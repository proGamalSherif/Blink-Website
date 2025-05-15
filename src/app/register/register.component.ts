import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControlOptions, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule,RouterLink], 
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
constructor(private _AuthService:AuthService, private _Router:Router) { }
  msgerror:string ='';
  isLoading:boolean = false;

  registerForm: FormGroup = new FormGroup({
    fName: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
    lName: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(15)]),
    userName: new FormControl(null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/)]),
    rePassword: new FormControl(null, [Validators.required]),
    phoneNumber: new FormControl(null, [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
    address: new FormControl(null, [Validators.required, Validators.minLength(10), Validators.maxLength(100)])

  },{validators:[this.confirmPassword]} as FormControlOptions)


  confirmPassword(group:FormGroup):void{
    let password = group.get("password")
    let rePassword = group.get("rePassword")
 
    if(rePassword?.value == null || rePassword.value == ''){
     rePassword?.setErrors({required : true})  
    }
    else if(password?.value != rePassword?.value){
     rePassword.setErrors({mismatch:true})
    }
   }

   registeration():void{
    if(this.registerForm.valid){
      this.isLoading =true;
      this._AuthService.setRegister(this.registerForm.value).subscribe({
        next:(response) =>{
          console.log(response);
           this._Router.navigate(['login'])
           this.isLoading = false;
        },
        error:(err:HttpErrorResponse)=> {
          this.isLoading = false;
          console.log(err);
          this.msgerror= err.error;
    
          
        },
       })
    }
    else{
      this.registerForm.markAllAsTouched();
    }
     
    }
    
   }

