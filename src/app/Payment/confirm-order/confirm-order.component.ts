import { ConfirmedOrder, IOrderDTO } from './../iorder-dto';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { OrderService } from '../../services/order.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-confirm-order',
  imports: [FormsModule,CommonModule,RouterLink], // No additional imports needed for this component
  templateUrl: './confirm-order.component.html',
  styleUrls: ['./confirm-order.component.css']
})
export class ConfirmOrderComponent implements OnInit {
  orderId: number | null = null;
  orderDetails: ConfirmedOrder | null = null;
  isLoading: boolean = true;

  constructor(
    private _ActivatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this._ActivatedRoute.queryParams.subscribe(params => {
      const orderId = params['id'];
      if (orderId) {
        this.fetchOrderDetails(orderId);
      }
    });
  }

  fetchOrderDetails(orderId: number|null): void {
    this.orderService.getOrderByOrderID(orderId).subscribe({
      next: (response) => {
        console.log(response);
        
        this.isLoading = false;
        this.orderDetails = response; 
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Error fetching order details:', err);
      }
    });
  }



 
CancelOrder(orderId: number): void {
  Swal.fire({
    title: 'Are you sure?',
    text: "Do you really want to cancel this order?",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Yes, cancel it!',
    cancelButtonText: 'No, keep it'
  }).then((result) => {
    if (result.isConfirmed) {
      this.orderService.deleteOrder(orderId).subscribe({
        next: (response) => {
          Swal.fire('Cancelled!', 'Your order has been cancelled.', 'success');
          this.router.navigate(['/myOrders']);
        },
        error: (err) => {
          Swal.fire('Error!', 'Failed to cancel the order.', 'error');
          console.error('Error cancelling order:', err);
        }
      });
    }
  });
}

}
