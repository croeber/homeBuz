
(function () {

    var Dashcontroller = ['getTempData',function (getTempData) {
		var ctrl = this;
		ctrl.data;
		ctrl.getNumber = function(num) {
			return new Array(num);   
		}
		
    }];

    angular.module('realtyApp').component('mainDashboard', {
    templateUrl: 'app/mainDashboard/mainDashboard.html',
    controller: Dashcontroller,
    controllerAs: 'dashCtrl'
    });
	
	
	
	angular.module('realtyApp').factory('getTempData', function(){
		var get = function(){
			var data =  [
			{street:'N Jefferson Ave',streetNum:'4470',city:'Miami Beach',zipCode:'33140',state:'FL',rating:2,reviews:18},
			{street:'N Michigan Ave',streetNum:'4477',city:'Miami Beach',zipCode:'33140',state:'FL',rating:5,reviews:12},
			{street:'Nautilus Dr',streetNum:'4485',city:'Miami Beach',zipCode:'33140',state:'FL',rating:2,reviews:8},
			{street:'Adams Ave',streetNum:'4520',city:'Miami Beach',zipCode:'33140',state:'FL',rating:3,reviews:17},
			{street:'Prairie Ave',streetNum:'4466',city:'Miami Beach',zipCode:'33140',state:'FL',rating:5,reviews:13},
			{street:'Meridian Ave',streetNum:'4565',city:'Miami Beach',zipCode:'33140',state:'FL',rating:1,reviews:28},
			{street:'N Jefferson Ave',streetNum:'4455',city:'Miami Beach',zipCode:'33140',state:'FL',rating:4,reviews:38},
			{street:'N Bay Rd',streetNum:'4355 ',city:'Miami Beach',zipCode:'33140',state:'FL',rating:2,reviews:18},
			{street:'N Bay Rd',streetNum:'4335 ',city:'Miami Beach',zipCode:'33140',state:'FL',rating:4,reviews:38},
			{street:'Alton Rd',streetNum:'4331',city:'Miami Beach',zipCode:'33140',state:'FL',rating:4,reviews:38},
			{street:'Nautilus Dr',streetNum:'4301',city:'Miami Beach',zipCode:'33140',state:'FL',rating:4,reviews:38},
			{street:'Nautilus Dr',streetNum:'4475',city:'Miami Beach',zipCode:'33140',state:'FL',rating:2,reviews:21}
			];
			for (var i = 0 ; i < data.length ; i++){
				data[i].index = i;
				data[i].image = "https://maps.googleapis.com/maps/api/streetview?size=390x215&location="+data[i].streetNum+" "+data[i].street+", "+data[i].city+", "+data[i].state+", United States&key=AIzaSyBqqOMuVejvk6bD4FatH4-N0y1iN7hQXmk";
			}
			return data;
		}
		return {
			get:get
		}
    });
	
	
	angular.module('realtyApp').factory('getGeocode',['$q', function($q){
		var get = function(data){
			var defer = $q.defer();
			var geocoder = new google.maps.Geocoder();
				geocoder.geocode( data, function(results, status) {
				  if (status == google.maps.GeocoderStatus.OK) {					
					defer.resolve(results[0]);
				  } else{					 
					 defer.reject();
				  }
				});
			return defer.promise;
		}
		return {
			get:get
		}
    }]);
	
	



})();