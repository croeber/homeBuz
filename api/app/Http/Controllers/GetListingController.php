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
		$apartmentNumber = $request->query('apartmentNumber');
		
		
		$listings = DB::select("select Listings.listingID, Ratings.rating from Listings INNER JOIN Ratings ON Listings.listingID=Ratings.listingID Where street = '?' AND houseNumber = '?' AND city = '?' AND region = '?'",[$streetName,$streetNum,$city,$state]);
		if (count($listings) > 0){
			$reviews = DB::select('select * from Reviews Where listingID = ?',[$listings[0]->listingID]);
			return response()->json(array('listing' => $listings[0],'reviewsCount'=>count($reviews)));
		}else{
			return '';
		}
        
    }
}