(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _viewModel = require('./view-model/view-model.js');

var _viewModel2 = _interopRequireDefault(_viewModel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

ko.applyBindings(new _viewModel2.default());

},{"./view-model/view-model.js":5}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Represents the type on google places
 */
var GooglePlaceType = function () {
    function GooglePlaceType(data) {
        _classCallCheck(this, GooglePlaceType);

        this.type = ko.observable(data);
        this.name = ko.observable(this.formatName(data));
    }

    /**
     * Transform the google place type in a readable name. For example:
     * electronics_store becomes Electronics Store
     * @param {string} name 
     */


    _createClass(GooglePlaceType, [{
        key: 'formatName',
        value: function formatName(name) {
            return name.split('_').map(function (word) {
                return word.charAt(0).toUpperCase() + word.substring(1).toLowerCase();
            }).join(' ');
        }
    }]);

    return GooglePlaceType;
}();

exports.default = GooglePlaceType;

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * List of posible types of places to look for
 */
var googlePlacesTypes = exports.googlePlacesTypes = ['accounting', 'airport', 'amusement_park', 'aquarium', 'art_gallery', 'atm', 'bakery', 'bank', 'bar', 'beauty_salon', 'bicycle_store', 'book_store', 'bowling_alley', 'bus_station', 'cafe', 'campground', 'car_dealer', 'car_rental', 'car_repair', 'car_wash', 'casino', 'cemetery', 'church', 'city_hall', 'clothing_store', 'convenience_store', 'courthouse', 'dentist', 'department_store', 'doctor', 'electrician', 'electronics_store', 'embassy', 'establishment', 'finance', 'fire_station', 'florist', 'food', 'funeral_home', 'furniture_store', 'gas_station', 'general_contractor', 'grocery_or_supermarket', 'gym', 'hair_care', 'hardware_store', 'health', 'hindu_temple', 'home_goods_store', 'hospital', 'insurance_agency', 'jewelry_store', 'laundry', 'lawyer', 'library', 'liquor_store', 'local_government_office', 'locksmith', 'lodging', 'meal_delivery', 'meal_takeaway', 'mosque', 'movie_rental', 'movie_theater', 'moving_company', 'museum', 'night_club', 'painter', 'park', 'parking', 'pet_store', 'pharmacy', 'physiotherapist', 'place_of_worship', 'plumber', 'police', 'post_office', 'real_estate_agency', 'restaurant', 'roofing_contractor', 'rv_park', 'school', 'shoe_store', 'shopping_mall', 'spa', 'stadium', 'storage', 'store', 'subway_station', 'synagogue', 'taxi_stand', 'train_station', 'travel_agency', 'university', 'veterinary_care', 'zoo'];

/**
 * Preferred City that loads the map
 */
var preferredCity = exports.preferredCity = 'Berlin, Germany';

/**
 * Google app key
 */
var GOOGLE_APIKEY = exports.GOOGLE_APIKEY = 'AIzaSyDSkRsrE76n3aMmeOnbx7C2XzFk9eyj0qw';

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _variables = require('./../utils/variables.js');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Map = function () {
    function Map() {
        _classCallCheck(this, Map);
    }

    _createClass(Map, null, [{
        key: 'initMap',


        /**
         * Init the google maps map
         */
        value: function initMap() {
            // Constructor creates a new map - only center and zoom are required.
            var map = new google.maps.Map(document.getElementById('map'), {
                center: { lat: 52.5200066, lng: 13.404954 },
                zoom: 13,
                mapTypeControl: false
            });
            return map;
        }

        /**
         * Show the infowindow on the marker with the details, wiki and streetview image
         * @param {*} articleStr The name of the wiki article
         * @param {*} wikiUrl the url of the wiki article
         * @param {*} data the streeview data
         * @param {*} status the status of street view
         * @param {*} marker the marker clicked
         * @param {*} infowindow the infowindow instance
         */

    }, {
        key: 'openInfoWindow',
        value: function openInfoWindow(articleStr, wikiUrl, data, status, marker, infowindow) {
            if (status == google.maps.StreetViewStatus.OK) {
                var nearStreetViewLocation = data.location.latLng;
                var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
                infowindow.setContent(Map.getWindowContent(marker.title, marker.vicinity, wikiUrl, articleStr));
                var panoramaOptions = {
                    position: nearStreetViewLocation,
                    pov: {
                        heading: heading,
                        pitch: 30
                    }
                };
                new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
            } else {
                infowindow.setContent(Map.getWindowContent(marker.title, marker.vicinity, wikiUrl, articleStr, 'No StreetView Found'));
            }
        }

        /**
         * get html content of the infowindow
         * @param {*} title the title of the marker
         * @param {*} address the address of the marker
         * @param {*} wikiUrl the wikiurl of the marker
         * @param {*} wikiArticleStr the wiki article of the marker
         * @param {*} streetViewMsg the streetview of the marker
         */

    }, {
        key: 'getWindowContent',
        value: function getWindowContent(title, address, wikiUrl, wikiArticleStr, streetViewMsg) {
            var wikiArticle = wikiArticleStr ? 'Wiki article: <a target="_blank" href="' + wikiUrl + '" >' + wikiArticleStr + '</a>' : 'No Wiki article';
            return '<p><h5>' + title + '</h5><h7>' + address + '</h7><p>' + wikiArticle + '</p></p><div id="pano">' + streetViewMsg + '</div>';
        }

        /**
         * Get Wikipedia article for the marker location
         * @param {*} marker : marker of the place
         */

    }, {
        key: 'getWikiArticle',
        value: function getWikiArticle(data, status, marker, infowindow) {
            // get wiki article
            var address = marker.vicinity;
            var wikiURl = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + address + '&format=json&callback=wikiCallBack';

            $.ajax({
                url: wikiURl,
                dataType: 'jsonp'
            }).done(function (response) {
                var articleList = response[1];
                var articleStr = articleList[0];
                var url = 'http://wikipedia.org/wiki/' + articleStr;

                // print infowindow
                Map.openInfoWindow(articleStr, url, data, status, marker, infowindow);
            }).fail(function () {
                alert('failed to get wikipedia resources');

                // print infowindow
                Map.openInfoWindow(undefined, undefined, data, status, marker, infowindow);
            });
        }

        /**
         * In case the status is OK, which means the pano was found, compute the
         * position of the streetview image, then calculate the heading, then get a
         * panorama from that and set the options
         * @param {object} data 
         * @param {string} status 
         * @param {object} marker 
         * @param {object} infowindow 
         */

    }, {
        key: 'getStreetViewAndInta',
        value: function getStreetViewAndInta(data, status, marker, infowindow) {
            //get wiki article
            Map.getWikiArticle(data, status, marker, infowindow);
        }

        /**
         * This function populates the infowindow when the marker is clicked. We'll only allow
         * one infowindow which will open at the marker that is clicked, and populate based
         * on that markers position.
         * @param {*} map 
         * @param {*} marker 
         * @param {*} infowindow 
         */

    }, {
        key: 'populateInfoWindow',
        value: function populateInfoWindow(map, marker, infowindow) {
            // Check to make sure the infowindow is not already opened on this marker.
            if (infowindow.marker != marker) {
                // Clear the infowindow content to give the streetview time to load.
                infowindow.setContent('<p><h5>' + marker.title + '</h5><h7>' + marker.vicinity + '</h7><p>');
                infowindow.marker = marker;
                // Make sure the marker property is cleared if the infowindow is closed.
                infowindow.addListener('closeclick', function () {
                    infowindow.marker = null;
                });
                var streetViewService = new google.maps.StreetViewService();
                var radius = 50;
                // Use streetview service to get the closest streetview image within
                // 50 meters of the markers position
                streetViewService.getPanoramaByLocation(marker.position, radius, function (data, status) {
                    return Map.getStreetViewAndInta(data, status, marker, infowindow);
                });
                // Open the infowindow on the correct marker.
                infowindow.open(map, marker);
            }
        }

        /**
         * This function will loop through the listings and erase them all.
         * @param {list} markers - the old markers on the amp
         */

    }, {
        key: 'removeMarkers',
        value: function removeMarkers(markers) {
            if (!markers) return [];
            for (var i = 0; i < markers.length; i++) {
                markers[i].setMap(null);
            }
            markers = [];
            return markers;
        }
    }, {
        key: 'makeMarkerIcon',
        value: function makeMarkerIcon(markerColor) {
            var markerImage = new google.maps.MarkerImage('http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|' + markerColor + '|40|_|%E2%80%A2', new google.maps.Size(21, 34), new google.maps.Point(0, 0), new google.maps.Point(10, 34), new google.maps.Size(21, 34));
            return markerImage;
        }

        /**
         * Populate the map with the results received
         * @param {object} map - the google maps map
         * @param {list} markers - the old markers printed on the map
         * @param {list} places - the places to print on the map
         */

    }, {
        key: 'createMarkers',
        value: function createMarkers(map, markers, places, infowindow) {
            // remove all previous markers
            var _markers = Map.removeMarkers(markers);

            // Style the markers a bit. This will be our listing marker icon.
            var defaultIcon = Map.makeMarkerIcon('0091ff');

            // Create a "highlighted location" marker color for when the user
            // mouses over the marker.
            var highlightedIcon = Map.makeMarkerIcon('FFFF24');

            var bounds = new google.maps.LatLngBounds();
            places.forEach(function (place) {
                // const image = {
                //     url: place.icon,
                //     size: new google.maps.Size(71, 71),
                //     origin: new google.maps.Point(0, 0),
                //     anchor: new google.maps.Point(17, 34),
                //     scaledSize: new google.maps.Size(25, 25)
                // };

                // const imageHover = {
                //     url: place.icon,
                //     size: new google.maps.Size(71, 71),
                //     origin: new google.maps.Point(0, 0),
                //     anchor: new google.maps.Point(17, 34),
                //     scaledSize: new google.maps.Size(25, 25)
                // };

                var marker = new google.maps.Marker({
                    map: map,
                    icon: defaultIcon,
                    title: place.name,
                    position: place.geometry.location,
                    animation: google.maps.Animation.DROP,
                    id: place.id,
                    vicinity: place.vicinity,
                    photo: place.photos && place.photos[0] && place.photos[0].getUrl({ 'maxWidth': 70, 'maxHeight': 70 })
                });

                google.maps.event.addDomListener(window, 'resize', function () {
                    map.fitBounds(bounds);
                });

                marker.addListener('click', function () {
                    marker.setAnimation(google.maps.Animation.DROP);
                    Map.populateInfoWindow(map, marker, infowindow);
                });
                // Two event listeners - one for mouseover, one for mouseout,
                // to change the colors back and forth.
                marker.addListener('mouseover', function () {
                    marker.setIcon(highlightedIcon);
                });
                marker.addListener('mouseout', function () {
                    marker.setIcon(defaultIcon);
                });

                places.innerHTML += '<li>' + place.name + '</li>';

                _markers.push(marker);

                bounds.extend(place.geometry.location);
            });
            map.fitBounds(bounds);
            return _markers;
        }

        /**
         * add or remove the animation of the marker
         * @param {object} marker 
         * @param {boolean} animate if is to add or remove animation
         */

    }, {
        key: 'toggleBounce',
        value: function toggleBounce(marker, animate) {
            if (!animate) {
                marker.setAnimation(null);
            } else {
                marker.setAnimation(google.maps.Animation.BOUNCE);
            }
        }

        /**
         * hide the filtered markers
         * @param {*} filteredMarkers the filtered markers 
         * @param {*} allMarkers
         */

    }, {
        key: 'hideFilteredMarkers',
        value: function hideFilteredMarkers(filteredMarkers, allMarkers) {
            allMarkers.forEach(function (item) {
                var wasFiltered = !filteredMarkers.some(function (itemAll) {
                    return itemAll.id === item.id;
                });
                if (wasFiltered) {
                    item.setVisible(false);
                } else {
                    item.setVisible(true);
                }
            });
        }

        /**
         * This function takes the input value in the find nearby area text input
         * locates it, and then zooms into that area. This is so that the user can
         * show all listings, then decide to focus on one area of the map.
         * @param {object} map - google maps map
         * @param {list} markers - the markers already printed on the map
         * @param {string} address - the address typed by the user
         * @param {string} type - the type of the places asked
         */

    }, {
        key: 'search',
        value: function search(map, markers, infowindow, address, type) {
            return new Promise(function (resolve, reject) {
                // Make sure the address isn't blank.
                if (address == '') {
                    window.alert('You must enter an area, or address.');
                } else {
                    var urlGeocodes = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address + '&key=' + _variables.GOOGLE_APIKEY;

                    $.getJSON(urlGeocodes, function (data) {
                        var service = new google.maps.places.PlacesService(map);
                        var request = {
                            location: new google.maps.LatLng(data.results[0].geometry.location.lat, data.results[0].geometry.location.lng),
                            radius: '5000',
                            types: [type]
                        };

                        map.setCenter(data.results[0].geometry.location);
                        map.setZoom(15);

                        service.nearbySearch(request, function callback(results, status) {
                            if (status == google.maps.places.PlacesServiceStatus.OK) {
                                resolve(Map.createMarkers(map, markers, results, infowindow));
                            } else {
                                alert('Problem while tring to retrive nearby places');
                                reject();
                            }
                        });
                    }).error(function () {
                        alert('Place Could Not Be Loaded. Try again');
                        reject();
                    });
                }
            });
        }
    }]);

    return Map;
}();

exports.default = Map;

},{"./../utils/variables.js":3}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _variables = require('./../utils/variables.js');

