import {GOOGLE_APIKEY} from './../utils/variables.js';

export default class Map {

    /**
     * Init the google maps map
     */
    static initMap() {
        // Constructor creates a new map - only center and zoom are required.
        const map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 52.5200066, lng: 13.404954},
            zoom: 13,
            mapTypeControl: false,
        });
        return map;
    }

    /**
     * In case the status is OK, which means the pano was found, compute the
     * position of the streetview image, then calculate the heading, then get a
     * panorama from that and set the options
     * @param {object} data 
     * @param {string} status 
     * @param {object} marker 
     */     
    static getInstaPhotos(data, marker){

    }

    static getWikiArticle(marker) {
        // get wiki article
        const address = marker.vicinity;
        const wikiURl = `http://en.wikipedia.org/w/api.php?action=opensearch&search=${address}&format=json&callback=wikiCallBack`;

        const wikiRequestTimeout = setTimeout(function() {
            alert('failed to get wikipedia resources');
            $('#wiki').text('No Wiki article');
        }, 8000);

        $.ajax({
            url: wikiURl,
            dataType: 'jsonp',
            success: function(response) {
                var articleList = response[1];
                const articleStr = articleList[0];
                var url = 'http://wikipedia.org/wiki/' + articleStr;
                if (articleStr) {
                    $('#wiki').html(`<p>Wiki article: <a target="_blank" href="${url}" >${articleStr}</a></p>`);
                } else {
                    $('#wiki').html('<p>No Wiki article</p>');
                }
                clearTimeout(wikiRequestTimeout);
            },
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
    static getStreetViewAndInta(data, status, marker, infowindow) {
        
        //get wiki article
        Map.getWikiArticle(marker);

        if (status == google.maps.StreetViewStatus.OK) {
            const nearStreetViewLocation = data.location.latLng;
            const heading = google.maps.geometry.spherical
                                    .computeHeading(nearStreetViewLocation, marker.position);
            infowindow.setContent(`<p><h5>${marker.title}</h5><h7>${marker.vicinity}</h7><div id="wiki"></div></p><div id="pano"></div>`);
            const panoramaOptions = {
                position: nearStreetViewLocation,
                pov: {
                    heading: heading,
                    pitch: 30
                }
            };
            new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
        } else {
            infowindow.setContent('<p><h5>${marker.title}</h5><h7>${marker.vicinity}</h7><div id="wiki"></div></p><div id="pano">No StreetView Found</div>');
        }
    }

    /**
     * This function populates the infowindow when the marker is clicked. We'll only allow
     * one infowindow which will open at the marker that is clicked, and populate based
     * on that markers position.
     * @param {*} map 
     * @param {*} marker 
     * @param {*} infowindow 
     */
    static populateInfoWindow(map, marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            // Clear the infowindow content to give the streetview time to load.
            infowindow.setContent('');
            infowindow.marker = marker;
            // Make sure the marker property is cleared if the infowindow is closed.
            infowindow.addListener('closeclick', function() {
                infowindow.marker = null;
            });
            const streetViewService = new google.maps.StreetViewService();
            const radius = 50;
            // Use streetview service to get the closest streetview image within
            // 50 meters of the markers position
            streetViewService.getPanoramaByLocation(marker.position, radius, (data, status) => Map.getStreetViewAndInta(data, status, marker, infowindow));
            // Open the infowindow on the correct marker.
            infowindow.open(map, marker);
        }
    }

    /**
     * This function will loop through the listings and erase them all.
     * @param {list} markers - the old markers on the amp
     */
    static removeMarkers(markers) {
        if(!markers)
            return [];
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(null);
        }
        markers = [];
        return markers;
    }

    static makeMarkerIcon(markerColor) {
        var markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
    }

    /**
     * Populate the map with the results received
     * @param {object} map - the google maps map
     * @param {list} markers - the old markers printed on the map
     * @param {list} places - the places to print on the map
     */
    static createMarkers(map, markers, places, infowindow) {
        // remove all previous markers
        let _markers = Map.removeMarkers(markers);
        
        // Style the markers a bit. This will be our listing marker icon.
        const defaultIcon = Map.makeMarkerIcon('0091ff');

        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
        const highlightedIcon = Map.makeMarkerIcon('FFFF24');

        var bounds = new google.maps.LatLngBounds();
        places.forEach((place) => {
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

            const marker = new google.maps.Marker({
                map: map,
                icon: defaultIcon,
                title: place.name,
                position: place.geometry.location,
                animation: google.maps.Animation.DROP,
                id: place.id,
                vicinity: place.vicinity,
                photo: place.photos && place.photos[0] && place.photos[0].getUrl({'maxWidth': 70, 'maxHeight': 70})
            });

            google.maps.event.addDomListener(window, 'resize', function() {
                map.fitBounds(bounds);
            });

            marker.addListener('click', function() {
                marker.setAnimation(google.maps.Animation.DROP);
                Map.populateInfoWindow(map, marker, infowindow);
            });
            // Two event listeners - one for mouseover, one for mouseout,
            // to change the colors back and forth.
            marker.addListener('mouseover', function() {
                marker.setIcon(highlightedIcon);
            });
            marker.addListener('mouseout', function() {
                marker.setIcon(defaultIcon);
            });

            places.innerHTML += '<li>' + place.name + '</li>';

            _markers.push(marker);

            bounds.extend(place.geometry.location);
        });
        map.fitBounds(bounds);
        return _markers;
    }

    static toggleBounce(marker, animate) {
        if (!animate) {
            marker.setAnimation(null);
        } else {
            marker.setAnimation(google.maps.Animation.BOUNCE);
        }
    }

    static hideFilteredMarkers(filteredMarkers, allMarkers, map) {
        allMarkers.forEach((item) => {
            const wasFiltered = !filteredMarkers.some(itemAll => itemAll.id === item.id);
            if (wasFiltered) {
                item.setMap(null);
            } else {
                item.setMap(map);
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
    static search(map, markers, infowindow, address, type) {
        return new Promise((resolve, reject) => {
            // Make sure the address isn't blank.
            if (address == '') {
                window.alert('You must enter an area, or address.');
            } else {
                const urlGeocodes= `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_APIKEY}`;

                $.getJSON(urlGeocodes, (data) => {
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
                }).error(() => {
                    alert('Place Could Not Be Loaded. Try again');
                    reject();
                });
            }
        });
    }
}