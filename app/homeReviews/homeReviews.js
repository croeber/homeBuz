
(function () {


    angular.module('realtyApp').component('homeReviews', {
		templateUrl: 'app/homeReviews/homeReviews.html',
		controllerAs: 'revCtrl',
		controller:['$stateParams','getListingData','$http',function($stateParams,getListingData,$http){
			var ctrl = this;
			var home = {
				id:$stateParams.id,
				streetNum:$stateParams.streetNum,
				streetName:$stateParams.streetName,
				city:$stateParams.city,
				state:$stateParams.state,
				country:$stateParams.country
			}
			getListingData.get(home).then(function(data){
					ctrl.listing = data;
					ctrl.lat = ctrl.listing.property.address.latitude;
					ctrl.long = ctrl.listing.property.address.longitude;
					ctrl.getMap({streetNum:home.streetNum,streetName:home.streetName,city:home.city,state:home.state,country:home.country});
					ctrl.images = {};
					if (ctrl.listing.details && ctrl.listing.details.images && ctrl.listing.details.images.image)
						ctrl.images = ctrl.listing.details.images.image;
					else
						ctrl.images.url = [];
					ctrl.images.url.push("https://maps.googleapis.com/maps/api/streetview?size=500x350&location="+ctrl.listing.property.address.street+", "+ctrl.listing.property.address.city+", "+ctrl.listing.property.address.state+", United States&key=AIzaSyBqqOMuVejvk6bD4FatH4-N0y1iN7hQXmk");
							
				});
			ctrl.getNumber = function(num) {
				return new Array(num);   
			}
			
		}]
    });
	
	
	

	
	



})();