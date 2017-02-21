<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
 
class GetReviewsController extends Controller
{
 
    public function get(Request $request) 
    {  
    	  
		$id = $request->input('id'); 

		$reviews = DB::select("select Reviews.content,Reviews.title,Users.userName,DATE_FORMAT(Reviews.dateEntered,'%b %d %Y %h:%i %p') as dateEntered,Reviews.id from Reviews INNER JOIN Users ON Users.id=Reviews.userId where Reviews.listingID = ? ORDER BY Reviews.dateEntered DESC",[$id]);
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
		$isFavorite = false;
		$token = $request->header('Authorization');		 
		include_once __DIR__ . '/../../../../jwt/api/index.php';
		$ticket = verifyRblToken($token);		
		$emailVerified = $ticket->emailVerified;
		$provider = $ticket->provider;
		$email = $ticket->email;
		$valid = $ticket->valid;
		if($valid == true && $email != null && $emailVerified == true && $provider != null){
			$users = DB::select("select userName,id from Users where email = ?",[$email]);
			$user = $users[0];
			$userID = $user->id;
			$userName = $user->userName;
			$items = DB::select("select id,listingID,isFollowed from UsersHomes where userId = ? AND listingID = ?",[$userID,$id]);
			if (count($items) > 0){
				$home = $items[0];				
				$isFavorite = $home->isFollowed;
			}
		}
		$columns = 'SUM(bedroomsSize) / COUNT(bedroomsSize) AS bedroomsSize, SUM(bedroomsCondition) / COUNT(bedroomsCondition) AS bedroomsCondition, SUM(masterBedroomSize) / COUNT(masterBedroomSize) AS masterBedroomSize, SUM(masterBedroomCondition) / COUNT(masterBedroomCondition) AS masterBedroomCondition, SUM(masterBathroomCondition) / COUNT(masterBathroomCondition) AS masterBathroomCondition, SUM(bathroomsCondition) / COUNT(bathroomsCondition) AS bathroomsCondition, SUM(livingRoomCondition) / COUNT(livingRoomCondition) AS livingRoomCondition, SUM(livingRoomSize) / COUNT(livingRoomSize) AS livingRoomSize, SUM(kitchenCondition) / COUNT(kitchenCondition) AS kitchenCondition, SUM(kitchenSize) / COUNT(kitchenSize) AS kitchenSize, SUM(kitchenCountertops) / COUNT(kitchenCountertops) AS kitchenCountertops, SUM(kitchenAppliances) / COUNT(kitchenAppliances) AS kitchenAppliances, SUM(airConditioningCondition) / COUNT(airConditioningCondition) AS airConditioningCondition, SUM(roofCondition) / COUNT(roofCondition) AS roofCondition, SUM(laundryAppliances) / COUNT(laundryAppliances) AS laundryAppliances, SUM(homeSize) / COUNT(homeSize) AS homeSize, SUM(homeLayout) / COUNT(homeLayout) AS homeLayout, SUM(homeFloors) / COUNT(homeFloors) AS homeFloors, SUM(wallColors) / COUNT(wallColors) AS wallColors, SUM(backyardSize) / COUNT(backyardSize) AS backyardSize, SUM(backyardCondition) / COUNT(backyardCondition) AS backyardCondition, SUM(homePaintColor) / COUNT(homePaintColor) AS homePaintColor, SUM(neighborhoodCondition) / COUNT(neighborhoodCondition) AS neighborhoodCondition, SUM(neighborhoodLocation) / COUNT(neighborhoodLocation) AS neighborhoodLocation, SUM(wasSellingRealtorFriendly) / COUNT(wasSellingRealtorFriendly) AS wasSellingRealtorFriendly, SUM(wasSellierWillToNegotiate) / COUNT(wasSellierWillToNegotiate) AS wasSellierWillToNegotiate, SUM(wasSellierWillToFixProblems) / COUNT(wasSellierWillToFixProblems) AS wasSellierWillToFixProblems';
		$surgeryCounts = DB::select("select ".$columns." from Surveys where listingID = ?",[$id]);
		$surgeryCount = null;
		if (count($surgeryCounts)>0)
			$surgeryCount = $surgeryCounts[0];
			
		
		return response()->json(array('reviews' => $reviews,'rating'=>$ratingNum,'isFavorite'=>$isFavorite,'surgeryCount'=>$surgeryCount));
		     
    }
}