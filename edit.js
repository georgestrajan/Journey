function editJourney()
{    
    var map = null;
    
    // contains objects which have the properties id, name and place
    var waypoints = [];
            
    initMap();
    
    // we start off by adding a waypoint
    showAddWaypointUI();            
    
    function initMap() {      
      var mapDiv = document.getElementById('map');
      map = new google.maps.Map(mapDiv, {
        center: {lat: 0, lng: 0},
        zoom: 1
      });      
    } 
    
    // return the index of a waypoint that has a specific Id; or -1 if none was found
    function getWaypointIndexById(Id) {
        for (var i = 0, iLen = waypoints.length; i < iLen; i++) {
            if (waypoints[i].Id == Id) return i;
        }
        return -1;
    }
    
    // add a waypoint to the list of waypoints and to the table of waypoints
    function addWaypointToList(currentlyAddingWaypointIndex, currentWaypoint) {
    
      waypoints.splice(currentlyAddingWaypointIndex, 0, currentWaypoint);  
      
      var table_waypoints = document.getElementById('table_waypoints');
      var newRow = table_waypoints.insertRow(currentlyAddingWaypointIndex);      
      
      var input = document.createElement("input");
      input.type = "text";
      input.id = "input_waypoint_" + currentWaypoint.Id;
      input.disabled = true;
      input.value = currentWaypoint.Name;
      var text_cell = newRow.insertCell(0);
      text_cell.appendChild(input);
      
      var buttonAdd = document.createElement("button");
      buttonAdd.type = "button";
      buttonAdd.textContent = "Add";
      buttonAdd.id = currentWaypoint.Id;
      buttonAdd.onclick = function(e) {

          // find in the waypoints array the object which has the Id equal to e.target.id
          showAddWaypointUI(getWaypointIndexById(e.target.id));          

      };
      
      var text_cell2 = newRow.insertCell(1);
      text_cell2.appendChild(buttonAdd);
      
      var buttonRemove = document.createElement("button");
      buttonRemove.type = "button";
      buttonRemove.textContent = "Remove";
      buttonRemove.id = currentWaypoint.Id;
      buttonRemove.onclick = function(e) {
      
          // remove the waypoint from the array, the marker from the map and the row from the table of waypoints    
          var indexToRemove = getWaypointIndexById(e.target.id);
          
          // remove the marker from the map
          if (waypoints[indexToRemove].Marker) {
              waypoints[indexToRemove].Marker.setMap(null);
          }
          
          waypoints.splice(indexToRemove, 1);
          table_waypoints.deleteRow(indexToRemove);
          
      };
      
      var text_cell3 = newRow.insertCell(2);
      text_cell3.appendChild(buttonRemove);
      
    }
    
    // show the UI for adding a waypoint and handle the user interactions that follow     
    function showAddWaypointUI(currentlyAddingWaypointIndex) {
      
      var autocomplete = null;
      var currentWaypoint = null;
      
      var input = document.getElementById('input_waypoint');
      input.value = "";
      
      var addUI = document.getElementById('div_addWaypoint');
      addUI.style.display = "inline-block";

      // Create the autocomplete object, restricting the search to geographical
      // location types.
      
      // set the bounds of the autocomplete to the entire world
      // TODO might want to set this to something else ?
      var defaultBounds = new google.maps.LatLngBounds(
        new google.maps.LatLng(-90, -180),
        new google.maps.LatLng(90, 180));
      
      autocomplete = new google.maps.places.Autocomplete(input),
            {
              bounds: defaultBounds,
              types: ['geocode']
            };
            
      autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();          
        if (!place.geometry) {
            alert("Could not find the location, please try again!");
            return;
          }
          
        // set the current waypoint to what we found          
        currentWaypoint = {
                Id : guid(),
                Name : input.value,
                Place : place,
                Marker : null
            };          
      }); 

      var input_waypoint_ok = document.getElementById('input_waypoint_ok');
      
      // user clicks Ok so we need to add the waypoint to the array, to the table and show it on the map
      input_waypoint_ok.onclick = function clicked(e) {
          
        if (!currentWaypoint.Place) {
            alert("Could not find the location, please try again!");
            return;
        }
        
        var addUI = document.getElementById('div_addWaypoint');
        addUI.style.display = "none";                
                
        // If the place has a geometry, then present it on a map.
        if (currentWaypoint.Place.geometry.viewport) {
          map.fitBounds(currentWaypoint.Place.geometry.viewport);
        } else {
          map.setCenter(currentWaypoint.Place.geometry.location);
          // TODO We may need to change the zoom, depending on what the user is searching for (cities, specific addresses ?)
          map.setZoom(4);
        }
                
        var marker = new google.maps.Marker({
          map: map,
          position: currentWaypoint.Place.geometry.location,
          // this will bounce the marker until we set setAnimation(null) animation: google.maps.Animation.BOUNCE,
          // this shows a text inside the marker, but it can only be one character label: '1',
          // this shows a longer text when the user clicks on the marker title: 'Bucharest'
        });
        
        currentWaypoint.Marker = marker;
        
        currentlyAddingWaypointIndex += 1;
        addWaypointToList(currentlyAddingWaypointIndex, currentWaypoint)
          
      };
      
            
    } 
        
    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
        }
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }
                    
}