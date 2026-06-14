"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/cart.context";
import Link from "next/link";
import { ShoppingBag, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { promotionService } from "@/services/promotion.service";

const SHIPPING_COST = 1000;
const TAX_RATE = 0.1;

export function CartSummary() {
  const { cart, clearCart, applyPromotion, removePromotion } = useCart();
  const router = useRouter();
  
  const [promoCode, setPromoCode] = useState("");
  const [promoError, setPromoError] = useState("");
  const [isLoadingPromo, setIsLoadingPromo] = useState(false);

  // Bây giờ subtotal sẽ được dùng làm giá trị tạm tính (chưa giảm)
  const subtotal = cart.subtotal || 0;
  // tax tính trên tổng sau khi đã trừ discount (hoặc trước, tùy logic kinh doanh. Thường là tính trên giá đã trừ discount)
  const taxableAmount = cart.totalPrice || 0;
  const tax = taxableAmount * TAX_RATE;
  const shipping = cart.items.length > 0 ? SHIPPING_COST : 0;
  
  // Tổng thanh toán = giá sau giảm + thuế + ship
  const total = taxableAmount + tax + shipping;

  const handleApplyPromo = async () => {
    if (!promoCode.trim()) return;
    
    setIsLoadingPromo(true);
    setPromoError("");
    
    try {
      const promotion = await promotionService.getPromotionById(promoCode.trim());
      applyPromotion(promotion);
      setPromoCode("");
    } catch (err: any) {
      setPromoError("Mã khuyến mãi không hợp lệ hoặc đã hết hạn.");
    } finally {
      setIsLoadingPromo(false);
    }
  };

  const handleRemovePromo = () => {
    removePromotion();
  };

  return (
    <Card className="h-fit sticky top-4">
      <CardContent className="p-6">
        <h2 className="text-xl font-bold mb-4">Tóm tắt đơn hàng</h2>

        <div className="space-y-3 mb-6 pb-6 border-b">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Tạm tính</span>
            <span className="font-medium">{subtotal.toLocaleString("vi-VN")} ₫</span>
          </div>
          
          {cart.promotion && (
            <div className="flex justify-between text-sm text-green-600">
              <span className="flex items-center gap-1">
                Giảm giá ({cart.promotion.condition})
                <button onClick={handleRemovePromo} className="hover:text-red-500" title="Gỡ bỏ mã">
                  <X className="h-3 w-3" />
                </button>
              </span>
              <span className="font-medium">-{cart.discountAmount?.toLocaleString("vi-VN")} ₫</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Thuế (10%)</span>
            <span className="font-medium">{tax.toLocaleString("vi-VN")} ₫</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Phí vận chuyển</span>
            <span className="font-medium">{shipping.toLocaleString("vi-VN")} ₫</span>
          </div>
        </div>
        
        {/* Promotion Input */}
        <div className="mb-6 pb-6 border-b">
           <label className="text-sm font-medium mb-2 block">Mã khuyến mãi</label>
           <div className="flex gap-2">
             <Input 
               placeholder="Nhập mã (VD: PR001)" 
               value={promoCode}
               onChange={(e) => setPromoCode(e.target.value)}
               disabled={isLoadingPromo || !!cart.promotion}
             />
             <Button 
               variant="secondary" 
               onClick={handleApplyPromo}
               disabled={isLoadingPromo || !promoCode.trim() || !!cart.promotion}
             >
               {isLoadingPromo ? "..." : "Áp dụng"}
             </Button>
           </div>
           {promoError && <p className="text-red-500 text-xs mt-2">{promoError}</p>}
        </div>

        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-bold">Tổng cộng</span>
          <span className="text-2xl font-bold text-blue-600">
            {total.toLocaleString("vi-VN")} ₫
          </span>
        </div>

        <Button
          className="w-full h-12 text-base font-semibold mb-3"
          onClick={() => router.push("/checkout")}
          disabled={cart.items.length === 0}
        >
          <ShoppingBag className="mr-2 h-5 w-5" />
          Tiến hành thanh toán
        </Button>

        <Button variant="outline" className="w-full h-10" onClick={clearCart}>
          Xóa giỏ hàng
        </Button>

        <Link href="/products">
          <Button variant="ghost" className="w-full h-10 mt-2">
            Tiếp tục mua sắm
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
