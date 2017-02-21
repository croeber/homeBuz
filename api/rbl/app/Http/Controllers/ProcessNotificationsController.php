<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request; 
use Illuminate\Support\Facades\DB;

class ProcessNotificationsController extends Controller
{

    public function post(Request $request)
    {
		$success = false;
		$token = $request->header('Authorization');
		 
		include_once __DIR__ . '/../../../../jwt/api/index.php';
		$ticket = verifyRblToken($token);
		$emailVerified = $ticket->emailVerified;
		$provider = $ticket->provider;
		$email = $ticket->email;
		$valid = $ticket->valid;
		$notifications = array();
		if($valid == true && $email != null && $emailVerified == true && $provider != null){
			$users = DB::select("select userName,id from Users where email = ?",[$email]);
			if (count($users)>0){
				$user = $users[0];
				$userID = $user->id;
				DB::table('Notifications')->where('userId', $userID)->update(['isRead' => 1]);
				$notifications = DB::select("select * FROM Notifications WHERE userId = ?",[$userID]);
				$success = true;
			}
		}
		
		
		
		return response()->json(array('success' => $success,'notifications'=>$notifications));
		     
    }
}