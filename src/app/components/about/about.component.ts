import { Component } from '@angular/core';
import { WhoWeAreComponent } from "../who-we-are/who-we-are.component";
import { LocationsComponent } from "../locations/locations.component";
import { FoundersComponent } from "../founders/founders.component";

@Component({
  selector: 'app-about',
  imports: [WhoWeAreComponent, LocationsComponent, FoundersComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  ngOnInit() { 
    window.scrollTo(0, 0);
  }
}
