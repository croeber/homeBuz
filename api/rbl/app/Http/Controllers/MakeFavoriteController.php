<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MakeFavoriteController extends Controller
{

    public function post(Request $request)
    {
		$success = false;
		$streetNum = $request->input('streetNum');
		$streetName = $request->input('streetName');
		$city = $request->input('city');
		$state = $request->input('state');
		$country = $request->input('country');
		$id = $request->input('id');
		$zipCode = $request->input('zipCode');
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
			$user = $users[0];
			if (count($users)>0){
				$userID = $user->id;
				$userName = $user->userName;
				
				$items = DB::select("select id,listingID,isFollowed from UsersHomes where userId = ? AND listingID = ?",[$userID,$id]);
				if (count($items) > 0){
					$home = $items[0];
					$homeId = $home->id;
					$isFollowed = $home->isFollowed;
					if ($isFollowed == 0)
						$isFollowed = 1;
					else if ($isFollowed == 1)
						$isFollowed = 0;
					DB::table('UsersHomes')->where('id', $homeId)->update(['isFollowed' => $isFollowed]);
					$success = true;
				}else{
					DB::table('UsersHomes')->insert(
								[	
									'listingID' =>$id,
									'userId' =>$userID,
									'isFollowed' =>1
								]
							);
					$success = true;

				}
			}
			
		}			
		
		return response()->json(array('success'=>$success,'id'=>$id));
    }
}