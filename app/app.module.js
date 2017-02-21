/**
 * @module epsApp
 */
(function () {
    var dependencies = [
        'ngAria',
        'ui.router',
        'ui.bootstrap',
		'irontec.simpleChat'
    ];
    angular.module('realtyApp', dependencies);
    angular.module('realtyApp').constant("realtyApp_VERSION", {
        version: "0.0.0.1"
    });  

        
})();

