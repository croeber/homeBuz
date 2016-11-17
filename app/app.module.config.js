
(function () {


    angular.module('realtyApp').config(function ($stateProvider, $urlRouterProvider) {

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
			.state('landing.reviews', {
                url: '/reviews/:id/:streetNum/:streetName/:city/:state/:zip/:country',
				template: '',
				views: {
					'content@landing': { template: '<home-reviews></home-reviews>' },
					'nav@landing': { template: '<top-nav></top-nav>' }
				},
            })
                
    });


        
})();

