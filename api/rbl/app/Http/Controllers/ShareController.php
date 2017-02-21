<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ShareController extends Controller
{

    public function post(Request $request)
    {
		$users = $request->input('users');
		$streetNum = $request->input('streetNum');
		$streetName = $request->input('streetName');
		$city = $request->input('city');
		$state = $request->input('state');
		$country = $request->input('country');
		$id = $request->input('id');
		$zipCode = $request->input('zipCode');
		$success = false;
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
				$string = $userName.' has shared the listing at '.$streetNum.' '.$streetName.', '.$city.', '.$state;
				for($i = 0; $i < count($users); ++$i) {
					$usersToSend = DB::select("select id from Users where userName = ?",[$users[$i]->userName]);
					if (count($usersToSend)>0){
						$userToSend = $usersToSend[0];
						$userToSendId = $userToSend->id;
						DB::table('Notifications')->insert(
								[	
									'type' =>2,
									'userId' =>$userToSendId,
									'listingID' =>$id,
									'content' =>$string,
									
								]
							);
						$success = true;
					}				
					
				}
				
			}
		}		
		
		

		
		
		return response()->json(array('success'=>$success));
		     
    }
}