var mainScope = {};



(function () {

	
	angular.module('realtyApp').component('mapCanvas', {
    templateUrl: 'app/components/map/map.html',
    controller: ['getDataOnMap','getGeocode','$timeout','$state','getMarkerData',
	function(getDataOnMap,getGeocode,$timeout,$state,getMarkerData){
		var ctrl = this;
		var map = new google.maps.Map(document.getElementById('map'), {
												zoom: 16,
												mapTypeId: google.maps.MapTypeId.ROADMAP,
												streetViewControl: true
											});	
		var input = document.getElementById('pac-input');
		var autocomplete = new google.maps.places.Autocomplete(input);
		ctrl.lat;
		ctrl.lng;
		var user = undefined;
		var user = {
			zipCode : '33140'
		}
		ctrl.openListing = function(){
			
		};
		
		
		
		ctrl.initialize = function(){
			
			
			if (ctrl.initMap === true){
			//if (true) {
				ctrl.isSearchedOn = true;
				
				$timeout(function(){
					google.maps.event.trigger(map, "resize");
					if (user !== undefined){
						getGeocode.get({ 'address': user.zipCode}).then(function(results){
							ctrl.lat = results.geometry.location.lat();
							ctrl.lng = results.geometry.location.lng();
							LoadMap(ctrl.lat,ctrl.lng);
						},function(){
							ctrl.lat = 25.8176795;
							ctrl.lng = -80.13727569999998; 
							LoadMap(ctrl.lat,ctrl.lng);
						});
						
					} else if ("geolocation" in navigator) {
						navigator.geolocation.getCurrentPosition(function(position) {
							ctrl.lat = position.coords.latitude;
							ctrl.lng = position.coords.longitude;
							LoadMap(ctrl.lat,ctrl.lng);
						});
					} else {
						ctrl.lat = 25.8176795;
						ctrl.lng = -80.13727569999998;
						LoadMap(ctrl.lat,ctrl.lng);
					}
					
				},1);
			}
			google.maps.event.addListener(autocomplete, 'place_changed', function () {
				var place = autocomplete.getPlace();
				if (place.geometry) {
					ctrl.isSearchedOn = true;									
				
				map.controls[google.maps.ControlPosition.TOP_LEFT];
				autocomplete.bindTo('bounds', map);
				
								
				map.setCenter(place.geometry.location);
				
				
				if (place.address_components) {
					var postCode = extractFromAddress(place.address_components, "postal_code");
					var street = extractFromAddress(place.address_components, "route");
					var town = extractFromAddress(place.address_components, "locality");
					var country = extractFromAddress(place.address_components, "country");
					var streetNumber = extractFromAddress(place.address_components, "street_number");
					var state = extractFromAddress(place.address_components, "administrative_area_level_1");
					if (postCode){ 
						setOtherMarkers(map)
					}
					if (streetNumber && street){
						
						getMarkerData.get().then(function(data){
							var address2 = streetNumber+' ' +street+', '+town+', '+state+', '+country;
							var iw = new google.maps.InfoWindow();
							ctrl.listingData = data;
							ctrl.listingData.numReviewsText = !isNaN(ctrl.listingData.numReviews) && ctrl.listingData.numReviews > 0 ? 'See '+ctrl.listingData.numReviews +' Comments': 'Add Comment';
							var contentString = '<img src="https://maps.googleapis.com/maps/api/streetview?size=200x100&location=' + address2 + '&key=AIzaSyBqqOMuVejvk6bD4FatH4-N0y1iN7hQXmk">';
							if (!isNaN(ctrl.listingData.rating) && ctrl.listingData.rating> 0)
								contentString = contentString +'<br>' + ctrl.listingData.rating+' Star Rating '
							for (var i = 0 ; i < ctrl.listingData.rating; i++)
								contentString = contentString + '<span class="glyphicon glyphicon-star"></span>';
							contentString = contentString + '<br>' 
							            +'<a href="http://localhost/#/reviews/'+ctrl.listingData.id+'/'+ctrl.listingData.streetNum+'/'+ctrl.listingData.street+'/'+ctrl.listingData.city+'/'+ctrl.listingData.state+'/'+ctrl.listingData.zipCode+'" class="btn btn-sm btn-success" role="button">'+ctrl.listingData.numReviewsText+'</a><br>'
										+'<a href="http://www.zillow.com/homes/'+address2+'_rb/"  >Update Zillow.com Listing</a><br>'
										+'<a href="http://www.realtor.com">Update Realtor.com Listing</a><br>'
										+'<a href="http://www.trulia.com" >Update Trulia.com Listing</a><br>'
							iw.setContent(contentString);
							
							var marker = new google.maps.Marker({
								map: map,
								anchorPoint: new google.maps.Point(0, -29)
							});
							map.fitBounds(place.geometry.viewport);
							map.setCenter(place.geometry.location);
							marker.setIcon(/** @type {google.maps.Icon} */({
								url: place.icon,
								size: new google.maps.Size(71, 71),
								origin: new google.maps.Point(0, 0),
								anchor: new google.maps.Point(17, 34),
								scaledSize: new google.maps.Size(35, 35)
							}));
							marker.setPosition(place.geometry.location);
							marker.setVisible(true);
							if (iw){
								iw.close();	
								google.maps.event.addListener(marker, 'click', function () {
									iw.open(map, marker);
								});
							}
							$timeout(function(){
								map.setZoom(16);
								map.setCenter(place.geometry.location);
								google.maps.event.trigger(map, "resize");	
								
							},1);
							google.maps.event.addListenerOnce(map, 'tilesloaded', function(){
								google.maps.event.trigger(map, "resize");
								map.setCenter(place.geometry.location);
							});
						});
						
						
					}
				}
				
			}
			});			
		};
		google.maps.event.addDomListener(window, "resize", function() {
			var center = map.getCenter();
			google.maps.event.trigger(map, "resize");
			map.setCenter(center); 
		});
		function LoadMap(lat,lng){
			var latLng = new google.maps.LatLng(lat, lng);
			map.setCenter(latLng); 
			map.controls[google.maps.ControlPosition.TOP_LEFT];
			map.setZoom(16);
			setOtherMarkers(map)	
		}
		function extractFromAddress(components, type) {
			for (var i = 0; i < components.length; i++)
				for (var j = 0; j < components[i].types.length; j++)
					if (components[i].types[j] == type) return components[i].short_name;
			return "";
		}
		google.maps.event.addListener(map, 'idle', function() {
			google.maps.event.trigger(map, "resize");				
		});
		
		google.maps.event.addListenerOnce(map, 'bounds_changed', function(){
			google.maps.event.trigger(map, "resize");
		});				
		function setOtherMarkers(map){				
			
			getDataOnMap.get().then(function(data){
				// var iw = new google.maps.InfoWindow();
				// iw.close();
				ctrl.listingsInMap = data;
				var geocoder = new google.maps.Geocoder();
				ctrl.listingsInMap.forEach(function(item){
				
				geocoder.geocode( { 'address': item.streetNum+' '+item.street+', '+item.city+', '+item.state }, function(results, status) {
				  if (status == google.maps.GeocoderStatus.OK) {
					var marker = new google.maps.Marker({
						map: map,
						anchorPoint: new google.maps.Point(0, -29)
					});
					marker.setVisible(false);
					
					marker.setIcon(/** @type {google.maps.Icon} */({
						url:'http://maps.google.com/mapfiles/ms/icons/blue.png',
						size: new google.maps.Size(71, 71),
						origin: new google.maps.Point(0, 0),
						anchor: new google.maps.Point(17, 34),
						scaledSize: new google.maps.Size(35, 35)
					}));
					marker.setPosition(results[0].geometry.location);
					marker.setVisible(true);
				  } 
				});
						
			});
				
			});
		};
		ctrl.initialize();
	}],
    controllerAs: 'mapCtrl',
	bindings:{
		listingsInMap:'=',
		initMap:'='
	}
    });
	
	

	
	



})();