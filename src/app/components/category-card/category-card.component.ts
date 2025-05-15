import { Component, Input, input, OnInit } from '@angular/core';

import { CategoryService } from '../../services/category.service'; 
 
import { Category } from '../../models/category';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-category-card',
  imports: [RouterLink],
  templateUrl: './category-card.component.html',
  styleUrl: './category-card.component.css'
})
export class CategoryCardComponent implements OnInit{
  // @Input() categoryId!: number;
  @Input() categoryId!: number;
  categoryEntity!: Category;

  constructor(private categoryService: CategoryService){}
  
  ngOnInit() {
    // this.categoryService.getAllParentCategory
    // this.categoryService.GetAllChildCategories
    // this.categoryService.getChildCategoriesById
    this.getCategoryDetails();
  }


  getCategoryDetails() {
    if (!this.categoryId) return; // 2t2kad Api exists 
    this.categoryService.getChildCategoriesById(this.categoryId).subscribe(

      (res ) => {
        this.categoryEntity = res;
      
     
      },

      (error) => {
        console.error('Error in category data:', error);
       
      
      }

    );
  }
}
