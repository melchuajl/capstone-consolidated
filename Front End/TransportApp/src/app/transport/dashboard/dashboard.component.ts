import { Component, NgZone, ViewChild } from '@angular/core';
import { MapDirectionsService, GoogleMap } from '@angular/google-maps';
import { MatSnackBar } from '@angular/material/snack-bar';
import { map, Observable } from 'rxjs';
import { FaveService } from 'src/app/services/fave.service';
import { UserService } from 'src/app/services/user.service';
import Route from '../../models/route';

export interface PlaceSearchResult {
  address: string;
  name?: string;
  location?: google.maps.LatLng;
  iconUrl?: string;
  imageUrl?: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  // Inject Google Map Directions Service dependency
  constructor(private mapDirectionsService: MapDirectionsService, private ngZone: NgZone, private faveService: FaveService, private userService: UserService, private snackBar: MatSnackBar) {
    // declare individual observables for 
    this.busDirectionsResults$ = new Observable();
    this.railDirectionsResults$ = new Observable();
    this.carDirectionsResults$ = new Observable();
    this.renderFaves();
    userService.isLoggedIn.subscribe(data => {
      this.isLoggedIn = data;
    })
  }

  isLoggedIn: boolean = false;
  selectBus: boolean = false;
  // Causes every new search to automatically select the bus routes first
  newSearch(val: boolean) {
    this.selectBus = val;
  }

  // Configure Google Map here
  center!: google.maps.LatLngLiteral;
  zoom!: number;

  // Configure Google Map options
  options: google.maps.MapOptions = {
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    scrollwheel: true,
    controlSize: 25,
    fullscreenControl: true,
    mapTypeControl: false,
    zoom: 11
  }

  // Declare the input fields for source and destination
  origin: string | google.maps.LatLngLiteral | undefined = this.center;
  destination: string | google.maps.LatLngLiteral | undefined = "";

