import { Component } from '@angular/core';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishList } from '../../models/wish-list';
import { WishListItem } from '../../models/wish-list-item';
import { WishlistService } from '../../services/wishlist.service';
import { WishListProductCardComponent } from "../wish-list-product-card/wish-list-product-card.component";

@Component({
  selector: 'app-wish-list',
  imports: [CommonModule, RouterLink, WishListProductCardComponent],
  templateUrl: './wish-list.component.html',
  styleUrl: './wish-list.component.css'
})
export class WishListComponent {
 wishList: WishList = { wishListDetails: [], userId: '', wishListId: 0 };
  wishListItem! : WishListItem;
  constructor(
    private wishListService: WishlistService,
  
  ) {
  }

  ngOnInit() 
  {
    window.scrollTo(0, 0);
    this.wishListService.wishList$.subscribe((updatedCart) => {
        this.wishList = updatedCart;
        console.log( "from the subuscribtion",this.wishList);
    });
    
    console.log("out side the sub", this.wishList);
    
  }

  clearCart() {
    Swal.fire({
      title: 'Clear WishList?',
      icon: 'warning',
      width: 400,
      showCancelButton: true,
      confirmButtonText: 'Clear',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.wishListService.deleteWishList(this.wishList.wishListId!); 
      }
      }
    );
  }

}
