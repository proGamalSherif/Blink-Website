import { CommonModule } from '@angular/common';
import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnInit,
} from '@angular/core';
import { Carousel } from 'bootstrap';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models/product';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from '../../models/cartItem';
import { CartService } from '../../services/cart.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Pipe } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Review } from '../../models/review';
import { WishListItem } from '../../models/wish-list-item';
import { WishlistService } from '../../services/wishlist.service';


@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css'],
})
export class ProductDetailsComponent implements AfterViewInit, OnInit {
  @ViewChild('mainCarousel') carouselElement: any;
  @ViewChild('thumbnailContainer') thumbnailContainer!: ElementRef;
  carousel: Carousel | undefined;
  activeIndex = 0;
  showArrows = false;
  images: { main: string; thumb: string }[] = [];
  product: Product | null = null;
  productId!: number;
  cartItem! : CartItem
  uxQuantity: number = 1 ;
  userId!: string | null;
  canaddReview: boolean = true;
  wishListItem! : WishListItem;

  reviewForm: FormGroup = new FormGroup({
    rate: new FormControl(null, [Validators.required]),
    comment: new FormControl("")
  });

  constructor(private router: Router, private productService: ProductService,private wishListServ:WishlistService,private route: ActivatedRoute, private cartService: CartService, private authService:AuthService) {}
  ngOnInit(): void {
    window.scrollTo(0, 0);
    this.loadProduct();
    this.userId = this.authService.getUserId();
    console.log("User ID:", this.userId);
    // this.productService.canUserAddReview(this.productId, this.userId!).subscribe({
    //   next: (response) => {
    //     this.canaddReview = response;
    //   },error: (error) => {
    //     console.error("Error checking review permission:", error);
    //   } 
    // }); 
  }

  submitReview() {

    if (this.reviewForm.valid) {
      const review: Review = {
        userId: this.userId!,
        productId: this.productId,
        reviewRate: this.reviewForm.value.rate,
        comment: this.reviewForm.value.comment
      };
      
      console.log("Review submitted:",review);
      this.productService.addReview(review).subscribe({
        next: (response) => {
          console.log("Review added:", response);
          Swal.fire({
            title: 'Review Added Successfully!',
            icon: 'success',
            showConfirmButton: false,
            timer: 1500
          });
          this.loadProduct(); 
          this.reviewForm.reset(); // Reset the form after submission
        },
        error: (error) => {
          console.error("Error adding review:", error);
        }
      });  
      this.reviewForm.reset(); 
      this.loadProduct();

    }
  }
  

  addProductToCart() {
    if (this.product) {
      this.cartItem = {
        productId: this.product.productId,
        quantity: this.uxQuantity,
      }
      this.cartService.addToCart(this.cartItem);
       Swal.fire({
              title: 'Product Added To Cart !',
              icon: 'success',
              width: 400,
              showCancelButton: true,
              confirmButtonText: 'Checkout',
              confirmButtonColor: '#d33',
              cancelButtonText: 'Continue Shopping',
            }).then((result) => {
              if (result.isConfirmed) {
                this.router.navigate(['/cart']); 
              }
            });
    }
  }


  increamentQuantity() {
    if (this.product && this.uxQuantity >= this.product.stockQuantity) {
      return;
    }
    this.uxQuantity = this.uxQuantity + 1;
  }
  
  decreamentQuantity() {
    if (this.uxQuantity <= 1) {
      return;
    }
    this.uxQuantity = this.uxQuantity - 1;
  }
  

   addProductToWishList() {
      if (this.userId == null) {
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
      if (this.product) {
        this.wishListItem = {
          productId: this.productId,
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


  ngAfterViewInit() {
    this.carousel = new Carousel(this.carouselElement.nativeElement, {
      interval: false,
      wrap: true,
    });

    // Add event listener for slide completion
    this.carouselElement.nativeElement.addEventListener(
      'slid.bs.carousel',
      (event: any) => {
        this.activeIndex = event.to;
      }
    );
    // Check if we need to show arrows
    setTimeout(() => {
      this.showArrows = this.images.length > 4;
    });
  }

  private loadProduct(): void {
    this.productId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.productId) {
      this.productService.GetById(this.productId).subscribe({
        next: (product) => {
          this.product = product;
          this.images = this.product.productImages.map((imgPath) => ({
            main: imgPath,
            thumb: imgPath,
          }));
        },
        error: (error) => {
          console.log(error);
        },
      });
    }
  }

  getStars(rating: number | undefined): number[] {
    return Array(Math.round(rating ?? 0)).fill(0);
  }

  // Galleria Logic
  selectImage(index: number) {
    this.activeIndex = index;
    this.carousel?.to(index);
    this.scrollToThumbnail(index);
  }
  scrollThumbnails(direction: 'left' | 'right') {
    const container = this.thumbnailContainer.nativeElement;
    const scrollAmount = 200; // Adjust this value as needed
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  }
  private scrollToThumbnail(index: number) {
    const container = this.thumbnailContainer.nativeElement;
    const thumbnails = container.children;
    if (thumbnails[index]) {
      thumbnails[index].scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center',
      });
    }
  }
}
