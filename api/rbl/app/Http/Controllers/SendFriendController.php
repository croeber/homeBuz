<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SendFriendController extends Controller
{

    public function post(Request $request)
    {
		$success = false;
		$sentUser = $request->input('user');
		$token = $request->header('Authorization');
		include_once __DIR__ . '/../../../../jwt/api/index.php';
		$ticket = verifyRblToken($token);
		$emailVerified = $ticket->emailVerified;
		$provider = $ticket->provider;
		$email = $ticket->email;
		$valid = $ticket->valid;
		if($valid == true && $email != null && $emailVerified == true && $provider != null){
			$users = DB::select("select id from Users where userName = ?",[$sentUser]);
			
			
			$usersTwo = DB::select("select id from Users where email = ?",[$email]);
			if (count($users)>0 && count($usersTwo)>0){
			    $user = $users[0];
				   $userID = $user->id;
				   $userTwo = $usersTwo[0];
				   $userIDTwo = $userTwo->id;
					
       $reqs = DB::select("select id from UsersFriendRequests where fromUserId = ? AND toUserId = ?",[$userIDTwo,$userID]);
			    if(count($reqs)==0){
			        DB::table('UsersFriendRequests')->insert(	[	'toUserId' =>$userID,'fromUserId' =>$userIDTwo]);
							    $success = true;
			    }
				}
			}
			
		
		
		return response()->json(array('success'=>$success));
    }
}