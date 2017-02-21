<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GetListingsOnMapController extends Controller
{
    /**
     * Show the profile for the given user.
     *
     * @param  int  $id
     * @return Response
     */
    public function get(Request $request)
    { 
		
		 $postalCode = $request->query('postalCode');
		 $city = $request->query('city');
		 $state = $request->query('state');
		 $street = $request->query('street');
		 $streetNum = $request->query('streetNum');
		 $final = array();
		 $listings = DB::select("select id from Listings Where street = ? AND houseNumber = ? AND city = ? AND region = ?",[$street,$streetNum,$city,$state]);
		 if (count($listings) > 0){
			 $listing = $listings[0];
			 $id = $listing->id;
		 }else{
			 $id = -1;
		 }
	     $listings = DB::select("select Listings.id,Listings.street,Listings.houseNumber,Listings.city,Listings.region,Listings.postalCode,Ratings.accumRating,Ratings.numTimesRated from Listings INNER JOIN Ratings ON Listings.id=Ratings.listingID Where Listings.postalCode = ? AND Listings.id <> ?",[$postalCode,$id]);
		 if (count($listings) > 0){
			$arrlength = count($listings);
			for($x = 0; $x < $arrlength; $x++) {
				$ratingNum = 0;
				$numTimesRated = $listings[$x]->numTimesRated;
				$accumRating = $listings[$x]->accumRating;
				if (is_numeric($numTimesRated) && is_numeric($accumRating) && $numTimesRated > 0 && $accumRating > 0){
					$ratingNum = round( $accumRating / $numTimesRated ,1);
					$listings[$x]->ratingNum = $ratingNum;
				}
				
			}
			return response()->json(array('listings' => $listings));
		 }else{
			return response()->json(array('found' => false));
		 }
		
		
    }
}