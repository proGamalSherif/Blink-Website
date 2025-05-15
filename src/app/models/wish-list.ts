export interface WishList {
        userId: string; 
        wishListId: number;
        wishListDetails: WishListDetail[];
      }
      
      export interface WishListDetail {
        productId: number;
        productName: string;
        productImageUrl: string;
      }
      

