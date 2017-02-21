<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ListingController extends Controller
{
    /**
     * Show the profile for the given user.
     *
     * @param  int  $id
     * @return Response
     */
    public function get(Request $request)
    {
		$streetName = $request->query('streetName');
		$streetNum = $request->query('streetNum');
		$city = $request->query('city'); 
		$state = $request->query('state');
		$id = $request->query('id');
		$home = null;
		if($id){
			$homes = DB::select("select region, houseNumber, street, city from Listings WHERE id = ?",[$id]);
			
			if (count($homes)>0){
				$home = $homes[0];
				$streetName = $home->street;
				$streetNum = $home->houseNumber;
				$city = $home->city; 
				$state = $home->region;
			}
		}
		
		
		$url = "http://www.zillow.com/webservice/GetDeepSearchResults.htm?zws-id=X1-ZWz1dvqqhbgz63_aovt1&address=".str_replace(" ","+",$streetNum)."+".str_replace(" ","+",$streetName)."&citystatezip=".str_replace(" ","+",$city)."%2c+".str_replace(" ","+",$state);
		
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$curl_scraped_page = curl_exec($ch);
		$xml = simplexml_load_string($curl_scraped_page);
		$prop = $xml->response->results->result;
		return response()->json(array('property' => $prop, 'home' => $home));
    }
}