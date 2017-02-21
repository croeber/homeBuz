<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class SearchUserController extends Controller
{

    public function get(Request $request)
    {
		$query = $request->input('query');
  $users = array();
  $success = false;		
  if($query != null && strlen($query) > 4 && strtolower($query) != 'user'){
      
  
  $query = $query.'%';
  $sql = "select userName, firstName, lastName from Users where userName LIKE ? OR firstName LIKE ? OR lastName LIKE ?";
	 $users = DB::select($sql,[$query,$query,$query]);
		}
				
		return response()->json(array('success'=>$success,'users'=>$users));
		     
    }
}