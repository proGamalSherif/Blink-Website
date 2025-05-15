import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart';
import { CartItem } from '../../models/cartItem';
import Swal from 'sweetalert2';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cart',
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cart: Cart = { cartDetails: [], userId: '', cartId: 0 };
  cartItem! : CartItem;
  totalPrice: number = 0;
  shippingPrice: number = 0;


  constructor(
    private authService: AuthService,
    private cartService: CartService,
  
  ) {
  }

  ngOnInit() 
  {
    window.scrollTo(0, 0);
    this.cartService.cart$.subscribe((updatedCart) => {
        this.cart = updatedCart;
    });
    this.cartService.totalPrice$.subscribe((total) => {
      this.totalPrice = total;
    });

  }

  clearCart() {
    Swal.fire({
      title: 'Clear Cart?',
      icon: 'warning',
      width: 400,
      showCancelButton: true,
      confirmButtonText: 'Clear',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.cartService.deleteCart(this.cart.cartId!); 

      }
      }
    );
  }

  icreamentQauntity(productId: number) {
    this.cartItem = { productId: productId, quantity: 1 };
     Swal.fire({
            toast: true,
            position: 'top',
            icon: 'success',
            title: 'Qauntity Increased !',
            showConfirmButton: false,
            timer: 1500,
          });
    this.cartService.addToCart(this.cartItem);

  }
  decreamentQauntity(productId: number) {
    const item = this.cart.cartDetails.find((item) => item.productId === productId);
    if (item && item.quantity == 1) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do You Want To Remove This Product?',
        icon: 'warning',
        width: 400,
        showCancelButton: true,
        confirmButtonText: 'Remove',
        confirmButtonColor: '#d33',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          this.cartItem = { productId: productId, quantity: -1 };
          this.cartService.addToCart(this.cartItem);
        }
      });
    }else{
      this.cartItem = { productId: productId, quantity: -1 };
          this.cartService.addToCart(this.cartItem);
    }
    
  }
}
