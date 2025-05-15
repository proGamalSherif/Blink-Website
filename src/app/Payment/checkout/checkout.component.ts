import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { ICreatOrder } from '../../components/Orders/icreat-order';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Cart } from '../../models/cart';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  cartId: number | null = null;
  isLoading: boolean = false;
  cart: Cart = { cartDetails: [], userId: '', cartId: 0 };
  totalPrice: number = 0;
  checkoutForm: FormGroup;
  CurrentUserLatitude!: number;
  CurrentUserLongitude!: number;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private _Router: Router,
    private _CartService: CartService,
    private _OrderService: OrderService,
    private _PaymentService: PaymentService
  ) {
    this.checkoutForm = new FormGroup({
      address: new FormControl(null, [
        Validators.required,
        Validators.minLength(3),
      ]),
      phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^01[0125][0-9]{8}$/),
      ]),
      paymentMethod: new FormControl(null, Validators.required),
    });
  }

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.cartId = id ? +id : null;
    });

    window.scrollTo(0, 0);

    this._CartService.cart$.subscribe((updatedCart) => {
      this.cart = updatedCart;
    });

    this._CartService.totalPrice$.subscribe((total) => {
      this.totalPrice = total;
    });


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

  onSubmit(): void {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      return;
    }

    const selectedMethod = this.checkoutForm.get('paymentMethod')?.value;
 

    const createOrderDTO: ICreatOrder = {
      userId: this.cart.userId,
      address: this.checkoutForm.get('address')?.value,
      paymentMethod: selectedMethod,
      phoneNumber: this.checkoutForm.get('phone')?.value,
      
      lat: this.CurrentUserLatitude, // Set the latitude value
      long: this.CurrentUserLongitude, // Set the longitude value
    };

    if (selectedMethod === 'cash') {
      this.createOrderAndRedirect(createOrderDTO);
    } else if (selectedMethod === 'card') {
      // Step 1: Show confirmation dialog before payment
      Swal.fire({
        title: 'Confirm Payment',
        text: 'You will be redirected to the payment page.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Continue to Payment',
        cancelButtonText: 'Cancel',
      }).then((result) => {
        if (result.isConfirmed) {
          // Step 2: Create Payment Intent
          this.isLoading = true;
          this._PaymentService.createOrUpdatePaymentIntent(createOrderDTO.userId).subscribe({
            next: (paymentResponse) => {
              console.log(paymentResponse);
              
              // Step 3: Redirect to Stripe Payment
              this._Router.navigate(['/pay'], {
                queryParams: {
                  clientSecret: paymentResponse.data.clientSecret,
                  paymentIntentId: paymentResponse.data.paymentIntentId,
                  cartId: this.cart.cartId,
                  userId: this.cart.userId
                },
              });

              // Step 4: After successful payment, create the order
              this._PaymentService.paymentStatus$.subscribe((paymentStatus) => {
                if (paymentStatus === 'succeeded') {
                  this._OrderService.creatOrder(createOrderDTO).subscribe({
                    next: (orderResponse) => {
                      this.isLoading = false;
                      console.log(orderResponse);
                      Swal.fire({
                        icon: 'success',
                        title: 'Order Created Successfully',
                        text: 'Your order has been successfully created.',
                        showConfirmButton: false,
                        timer: 1700,
                      });
                      this._Router.navigate(['/confirmOrder'], {
                        queryParams: {
                          id: orderResponse.data.orderHeaderId,
                        },
                      });
                    },
                    error: (err) => {
                      this.isLoading = false;
                      console.error('Error creating order:', err);
                    },
                  });
                }
              });
            },
            error: (err) => {
              this.isLoading = false;
              console.error('PaymentIntent Error:', err);
            },
          });
        }
      });
    }
  }

  // Function to create the order and redirect to confirmation or home
  createOrderAndRedirect(createOrderDTO: ICreatOrder): void {
    this.isLoading = true;
    this._OrderService.creatOrder(createOrderDTO).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log(response);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: response.message,
          showConfirmButton: false,
          timer: 1700,
        });

        Swal.fire({
          icon: 'success',
          title: response.message,
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
      error: (err) => {
        this.isLoading = false;
        console.error('Error creating order:', err);
      },
    });
  }


  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        console.log('Latitude:', lat, 'Longitude:', long);
        this.checkoutForm.patchValue({ lat, long });
      });
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }
}
