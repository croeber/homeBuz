(function () {
    angular.module('realtyApp').component('rblLogin', {
		templateUrl: 'app/login/login.html',
		controllerAs: 'ctrl',
		controller:['$http',function($http){
			var ctrl = this;
			firebase.auth().getRedirectResult().then(function(result) {
			  if (result.credential) {
				$http.post('api/rbl/public/index.php/api/login',{token: result.credential.idToken}).then(function(res){
				  var user = res.data;
				  localStorage.setItem("user", user);
				  $http.defaults.headers.common.Authorization = result.credential.idToken;
				  localStorage.setItem("token", result.credential.idToken);
				});
			  }
			}).catch(function(error) {

			});
			ctrl.login = function(){
				var provider = new firebase.auth.GoogleAuthProvider();
				firebase.auth().signInWithRedirect(provider);
			}
		}]
    });
})();