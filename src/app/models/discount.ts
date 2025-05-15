import { Product } from "./product";
import { ProductDiscount } from "./product-discount";

export interface Discount {
    discountId:number;
    discountPercentage:number;
    discountFromDate:Date;
    discountEndDate:Date;
    isDeleted:boolean;
    discountProducts:ProductDiscount[];
}
