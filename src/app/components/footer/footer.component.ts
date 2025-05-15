import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.css'
})
export class FooterComponent implements OnInit{

  UserStatus!:boolean;
  constructor(private authServ:AuthService){}
  ngOnInit(){
    this.authServ.isLoggedIn$.subscribe(isLogged=>{
      this.UserStatus=isLogged;
    })
  }
}
