<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class UpdateUserController extends Controller
{

    public function post(Request $request)
    {
		$userName = $request->input('userName');
		$userNameSent = $request->input('userNameSent');
		$firstName = $request->input('firstName');
		$lastName = $request->input('lastName');
		$city = $request->input('city');
		$state = $request->input('state');
		$bio = $request->input('bio');
		$wants = $request->input('wants');
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
			$usersSent = DB::select("select id from Users where userName = ?",[$userName]);
			if (count($users)>0 && count($usersSent)>0){
				$user = $users[0];
				$userSent = $usersSent[0];
				$userSentId = $userSent->id;
				$userID = $user->id;
				if ($userSentId == $userID){
					DB::table('Users')->where('id', $userSentId)->update(
					[
						'userName' => $userNameSent,
						'wants' => $wants,
						'bio' => $bio,
						'state' => $state,
						'city' => $city,
						'lastName' => $lastName,
						'firstName' => $firstName,
					]
					);
					$success = true;
				}
				
				
				
			}
		}		
		
		

		
		
		return response()->json(array('success'=>$success));
		     
    }
}