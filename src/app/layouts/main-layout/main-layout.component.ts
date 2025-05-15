import { Component } from '@angular/core';
import { NewNavbarComponent } from '../../components/new-navbar/new-navbar.component';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-main-layout',
  imports: [NewNavbarComponent, RouterOutlet, FooterComponent, RouterModule],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.css'
})
export class MainLayoutComponent {

}