  // Get current position of user and render on google-map
  ngOnInit(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
      }, (error) => {
        // console.log('Error getting current position:', error);
      });
    }

    // Limit the Date Input for Desired Arrival Time from today to one week later
    const today = new Date().toISOString().slice(0, 16);
    const oneWeekLater = new Date(new Date().getTime() + 604800000).toISOString().slice(0, 16);;
    let desiredArrivalTimeElement = document.getElementById('desiredArrivalTime') as HTMLInputElement;
    desiredArrivalTimeElement.min = today;
    desiredArrivalTimeElement.max = oneWeekLater;

    // Update the bus arrival time by the seconds
    setInterval(() => {
      this.getCountDown(new Date('2023-03-01T08:00:00.000Z'));
    }, 1000);
  }

  // For displaying routes based on selected mode of transport, bus, mrt and taxi.
  chosen_mode: any = ""
  bus: string = "bus";
  mrt: string = "mrt";
  taxi: string = "taxi";
  fave: string = "fave";

  renderRoute(value: string) {
    if (this.chosen_mode == null) {
      this.chosen_mode = this.bus;
    }
    this.chosen_mode = value;
  }

  // Declaring the observable of type DirectionsResult

  busDirectionsResults$: Observable<google.maps.DirectionsResult | undefined>;
  railDirectionsResults$: Observable<google.maps.DirectionsResult | undefined>;
  carDirectionsResults$: Observable<google.maps.DirectionsResult | undefined>;

  // Declaring the DirectionsResult for rendering of routes at later date

  busDirectionsResults!: google.maps.DirectionsResult | undefined;
  railDirectionsResults!: google.maps.DirectionsResult | undefined;
  carDirectionsResults!: google.maps.DirectionsResult | undefined;

  // The DirectionResults are saved into the following respective route arrays

  busRoutes: any = [];
  railRoutes: any = [];
  carRoutes: any = [];

  chosen_routePreference: number = 0;
  chosen_routeAvoidance: number = 0;

  // This method posts a DirectionsRequest and receives a DirectionsResult if DirectionsStatus is 'OK'

  getRoutes() {
    let origin: string | google.maps.LatLngLiteral | google.maps.LatLng | google.maps.Place;
    if (typeof this.origin === 'string') {
      origin = this.origin;
    } else if (typeof this.origin === 'object') {
      origin = {
        lat: this.origin.lat,
        lng: this.origin.lng
      };
    } else {
      throw new Error('Origin is undefined');
    }

    let destination: string | google.maps.LatLngLiteral | google.maps.LatLng | google.maps.Place;
    if (typeof this.destination === 'string') {
      destination = this.destination;
    } else if (typeof this.destination === 'object') {
      destination = {
        lat: this.destination.lat,
        lng: this.destination.lng
      };
    } else {
      throw new Error('Destination is undefined');
    }

    const request_bus: google.maps.DirectionsRequest = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.TRANSIT,
      provideRouteAlternatives: true,
      transitOptions: {
        modes: [google.maps.TransitMode.BUS],
        ...this.chosen_routePreference == 1 && { routingPreference: google.maps.TransitRoutePreference.LESS_WALKING },
        ...this.chosen_routePreference == 2 && { routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS },
        arrivalTime: new Date(this.desiredArrivalTime)
      },
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    };

    const request_rail: google.maps.DirectionsRequest = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.TRANSIT,
      provideRouteAlternatives: true,
      transitOptions: {
        modes: [google.maps.TransitMode.RAIL, google.maps.TransitMode.TRAIN],
        ...this.chosen_routePreference == 1 && { routingPreference: google.maps.TransitRoutePreference.LESS_WALKING },
        ...this.chosen_routePreference == 2 && { routingPreference: google.maps.TransitRoutePreference.FEWER_TRANSFERS },
        arrivalTime: new Date(this.desiredArrivalTime)
      },
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    };

    const request_car: google.maps.DirectionsRequest = {
      origin: origin,
      destination: destination,
      travelMode: google.maps.TravelMode.DRIVING,
      ...this.chosen_routeAvoidance == 1 && { avoidHighways: true },
      ...this.chosen_routeAvoidance == 2 && { avoidTolls: true },
      provideRouteAlternatives: true,
      unitSystem: google.maps.UnitSystem.IMPERIAL,
    };

    this.busDirectionsResults$ = this.mapDirectionsService.route(request_bus).pipe(
      map((response) => response.result)
    );

    this.railDirectionsResults$ = this.mapDirectionsService.route(request_rail).pipe(
      map((response) => response.result)
    );

    this.carDirectionsResults$ = this.mapDirectionsService.route(request_car).pipe(
      map((response) => response.result)
    );

    this.busDirectionsResults$.subscribe(bus_result => {
      if (bus_result) {
        this.busRoutes = [];
        // Handle the result
        // console.log("busDirectionsResults$ saved");
        // console.log(bus_result);
        this.busDirectionsResults = bus_result;
        this.saveToRoutes(bus_result, this.busRoutes)
      } else {
        // Handle the case where there is no result
        // console.log("No result found");
      }
    });

    this.railDirectionsResults$.subscribe(mrt_result => {
      if (mrt_result) {
        this.railRoutes = [];
        // Handle the result
        // console.log("railDirectionsResults$ saved");
        // console.log(mrt_result);
        this.railDirectionsResults = mrt_result;
        this.saveToRoutes(mrt_result, this.railRoutes)
      } else {
        // Handle the case where there is no result
        // console.log("No result found");
      }
    });

    this.carDirectionsResults$.subscribe(taxi_result => {
      if (taxi_result) {
        this.carRoutes = [];
        // Handle the result
        // console.log("carDirectionsResults$ saved");
        // console.log(taxi_result);
        this.carDirectionsResults = taxi_result;
        this.saveToRoutes(taxi_result, this.carRoutes)
      } else {
        // Handle the case where there is no result
        // console.log("No result found");
      }
    });
  }

  // For rendering of polyline for individual route selected

  routeIndex!: number;
  renderer_options!: google.maps.DirectionsRendererOptions;

  showRoute(routeIndex: number, directionsResults: any) {
    this.routeIndex = routeIndex;

    this.renderer_options = {
      directions: directionsResults,
      routeIndex: this.routeIndex
    };
  }

  // For AutoCompleteService

  predictions: google.maps.places.AutocompletePrediction[] | null = [];

  ngAfterViewInit() {
    let originInput = document.getElementById('originInput') as HTMLInputElement;
    let destinationInput = document.getElementById('destinationInput') as HTMLInputElement;

    const autocompleteOrigin = new google.maps.places.Autocomplete(originInput, {
      componentRestrictions: { country: 'sg' }
    });

    const autocompleteDestination = new google.maps.places.Autocomplete(destinationInput, {
      componentRestrictions: { country: 'sg' }
    });

    // Set the origin and destination values when the user selects a place
    autocompleteOrigin.addListener('place_changed', () => {
      const place = autocompleteOrigin.getPlace();
      this.origin = `${place.name}, ${place.formatted_address}`;

      const result: PlaceSearchResult = {
        address: originInput.value,
        name: place?.name,
        location: place.geometry?.location,
        imageUrl: this.getPhotoUrl(place),
        iconUrl: place?.icon
      }

      this.originSearchResult = result;

      // Enables Search button after user has selected from dropdown list for both origin and destination
      this.ngZone.run(() => {
        if (!this.origin!.toString().includes('undefined')) {
          this.isOriginSelected = true;
          this.toggleDisable()
        }
        else if (this.origin!.toString().includes('undefined')) {
          this.snackBar.open("Please select from the dropdown list", "OK", {
            verticalPosition: 'top'
          });
        }
      })
    });

    autocompleteDestination.addListener('place_changed', () => {
      const place = autocompleteDestination.getPlace();
      this.destination = `${place.name}, ${place.formatted_address}` || undefined;

      // console.log(place);

      const result: PlaceSearchResult = {
        address: originInput.value,
        name: place?.name,
        location: place.geometry?.location,
        imageUrl: this.getPhotoUrl(place),
        iconUrl: place?.icon
      }

      this.destinationSearchResult = result;

      // Enables Search button after user has selected from dropdown list for both origin and destination
      this.ngZone.run(() => {
        if (!this.destination!.toString().includes('undefined')) {
          this.isDestinationSelected = true;
          this.toggleDisable()
        }
        else {
          this.snackBar.open("Please select from dropdown list", "OK", {
            verticalPosition: 'top'
          });
        }
      })
    });

    // Listen for changes to the input fields
    originInput.addEventListener('input', () => {
      if (originInput.value) {
        const options: google.maps.places.AutocompletionRequest = {
          input: originInput.value,
          types: ['geocode'],
          componentRestrictions: { country: 'sg' }
        };
        const service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions(options, (predictions) => {
          this.predictions = predictions;
        });
      } else {
        this.predictions = [];
      }
    });

    destinationInput.addEventListener('input', () => {
      if (destinationInput.value) {
        const options: google.maps.places.AutocompletionRequest = {
          input: destinationInput.value,
          types: ['geocode'],
          componentRestrictions: { country: 'sg' }
        };
        const service = new google.maps.places.AutocompleteService();
        service.getPlacePredictions(options, (predictions) => {
          this.predictions = predictions;
        });
      } else {
        this.predictions = [];
      }
    });
  }

  // For enabling the button once user selects the origin and destination from dropdown list suggested by AutoCompleteService

  isSearchDisabled = true;
  isOriginSelected = false;
  isDestinationSelected = false;

  toggleDisable() {
    if (this.isOriginSelected && this.isDestinationSelected) {
      this.isSearchDisabled = false;
    }
    else {
      this.isSearchDisabled = true;
    }
  }

  // Save DirectionsResults to individual routes

  saveToRoutes(result: google.maps.DirectionsResult, arr: any[]): void {

    let counter = 0;

    result.routes.forEach((route) => {
      const singleRoute: Route = new Route();
      singleRoute.directionsRoute = route;
      singleRoute.summary = route.summary;

      route.legs.forEach((leg) => {

        singleRoute.routeIndex = counter;
        counter++;
        singleRoute.arrivalTimeText = this.getArrivalTimeText(leg.arrival_time?.text, leg.duration?.value);
        singleRoute.arrivalTimeValue = leg.arrival_time?.value;
        singleRoute.departureTimeText = this.getDepartureTimeText(leg.departure_time?.text);
        singleRoute.departureTimeValue = leg.departure_time?.value;
        singleRoute.totalDistanceValue = leg.distance!.value;
        singleRoute.totalDurationText = leg.duration?.text;
        singleRoute.totalDurationValue = leg.duration?.value;
        singleRoute.endAddress = leg.end_address;
        singleRoute.startAddress = leg.start_address;


        // Calculate TransitFare
        const transitSteps = leg.steps.filter((step) => step.travel_mode === "TRANSIT");
        const transitDistance = transitSteps.reduce((sum, step: any) => sum + step.distance?.value, 0);

        singleRoute.transitDistance = transitDistance;
        singleRoute.transitFare = this.getTransitFare(Math.ceil(singleRoute.transitDistance / 100) / 10);

        // Calculate Taxifare 
        const drivingSteps = leg.steps.filter((step) => step.travel_mode === "DRIVING");
        if (drivingSteps.length > 0) {
          singleRoute.totalDistanceValue = leg.distance!.value;
          singleRoute.taxiFare = { min: this.getTaxiFare(singleRoute.totalDistanceValue).min, max: this.getTaxiFare(singleRoute.totalDistanceValue).max }
        }

        singleRoute.steps = [];

        leg.steps?.forEach((step) => {
          if (step.travel_mode == "WALKING") {
            singleRoute.steps?.push({
              distance: step.distance?.value,
              duration: step.duration?.text,
              travelMode: step.travel_mode,
              instructions: step.instructions
            })
          }

          else if (step.travel_mode == "TRANSIT") {
            singleRoute.steps?.push(
              {
                distance: step.distance?.value,
                duration: step.duration?.text,
                travelMode: step.travel_mode,
                instructions: step.instructions,

                transitArrivalStopName: step.transit?.arrival_stop.name,
                transitArrivalTimeText: step.transit?.arrival_time.text,
                transitDepartureStopName: step.transit?.departure_time.text,
                transitDepartureTimeText: step.transit?.departure_time.text,
                transitDepartureTimeValue: step.transit?.departure_time.value,

                transitHeadSign: step.transit?.headsign,
                transitLineColor: step.transit?.line.color,
                transitLineName: this.renameLineName(step.transit?.line.name),
                transitVehicleIcon: step.transit?.line.vehicle.icon,
                transitVehicleType: step.transit?.line.vehicle.type,
                transitNumStops: step.transit?.num_stops
              }
            )
          }
        });
        arr.push(singleRoute);
      });
    });
  }

  // To ensure departureTimeText is not null or undefined
  getDepartureTimeText(originalTimeText: any) {
    if (originalTimeText === undefined) {
      const currentTime = new Date()

      let currentHour = currentTime.getHours()
      let currentMinute = currentTime.getMinutes()
      let meridian = "AM";

      if (currentHour > 12) {
        currentHour -= 12;
        meridian = "PM";
        const departureTimeText = `${currentHour}:${currentMinute.toString().padStart(2, "0")} ${meridian}`;
        return departureTimeText;
      }
      else {
        const departureTimeText = `${currentHour}:${currentMinute.toString().padStart(2, "0")} ${meridian}`;
        return departureTimeText;
      }
    }
    else {
      return originalTimeText;
    }
  }

  // To ensure arrivalTimeText is not null or undefined
  getArrivalTimeText(originalTimeText: any, totalDurationValue: any) {
    if (originalTimeText == undefined) {
      const currentTime = new Date()
      const arrivalTime = new Date(currentTime.getTime() + totalDurationValue * 1000);

      let arrivalHour = arrivalTime.getHours()
      let arrivalMinute = arrivalTime.getMinutes()
      let meridian = "AM";

      if (arrivalHour > 12) {
        arrivalHour -= 12;
        meridian = "PM";
        const arrivalTimeText = `${arrivalHour}:${arrivalMinute.toString().padStart(2, "0")} ${meridian}`;
        return arrivalTimeText;
      }
      else {
        const arrivalTimeText = `${arrivalHour}:${arrivalMinute.toString().padStart(2, "0")} ${meridian}`;
        return arrivalTimeText;
      }
    }
    else {
      return originalTimeText;
    }
  }

  // To abbreivate the MRT lines
  renameLineName(name: any) {
    if (name == 'North South Line') {
      return 'NSL'
    }
    else if (name == 'East West Line') {
      return 'EWL'
    }
    else if (name == 'North East Line') {
      return 'NEL'
    }
    else if (name == 'Circle Line') {
      return 'CCL'
    }
    else if (name == 'Downtown Line') {
      return 'DTL'
    }
    else if (name == 'Thomson East Coast Line') {
      return 'TEL'
    }
    else if (name == 'Bukit Panjang LRT') {
      return 'BP'
    }
    else if (name == 'Sengkang LRT') {
      return 'SK'
    }
    else if (name == 'Punggol LRT') {
      return 'PG'
    }
    else {
      return name
    }
  }

  // Taxi Fare Schedule from LTA, less any booking fees or peak hour and midnight hour surcharges
  taxiFareSchedule: any = {
    flagDownFare: { min: 3.2, max: 3.9 },
    incrementalFare: { min: 0.22, max: 0.25 }
  }

  //Calculate Taxi fare
  getTaxiFare(transitDistance: number) {
    const flagDownFare = this.taxiFareSchedule.flagDownFare;
    const incrementalFare = this.taxiFareSchedule.incrementalFare;

    if (transitDistance <= 1000) {
      return flagDownFare;
    }
    else if (transitDistance > 1000 && transitDistance <= 10000) {
      const minAdditionalFare = (Math.floor(transitDistance - 1000) / 400) * incrementalFare.min;
      const maxAdditionalFare = (Math.floor(transitDistance - 1000) / 400) * incrementalFare.max;
      return {
        min: flagDownFare.min + minAdditionalFare,
        max: flagDownFare.max + maxAdditionalFare
      }
    }
    else if (transitDistance > 10000) {
      const minAdditionalFare = (Math.floor(9000 / 400)) + (Math.floor(transitDistance - 10000) / 350) * incrementalFare.min;
      const maxAdditionalFare = (Math.floor(9000 / 400)) + (Math.floor(transitDistance - 10000) / 350) * incrementalFare.max;
      return {
        min: flagDownFare.min + minAdditionalFare,
        max: flagDownFare.max + maxAdditionalFare
      }
    }
  }

  // Transit Fare Schedule as at 24 Feb 2023

  transitFareSchedule: any = [
    { lowerLimit: 0.01, upperLimit: 3.2, fare: .99 },
    { lowerLimit: 3.3, upperLimit: 4.2, fare: 1.09 },
    { lowerLimit: 4.3, upperLimit: 5.2, fare: 1.19 },
    { lowerLimit: 5.3, upperLimit: 6.2, fare: 1.29 },
    { lowerLimit: 6.3, upperLimit: 7.2, fare: 1.38 },
    { lowerLimit: 7.3, upperLimit: 8.2, fare: 1.45 },
    { lowerLimit: 8.3, upperLimit: 9.2, fare: 1.52 },
    { lowerLimit: 9.3, upperLimit: 10.2, fare: 1.56 },
    { lowerLimit: 10.3, upperLimit: 11.2, fare: 1.60 },
    { lowerLimit: 11.3, upperLimit: 12.2, fare: 1.64 },
    { lowerLimit: 12.3, upperLimit: 13.2, fare: 1.68 },
    { lowerLimit: 13.3, upperLimit: 14.2, fare: 1.72 },
    { lowerLimit: 14.3, upperLimit: 15.2, fare: 1.77 },
    { lowerLimit: 15.3, upperLimit: 16.2, fare: 1.81 },
    { lowerLimit: 16.3, upperLimit: 17.2, fare: 1.85 },
    { lowerLimit: 17.3, upperLimit: 18.2, fare: 1.89 },
    { lowerLimit: 18.3, upperLimit: 19.2, fare: 1.93 },
    { lowerLimit: 19.3, upperLimit: 20.2, fare: 1.96 },
    { lowerLimit: 20.3, upperLimit: 21.2, fare: 1.99 },
    { lowerLimit: 21.3, upperLimit: 22.2, fare: 2.02 },
    { lowerLimit: 22.3, upperLimit: 23.2, fare: 2.05 },
    { lowerLimit: 23.3, upperLimit: 24.2, fare: 2.07 },
    { lowerLimit: 24.3, upperLimit: 25.2, fare: 2.09 },
    { lowerLimit: 25.3, upperLimit: 26.2, fare: 2.11 },
    { lowerLimit: 26.3, upperLimit: 27.2, fare: 2.12 },
    { lowerLimit: 27.3, upperLimit: 28.2, fare: 2.13 },
    { lowerLimit: 28.3, upperLimit: 29.2, fare: 2.14 },
    { lowerLimit: 29.3, upperLimit: 30.2, fare: 2.15 },
    { lowerLimit: 30.3, upperLimit: 31.2, fare: 2.16 },
    { lowerLimit: 31.3, upperLimit: 32.2, fare: 2.17 },
    { lowerLimit: 32.3, upperLimit: 33.2, fare: 2.18 },
    { lowerLimit: 33.3, upperLimit: 34.2, fare: 2.19 },
    { lowerLimit: 34.3, upperLimit: 35.2, fare: 2.20 },
    { lowerLimit: 35.3, upperLimit: 36.2, fare: 2.21 },
    { lowerLimit: 36.3, upperLimit: 37.2, fare: 2.22 },
    { lowerLimit: 37.3, upperLimit: 38.2, fare: 2.23 },
    { lowerLimit: 38.3, upperLimit: 39.2, fare: 2.24 },
    { lowerLimit: 39.3, upperLimit: 40.2, fare: 2.25 },
    { lowerLimit: 40.3, upperLimit: 99.0, fare: 2.26 }
  ]

  // Calculate Transitfare (Bus and/or Train)

  getTransitFare(transitDistance: number) {
    for (const fareObject of this.transitFareSchedule) {
      if (transitDistance >= fareObject.lowerLimit && transitDistance <= fareObject.upperLimit) {
        return fareObject.fare;
      }
    }
    // If transitDistance doesn't fall within the range of transitFare, return 0
    return 0;
  }

  // Sort by fare, cheaper first
  sortByFare(arr: any) {
    arr.sort((a: any, b: any) => a.transitFare - b.transitFare)
    return arr;
  }

  // Sort by travel duration, shortest first
  sortByTotalDuration(arr: any) {
    arr.sort((a: any, b: any) => a.totalDurationValue - b.totalDurationValue)
    return arr;
  }

  // Sort by arrival time, earliest first
  sortByEarliestArrival(arr: any) {
    arr.sort((a: any, b: any) => a.arrivalTimeValue - b.arrivalTimeValue)
    return arr;
  }

  desiredArrivalTime!: Date;

  // Generate arrival time count
  getCountDown(transitDepartureTimeValue: Date): number {
    const now = new Date();

    const milliSecondsDifference = transitDepartureTimeValue.getTime() - now.getTime();
    const diffInSeconds = Math.round(milliSecondsDifference / 1000);
    // console.log(`Bus arriving in ${diffInSeconds} seconds.`);
    return diffInSeconds;
  }

  swapLocations() {
    let tempLocation = this.origin;
    this.origin = this.destination;
    this.destination = tempLocation;
    this.getRoutes();
  }

  originPhotoUrl!: string | undefined;
  originSearchResult!: PlaceSearchResult | undefined;
  destinationPhotoUrl!: string | undefined;
  destinationSearchResult!: PlaceSearchResult | undefined;

  getPhotoUrl(place: google.maps.places.PlaceResult | undefined): string | undefined {
    return place?.photos && place.photos.length > 0 ? place.photos[0].getUrl() : undefined;
  }

  // To Add/Remove fav from favRouteList

  faveRoutes: Array<any> = [];
  removeId: string = "";
  faveDirectionsResults?: any = {};
  faveDirectionsRoute?: any = {};

  addFav(route: any, directionsResults: any) {
    // Checks if user is logged in before allowing Add fav

    if (this.isLoggedIn) {

      const fav = { route, directionsResults }

      let usertag = ""
      this.userService.userId.subscribe(data => usertag = data);   // to map userID
      this.faveDirectionsRoute = (route.directionsRoute)
      this.faveService.AddToFav({ SavedRoute: route, DirectionsResults: this.faveDirectionsRoute, CreatedBy: usertag }).subscribe((data: any) => {
        this.removeId = data.favId;
        this.faveRoutes.push(fav)
      })
      this.snackBar.open("Route added to favourites", "Close", {
        verticalPosition: 'top',
        duration: 5000
      });
    } else {
      this.snackBar.open("You need to be logged in first", "OK", {
        verticalPosition: 'top'
      });
    }
  }

  // To delete Fav from Fav API

  deleteFav(fav: any) {
    this.faveService.DeleteFav(fav).subscribe((data: any) => {
      this.snackBar.open(data, "Close", {
        verticalPosition: 'top',
        duration: 5000
      });
      this.faveRoutes = this.faveRoutes.filter((x: any) => x.favId !== fav)
    })
  }

  chosen_directionsResults: number = 0;

  // To render favRoute on Google Map

  showFavRoute(routeID: number, directionsResults: any) {
    if (directionsResults.request.travelMode == "TRANSIT") {
      if (directionsResults.request.transitOptions.modes.includes("BUS")) {
        this.busDirectionsResults = directionsResults
        this.chosen_directionsResults = 1
      }
      else if (directionsResults.request.transitOptions.modes.includes("RAIL") && directionsResults.request.transitOptions.modes.includes("TRAIN")) {
        this.railDirectionsResults = directionsResults
        this.chosen_directionsResults = 2
      }
      else if (directionsResults.request.travelMode.includes("DRIVING")) {
        this.carDirectionsResults = directionsResults
        this.chosen_directionsResults = 3
      }

      this.renderer_options = {
        ...this.chosen_directionsResults == 1 && { directions: this.busDirectionsResults },
        ...this.chosen_directionsResults == 2 && { directions: this.railDirectionsResults },
        ...this.chosen_directionsResults == 3 && { directions: this.carDirectionsResults },
        routeIndex: routeID
      };
    }
  }

  renderFaves() {
    this.faveRoutes = [];
    this.faveDirectionsResults!.routes = [];
    this.userService.userId.subscribe(user => {
      this.faveService.getAllFavesByUser(user).subscribe((data: any) =>

        data.map((result: any) => {
          if (result.isActive) {
            // console.log({ ...result.savedRoute, favId: result.favId });

            this.faveRoutes.push({ ...result.savedRoute, favId: result.favId });

            this.faveDirectionsResults!.routes.push({ ...result.savedRoute.directionsRoute, favId: result.favId })
          }
        })
      )
    })
  }

}
