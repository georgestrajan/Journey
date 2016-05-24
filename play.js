function playJourney() {
    
    var journey = {
   "Id":"85954303-f984-7743-7cfe-e40a67a77fff",
   "Title":"Untitled journey",
   "Stops":[
      {
         "Name":"Seattle, WA, United States",
         "Notes":"Started in Seattle",
         "Location":{
            "lat":47.6062095,
            "lng":-122.3320708
         },
         "PlaceId":"ChIJVTPokywQkFQRmtVEaUZlJRA"
      },
      {
         "Name":"Kansas City, MO, United States",
         "Notes":"Drove to KC!",
         "Location":{
            "lat":39.0997265,
            "lng":-94.57856670000001
         },
         "PlaceId":"ChIJl5npr173wIcRolGqauYlhVU"
      },
      {
         "Name":"Chicago, IL, United States",
         "Notes":"Took a train to the windy City!",
         "Location":{
            "lat":41.8781136,
            "lng":-87.62979819999998
         },
         "PlaceId":"ChIJ7cv00DwsDogRAMDACa2m4K8"
      },
      {
         "Name":"Copenhagen, Denmark",
         "Notes":"Flew to Cph for a few days",
         "Location":{
            "lat":55.6760968,
            "lng":12.568337100000008
         },
         "PlaceId":"ChIJIz2AXDxTUkYRuGeU5t1-3QQ"
      },
      {
         "Name":"Malmö, Sweden",
         "Notes":"Day trip to Malmo!",
         "Location":{
            "lat":55.604981,
            "lng":13.003822000000014
         },
         "PlaceId":"ChIJ_5HEdKUFU0YR5YhIvd8FqdM"
      },
      {
         "Name":"Bucharest, Romania",
         "Notes":"Flew to Bucharest",
         "Location":{
            "lat":44.4267674,
            "lng":26.102538399999958
         },
         "PlaceId":"ChIJT608vzr5sUARKKacfOMyBqw"
      },
      {
         "Name":"Focșani, Vrancea County, Romania",
         "Notes":"Spent time with parents",
         "Location":{
            "lat":45.69647450000001,
            "lng":27.184042999999974
         },
         "PlaceId":"ChIJo5Yhh6MYtEARMtKEEvmfigc"
      },
      {
         "Name":"Istanbul, İstanbul, Turkey",
         "Notes":"A week in Istanbul!",
         "Location":{
            "lat":41.0082376,
            "lng":28.97835889999999
         },
         "PlaceId":"ChIJawhoAASnyhQR0LABvJj-zOE"
      },
      {
         "Name":"Kuala Lumpur Federal Territory of Kuala Lumpur Malaysia",
         "Notes":"Landed in SE Asia!",
         "Location":{
            "lat":3.139003,
            "lng":101.68685499999992
         },
         "PlaceId":"ChIJ5-rvAcdJzDERfSgcL1uO2fQ"
      },
      {
         "Name":"Siem Reap, Cambodia",
         "Notes":"2 weeks exploring the temples of Angkor!",
         "Location":{
            "lat":13.3670968,
            "lng":103.84481340000002
         },
         "PlaceId":"ChIJeaiRjJoWEDER-rvlPvmqQKk"
      },
      {
         "Name":"Battambang, Cambodia",
         "Notes":"A couple of days exploring Battambang",
         "Location":{
            "lat":13.09573,
            "lng":103.20220549999999
         },
         "PlaceId":"ChIJ5dfd6pZJBTERk-PpXJXOVZw"
      },
      {
         "Name":"Phnom Penh, Cambodia",
         "Notes":"\"The pearl of Asia\" as Lonely Planet calls it",
         "Location":{
            "lat":11.5448729,
            "lng":104.89216680000004
         },
         "PlaceId":"ChIJ42tqxz1RCTERuyW1WugOAZw"
      },
      {
         "Name":"Sihanoukville, Cambodia",
         "Notes":"Beach time!",
         "Location":{
            "lat":10.7581899,
            "lng":103.8216261
         },
         "PlaceId":"ChIJgVIpXRHhBzERWV-LJqT_nmk"
      }
   ]
};

    var map = null;
    var placesService = null;
    //var currentPoint = 0;
    
    // array of markers on the map
    var markers = [];
    
    var prevInfoWindow = null;

    init();
    
    function init() {
        var mapDiv = document.getElementById('map');
        map = new google.maps.Map(mapDiv, {
            center: {lat: 0, lng: 0},
            zoom: 1
        });
        
        placesService = new google.maps.places.PlacesService(map);

        var playJourneyButton = document.getElementById('button_playJourney');
        playJourneyButton.onclick = playJourney;    
    }
    
    function playJourney() {
                        
        var speed = 1.2;        
        play(0);
        
        function play(currentPoint) {
            
            setTimeout(function() {           

                if (currentPoint >= journey.Stops.length) {
                    return;
                }
                
                var currentLat = journey.Stops[currentPoint].Location.lat;
                var currentLon = journey.Stops[currentPoint].Location.lng;
                var latLng = new google.maps.LatLng(currentLat, currentLon);
                var currentName = journey.Stops[currentPoint].Name;
                var currentNotes = journey.Stops[currentPoint].Notes;
                var marker = null;

                
                if (currentPoint == 0) {
                    
                    bringPointIntoView(latLng);
                    setZoomToCoverPoints(0);
                } else {
                    
                    var prevLat = journey.Stops[currentPoint - 1].Location.lat;
                    var prevLon =  journey.Stops[currentPoint -1].Location.lng;            
                    var prevLatLng = new google.maps.LatLng(prevLat, prevLon);
                    
                    var distance = getDistanceBetweenPoints(prevLat, prevLon, currentLat, currentLon);
                    console.log(distance);        
                        
                    setTimeout(function () { 
                        setZoomToCoverPoints(distance);
                    }, speed * 700);

                    setTimeout(function () { 
                        bringPointIntoView(latLng);
                    }, speed * 1500);
                    
                }
                                                                
                setTimeout(function () { 
                    
                    marker = addMarkerToMap(latLng);
                    markers.push(marker);            
                    var infoWindow = addInfoWindow(marker, currentName , currentNotes);
                    if (prevInfoWindow) {
                        prevInfoWindow.close();
                    }
                    prevInfoWindow = infoWindow;
                    
                }, speed * 2000);
                
                play(currentPoint + 1);
                
            }, speed * 3500);
        }

    }   
    
    function addMarkerToMap(latLng) {
        var marker = new google.maps.Marker({
        map: map,
        position: latLng,
        animation: google.maps.Animation.DROP
      });
        return marker;        
    }
    
    function addInfoWindow(marker, name, notes) {
        var infowindow = new google.maps.InfoWindow();
        infowindow.setContent('<div>' + notes);// + '</strong><br>' + notes);     
        infowindow.open(map, marker);
        return infowindow;
    }
    
    function bringPointIntoView(latLng) {
        map.panTo(latLng);
    }

    function panToBounds(latLngSW, latLngNE) {
        var bounds = new google.maps.LatLngBounds();
        bounds.extend(latLngSW);
        bounds.extend(latLngNE);
                
        //panToBounds does not change zoom level; fitBounds does
        map.panToBounds(bounds);        
    }
    
    function setZoomToCoverPoints(distanceBetweenPoints) {
        
        // TODO this should be reconsidered, the distances and zoom levels seem arbitrary
        var zoomLevel, defaultZoomLevel = 7;
        
        var currentZoomLevel = map.getZoom();
        
        if (distanceBetweenPoints < 500) {
            zoomLevel = defaultZoomLevel;
        }
        else if (distanceBetweenPoints < 1000) {
            zoomLevel = defaultZoomLevel - 1;
        }
        else if (distanceBetweenPoints < 3000) {
            zoomLevel = defaultZoomLevel - 2;
        }
        else if (distanceBetweenPoints < 5000) {
            zoomLevel = defaultZoomLevel - 3;
        }
        else {
            zoomLevel = defaultZoomLevel - 4;
        }
        
        // don't let zoomLevel reach 1
        if (zoomLevel <= 1) {
            zoomLevel = 2;
        }
        
        console.log("Set zoom level: " + zoomLevel);
        //map.setZoom(zoomLevel);
        var zoomOut = false;
        
        if (zoomLevel < currentZoomLevel) {
            zoomOut = true;            
        }
        
        var zoomArr = [];
        for (var i = 0; i < Math.abs(zoomLevel - currentZoomLevel); i++) {
            if (zoomOut) {
                zoomArr.push(currentZoomLevel - i + 1);                
            } else {                
                zoomArr.push(currentZoomLevel + i + 1);                
            }
        }
        
        // 2 to 6
        // i = 0, 1, 2, 3
        // 3, 4, 5, 6
                
        var z = 0;
        function zoom(z) {
            setTimeout(function () {
                if (!zoomArr[z]) {
                    return;
                }
                
                map.setZoom(zoomArr[z]);
                zoom(z + 1);
            }, 200);
        }
        
    }
    
    function getDistanceBetweenPoints(lat1, lon1, lat2, lon2) {
        var radlat1 = Math.PI * lat1/180;
        var radlat2 = Math.PI * lat2/180;
        var radlon1 = Math.PI * lon1/180;
        var radlon2 = Math.PI * lon2/180;
        var theta = lon1-lon2;
        var radtheta = Math.PI * theta/180;
        var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;
        dist = Math.round(dist*1000)/1000
        return dist    
    }


}