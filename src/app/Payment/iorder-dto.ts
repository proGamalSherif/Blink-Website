export interface IOrderDTO {
  orderHeaderId: number;  
  orderStatus: string;
  orderDate: string;
  orderTotalAmount: number;  
  orderTax: number;
  orderShippingCost: number;  
  orderDetails: OrderItemDTO[]; 
  payment: PaymentDTO;  
}

export interface OrderItemDTO {
  productId: number;  
  sellQuantity: number; 
  sellPrice: number;  
}

export interface PaymentDTO {
  method: string;
  paymentStatus: string;
  paymentDate: string;
}
export interface ConfirmedOrderItem {
  productId: number;
  productName: string;
  productImageUrl: string;
  quantity: number;
  unitPrice: number;
}

export interface ConfirmedOrder {
  orderId: number;
  orderStatus: string;
  orderDate: string;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  paymentIntentId: string;
  items: ConfirmedOrderItem[];
}
