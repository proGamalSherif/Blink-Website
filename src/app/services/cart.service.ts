import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Cart } from '../models/cart';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { CartItem } from '../models/cartItem';
import { AuthService } from './auth.service';


@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartUserId: string | null = null;
  
  private apiUrl = environment.apiUrl;
shippingprice: number = 0;
  
  private cartSubject = new BehaviorSubject<Cart>({
    cartDetails: [],
    userId: '',
    cartId: 0,
  });
  cart$ = this.cartSubject.asObservable(); 

  private totalPriceSubject = new BehaviorSubject<number>(0);
  totalPrice$ = this.totalPriceSubject.asObservable();

  constructor(
    private _HttpClient: HttpClient,
    private authService: AuthService,
  ) {
    this.cartUserId = this.authService.getUserId();
    this.loadCart(); 
    
  }

  loadCart(): void {
    let cart: Cart | undefined;
    let subTotal: number = 0;
    if (this.cartUserId) {
      this.getCartByUserId(this.cartUserId).subscribe({
        next: (cart) => {
          this.cartSubject.next(cart);
          this.calculateTotal(cart);
        },
        error: (error) => {
          if (error.status === 404) {
            this.cartSubject.next({ cartDetails: [], userId: '', cartId: 0 });
            this.totalPriceSubject.next(0);
          } else {
            console.error(error);
          }
        },
      });
    }else{
      
    return;
    }

  }

  getCartByUserId(id: string): Observable<Cart> {
    return this._HttpClient.get<Cart>(`${this.apiUrl}/cart/getbyuserid/${id}`);
  }
 // In cart.service.ts

deleteCart(cartId: number): void {
  if (!this.cartUserId) return;

  this._HttpClient.delete(`${this.apiUrl}/cart/DeleteCart/${cartId}`)
    .subscribe({
      next: () => {
        this.loadCart(); 
        console.log('Cart deleted successfully');
      },
      error: (error) => {
        console.error('Error deleting cart', error);
      }
    });
}

  addToCart(cartItem: CartItem): void {
    if (!this.cartUserId) return;

     this._HttpClient.post<CartItem>(
      `${this.apiUrl}/cart/AddCart/${this.cartUserId}`,
      cartItem
    ).subscribe({
      next: (response) => {
        this.loadCart();
      },
      error: (error) => {
        console.error('Error adding item',error);
      }
    })
  }

  private calculateTotal(cart: Cart): void {
    const total = cart.cartDetails.reduce((sum, item) => sum + ((item.productUnitPrice - item.discountAmount) * item.quantity), 0);
    this.totalPriceSubject.next(total);
  }
  

}
