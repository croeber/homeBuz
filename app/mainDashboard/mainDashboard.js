
(function () {

    var Dashcontroller = ['$state',function ($state) {
		var ctrl = this;
		ctrl.data;
		ctrl.getNumber = function(num) {
			return new Array(num);   
		}
		ctrl.open = function(id){
			if (id){
				$state.go('landing.reviews',{id:id});
			}
		}
		
    }];

    angular.module('realtyApp').component('mainDashboard', {
    templateUrl: 'app/mainDashboard/mainDashboard.html',
    controller: Dashcontroller,
    controllerAs: 'dashCtrl'
    });
	
	
	
	angular.module('realtyApp').factory('getDataOnMap', function($q,$http){
		var get = function(res){
			var defer = $q.defer();
			$http.get('api/rbl/public/index.php/api/getListingsOnMap?postalCode='+res.postalCode+'&street='+res.street+'&streetNum='+res.streetNum+'&city='+res.city+'&state='+res.state).then(function(res){
				if (res && res.data && res.data.listings)
					defer.resolve(res.data.listings);
				else
					defer.reject();
			});			
			return defer.promise
		}
		return {
			get:get
		}
    });
	
	angular.module('realtyApp').factory('getMarkerData', function($timeout,$q,$http){
		var get = function(listing){
			var defer = $q.defer();
			$http.get('api/rbl/public/index.php/api/getListing?streetNum='+listing.streetNum+'&streetName='+listing.streetName+'&city='+listing.city+'&state='+listing.state+'&apartmentNum='+listing.apartmentNumber).then(function(res){
				defer.resolve(res.data);
			});
			return defer.promise;
		}
		return {
			get:get
		}
    });
	
	angular.module('realtyApp').factory('getListingData', function($timeout,$q,$http){
		var get = function(listing){
			var defer = $q.defer();
			
			$http.get('api/rbl/public/index.php/api/listing?streetNum='+listing.streetNum+'&streetName='+listing.streetName+'&city='+listing.city+'&state='+listing.state+'&id='+listing.id).then(function(res){
				defer.resolve(res.data);
			},function(res){
				defer.reject(res.data);
			});
			
			return defer.promise;
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