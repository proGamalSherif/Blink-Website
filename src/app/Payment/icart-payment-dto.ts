export interface ICartPaymentDTO {
    userId: string;
    cartId: number;
    paymentMethod: string | null;
    paymentStatus: string | null;
    paymentIntentId: string;
    clientSecret: string;
    shippingPrice: number;
    subTotal: number;
    items: {
      productId: number;
      productName: string;
      productUnitPrice: number;
      productImageUrl: string;
      quantity: number;
    }[];
}
