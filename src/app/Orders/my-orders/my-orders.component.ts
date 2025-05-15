import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConfirmedOrder } from '../../Payment/iorder-dto';
import { Router, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [CommonModule, FormsModule,RouterLink],
  templateUrl: './my-orders.component.html',
  styleUrls: ['./my-orders.component.css']
})
export class MyOrdersComponent implements OnInit {
  activeTab: string = 'all';
  allOrders: ConfirmedOrder[] = [];
  filteredOrders: ConfirmedOrder[] = [];
  isLoading: boolean = true;
  selectedOrder: ConfirmedOrder | null = null;
  showModal: boolean = false;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.orderService.getAllOrdersByUserID().subscribe({
      next: (orders) => {
        // console.log(orders);
        
        this.allOrders = orders;
        // console.log(this.allOrders);
        
        this.filterOrders();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading orders:', err);
        this.isLoading = false;
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    this.filterOrders();
  }

  filterOrders(): void {
    switch (this.activeTab) {
      case 'shipped':
        this.filteredOrders = this.allOrders.filter(order => 
          order.orderStatus.toLowerCase() === 'shipped' || 
          order.orderStatus.toLowerCase() === 'paymentreceived'
        );
        break;
      case 'delivered':
        this.filteredOrders = this.allOrders.filter(order => 
          order.orderStatus.toLowerCase() === 'delivered'
        );
        break;
      case 'cancelled':
        this.filteredOrders = this.allOrders.filter(order => 
          order.orderStatus.toLowerCase() === 'cancelled'
        );
        break;
      default:
        this.filteredOrders = [...this.allOrders];
    }
  }

  getStatusClass(status: string): string {
    const statusLower = status.toLowerCase();
    if (statusLower === 'paymentreceived') {
      return 'status-pending';
    }
    return `status-${statusLower}`;
  }

  canTrack(order: ConfirmedOrder): boolean {
    const trackableStatuses = ['shipped', 'paymentreceived'];
    return trackableStatuses.includes(order.orderStatus.toLowerCase());
  }

  canReorder(order: ConfirmedOrder): boolean {
    return order.orderStatus.toLowerCase() === 'delivered';
  }

  viewOrderDetails(orderId: number): void {
    this.orderService.getOrderByOrderID(orderId).subscribe({
      next: (orderDetails) => {
        this.selectedOrder = orderDetails;
        this.showModal = true;
      },
      error: (err) => {
        console.error('Error loading order details:', err);
      }
    });
  }
  closeModal(): void {
    this.showModal = false;
    this.selectedOrder = null;
  }
 

  // trackOrder(orderId: number): void {
  //   this.router.navigate(['/track-order', orderId]);
  // }
  cancelOrder(orderId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to cancel this order?',
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
            console.log(response);
            
            Swal.fire('Canceled!', 'Your order has been canceled.', 'success');
            this.loadOrders(); // Refresh the list
          },
          error: (err) => {
            Swal.fire('Error!', 'There was a problem canceling the order.', 'error');
            console.error('Error canceling order:', err);
          }
        });
      }
    });
  }

  reorder(order: ConfirmedOrder): void {
    // Implement reorder logic
    console.log('Reordering:', order.orderId);
    // This would typically add all items to cart
    // or navigate to a reorder confirmation page
  }
}