<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GetListingController extends Controller
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
		 $apartmentNumber = $request->query('apartmentNum');
		 
		 $listings = DB::select("select id from Listings Where street = ? AND houseNumber = ? AND city = ? AND region = ?",[$streetName,$streetNum,$city,$state]);
		 if (count($listings) > 0){
			 $listing = $listings[0];
			 $id = $listing->id;
			 $ratings = DB::select("select accumRating,numTimesRated From Ratings Where listingID = ?",[$id]);
			 $rating = null;
			 $ratingNum = 0;
			 if (count($ratings)>0){
				$rating = $ratings[0];
				$numTimesRated = $rating->numTimesRated;
				$accumRating = $rating->accumRating;
				if (is_numeric($numTimesRated) && is_numeric($accumRating) && $numTimesRated > 0 && $accumRating > 0){
					$ratingNum = round( $accumRating / $numTimesRated ,1);
				}
			 }
			 $reviewsSelect = DB::select("select content,dateEntered,userName,title from Reviews where listingID = ?",[$id]);
			 return response()->json(array('listing' => $listing,'reviewsCount'=>count($reviewsSelect),'rating'=>$ratingNum,'reviews'=>$reviewsSelect));
		 }else{
			 return response()->json(array('found' => false));
		 }
		
		
    }
}