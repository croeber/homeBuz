<?php

namespace App\Http\Controllers;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class LoginController extends Controller
{
    public function post(Request $request)
    {       
		try {
			$token = $request->input('token');
			include_once __DIR__ . '/../../../../jwt/api/index.php';
			$ticket = verifyRblToken($token);			
			$emailVerified = $ticket->emailVerified;
			$provider = $ticket->provider;
			$email = $ticket->email;
			$valid = $ticket->valid;
			if($valid == true && $email != null && $emailVerified == true && $provider != null){				 
				$users = DB::select("select userName from Users where email = ?",[$email]);
				if (count($users)>0){
					return response()->json(array('auth' => true,'user'=>$users[0]));
				}else{
					$ran = rand(10000,99999);
					$userImport = DB::select("select * from Users where userName = ?",['User'.$ran]);
					$num = count($userImport);
					while ($num > 0){
						$ran = rand(10000,99999);
						$userImport = DB::select("select * from Users where userName = ?",['User'.$ran]);
						$num = count($userImport);
					}
					
					DB::table('Users')->insert([
						['email' =>$email, 'userName' =>'User'.$ran, 'provider' => $provider]
					]);
					return response()->json(array('auth' => true,'user' => 'User'.$ran));
				}
			}else{		
				return response()->json(array('auth' => false));
			}
		} catch (Exception $e) {
			$message = $e->getMessage();
			return response()->json(array('auth' => false,'message'=> $message));
		}
		
	
		
    }

}