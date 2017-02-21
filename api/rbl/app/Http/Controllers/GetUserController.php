<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GetUserController extends Controller
{

    public function get(Request $request)
    {
		$userName = $request->input('user');
		$token = $request->header('Authorization');		 
		include_once __DIR__ . '/../../../../jwt/api/index.php';
		$ticket = verifyRblToken($token);
		$emailVerified = $ticket->emailVerified;
		$provider = $ticket->provider;
		$email = $ticket->email;
		$valid = $ticket->valid;
		$success = false;
		$isFriend = false;
		$user = null;
		$reviews = array();
		$homes = array();
		$surveys = array();
		$friends = array();
		$reviewsCount = 0;
		$reviewsCounts = null;
		$ratingsCount = 0;
		$ratingsCounts = null;
		if($valid == true && $email != null && $emailVerified == true && $provider != null){
			$users = DB::select("select * from Users where email = ?",[$email]);
			if (count($users)>0){
				$user = $users[0];
				$userID = $user->id;
				$userNameSelect = $user->userName;
				unset($user->id);
				unset($user->email);
				unset($user->provider);
				unset($user->password);
				if ($userName == $userNameSelect){
					$reviews = DB::select("select DISTINCT Listings.id,street,postalCode,region,country,apartmentNumber,houseNumber,city,county from Listings INNER JOIN Reviews ON Reviews.listingID=Listings.id where Reviews.userId = ?",[$userID]);
					$surveys = DB::select("select DISTINCT Listings.id,street,postalCode,region,country,apartmentNumber,houseNumber,city,county from Listings INNER JOIN Surveys ON Surveys.listingID=Listings.id where Surveys.userId = ?",[$userID]);
					$homes = DB::select("select DISTINCT Listings.id,street,postalCode,region,country,apartmentNumber,houseNumber,city,county from Listings INNER JOIN UsersHomes ON UsersHomes.listingID=Listings.id where UsersHomes.userId = ?",[$userID]);
					$friends = DB::select("select DISTINCT Users.id,Users.firstName,Users.lastName,Users.userName from Users INNER JOIN UsersFriends  ON UsersFriends.theFriendUserId=Users.id where UsersFriends.theSendingFriendUserId = ?",[$userID]);
					$reviewsCounts = DB::select("select COUNT(*) AS reviewsCount from Reviews where userId = ?",[$userID]);
					if (count($reviewsCounts)>0){
						$reviewsCount = $reviewsCounts[0];
						$reviewsCount = $reviewsCount->reviewsCount;
					}
					$ratingsCounts = DB::select("select COUNT(*) AS ratingsCount from UsersListingsRated where userId = ?",[$userID]);
					if (count($ratingsCounts)>0){
						$ratingsCount = $ratingsCounts[0];
						$ratingsCount = $ratingsCount->ratingsCount;
					}
						
						
					$success = true;
				}else{
					$usersToFind = DB::select("select * from Users where userName = ?",[$userName]);
					if (count($usersToFind) > 0 ){
						$userIdToFind = $usersToFind[0]->id; 
						$user = $usersToFind[0];
						unset($user->id);
						unset($user->email);
						unset($user->provider);
						unset($user->password);
						$friendsReq = DB::select("select id from UsersFriends where theFriendUserId = ".$userID." AND theSendingFriendUserId = ".$userIdToFind);
					    $friendsTwoReq = DB::select("select id from UsersFriends where theFriendUserId = ? AND theSendingFriendUserId = ? ",[$userIdToFind,$userID]);
						if (count($friendsReq)>0 || count($friendsTwoReq)>0)
							$isFriend = true;
					}
					
				}
				
			}
		}		
		
		
		
				
		return response()->json(array(
				'success'=>$success,
				'user'=>$user,
				'reviews'=>$reviews,
				'surveys'=>$surveys,
				'homes'=>$homes,
				'friends'=>$friends,
				'reviewsCount'=>$reviewsCount,
				'ratingsCount'=>$ratingsCount,
				'isFriend'=>$isFriend
				)
			);
		     
    }
}