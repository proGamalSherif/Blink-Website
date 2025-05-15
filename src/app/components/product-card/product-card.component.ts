import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { Router, RouterLink } from '@angular/router';
import { CartItem } from '../../models/cartItem';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';
import { AuthService } from '../../services/auth.service';
import { WishlistService } from '../../services/wishlist.service';
import { WishListItem } from '../../models/wish-list-item';

@Component({
  selector: 'app-product-card',
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit {
  @Input() productId!: number;
  ProductEntity!: Product;
  cartItem! : CartItem
  wishListItem! : WishListItem;
  UserStatus!:boolean;
  constructor(private productServ:ProductService, private wishListServ:WishlistService, private cartService: CartService, private authService:AuthService ,private router: Router) { }
  ngOnInit() {
   this.productServ.GetById(this.productId).subscribe(res=>{
    this.ProductEntity=res;
    this.authService.isLoggedIn$.subscribe(isLogged=>{
      this.UserStatus=isLogged;
    })

   })
  }
 
  getStars(rating: number): number[] {
    return Array(Math.round(rating)).fill(0);
  }

  completeEmptyStart(){
    return Array(5 - Math.round(this.ProductEntity.averageRate)).fill(1);
  }

  addProductToCart() {
    if (!this.UserStatus) {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'warning',
        title: 'Login or Register to Add Product to Cart',
        showConfirmButton: false,
        timer: 2500,
      });
      return;
    }
    if (this.ProductEntity) {
      this.cartItem = {
        productId: this.ProductEntity.productId,
        quantity: 1,
      }
      this.cartService.addToCart(this.cartItem);
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'success',
        title: 'Product added to cart!',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
  

  addProductToWishList() {
    if (!this.UserStatus) {
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'warning',
        title: 'Login or Register to Add Product to WishList',
        showConfirmButton: false,
        timer: 2500,
      });
      return;
    }
    if (this.ProductEntity) {
      this.wishListItem = {
        productId: this.ProductEntity.productId,
      }
      this.wishListServ.addToWishList(this.wishListItem);
      Swal.fire({
        toast: true,
        position: 'top',
        icon: 'success',
        title: 'Product added to WishList!',
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
}
