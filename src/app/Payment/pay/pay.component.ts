import { loadStripe, Stripe, StripeCardElement } from '@stripe/stripe-js';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { PaymentService } from '../../services/payment.service';

import Swal from 'sweetalert2';
import { ConfirmedOrder } from '../iorder-dto';

@Component({
  selector: 'app-pay',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './pay.component.html',
  styleUrls: ['./pay.component.css']
})
export class PayComponent implements OnInit {
  stripe!: Stripe | null;
  card!: StripeCardElement;
  cardHolderName: string = '';
  clientSecret: string = '';
  paymentIntentId: string = '';
  cartId: number = 0;
  isProcessing: boolean = false;
  cardError: string = '';
    orderDetails: ConfirmedOrder | null = null;
    CurrentUserLatitude!: number;
    CurrentUserLongitude!: number;
    userId:string='';
  
  
  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router,
    private _paymentService: PaymentService
  ) {}

  async ngOnInit() {
    this.extractQueryParams();
    await this.setupStripeCardElement();



    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.CurrentUserLatitude = position.coords.latitude;
          this.CurrentUserLongitude = position.coords.longitude;
        },
        (error) => {
          console.log(error);
        }
      );
    }


  }

  private extractQueryParams() {
    const queryParams = this._ActivatedRoute.snapshot.queryParamMap;
    this.clientSecret = queryParams.get('clientSecret') || '';
    this.paymentIntentId = queryParams.get('paymentIntentId') || '';
    this.cartId = +(queryParams.get('cartId') || 0);
    this.userId = queryParams.get('userId') || '';
  }

  private async setupStripeCardElement() {
    this.stripe = await loadStripe('pk_test_51RCWSDFNhf4ER0gQ4w4bQGaljSws1oDom7IJBZLu7z42GxX2tDIUigQMLlO0WX4PJtZNL7XL915qybHSbTnhwPGn00tTANkeVx');
    
    if (!this.stripe) {
      console.error('Stripe failed to load.');
      return;
    }

    const elements = this.stripe.elements();
    this.card = elements.create('card');
    this.card.mount('#card-element');
  }

  async handlePayment() {
    if (this.isProcessing || !this.stripe || !this.card || !this.clientSecret) return;

    this.isProcessing = true;
    Swal.fire({
      title: 'Processing...',
      text: 'Please wait while we process your payment.',
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    const result = await this.stripe.confirmCardPayment(this.clientSecret, {
      payment_method: {
        card: this.card,
        billing_details: {
          name: this.cardHolderName || 'Unknown'
        }
      }
    });

    if (result.error) {
      this.isProcessing = false;
      Swal.fire('Error', result.error.message || 'Payment failed', 'error');
      return;
    }

    const paymentIntent = result.paymentIntent;
    if (paymentIntent?.status === 'succeeded') {
      this.confirmPaymentBackend();
    } else {
      this.isProcessing = false;
      Swal.fire('Error', 'Payment was not successful.', 'error');
      
    }
  }

  private confirmPaymentBackend() {
    this._paymentService.confirmPayment(this.userId,this.paymentIntentId, true,this.CurrentUserLatitude,this.CurrentUserLongitude).subscribe({
      next: (response) => {
        console.log(response);
        this.orderDetails = response;
         Swal.fire({
                  icon: 'success',
                  title: 'Success',
                  text: response.message,
                  showConfirmButton: false,
                  timer: 1700,
                });
        
                Swal.fire({
                  icon: 'success',
                  title: 'Thanks for Your Purchase',
                  text: 'Would you like to view your order or go to home?',
                  showCancelButton: true,
                  confirmButtonText: 'View My Order',
                  cancelButtonText: 'Go to Home',
                }).then((result) => {
                  if (result.isConfirmed) {
                    this._Router.navigate(['/confirmOrder'], {
                      queryParams: {
                        id: response.data.orderHeaderId,
                      },
                    });
                  } else {
                    this._Router.navigate(['/Homepage']);
                  }
                });
              },
      error: () => {
        Swal.fire('Error', 'Payment confirmed but saving order failed.', 'error');
      }
    });
  }
}
