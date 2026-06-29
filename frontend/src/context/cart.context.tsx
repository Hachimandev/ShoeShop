"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CartItem, Cart } from "@/types/cart";
import { Product } from "@/types/product";
import { Promotion } from "@/types/promotion";
import {
  CartItemDTO,
  Cart as BackendCart,
  OrderRequest,
  PaymentMethod,
} from "@/types/order";
import { useOrder } from "@/hooks/useOrder";

interface CartContextType {
  cart: Cart;
  addToCart: (
    product: Product,
    quantity: number,
    size: number,
    color: string,
  ) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  convertToBackendCart: () => BackendCart;
  checkout: (customerId: string, paymentMethod: PaymentMethod) => Promise<any>;
  checkoutLoading: boolean;
  checkoutError: string | null;
  applyPromotion: (promotion: Promotion) => void;
  removePromotion: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
    subtotal: 0,
    discountAmount: 0,
    promotion: null,
  });
  
  const {
    checkout: orderCheckout,
    loading: checkoutLoading,
    error: checkoutError,
    clearError,
  } = useOrder();

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsed = JSON.parse(savedCart);
        if (parsed && Array.isArray(parsed.items)) {
          setCart({
            ...parsed,
            subtotal: parsed.subtotal || 0,
            discountAmount: parsed.discountAmount || 0,
            promotion: parsed.promotion || null
          });
        } else {
          setCart({ items: [], totalItems: 0, totalPrice: 0, subtotal: 0, discountAmount: 0, promotion: null });
        }
      } catch (error) {
        console.error("Failed to load cart from localStorage:", error);
        setCart({ items: [], totalItems: 0, totalPrice: 0, subtotal: 0, discountAmount: 0, promotion: null });
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart) {
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  const calculateTotals = (items: CartItem[], promotion: Promotion | null | undefined) => {
    const totalItems = (items || []).reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = (items || []).reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    
    let discountAmount = 0;
    if (promotion) {
      if (promotion.discount <= 1) {
         // Phần trăm (vd: 0.1 là 10%)
         discountAmount = subtotal * promotion.discount;
      } else if (promotion.discount <= 100 && promotion.discount > 1) {
         // Nếu lưu kiểu 10 là 10%
         discountAmount = subtotal * (promotion.discount / 100);
      } else {
         // Số tiền cố định
         discountAmount = promotion.discount;
      }
      
      // Không giảm giá quá giá trị đơn hàng
      if (discountAmount > subtotal) {
         discountAmount = subtotal;
      }
    }
    
    const totalPrice = subtotal - discountAmount;

    return { totalItems, subtotal, discountAmount, totalPrice };
  };

  const addToCart = (
    product: Product,
    quantity: number,
    size: number,
    color: string,
  ) => {
    setCart((prevCart) => {
      const currentItems = prevCart?.items || [];
      const existingItem = currentItems.find(
        (item) =>
          (item.product.id || item.product.productId) ===
          (product.id || product.productId) &&
          item.size === size &&
          item.color === color,
      );

      let newItems: CartItem[];
      if (existingItem) {
        newItems = currentItems.map((item) =>
          item.id === existingItem.id
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        );
      } else {
        const newItem: CartItem = {
          id: `${product.id || product.productId}-${size}-${color}-${Date.now()}`,
          product,
          quantity,
          size,
          color,
          price: product.price,
        };
        newItems = [...currentItems, newItem];
      }

      const { totalItems, subtotal, discountAmount, totalPrice } = calculateTotals(newItems, prevCart.promotion);
      return {
        ...prevCart,
        items: newItems,
        totalItems,
        subtotal,
        discountAmount,
        totalPrice,
      };
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prevCart) => {
      const currentItems = prevCart?.items || [];
      const newItems = currentItems.filter((item) => item.id !== id);
      const { totalItems, subtotal, discountAmount, totalPrice } = calculateTotals(newItems, prevCart.promotion);
      return {
        ...prevCart,
        items: newItems,
        totalItems,
        subtotal,
        discountAmount,
        totalPrice,
      };
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCart((prevCart) => {
      const currentItems = prevCart?.items || [];
      const newItems =
        quantity <= 0
          ? currentItems.filter((item) => item.id !== id)
          : currentItems.map((item) =>
            item.id === id ? { ...item, quantity } : item,
          );

      const { totalItems, subtotal, discountAmount, totalPrice } = calculateTotals(newItems, prevCart.promotion);
      return {
        ...prevCart,
        items: newItems,
        totalItems,
        subtotal,
        discountAmount,
        totalPrice,
      };
    });
  };

  const clearCart = () => {
    setCart({
      items: [],
      totalItems: 0,
      totalPrice: 0,
      subtotal: 0,
      discountAmount: 0,
      promotion: null,
    });
  };

  const applyPromotion = (promotion: Promotion) => {
    setCart((prevCart) => {
      const { totalItems, subtotal, discountAmount, totalPrice } = calculateTotals(prevCart.items, promotion);
      return {
        ...prevCart,
        promotion,
        totalItems,
        subtotal,
        discountAmount,
        totalPrice,
      };
    });
  };

  const removePromotion = () => {
    setCart((prevCart) => {
      const { totalItems, subtotal, discountAmount, totalPrice } = calculateTotals(prevCart.items, null);
      return {
        ...prevCart,
        promotion: null,
        totalItems,
        subtotal,
        discountAmount,
        totalPrice,
      };
    });
  };

  const convertToBackendCart = (): BackendCart => {
    const currentItems = cart?.items || [];
    const backendItems: CartItemDTO[] = currentItems.map((item) => {
      // Find matching detail from product details array to get the real database ID
      const detail = item.product.productDetails?.find(
        (d: any) => String(d.size) === String(item.size) && String(d.color).toLowerCase() === String(item.color).toLowerCase()
      );

      if (!detail) {
        console.warn(`Product detail not found for ${item.product.name} (Size: ${item.size}, Color: ${item.color})`);
      }

      return {
        productDetailId: detail?.productDetailId || `${item.product.id || item.product.productId}-${item.size}-${item.color}`,
        quantity: item.quantity,
        productName:
          item.product.name || item.product.productName || "Unknown Product",
        price: item.price,
        size: item.size,
        color: item.color,
        stockQuantity: detail?.stockQuantity || item.product.stock || 0,
        image: item.product.image,
      };
    });

    return {
      items: backendItems,
      promotionId: cart.promotion?.promotionId,
      usedPoints: 0, // Có thể thêm logic points sau
    };
  };

  const checkout = async (customerId: string, paymentMethod: PaymentMethod) => {
    clearError();
    const backendCart = convertToBackendCart();

    const orderRequest: any = {
      customerId,
      cart: backendCart,
      paymentMethod,
    };

    const result = await orderCheckout(orderRequest);
    if (result) {
      // Clear cart after successful checkout
      clearCart();
    }
    return result;
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        convertToBackendCart,
        checkout,
        checkoutLoading,
        checkoutError,
        applyPromotion,
        removePromotion,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

