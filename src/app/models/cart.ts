export interface Cart {
  userId: string; 
  cartId: number;
  cartDetails: CartDetails[];
}

export interface CartDetails {
  productId: number;
  productName: string;
  productUnitPrice: number;  
  productImageUrl: string;
  quantity: number;
  discountAmount:number;
}
