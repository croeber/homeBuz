(function () {




angular.module('realtyApp').factory('api', function($uibModal,$http,$q){
    var share = function(req){
		var defer = $q.defer();    
		var modalInstance = $uibModal.open({      
			template: 
						'<div class="modal-header">'+
							'<h3 class="modal-title" id="modal-title">Share</h3>'+
						'</div>'+
						' <div class="modal-body" id="modal-body">'+
						 '<form ng-submit="ctrl.search()">'+
							'<div class="input-group">'+
								'<span class="input-group-btn">'+
									'<button class="btn btn-default" type="submit" >Go!</button>'+
								  '</span>'+
								  '<input type="text" ng-model="ctrl.userSearched" class="form-control" placeholder="Search for...">'+
								'</div>'+
							'</form>'+
							'<ul class="list-group" ng-show="ctrl.users.length > 0">'+
							  '<li ng-click="ctrl.addUser(user)" class="list-group-item" ng-repeat="user in ctrl.users">{{(user.firstName || user.lastName? user.firstName+" "+user.lastName:user.userName)}}</li>'+
							'</ul>'+
							'<hr class="divider">'+
							'<ul class="list-group" ng-show="ctrl.usersShare.length > 0">'+
							  '<li class="list-group-item" ng-repeat="user in ctrl.usersShare track by $index">{{(user.firstName || user.lastName? user.firstName+" "+user.lastName:user.userName)}}<span class="glyphicon glyphicon-minus pull-right" ng-click="ctrl.removeUser($index)"></span></li>'+
							'</ul>'+							
							
						'</div>'+
						'<div class="modal-footer">'+
							'<button class="btn btn-success" type="button" ng-click="ctrl.ok()"><span class="glyphicon glyphicon-ok"></span> OK</button>'+
							'<button class="btn btn-default" type="button" ng-click="ctrl.close()"><span class="glyphicon glyphicon-remove"></span> Cancel</button>'+ 
						'</div> ',
					
			controller: function($uibModalInstance,api){
				var ctrl = this;
				ctrl.users = [];
				ctrl.usersShare = [];
				ctrl.search = function(){					
					if(ctrl.userSearched && ctrl.userSearched.length > 4 ){	        
						api.searchUsers({query:ctrl.userSearched}).then(function(res){
							ctrl.users = res.data.users;
							ctrl.userSearched = '';
						});
					}
				};
				ctrl.addUser = function(user){
					var b = false;
					for (var i = 0; i < ctrl.usersShare.length;i++){
						if (ctrl.usersShare[i].userName == user.userName){
							b = true;
							break;
						}
						
					}
					if (b === false)
						ctrl.usersShare.push(user);
				}
				ctrl.removeUser = function(i){
					ctrl.usersShare.splice(i,1);
				}
				ctrl.ok = function() {
					$uibModalInstance.close(ctrl.usersShare);
				};
				ctrl.close = function() {
					$uibModalInstance.dismiss('cancel');
				};
			},
			controllerAs: 'ctrl',
			size: 'lg'
			});

			var promise = modalInstance.result.then(function (res) {
			if (Array.isArray(res) && res.length > 0){
				req.users = res;
				$http.post('api/rbl/public/index.php/api/share',req).then(function(res){
						
					defer.resolve(res);
				},function(res){
					alert(res.data);
					defer.reject(false);
				});
			}else{
				defer.resolve();
			}
			
			});
			return defer.promise;
    };
	
	var makeComment = function(req){
		var defer = $q.defer();    
		var modalInstance = $uibModal.open({      
			template: 
					'<form ng-submit="ctrl.ok()">'+ 
						'<div class="modal-header">'+
							'<h3 class="modal-title" id="modal-title">Comment / Rate</h3>'+
						'</div>'+
						' <div class="modal-body" id="modal-body">'+
							'<div class="form-group" >'+
								'<span style="color:orange" ng-click="ctrl.rating=1" ng-class="{\'fa fa-2x fa-star\':ctrl.rating>0,\'fa fa-2x fa-star-o\':ctrl.rating<1}"></span>'+	
								'<span style="color:orange" ng-click="ctrl.rating=2" ng-class="{\'fa fa-2x fa-star\':ctrl.rating>1,\'fa fa-2x fa-star-o\':ctrl.rating<2}"></span>'+	
								'<span style="color:orange" ng-click="ctrl.rating=3" ng-class="{\'fa fa-2x fa-star\':ctrl.rating>2,\'fa fa-2x fa-star-o\':ctrl.rating<3}"></span>'+	
								'<span style="color:orange" ng-click="ctrl.rating=4" ng-class="{\'fa fa-2x fa-star\':ctrl.rating>3,\'fa fa-2x fa-star-o\':ctrl.rating<4}"></span>'+	
								'<span style="color:orange" ng-click="ctrl.rating=5" ng-class="{\'fa fa-2x fa-star\':ctrl.rating>4,\'fa fa-2x fa-star-o\':ctrl.rating<5}"></span>'+							 
							'</div>'+
							'<div class="form-group">'+
							   '<label for="content">Comment</label>'+
							   '<textarea class="form-control" id="content" ng-model="ctrl.comment" row="20" style="min-height: 200px;"></textarea>'+
							'</div>'+							
							
						'</div>'+
						'<div class="modal-footer">'+
							'<button class="btn btn-success" type="submit"><span class="glyphicon glyphicon-ok"></span> OK</button>'+
							'<button class="btn btn-default" type="button" ng-click="ctrl.close()"><span class="glyphicon glyphicon-remove"></span> Cancel</button>'+ 
						'</div> '+
					'</form>', 
			controller: function($uibModalInstance){
				var ctrl = this;
				ctrl.rating = 0;
				ctrl.ok = function() {
					$uibModalInstance.close({
						comment:ctrl.comment,
						rating : ctrl.rating
					});
				};
				ctrl.close = function() {
					$uibModalInstance.dismiss('cancel');
				};
			},
			controllerAs: 'ctrl',
			size: 'md'
			});

			var promise = modalInstance.result.then(function (res) {
			req.comment = res.comment;
			req.rating = res.rating;
			$http.post('api/rbl/public/index.php/api/postcomment',req).then(function(res){
					
				defer.resolve(res);
			},function(res){
				alert(res.data);
				defer.reject(false);
			});
			});
			return defer.promise;
    };
	
	var surveyObjs = [ 
					{ item :'bedroomsSize',name: 'Bedrooms Size: ', values : [null,1,2,3,4,5],valueLink: [' ', 'Tiny' , 'Small' , 'Average' , 'Big', 'Huge'],bedroomsSizeadditionalComments: '',type:'rating',value:null},
					{ item :'bedroomsCondition',name: 'Bedrooms Condition: ', values : [null,1,2,3,4,5],valueLink: ['', 'Poor' , 'Fair' , 'Good' , 'Very Good', 'Excellent'],bedroomsConditionadditionalComments: '',type:'rating',value:null},
					{ item :'masterBedroomSize',name: 'Master Bedroom Size: ', values : [null,1,2,3,4,5],valueLink: ['', 'Tiny' , 'Small' , 'Average' , 'Big', 'Huge'],masterBedroomSizeadditionalComments: '',type:'rating',value:null},
					{ item :'masterBedroomCondition',name: 'Master Bedroom Condition:', values : [null,1,2,3,4,5],valueLink: ['I don\'t know', 'Poor' , 'Fair' , 'Good' , 'Very Good', 'Excellent'],masterBedroomConditionadditionalComments: '',type:'rating',value:null},
					{ item :'masterBathroomCondition',name: 'Master Bathroom Condition: ', values : [null,1,2,3,4,5],valueLink: ['I don\'t know', 'Poor' , 'Fair' , 'Good' , 'Very Good', 'Excellent'],masterBathroomConditionadditionalComments: '',type:'rating',value:null},
					{ item :'bathroomsCondition',name: 'Bathrooms Condition: ', values : [null,1,2,3,4,5],valueLink: ['I don\'t know', 'Poor' , 'Fair' , 'Good' , 'Very Good', 'Excellent'],bathroomsConditionadditionalComments: '',type:'rating',value:null},
					{ item :'livingRoomCondition',name: 'Living Room Condition: ', values : [null,1,2,3,4,5],valueLink: ['I don\'t know', 'Poor' , 'Fair' , 'Good' , 'Very Good', 'Excellent'],livingRoomConditionadditionalComments: '',type:'rating',value:null},
					{ item :'livingRoomSize',name: 'Living Room Size: ', values : [null,1,2,3,4,5],valueLink: ['', 'Tiny' , 'Small' , 'Average' , 'Big', 'Huge'],livingRoomSizeadditionalComments: '',type:'rating',value:null},
					{ item :'kitchenCondition',name: 'Kitchen Condition: ', values : [null,1,2,3,4,5],valueLink: ['I don\'t know', 'Poor' , 'Fair' , 'Good' , 'Very Good', 'Excellent'],kitchenConditionadditionalComments: '',type:'rating',value:null},
					{ item :'kitchenSize',name: 'Kitchen Size: ', values : [null,1,2,3,4,5],valueLink: ['', 'Tiny' , 'Small' , 'Average' , 'Big', 'Huge'],kitchenSizeadditionalComments: '',type:'rating',value:null},
					{ item :'kitchenCountertops',name: 'Kitchen Countertops Condition: ', values : [null,1,2,3,4,5],valueLink: ['I don\'t know', 'Poor' , 'Fair' , 'Good' , 'Very Good', 'Excellent'],kitchenCountertopsadditionalComments: '',type:'rating',value:null},
					{ item :'kitchenAppliances',name: 'Kitchen Appliances Condition: ', values : [null,1,2,3,4,5],valueLink: ['I don\'t know', 'Poor' , 'Fair' , 'Good' , 'Very Good', 'Excellent'],kitchenAppliancesadditionalComments: '',type:'rating',value:null},
					{ item :'airConditioningCondition',name: 'Air Conditioning Condition: ', values : [null,1,2,3,4,5],valueLink: ['I don\'t know', 'Poor' , 'Fair' , 'Good' , 'Very Good', 'Excellent'],airConditioningConditionadditionalComments: '',type:'rating',value:null},
					{ item :'roofCondition',name: 'Roof Condition: ', values : [null,1,2,3,4,5],valueLink: ['I don\'t know', 'Poor' , 'Fair' , 'Good' , 'Very Good', 'Excellent'],roofConditionadditionalComments: '',type:'rating',value:null},
					{ item :'laundryAppliances',name: 'Laundry Appliances Condition: ', values : [null,1,2,3,4,5],valueLink: ['I don\'t know', 'Poor' , 'Fair' , 'Good' , 'Very Good', 'Excellent'],laundryAppliancesadditionalComments: '',type:'rating',value:null},
					{ item :'homeSize',name: 'Home Size: ', values : [null,1,2,3,4,5],valueLink: ['', 'Tiny' , 'Small' , 'Average' , 'Big', 'Huge'],homeSizeadditionalComments: '',type:'rating',value:null},
					{ item :'homeLayout',name: 'Home Layout: ', values : [null,1,2,3,4,5],valueLink: ['I don\'t know', 'Poor' , 'Fair' , 'Good' , 'Very Good', 'Excellent'],homeLayoutadditionalComments: '',type:'rating',value:null},
					{ item :'homeFloors',name: 'Home Floors: ', values : [null,1,2,3,4,5],valueLink: ['I don\'t know', 'Poor' , 'Fair' , 'Good' , 'Very Good', 'Excellent'],homeFloorsadditionalComments: '',type:'rating',value:null},
					{ item :'wallColors',name: 'Wall Colors: ', values : [null,1,2,3,4,5],valueLink: ['I don\'t know', 'Poor' , 'Fair' , 'Good' , 'Very Good', 'Excellent'],wallColorsadditionalComments: '',type:'rating',value:null},
					{ item :'backyardSize',name: 'Backyard Size: ', values : [null,1,2,3,4,5],valueLink: ['', 'Tiny' , 'Small' , 'Average' , 'Big', 'Huge'],backyardSizeadditionalComments: '',type:'rating',value:null},
					{ item :'backyardCondition',name: 'Backyard Condition: ', values : [null,1,2,3,4,5],valueLink: ['I don\'t know', 'Poor' , 'Fair' , 'Good' , 'Very Good', 'Excellent'],backyardConditionadditionalComments: '',type:'rating',value:null},
					{ item :'homePaintColor',name: 'Home Exterior Paint Color: ', values : [null,1,2,3,4,5],valueLink: ['I don\'t know', 'Poor' , 'Fair' , 'Good' , 'Very Good', 'Excellent'],homePaintColoradditionalComments: '',type:'rating',value:null},
					{ item :'neighborhoodCondition',name: 'Neighborhood Condition: ', values : [null,1,2,3,4,5],valueLink: ['I don\'t know', 'Poor' , 'Fair' , 'Good' , 'Very Good', 'Excellent'],neighborhoodConditionadditionalComments: '',type:'rating',value:null},
					{ item :'neighborhoodLocation',name: 'Neighborhood Location: ', values : [null,1,2,3,4,5],valueLink: ['I don\'t know', 'Poor' , 'Fair' , 'Good' , 'Very Good', 'Excellent'],neighborhoodLocationadditionalComments: '',type:'rating',value:null},
					{ item :'wasSellingRealtorFriendly',name: 'Is the Selling Realtor Friendly: ', values : [null,true,false],valueLink: ['I don\'t know', 'Yes', 'No'],wasSellingRealtorFriendlyadditionalComments: '',type:'checkbox',value:null},
					{ item :'wasSellierWillToNegotiate',name: 'Is the Seller Willing To Negotiate: ', values : [null,true,false],valueLink: ['I don\'t know', 'Yes', 'No'],wasSellierWillToNegotiateadditionalComments: '',type:'checkbox',value:null},
					{ item :'wasSellierWillToFixProblems',name: 'Is the Seller Willing To Fix Problems: ', values : [null,true,false],valueLink: ['I don\'t know', 'Yes', 'No'],wasSellierWillToFixProblemsadditionalComments: '',type:'checkbox',value:null}
				];
	
	var showSurvey = function(req){
		var defer = $q.defer();    
		var modalInstance = $uibModal.open({      
			template: 
					'<form ng-submit="ctrl.ok()" class="rbl-survery">'+ 
						'<style>.rbl-survery label{margin-bottom:0px;}</style>'+
						'<div class="modal-header">'+
							'<h3 class="modal-title" id="modal-title">Survey</h3>'+
						'</div>'+
						' <div class="modal-body" id="modal-body">'+
							'<div class="container-fluid">'+
							'<div class="row-fluid">'+
							'<div class="form-group" ng-repeat="item in ctrl.surveryItems" ng-init="item.prop = item.item+\'additionalComments\'">'+
								'<div class="col-lg-6 col-md-6" style="border-bottom:1px solid #ddd; min-height:67px;">'+
							   '<label class="control-label" for="{{item.item}}">{{item.name}} </label><br>'+							   
								'<span ng-if="item.type==\'rating\'" style="color:orange;font-size:25px" ng-click="item.value=1" ng-class="{\'fa fa-star\':item.value>0,\'fa fa-star-o\':item.value<1}"></span>'+	
								'<span ng-if="item.type==\'rating\'" style="color:orange;font-size:25px" ng-click="item.value=2" ng-class="{\'fa fa-star\':item.value>1,\'fa fa-star-o\':item.value<2}"></span>'+	
								'<span ng-if="item.type==\'rating\'" style="color:orange;font-size:25px" ng-click="item.value=3" ng-class="{\'fa fa-star\':item.value>2,\'fa fa-star-o\':item.value<3}"></span>'+	
								'<span ng-if="item.type==\'rating\'" style="color:orange;font-size:25px" ng-click="item.value=4" ng-class="{\'fa fa-star\':item.value>3,\'fa fa-star-o\':item.value<4}"></span>'+	
								'<span ng-if="item.type==\'rating\'" style="color:orange;font-size:25px" ng-click="item.value=5" ng-class="{\'fa fa-star\':item.value>4,\'fa fa-star-o\':item.value<5}"></span>'+	
								'<label ng-if="item.type==\'checkbox\'"><input type="radio" ng-model="item.value" ng-value="true" ng-click="item.value=true"> Yes  </label>'+
								'<label ng-if="item.type==\'checkbox\'"><input type="radio" ng-model="item.value" ng-value="false" ng-click="item.value=false"> No  </label>'+
								'<input type="text" class="form-control" style="width:182px;float:right" placeholder="Additional Comments" maxlength="50" ng-model="item[item.prop]"/>'+
								'<br>'+
								'<span>{{ctrl.getValueLink(item)}}</span>'+
								'<br>'+
							'</div>'+							
							'</div>'+							
							'</div>'+							
							'</div>'+							
							
						'</div>'+
						'<div class="modal-footer">'+
							'<button class="btn btn-success" type="submit"><span class="glyphicon glyphicon-ok"></span> OK</button>'+
							'<button class="btn btn-default" type="button" ng-click="ctrl.close()"><span class="glyphicon glyphicon-remove"></span> Cancel</button>'+ 
						'</div> '+
					'</form>', 
			controller: function($uibModalInstance,$http){
				var ctrl = this;
				ctrl.getValueLink =function(item){
					var i = item.values.indexOf(item.value);
					if (i > -1){
						return item.valueLink[i];
					}else{
						return '';
					}
				}
				ctrl.surveryItems = angular.copy(surveyObjs);
				$http.post('api/rbl/public/index.php/api/getsurvey',req).then(function(res){
					if (res.data.success === true){
						var survey = res.data.survey;
						for (var i = 0 ; i < ctrl.surveryItems.length;i++){
							var propAddy = ctrl.surveryItems[i].item + 'additionalComments';
							var prop = ctrl.surveryItems[i].item;
							if(survey[prop]){
								ctrl.surveryItems[i].value = survey[prop];
							}
							if(survey[propAddy]){
								ctrl.surveryItems[i][propAddy] = survey[propAddy];
							}
						}
					}
					
				});
				ctrl.ok = function() {
					$uibModalInstance.close(
						ctrl.surveryItems
					);
				};
				ctrl.close = function() {
					$uibModalInstance.dismiss('cancel');
				};
			},
			controllerAs: 'ctrl',
			size: 'lg'
			});

			var promise = modalInstance.result.then(function (res) {
				var obj = {};
				obj.id = req.id;
				obj.streetNum = req.streetNum;
				obj.streetName = req.streetName;
				obj.city = req.city;
				obj.state = req.state;
				obj.country = req.country;
				obj.zipCode = req.zipCode;
				if (Array.isArray(res)){
					res.forEach(function(item){
						var prop = item.item;
						obj[prop] = item.value;
						obj[prop+'additionalComments'] = item[prop+'additionalComments'];
					});
					$http.post('api/rbl/public/index.php/api/postsurvey',obj).then(function(res){
						
						defer.resolve(res);
					},function(res){
						alert(res.data);
						defer.reject(false);
					});
				}else{
					defer.reject(false);
				}
				
				
			});
			return defer.promise;
    };
    
    var getReviews = function(req){
		var defer = $q.defer();
		$http.get('api/rbl/public/index.php/api/getReviews?id='+req.id).then(function(res){
						if (!res.data)
							res.data = {};
						res.data.survey = surveyObjs;
						if (res && res.data && res.data.surgeryCount){
							for (var prop in res.data.surgeryCount){
								if (res.data.surgeryCount[prop] != null){
									res.data.surgeryCount[prop] = parseFloat(res.data.surgeryCount[prop]);
									res.data.surgeryCount[prop] = Math.round( res.data.surgeryCount[prop] * 10 ) / 10;
								}
							}
							
							for (var i = 0 ; i < res.data.survey.length;i++){
								var prop = res.data.survey[i].item;
								if(res.data.surgeryCount[prop]){
									res.data.survey[i].value = res.data.surgeryCount[prop];
								}
								
							}
							delete res.data.surgeryCount;
						}
						 
						defer.resolve(res);
					},function(res){
						alert(res.data);
						defer.reject(false);
					});
		return defer.promise;
    };
    
    
   
    	
    	
    var searchUsers = function(req){
		var defer = $q.defer();
		
		$http.get('api/rbl/public/index.php/api/searchusers?query='+req.query).then(function(res){
					    
						defer.resolve(res);
					},function(res){
						
						defer.reject(false);
					});
					
		return defer.promise;
    };
	var getUserData = function(req){
		var defer = $q.defer();
		
		$http.get('api/rbl/public/index.php/api/getuserdata').then(function(res){
					    
						defer.resolve(res);
					},function(res){
						
						defer.reject(false);
					});
					
		return defer.promise;
    };
	var updateUser = function(req){
		var defer = $q.defer();
		
		$http.post('api/rbl/public/index.php/api/updateuser',req).then(function(res){
					    
						defer.resolve(res);
					},function(res){
						
						defer.reject(false);
					});
					
		return defer.promise;
    };
	var processNotifications = function(req){
		var defer = $q.defer();
		
		$http.post('api/rbl/public/index.php/api/processnotification',{}).then(function(res){
					    
						defer.resolve(res);
					},function(res){
						
						defer.reject(false);
					});
					
		return defer.promise;
    };
    
    var  confirmFriendRequest = function(req){
		var defer = $q.defer();
		if (req.do ===true){
		    $http.post('api/rbl/public/index.php/api/confirmfriend',{user:req.user.userName}).then(function(res){
					    
						defer.resolve(res);
					},function(res){
						
						defer.reject(false);
					});
		}else if(req.do === false){
		    $http.get('api/rbl/public/index.php/api/confirmfriend?user='+req.user.userName).then(function(res){
					    
						defer.resolve(res);
					},function(res){
						
						defer.reject(false);
					});
		}
		
					
		return defer.promise;
    };
    
    var sendFriend = function(req){
		var defer = $q.defer();
		
		$http.post('api/rbl/public/index.php/api/sendfriend',{user:req.user}).then(function(res){
					    
						defer.resolve(res);
					},function(res){
						alert(res.data)
						defer.reject(false);
					});
					
		return defer.promise;
    };
    var likeListing = function(req){
		var defer = $q.defer();
		$http.post('api/rbl/public/index.php/api/makeFavorite',req).then(function(res){
				
						defer.resolve(res);
					},function(res){
						alert(res.data);
						defer.reject(false);
					});
		return defer.promise;
    };
    
	var getUser = function(req){
		var defer = $q.defer();
		$http.get('api/rbl/public/index.php/api/getuser?user='+req.userName).then(function(res){				
			defer.resolve(res);
		},function(res){
			defer.reject(false);
		});
		return defer.promise;
    };
    
    return {
    	  makeComment:makeComment,
    	  getReviews:getReviews,
    	  likeListing:likeListing,
		  showSurvey:showSurvey,
		  surveyObjs:surveyObjs,
		   getUser:getUser,
		   searchUsers:searchUsers,
		   sendFriend:sendFriend,
		   getUserData:getUserData,
		   confirmFriendRequest :confirmFriendRequest,
		   processNotifications:processNotifications,
		   share:share,
		   updateUser:updateUser
    }
});


})();