var _googlePlaceType = require('./../model/google-place-type.js');

var _googlePlaceType2 = _interopRequireDefault(_googlePlaceType);

var _map = require('./map.js');

var _map2 = _interopRequireDefault(_map);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ViewModel = function ViewModel() {
    var _this = this;

    _classCallCheck(this, ViewModel);

    this.types = ko.observableArray([]);
    _variables.googlePlacesTypes.forEach(function (type) {
        _this.types.push(new _googlePlaceType2.default(type));
    });
    this.selectedType = ko.observable();
    this.selectedCity = ko.observable(_variables.preferredCity);
    var map = void 0;
    var infowindow = void 0;

    // init map when google api is loaded
    this.initMap = function () {
        map = _map2.default.initMap();
        infowindow = new google.maps.InfoWindow();
        _this.search();
    };

    // the markers to show on the map
    this.markers = ko.observable([]);

    // text to filter the markers
    this.filterText = ko.observable('');

    // the filtered markers
    this.markersToShow = ko.computed(function () {
        var _markers = void 0;
        if (!_this.filterText()) {
            // No input found, return all items
            _markers = _this.markers();
        }
        // input found, match keyword to filter
        _markers = ko.utils.arrayFilter(_this.markers(), function (item) {
            return item.title.toLowerCase().indexOf(_this.filterText().toLowerCase()) !== -1;
        });

        _map2.default.hideFilteredMarkers(_markers, _this.markers(), map);
        return _markers;
    });

    // search for new places in the city of type specified
    this.search = function () {
        _this.filterText('');
        var markersPromise = _map2.default.search(map, _this.markers(), infowindow, _this.selectedCity(), _this.selectedType() ? _this.selectedType().type() : '');
        markersPromise.then(function (result) {
            return _this.markers(result);
        });
    };
    // show the chosen marker on the map
    this.showMarker = function (marker) {
        marker.setAnimation(google.maps.Animation.DROP);
        _map2.default.populateInfoWindow(map, marker, infowindow);
    };

    this.isBoxVisible = ko.observable(true);
    this.toogleSearchBox = function () {
        _this.isBoxVisible(!_this.isBoxVisible());
        setTimeout(function () {
            return google.maps.event.trigger(map, 'resize');
        }, 500);
    };

    this.onMouseOver = function (marker) {
        _map2.default.toggleBounce(marker, true);
    };

    this.onMouseOut = function (marker) {
        _map2.default.toggleBounce(marker, false);
    };
};

exports.default = ViewModel;

},{"./../model/google-place-type.js":2,"./../utils/variables.js":3,"./map.js":4}]},{},[1]);
