<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB; 

class GetUserDataController extends Controller 
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
		$user = null;
		$userData = array();
		$notifications = array();
		$messages = array();
		if($valid == true && $email != null && $emailVerified == true && $provider != null){
			$users = DB::select("select * from Users where email = ?",[$email]);
			if (count($users)>0){
				$user = $users[0];
				$userID = $user->id;
				$userData = DB::select("select Users.firstName,Users.lastName,Users.userName,DATE_FORMAT(UsersFriendRequests.dateEntered,'%b %d %Y') as dateEntered from UsersFriendRequests INNER JOIN Users ON Users.id=UsersFriendRequests.fromUserId where UsersFriendRequests.toUserId = ? ORDER BY UsersFriendRequests.dateEntered DESC",[$userID]);
				$notifications = DB::select("select * FROM Notifications WHERE userId = ?",[$userID]);
				
				$success = true;
			}
		}		
		
		
		
				
		return response()->json(array('success'=>$success,'friendRequests'=>$userData,'notifications'=>$notifications,'messages'=>$messages));
		     
    }
}