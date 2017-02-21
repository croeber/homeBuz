<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ProcessFriendRequestController extends Controller
{
    public function post(Request $request)
    {
		$success = false;
		$userName = $request->input('user');
		$token = $request->header('Authorization');
		include_once __DIR__ . '/../../../../jwt/api/index.php';
		$ticket = verifyRblToken($token);
		$emailVerified = $ticket->emailVerified;
		$provider = $ticket->provider;
		$email = $ticket->email;
		$valid = $ticket->valid;
		if($valid == true && $email != null && $emailVerified == true && $provider != null){
			//GET CURRENT USER
			$users = DB::select("select * from Users where email = ?",[$email]);
			//GET USER TO PROCESS
			$usersTwo = DB::select("select * from Users where userName = ?",[$userName]);
			
			if (count($users)>0 && count($usersTwo)>0){
			    $user = $users[0];
				$userID = $user->id;
				$userTwo = $usersTwo[0];
				$userIDTwo = $userTwo->id;
				 
				//GET THE REQUEST TO PROCESS
				$reqs = DB::select("select id from UsersFriendRequests where fromUserId = ? AND toUserId = ?",[$userIDTwo,$userID]);
				//USED TO MAKE SURE THEY ARE NOT ALREADY FRIENDS
				$items = DB::select("select * from UsersFriends where theFriendUserId = ? AND theSendingFriendUserId = ?",[$userID,$userIDTwo]);
				$itemsTwo = DB::select("select * from UsersFriends where theFriendUserId = ? AND theSendingFriendUserId = ?",[$userIDTwo,$userID]);
				if (count($items) > 0 || count($reqs) == 0  || count($itemsTwo) > 0){
					$success = false;
				}else{
					//MAKE EM FRIENDS
					DB::table('UsersFriends')->insert(
						[									
							'theFriendUserId' =>$userID,
							'theSendingFriendUserId' =>$userIDTwo
						]
					);
					DB::table('UsersFriends')->insert(
						[									
							'theFriendUserId' =>$userIDTwo,
							'theSendingFriendUserId' =>$userID
						]
					);
					//DELETE THE REQUEST
					DB::table('UsersFriendRequests')->where('id', '=', $reqs[0]->id)->delete();
					//USED TO DELETE ANY REQUESTS THE OTHER USER MAY OF SENT
					$reqstwo = DB::select("select id from UsersFriendRequests where fromUserId = ? AND toUserId = ?",[$userID,$userIDTwo]);
					if (count($reqstwo) > 0)
						DB::table('UsersFriendRequests')->where('id', '=', $reqstwo[0]->id)->delete();
					$success = true;

				}
			}
			
		}			
		
		return response()->json(array('success'=>$success));
    }
	public function get(Request $request)
    {
		$success = false;
		$userName = $request->query('user');
		$token = $request->header('Authorization');
		include_once __DIR__ . '/../../../../jwt/api/index.php';
		$ticket = verifyRblToken($token);
		$emailVerified = $ticket->emailVerified;
		$provider = $ticket->provider;
		$email = $ticket->email;
		$valid = $ticket->valid;
		if($valid == true && $email != null && $emailVerified == true && $provider != null){
			//GET CURRENT USER
			$users = DB::select("select * from Users where email = ?",[$email]);
			//GET USER TO PROCESS
			$usersTwo = DB::select("select * from Users where userName = ?",[$userName]);
			
			if (count($users)>0 && count($usersTwo)>0){
			    $user = $users[0];
				$userID = $user->id;
				$userTwo = $usersTwo[0];
				$userIDTwo = $userTwo->id;
				 
				//GET THE REQUEST TO PROCESS
				$reqs = DB::select("select id from UsersFriendRequests where fromUserId = ? AND toUserId = ?",[$userIDTwo,$userID]);
				//GET THE ANY REQUESTS FROM THE OTHER USERS
				$reqstwo = DB::select("select id from UsersFriendRequests where fromUserId = ? AND toUserId = ?",[$userID,$userIDTwo]);
				//USED TO MAKE SURE THEY ARE NOT ALREADY FRIENDS
				$items = DB::select("select * from UsersFriends where theFriendUserId = ? AND theSendingFriendUserId = ?",[$userID,$userIDTwo]);
				$itemsTwo = DB::select("select * from UsersFriends where theFriendUserId = ? AND theSendingFriendUserId = ?",[$userIDTwo,$userID]);
				//NOW DELETE ANY REQUESTS FROM USER
				//DELETE REQUESTS FROM OTHER USER
				//DELETE FRIEND 
				//DELETE USER FROM FRIEND
				if( count($itemsTwo) > 0){
					DB::table('UsersFriends')->where('id', '=', $itemsTwo[0]->id)->delete();
				}
				if(count($items) > 0 ){
					DB::table('UsersFriends')->where('id', '=', $items[0]->id)->delete();
				}
				if( count($reqs) > 0){
					DB::table('UsersFriendRequests')->where('id', '=', $reqs[0]->id)->delete();
				}
				if(count($reqstwo) > 0 ){
					DB::table('UsersFriendRequests')->where('id', '=', $reqstwo[0]->id)->delete();
				}
				$success = true;
				
			}
			
		}			
		
		return response()->json(array('success'=>$success));
    }
}