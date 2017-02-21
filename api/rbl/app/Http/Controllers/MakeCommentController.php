<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MakeCommentController extends Controller
{

    public function post(Request $request)
    {
		$rating = $request->input('rating');
		$comment = $request->input('comment');
		$streetNum = $request->input('streetNum');
		$streetName = $request->input('streetName');
		$city = $request->input('city');
		$state = $request->input('state');
		$country = $request->input('country');
		$id = $request->input('id');
		$zipCode = $request->input('zipCode');
		$ratings = array();
		if ($id === ''){
 
			$id = DB::table('Listings')->insertGetId(
				['houseNumber' =>$streetNum,
				'street' =>$streetName,
				'city' =>$city,
				'region' =>$state,
				'postalCode' => $zipCode
				]
			);
		}  
		$token = $request->header('Authorization');
		 
		include_once __DIR__ . '/../../../../jwt/api/index.php';
		$ticket = verifyRblToken($token);
		$emailVerified = $ticket->emailVerified;
		$provider = $ticket->provider;
		$email = $ticket->email;
		$valid = $ticket->valid;
		if($valid == true && $email != null && $emailVerified == true && $provider != null){
			$users = DB::select("select userName,id from Users where email = ?",[$email]);
			if (count($users)>0){
				$user = $users[0];
				$userID = $user->id;
				$userName = $user->userName;
				if ($comment != null || $comment != ''){
					DB::table('Reviews')->insert(
						[
							'listingID' =>$id,
							'content' =>$comment,
							'userId' =>$userID,
							'userName' =>$userName
						]
					);
				}
				$itemsRevs = DB::select("select * from UsersListingsReviewed where userId = ? AND listingID = ?",[$userID,$id]);
				if (!count($itemsRevs) > 0){
					DB::table('UsersListingsReviewed')->insert(
								[	
									'listingID' =>$id,
									'userId' =>$userID
								]
							);

				}
				$items = DB::select("select * from UsersListingsRated where userId = ? AND listingID = ?",[$userID,$id]);
				if (!count($items) > 0){
					DB::table('UsersListingsRated')->insert(
								[	
									'listingID' =>$id,
									'userId' =>$userID
								]
							);

				}
				
				$usersHomes = DB::select("select Listings.id as id,street,postalCode,region,country,apartmentNumber,houseNumber,city,county,UsersHomes.userId as userId from UsersHomes INNER JOIN Listings ON Listings.id=UsersHomes.id where UsersHomes.listingID = ? AND UsersHomes.isFollowed = 1 AND UsersHomes.userId <> ?",[$id,$userID]);
				for($i = 0; $i < count($usersHomes); ++$i) {
					$userHome = $usersHomes[$i];
					$userHomeUserId = $userHome->userId;

					//Look for existing notification
					//If existings and not isRead
					//Then update notificiation count 
					//Else if existing THEN delete existing and create new current count (not includeing last count)
					$nots = DB::select("select * FROM Notifications where listingID = ?",[$userHome->id]);
					if (count($nots) > 0){
						$not = $nots[0];
						if ($not->isRead == 0){
							//update notification count
							$count = $not->count + 1;
							DB::table('Notifications')->where('id', $not->id)->update(['count' => $count]);
							DB::table('Notifications')->where('id', $not->id)->update(['content'=>'There are '.$count.' new comment(s) on your liked home at '.$userHome->houseNumber.' '.$userHome->street.', '.$userHome->city.', '.$userHome->region]);
						}else{
							DB::table('Notifications')->where('id', '=', $not->id)->delete();
							DB::table('Notifications')->insert(
								[	
									'type' =>1,
									'userId' =>$userHome->userId,
									'listingID' =>$userHome->id,
									'count' => 1,
									'content' =>'There are 1 new comment(s) on your liked home at '.$userHome->houseNumber.' '.$userHome->street.', '.$userHome->city.', '.$userHome->region,
								]
							);
						}
					}else{
						DB::table('Notifications')->insert(
								[	
									'type' =>1,
									'userId' =>$userHome->userId,
									'listingID' =>$userHome->id,
									'count' => 1,
									'content' =>'There are 1 new comment(s) on your liked home at '.$userHome->houseNumber.' '.$userHome->street.', '.$userHome->city.', '.$userHome->region,
								]
							);
					}
					
					
					
				}
				
			}
		}		
		
		
		if (is_numeric($rating) && $rating > 0 && $rating < 6 ){
			$ratings = DB::select("select * from Ratings where listingID = ?",[$id]);
			if (count($ratings) > 0 ){
				DB::table('Ratings')->where('listingID', $id)->increment('accumRating', $rating);
				DB::table('Ratings')->where('listingID', $id)->increment('numTimesRated', 1);
			}else{
				DB::table('Ratings')->insert(
						[	
							'listingID' =>$id,
							'accumRating' =>$rating,
							'numTimesRated' =>1
						]
					);
			}
			
		}
		
		
		return response()->json(array('id' => $id,'rating'=>$rating));
		     
    }
}