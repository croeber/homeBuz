
(function () {

    function navCtrl($http,$state,api) {
    var ctrl = this;
	ctrl.isAuthed = false;
	ctrl.processRequest = function(b,user){
	    api.confirmFriendRequest({do:b,user:user}).then(function(res){
	        if(res.data.success ===true){
	            user.processed = true;
				$state.go($state.current.name,$state.params,{reload:true});
	        }
	    });
	};
	ctrl.clearNotifications = function(){
		api.processNotifications().then(function(res){			
			if (res && res.data && res.data.success ===true){
				ctrl.userData.notifications = res.data.notifications;
				getNotificationCount();
			}
		});
	}
	ctrl.sendMessage = function(user){
		ctrl.name = user.firstName || user.lastName? user.firstName+' '+user.lastName:user.userName;
		ctrl.visible = true;
	}
	ctrl.sendMessageTo = function(msg){
		
	}
	function getNotificationCount(){
		ctrl.notificationCount = 0;
		if (ctrl.userData && Array.isArray(ctrl.userData.notifications)){
			ctrl.userData.notifications.forEach(function(not){
				if (not.isRead == 0)
					ctrl.notificationCount++;
			});
		}
	}
	ctrl.processNotification = function(not){
		if (not){
			switch (not.type){
				case "1":
					$state.go('landing.reviews',{id:not.listingID,streetNum:'',streetName:'',city:'',state:'',zip:'',country:''});
					break;
				case "2":
					$state.go('landing.reviews',{id:not.listingID,streetNum:'',streetName:'',city:'',state:'',zip:'',country:''});
					break;
			}
		}
	};
	ctrl.searchUsers = function(){
	    
	    if(ctrl.userSearched && ctrl.userSearched.length > 4 ){
	        
	        api.searchUsers({query:ctrl.userSearched}).then(function(res){
	            ctrl.usersFound = res.data.users;
	            ctrl.userSearched = '';
	        });
	    }
	    
	};
	function getUserData(){
		if (ctrl.isAuthed === true){
			api.getUserData().then(function(res){
				ctrl.userData = res.data;
				getNotificationCount();
			});
		}
	};
	
	ctrl.wasAuthedOnce = false;
	firebase.auth().onAuthStateChanged(function(currentUser) {
		if (currentUser && ctrl.wasAuthedOnce === false) {
			ctrl.wasAuthedOnce = true;
			var emailVerified = currentUser.emailVerified;
			if (emailVerified === false){
				currentUser.sendEmailVerification().then(function() {
				  alert('You Must Verify Your Email Before Proceeding!');
				}, function(error) {
				  // An error happened.
				});
			}else{				
				currentUser.getToken(true).then(function(data) {
					var token = data;
					$http.post('api/rbl/public/index.php/api/login',{token: token}).then(function(res){
						if (res.data.auth === true){
							var user = res.data.user || {};
							ctrl.isAuthed = true;
							sessionStorage.setItem("user", JSON.stringify(user));
							$http.defaults.headers.common.Authorization = token;
							localStorage.setItem("token", token);
							getUserData();
						}
						
					});
				});
			}			
		}
	});
	
	ctrl.user = function(userName){
	    if(userName){
	        var user = userName;
	    }else{
	        var user = JSON.parse( sessionStorage.getItem("user") ).userName;
	    	
	    }
	    	
	    	$state.go("landing.user",{user:user});
	};
	
	ctrl.signOut = function(){
		firebase.auth().signOut().then(function() {
			ctrl.isAuthed = false;
			sessionStorage.removeItem("user");
			$http.defaults.headers.common.Authorization = '';
			localStorage.removeItem("token");
			$state.go('landing.dashboard',{},{reload:true});
		}, function(error) {
		  // An error happened.
		});
	};
		ctrl.messages = [
    {
      'username': 'username1',
      'content': 'Hi!'
    },
    {
      'username': 'username2',
      'content': 'Hello!'
    },
    {
      'username': 'username2',
      'content': 'Hello!'
    },
    {
      'username': 'username2',
      'content': 'Hello!'
    },
    {
      'username': 'username2',
      'content': 'Hello!'
    },
    {
      'username': 'username2',
      'content': 'Hello!'
    }
  ];
	ctrl.login = function(){
		
		var provider = new firebase.auth.GoogleAuthProvider();
		firebase.auth().signInWithRedirect(provider);

	}
	ctrl.loginFaceBook = function(){
		var provider = new firebase.auth.FacebookAuthProvider();
		provider.addScope('email');
		firebase.auth().signInWithRedirect(provider);
		
	};
	ctrl.createLoginPassword = function(){
		firebase.auth().createUserWithEmailAndPassword(ctrl.signupemail, ctrl.signuppassword).catch(function(error) {
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  if (errorCode == 'auth/email-already-in-use')
			alert(errorMessage);
		});
	};
	ctrl.loginEmailPassword = function(){
		firebase.auth().signInWithEmailAndPassword(ctrl.loginemail, ctrl.loginpassword).catch(function(error) {
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  if (errorCode == 'auth/wrong-password')
			alert('Invalid email password combination');
		});
		
	};
}


angular.module('realtyApp').component('topNav', {
    templateUrl: 'app/common/topNav/topNav.html',
    controller: navCtrl,
    controllerAs: 'ctrl'
});
})();