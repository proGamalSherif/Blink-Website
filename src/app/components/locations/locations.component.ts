import { Component, ElementRef, ViewChild } from '@angular/core';
declare const google: any; // Google Maps API
@Component({
  selector: 'app-locations',
  imports: [],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.css'
})
export class LocationsComponent {
  @ViewChild('mymap', { static: false }) mymap!: ElementRef;
  mapInstance: any;

  ngAfterViewInit(): void {
    this.loadMap();
  }

  private loadMap(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
          const specs = { zoom: 5, center: location };
          this.mapInstance = new google.maps.Map(this.mymap.nativeElement, specs);
        },
        () => alert("Unable to retrieve your location.")
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }
}
