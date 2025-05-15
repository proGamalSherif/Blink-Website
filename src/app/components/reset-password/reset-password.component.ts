import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service'; 
import { FormControlOptions, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  imports: [RouterLink,FormsModule,CommonModule,ReactiveFormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent {
  msgerror: string = '';
  step :number = 1;
  emailValue: string = '';
   
  isLoading: boolean = false;

  resetForm: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
  });

  verifyCode: FormGroup = new FormGroup({
    code: new FormControl(null, [Validators.required,Validators.pattern(/^[0-9]{6}$/)]),
  });

  newPassword: FormGroup = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    newPassword: new FormControl(null, [Validators.required,Validators.pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).{8,}$/)]),
    confirmPassword: new FormControl(null, [Validators.required]),
  },{validators:[this.confirmPassword]} as FormControlOptions);

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


  constructor(private authService: AuthService , private _Router: Router) {}


  verifiyEmail(): void {
    this.isLoading = true;
    this.emailValue = this.resetForm.get('email')?.value;
    this.newPassword.get('email')?.patchValue(this.emailValue);

    this.authService.resetPassword(this.resetForm.value).subscribe({
      next: (response) => {
        console.log(response.statusCode==200);
        this.step = 2;
        this.isLoading = false;
        this.msgerror = response.message;
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
        this.msgerror = err.error;
      },
    })


  }

  verifyCodeFunc(): void {
    this.isLoading = true;
    // console.log(this.emailValue);
    // console.log(this.verifyCode.value.code);
    let code = this.verifyCode.value.code;
    this.authService.verifyCode(code,this.emailValue).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.statusCode === 200 && response.data?.isValid) {
          this.step = 3;
          this.msgerror = '';
        } else {
          this.msgerror = response.message;
        }
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
        this.msgerror = err.error;
      },
    })
  }

  setNewPassword(): void {
    this.isLoading = true;
    // let newPassword = this.newPassword.value;
    // let confirmPassword = this.newPassword.value;
    console.log(this.newPassword.value);
    // console.log(confirmPassword);
    // console.log(this.emailValue);
    
    this.authService.setNewPassword(this.newPassword.value).subscribe({
      next: (response) => {
        console.log(response);
        console.log(response.statusCode==200);
        this.msgerror = response.message;
        localStorage.setItem('token', response.data.token);
        this.authService.userLogin();
        this.authService.setUserRole();
        this.isLoading = false;
        this._Router.navigateByUrl('/Homepage');
      },
      error: (err) => {
        this.isLoading = false;
        console.log(err);
        this.msgerror = err.error;
      },
    })
  }
}