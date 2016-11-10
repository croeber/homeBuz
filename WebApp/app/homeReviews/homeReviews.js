
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
					//ctrl.listing.imageUrl = "https://maps.googleapis.com/maps/api/streetview?size=250x150&location="+ctrl.listing.streetNum+" "+ctrl.listing.street+", "+ctrl.listing.city+", "+ctrl.listing.state+", United States&key=AIzaSyBqqOMuVejvk6bD4FatH4-N0y1iN7hQXmk"				
				});
			ctrl.getNumber = function(num) {
				return new Array(num);   
			}
			
		}]
    });
	
	
	

	
	



})();