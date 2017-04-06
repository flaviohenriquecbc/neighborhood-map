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
     * Show the infowindow on the marker with the details, wiki and streetview image
     * @param {*} articleStr The name of the wiki article
     * @param {*} wikiUrl the url of the wiki article
     * @param {*} data the streeview data
     * @param {*} status the status of street view
     * @param {*} marker the marker clicked
     * @param {*} infowindow the infowindow instance
     */
    static openInfoWindow(articleStr, wikiUrl, data, status, marker, infowindow){
        if (status == google.maps.StreetViewStatus.OK) {
            const nearStreetViewLocation = data.location.latLng;
            const heading = google.maps.geometry.spherical
                                    .computeHeading(nearStreetViewLocation, marker.position);
            infowindow.setContent(Map.getWindowContent(marker.title, marker.vicinity, wikiUrl, articleStr));
            const panoramaOptions = {
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
    static getWindowContent(title, address, wikiUrl, wikiArticleStr, streetViewMsg) {
        const wikiArticle = wikiArticleStr
                ? `Wiki article: <a target="_blank" href="${wikiUrl}" >${wikiArticleStr}</a>`
                : 'No Wiki article';
        return `<p><h5>${title}</h5><h7>${address}</h7><p>${wikiArticle}</p></p><div id="pano">${streetViewMsg}</div>`;
    }

    /**
     * Get Wikipedia article for the marker location
     * @param {*} marker : marker of the place
     */
    static getWikiArticle(data, status, marker, infowindow) {
        // get wiki article
        const address = marker.vicinity;
        const wikiURl = `http://en.wikipedia.org/w/api.php?action=opensearch&search=${address}&format=json&callback=wikiCallBack`;

        $.ajax({
            url: wikiURl,
            dataType: 'jsonp',
        }).done(function (response) {
            const articleList = response[1];
            const articleStr = articleList[0];
            const url = `http://wikipedia.org/wiki/${articleStr}`;

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
    static getStreetViewAndInta(data, status, marker, infowindow) {
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
    static populateInfoWindow(map, marker, infowindow) {
        // Check to make sure the infowindow is not already opened on this marker.
        if (infowindow.marker != marker) {
            // Clear the infowindow content to give the streetview time to load.
            infowindow.setContent(`<p><h5>${marker.title}</h5><h7>${marker.vicinity}</h7><p>`);
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
        const markerImage = new google.maps.MarkerImage(
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

        const bounds = new google.maps.LatLngBounds();
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

            places.innerHTML += `<li>${place.name}</li>`;

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
    static toggleBounce(marker, animate) {
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
    static hideFilteredMarkers(filteredMarkers, allMarkers) {
        allMarkers.forEach((item) => {
            const wasFiltered = !filteredMarkers.some(itemAll => itemAll.id === item.id);
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
    static search(map, markers, infowindow, address, type) {
        return new Promise((resolve, reject) => {
            // Make sure the address isn't blank.
            if (address == '') {
                window.alert('You must enter an area, or address.');
            } else {
                const urlGeocodes= `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${GOOGLE_APIKEY}`;

                $.getJSON(urlGeocodes, (data) => {
                    const service = new google.maps.places.PlacesService(map);
                    const request = {
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