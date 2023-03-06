export default class Route {
  // common base properties for all routes
  public routeIndex?: number;
  public arrivalTimeText?: string;
  public arrivalTimeValue?: Date;
  public departureTimeText?: string;
  public departureTimeValue?: Date;
  public totalDistanceValue!: number;
  public totalDurationText?: string;
  public totalDurationValue?: number;
  public endAddress?: string;
  public startAddress?: string;
  public directionsRoute?: google.maps.DirectionsRoute
  
  // properties created to calculate fare by distance for TRANSIT travelMode
  public transitDistance?: number;
  public transitFare?: number;
  
  // property created for DRIVING travelMode
  public summary?: string;
  public taxiFare?: any;

  public steps?: {
      // common properties for both TRANSIT and DRIVING travelMode
      distance?: number;
      duration?: string;
      travelMode?: string;
      instructions?: string;

      // unique properties for only TRANSIT travelMode (meaning bus or rail only)
      transitArrivalStopName?: string;
      transitArrivalTimeText?: string;
      transitDepartureStopName?: string;
      transitDepartureTimeText?: string;
      transitDepartureTimeValue?: Date;
      transitHeadSign?: string;
      transitLineColor?: string;
      transitLineName?: string;
      transitVehicleIcon?: string;
      transitVehicleType?: string;   
      transitNumStops?: number;
  }[];
}
