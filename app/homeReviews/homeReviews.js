
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
				state:$stateParams.state
			}
			getListingData.get(home).then(function(data){
					ctrl.listing = data;
					ctrl.images = {};
					if (ctrl.listing.details && ctrl.listing.details.images && ctrl.listing.details.images.image)
						ctrl.images = ctrl.listing.details.images.image;
					else
						ctrl.images.url = [];
					ctrl.images.url.push("https://maps.googleapis.com/maps/api/streetview?size=400x300&location="+ctrl.listing.property.address.street+", "+ctrl.listing.property.address.city+", "+ctrl.listing.property.address.state+", United States&key=AIzaSyBqqOMuVejvk6bD4FatH4-N0y1iN7hQXmk");
							
				});
			ctrl.getNumber = function(num) {
				return new Array(num);   
			}
			
		}]
    });
	
	
	

	
	



})();