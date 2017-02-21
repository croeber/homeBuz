
(function () {


    angular.module('realtyApp').component('homeReviews', {
		templateUrl: 'app/homeReviews/homeReviews.html',
		controllerAs: 'revCtrl',
		controller:['$stateParams','getListingData','api','$state','$timeout',function($stateParams,getListingData,api,$state,$timeout){
			var ctrl = this;
			var home = {
				id:$stateParams.id,
				streetNum: $stateParams.streetNum && $stateParams.streetNum[0] == '/' ? $stateParams.streetNum.slice(1):$stateParams.streetNum,
				streetName: $stateParams.streetName && $stateParams.streetName[0] == '/' ? $stateParams.streetName.slice(1):$stateParams.streetName,
				city: $stateParams.city && $stateParams.city[0] == '/' ? $stateParams.city.slice(1):$stateParams.city,
				state: $stateParams.state && $stateParams.state[0] == '/' ? $stateParams.state.slice(1):$stateParams.state,
				country: $stateParams.country && $stateParams.country[0] == '/' ? $stateParams.country.slice(1):$stateParams.country,
				zipCode: $stateParams.zip && $stateParams.zip[0] == '/' ? $stateParams.zip.slice(1):$stateParams.zip
			} 
			
			
			ctrl.home = home;
			
			if (home.id){
			api.getReviews(ctrl.home).then(function(res){
				if (res.data.reviews){
					ctrl.rating = res.data.rating;
					ctrl.reviewsOnFile = res.data.reviews;
					ctrl.survey = res.data.survey;
				}else{
					ctrl.reviewsOnFile = [];
				}
				
				ctrl.isFavorite = res.data.isFavorite;
			});
		}
		ctrl.listing = $stateParams.listing;
		if (!ctrl.listing.home){
			ctrl.listing.home = {};
			ctrl.listing.home.city = ctrl.home.city;
			ctrl.listing.home.houseNumber = ctrl.home.streetNum;
			ctrl.listing.home.street = ctrl.home.streetName;
			ctrl.listing.home.region = ctrl.home.state;
		}
		ctrl.listing.home.city = ctrl.listing.home.city[0] == '/' ? ctrl.listing.home.city.slice(1) : ctrl.listing.home.city;
		ctrl.listing.home.houseNumber = ctrl.listing.home.houseNumber[0] == '/' ? ctrl.listing.home.houseNumber.slice(1) : ctrl.listing.home.houseNumber;
		ctrl.listing.home.street = ctrl.listing.home.street[0] == '/' ? ctrl.listing.home.street.slice(1) : ctrl.listing.home.street;
		ctrl.listing.home.region = ctrl.listing.home.region[0] == '/' ? ctrl.listing.home.region.slice(1) : ctrl.listing.home.region;
		$('#rbl-title').html('Rent Buy Live - '+ctrl.listing.home.houseNumber+' '+ctrl.listing.home.street+', '+ ctrl.listing.home.city + ', '+ctrl.listing.home.region);
		ctrl.lat = ctrl.listing.property.address.latitude;
		ctrl.long = ctrl.listing.property.address.longitude;
		$timeout(function(){
			ctrl.getMap({
					streetNum:  home.streetNum || ctrl.listing.home.houseNumber,
					streetName: home.streetName || ctrl.listing.home.street,
					city:       home.city||ctrl.listing.home.city,
					state:      home.state || ctrl.listing.home.region,
					country:    home.country || "United States"
				});
		},1000);
		
		ctrl.images = {};
		if (ctrl.listing.details && ctrl.listing.details.images && ctrl.listing.details.images.image)
			ctrl.images = ctrl.listing.details.images.image;
		else
			ctrl.images.url = [];
		ctrl.images.url.push("https://maps.googleapis.com/maps/api/streetview?size=500x350&location="+ctrl.listing.property.address.street+", "+ctrl.listing.property.address.city+", "+ctrl.listing.property.address.state+", United States&key=AIzaSyBqqOMuVejvk6bD4FatH4-N0y1iN7hQXmk");
		
		ctrl.getNumber = function(num) {
			return new Array(num);   
		}
		ctrl.makeComment = function(){
			var req = ctrl.home;
			req.comment = ctrl.comment;
			req.title = ctrl.title;
			api.makeComment(req).then(function(res){
				if (res !== false){
					var res = res;
					$state.go('landing.reviews',{streetNum:ctrl.home.streetNum,streetName:ctrl.home.streetName,city:ctrl.home.city,state:ctrl.home.state,country:ctrl.home.country,zipCode:ctrl.home.zipCode,id:res.data.id},{ reload: true })
				}
				
			});
		};
		ctrl.dosurvey = function(){
			var req = ctrl.home;
			api.showSurvey(req).then(function(res){
				if (res !== false)
					$state.go('landing.reviews',{streetNum:ctrl.home.streetNum,streetName:ctrl.home.streetName,city:ctrl.home.city,state:ctrl.home.state,country:ctrl.home.country,zipCode:ctrl.home.zipCode,id:res.data.id},{ reload: true });
				
			});
		};
		ctrl.makeFavorite = function(){
			var req = ctrl.home;
			api.likeListing(req).then(function(res){
				ctrl.isFavorite = !ctrl.isFavorite;
			});
		};
		ctrl.share = function(){
			var req = ctrl.home;
			api.share(req).then(function(res){
				ctrl.isFavorite = !ctrl.isFavorite;
			});
		};
			
		}]
    });
	
	
	

	
	



})();