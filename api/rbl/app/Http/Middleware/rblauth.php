<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

use Closure;

class rblauth
{
    public function handle($request, Closure $next)
    {
		$token = $request->header('Authorization');
		if ($token !== null){
			include_once __DIR__ . '/../../../../jwt/api/index.php';
		    $ticket = verifyRblToken($token);
			$emailVerified = $ticket->emailVerified;
			$provider = $ticket->provider;
			$email = $ticket->email;
			$valid = $ticket->valid;
			if($valid == true && $email != null && $emailVerified == true && $provider != null){	
				
				$users = DB::select("select userName from Users where email = ? AND provider = ?",[$email,$provider]);
				if (count($users)>0){
					return $next($request);
				}else{
					return response('You Must Be Logged in to do this!', 401)
						  ->header('Content-Type', 'text/plain');
				}
				return $next($request);
			}else{		
				return response('You Must Be Logged in to do this!!', 401)
                      ->header('Content-Type', 'text/plain');
			}
		}else{
			return response('You Must Be Logged in to do this!!!', 401)
                  ->header('Content-Type', 'text/plain');
		}
    }
}