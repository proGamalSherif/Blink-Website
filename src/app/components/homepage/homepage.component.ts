import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { ProductCardComponent } from "../product-card/product-card.component";
import { CategoryCardComponent } from "../category-card/category-card.component";
import { RouterLink } from '@angular/router';
import { Category } from '../../models/category';
import { CategoryService } from '../../services/category.service';
import { Discount } from '../../models/discount';
import { DiscountService } from '../../services/discount.service';
// import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-homepage',
  imports: [FormsModule, CommonModule, ProductCardComponent, CategoryCardComponent,RouterLink],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  ProductArr!:Product[];
  ProductDiscountArr!:Product[];
  ParentCategoryArr!:Category[];
  CategoryArr!:Category[];
  maxCategories = 13;
  constructor(private productServ:ProductService,private categoryServ:CategoryService,private discountServ:DiscountService) {}

  ngOnInit() {
    this.productServ.GetAll().subscribe(res=>{
      this.ProductArr=res;
      this.ProductDiscountArr=this.ProductArr.filter((product)=>{
        return product.discountAmount > 0 ;
      })
    })
    this.categoryServ.getAllParentCategory().subscribe(res=>{
      this.ParentCategoryArr=res.slice(0,this.maxCategories);
    })
    this.categoryServ.GetAllChildCategories().subscribe(res => {
      this.CategoryArr = res
    })
  }

}
