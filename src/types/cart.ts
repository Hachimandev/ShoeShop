import { Product } from "./product";
import { Promotion } from "./promotion";

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size: number;
  color: string;
  price: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number; // Mức giá cuối cùng (đã trừ discountAmount)
  subtotal: number; // Tổng giá các sản phẩm
  discountAmount: number; // Số tiền được giảm
  promotion?: Promotion | null; // Khuyến mãi đang áp dụng
}
