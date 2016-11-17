
(function () {

    var Dashcontroller = [function () {
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
	
	
	
	angular.module('realtyApp').factory('getDataOnMap', function($q,$timeout){
		var get = function(){
			var defer = $q.defer();
			$timeout(function(){
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
				defer.resolve(data);
			},2000);
			
			return defer.promise
		}
		return {
			get:get
		}
    });
	
	angular.module('realtyApp').factory('getMarkerData', function($timeout,$q,$http){
		var get = function(listing){
			var defer = $q.defer();
			$http.get('api/public/index.php/api/getListing?streetNum='+listing.streetNum+'&streetName='+listing.streetName+'&city='+listing.city+'&state='+listing.state+'&apartmentNum='+listing.apartmentNumber).then(function(res){
				defer.resolve(res.data);
			});
			$timeout(function(){
				var data = {id:'1',street:'Nautilus Dr',streetNum:'4411',city:'Miami Beach',zipCode:'33140',state:'FL',rating:3,reviews:13}
				defer.resolve();
				
			},2000);
			return defer.promise;
		}
		return {
			get:get
		}
    });
	
	angular.module('realtyApp').factory('getListingData', function($timeout,$q,$http){
		var get = function(listing){
			var defer = $q.defer();
			//$http.get('api/public/index.php/api/listing').then(function(res){
			$http.get('api/public/index.php/api/listing?streetNum='+listing.streetNum+'&streetName='+listing.streetName+'&city='+listing.city+'&state='+listing.state+'&id='+listing.id).then(function(res){
				defer.resolve(res.data);
			});
			// $timeout(function(){
			// 	var data = {id:'1',street:'Nautilus Dr',streetNum:'4411',city:'Miami Beach',zipCode:'33140',state:'FL',rating:3,reviews:13,reviewsOnFile:
			// 				[
			// 					{date:'11/1/2015',review:'Has a good backyard',displayName:'Chris'},
			// 					{date:'11/2/2015',review:'But it looks like it might need a new fence at parts',displayName:'Chris'},
			// 					{date:'11/3/2015',review:'Hi. I am the active realtor. The owner says he will fix the fence',displayName:'Mary'},
			// 					{date:'11/6/2015',review:'Great. I really like the home',displayName:'Chris'},
			// 					{date:'11/11/2015',review:'Hi. I am the owner I look forward to showing of the changes',displayName:'Paul'},
			// 					{date:'11/12/2015',review:'I love it.',displayName:'Chris'},
			// 					{date:'11/14/2015',review:'We are excited',displayName:'Chris'},
			// 					{date:'11/16/2015',review:'Hi. I just saw this home driving by. Can we schedule a showing please. ',displayName:'Mike'},
			// 					{date:'11/20/2015',review:'Of Course I will message you',displayName:'Mary'},
			// 					{date:'1/1/2016',review:'We are taking this listing off and I will let you know when it comes back up',displayName:'Mary'},
			// 					{date:'1/2/2016',review:'Good Luck',displayName:'Chris'},
			// 					{date:'4/4/2016',review:'Hi we have made some new updates come check them out',displayName:'Paul'},
			// 					{date:'11/1/2016',review:'Great. Now is a better time for us anyways we will schedule a showing with Mary',displayName:'Chris'}
			// 				],
							
			// 			}
			// 	defer.resolve(data);
				
			// },2000);
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