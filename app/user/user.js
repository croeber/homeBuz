
(function () {


    angular.module('realtyApp').component('rblUser', {
		templateUrl: 'app/user/user.html',
		controllerAs: 'uctrl',
		controller:['api','$stateParams','$state',function(api,$stateParams,$state){
			var ctrl = this;
			ctrl.userName = $stateParams.user;
			ctrl.notEditing = true;
			ctrl.editUser = function(){
			    if(ctrl.isUser){
			        ctrl.notEditing = !ctrl.notEditing;
			    }
			};
			ctrl.deleteFriend = function(){
				var user = {
					userName:ctrl.userName
				}
				api.confirmFriendRequest({do:false,user:user}).then(function(res){
					if(res.data.success ===true){
						$state.go('landing.user',{user:ctrl.userName},{ reload: true });					
					}
				});
			};
			ctrl.updateUser = function(){
				var req = {
					userNameSent:ctrl.user.user.userName,
					userName:ctrl.userName,
					firstName:ctrl.user.user.firstName,
					lastName:ctrl.user.user.lastName,
					city:ctrl.user.user.city,
					state:ctrl.user.user.state,
					bio:ctrl.user.user.bio,
					wants:ctrl.user.user.wants,					
				}
				api.updateUser(req).then(function(res){
					if (res && res.data && res.data.success === true)
						$state.go('landing.user',{user:ctrl.user.user.userName},{ reload: true });
				});
			};
 		ctrl.sendFriend = function(){
 		    api.sendFriend({user:ctrl.userName}).then(function(res){
 		        alert(JSON.stringify(res.data));
 		    });
 		};
			api.getUser({userName:ctrl.userName}).then(function(res){
				ctrl.user = res.data;
				ctrl.isUser = ctrl.user.success;
				if(Array.isArray(ctrl.user.surveys))
				  ctrl.surveyCount = ctrl.user.surveys.length;
				if(Array.isArray(ctrl.user.homes))
				  ctrl.homesCount = ctrl.user.homes.length;
				
			});
		}]
    });
	
	
	

	
	



})();