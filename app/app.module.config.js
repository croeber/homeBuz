
(function () {

	angular.module('realtyApp').run(function($http) {
	  var token = localStorage.getItem("token");
	  if (token)
		$http.defaults.headers.common.Authorization = token;
	  
	});
    angular.module('realtyApp').config(function ($stateProvider, $urlRouterProvider,$locationProvider) {

        $urlRouterProvider.otherwise('/');
        
        $stateProvider
            .state('landing', {
                abstract: true,
                data: { proxy: "landing.dashboard" },                
            })
            .state('landing.dashboard', {
                url: '/',
				template: '',
				views: {
					'content@landing': { template: '<main-dashboard></main-dashboard>' },
					'nav@landing': { template: '<top-nav></top-nav>' }
				},
            })
       .state('landing.user', {
                url: '/user/:user',
				template: '',
				views: {
					'content@landing': { template: '<rbl-user></rbl-user>' },
					'nav@landing': { template: '<top-nav></top-nav>' }
				}
			})     
            
			.state('landing.reviews', {
                url: '/reviews/:id{streetNum:(?:/[^/]+)?}{streetName:(?:/[^/]+)?}{city:(?:/[^/]+)?}{state:(?:/[^/]+)?}{zip:(?:/[^/]+)?}{country:(?:/[^/]+)?}',
				template: '',
				views: {
					'content@landing': { template: '<home-reviews></home-reviews>' },
					'nav@landing': { template: '<top-nav></top-nav>' }
				},
				resolve: {
                    getListing: function ($q, getListingData,$stateParams) {
                        var defer = $q.defer();
						var home = {
							id:$stateParams.id,
							streetNum:$stateParams.streetNum && $stateParams.streetNum[0] == '/' ? $stateParams.streetNum.slice(1) : $stateParams.streetNum,
							streetName: $stateParams.streetName && $stateParams.streetName[0] == '/' ? $stateParams.streetName.slice(1) : $stateParams.streetName,
							city:$stateParams.city && $stateParams.city[0] == '/' ? $stateParams.city.slice(1) : $stateParams.city,
							state:$stateParams.state && $stateParams.state[0] == '/' ? $stateParams.state.slice(1) : $stateParams.state,
							country:$stateParams.country && $stateParams.country[0] == '/' ? $stateParams.country.slice(1) : $stateParams.country,
							zipCode:$stateParams.zip && $stateParams.zip[0] == '/' ? $stateParams.zip.slice(1) : $stateParams.zip
						} 
                        getListingData.get(home).then(function(data){
							$stateParams.listing = data;
							defer.resolve(data);	
						},function(res){
							alert('Whoops. This doesn\'t look to be a valid home address');
							defer.reject();
						}
						);
                        return defer.promise;
                    }
                }
            })
			$locationProvider.html5Mode(true);
                
    });


        
})();