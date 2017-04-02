import {preferredCity, googlePlacesTypes} from './../utils/variables.js';
import GooglePlaceType from './../model/google-place-type.js';
import Map from './map.js';

export default class ViewModel {
    constructor() {
        this.types = ko.observableArray([]);
        googlePlacesTypes.forEach((type) => {
            this.types.push(new GooglePlaceType(type));
        });
        this.selectedType = ko.observable();
        this.selectedCity = ko.observable(preferredCity);
        const map = Map.initMap();
        const infowindow = new google.maps.InfoWindow();
        this.markers = ko.observable([]);
        // search for new places in the city of type specified
        this.search = () => {
            let markersPromise = Map.search(map, this.markers(), infowindow, this.selectedCity(), this.selectedType() ? this.selectedType().type() : '');
            markersPromise.then(result => this.markers(result));
            
        };
        this.search();
        // show the chosen marker on the map
        this.showMarker = (marker) => {
            Map.populateInfoWindow(map, marker, infowindow);
        };

        this.isBoxVisible = ko.observable(true);
        this.toogleSearchBox = () => {
            this.isBoxVisible(!this.isBoxVisible());
            setTimeout(() => google.maps.event.trigger(map, 'resize'), 500);
        };
    }
}
