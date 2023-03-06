import { Component } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-routes',
  templateUrl: './routes.component.html',
  styleUrls: ['./routes.component.css']
})
export class RoutesComponent {

  constructor(private dataService: DataService) {
    // dataService.busRoutes.subscribe((data: any) => {
    //   this.busRoutes = data;
    // });
    // dataService.railRoutes.subscribe((data: any) => {
    //   this.railRoutes = data;
    // });
    // dataService.carRouts.subscribe((data: any) => {
    //   this.carRoutes = data;
    // });
  }

  // The DirectionResults are saved into their respective route array
  busRoutes: any = [];
  railRoutes: any = [];
  carRoutes: any = [];

  sortByFare(arr: any) {
    // arr.sort((a: any, b: any) => a.transitFare - b.transitFare)
    // return arr;
  }

  sortByTime(arr: any) {
    // arr.sort((a: any, b: any) => a.totalDurationValue - b.totalDurationValue)
    // return arr;
  }

}
