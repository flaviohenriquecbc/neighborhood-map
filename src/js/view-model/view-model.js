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
        let map;
        let infowindow;

        // init map when google api is loaded
        this.initMap = () => {
            map = Map.initMap();
            infowindow = new google.maps.InfoWindow();
            this.search();
        };

        // the markers to show on the map
        this.markers = ko.observable([]);
        
        // text to filter the markers
        this.filterText = ko.observable('');

        // the filtered markers
        this.markersToShow = ko.computed(() => {
            let _markers;
            if (!this.filterText()) {
                // No input found, return all items
                _markers = this.markers();
            }
            // input found, match keyword to filter
            _markers = ko.utils.arrayFilter(this.markers(), (item) => {
                return item.title.toLowerCase().indexOf(this.filterText().toLowerCase()) !== -1;
            });

            Map.hideFilteredMarkers(_markers, this.markers(), map);
            return _markers;
        });

        // search for new places in the city of type specified
        this.search = () => {
            this.filterText('');
            let markersPromise = Map.search(map, this.markers(), infowindow, this.selectedCity(), this.selectedType() ? this.selectedType().type() : '');
            markersPromise.then(result => this.markers(result));
            
        };
        // show the chosen marker on the map
        this.showMarker = (marker) => {
            marker.setAnimation(google.maps.Animation.DROP);
            Map.populateInfoWindow(map, marker, infowindow);
        };

        this.isBoxVisible = ko.observable(true);
        this.toogleSearchBox = () => {
            this.isBoxVisible(!this.isBoxVisible());
            setTimeout(() => google.maps.event.trigger(map, 'resize'), 500);
        };

        this.onMouseOver = (marker) => {
            Map.toggleBounce(marker, true);
        };

        this.onMouseOut = (marker) => {
            Map.toggleBounce(marker, false);
        };
    }
}
