import { CartDetails } from "../models/cart";

export interface CartPayment {
    userId: string;
    cartId: number;
    paymentMethod: string;
    paymentStatus: string;
    paymentIntentId: string;
    clientSecret: string;
    shippingPrice: number;
    items: CartDetails[];
}
