<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class GetSurveyController extends Controller
{

    public function post(Request $request)
    {
		$streetNum = $request->input('streetNum');
		$streetName = $request->input('streetName');
		$city = $request->input('city');
		$state = $request->input('state');
		$country = $request->input('country');
		$id = $request->input('id');
		$zipCode = $request->input('zipCode');
		$success= false;
		$listing = array();
		if ($id === ''){

			$id = DB::table('Listings')->insertGetId(
				['houseNumber' =>$streetNum,
				'street' =>$streetName,
				'city' =>$city,
				'region' =>$state,
				'postalCode' => $zipCode
				]
			);
		}  
		$token = $request->header('Authorization');
		 
		include_once __DIR__ . '/../../../../jwt/api/index.php';
		$ticket = verifyRblToken($token);
		$emailVerified = $ticket->emailVerified;
		$provider = $ticket->provider;
		$email = $ticket->email;
		$valid = $ticket->valid;
		if($valid == true && $email != null && $emailVerified == true && $provider != null){
			$users = DB::select("select userName,id from Users where email = ?",[$email]);
			if (count($users)>0){
				$user = $users[0];
				$userID = $user->id;
				$columns = 'bedroomsSize,bedroomsSizeadditionalComments,bedroomsCondition,bedroomsConditionadditionalComments,masterBedroomSize,masterBedroomSizeadditionalComments,masterBedroomCondition,masterBedroomConditionadditionalComments,masterBathroomCondition,masterBathroomConditionadditionalComments,bathroomsCondition,bathroomsConditionadditionalComments,livingRoomCondition,livingRoomConditionadditionalComments,livingRoomSize,livingRoomSizeadditionalComments,kitchenCondition,kitchenConditionadditionalComments,kitchenSize,kitchenSizeadditionalComments,kitchenCountertops,kitchenCountertopsadditionalComments,kitchenAppliances,kitchenAppliancesadditionalComments,airConditioningCondition,airConditioningConditionadditionalComments,roofCondition,roofConditionadditionalComments,laundryAppliances,laundryAppliancesadditionalComments,homeSize,homeSizeadditionalComments,homeLayout,homeLayoutadditionalComments,homeFloors,homeFloorsadditionalComments,wallColors,wallColorsadditionalComments,backyardSize,backyardSizeadditionalComments,backyardCondition,backyardConditionadditionalComments,homePaintColor,homePaintColoradditionalComments,neighborhoodCondition,neighborhoodConditionadditionalComments,neighborhoodLocation,neighborhoodLocationadditionalComments,wasSellingRealtorFriendly,wasSellingRealtorFriendlyadditionalComments,wasSellierWillToNegotiate,wasSellierWillToNegotiateadditionalComments,wasSellierWillToFixProblems,wasSellierWillToFixProblemsadditionalComments';
				$listings = DB::select("select ".$columns." from Surveys where listingID = ? and userId = ?",[$id,$userID]);
				if (count($listings)>0){
					$listing = $listings[0];
					$success = true;
					
				}
			}
		}		
		
		
		
				
		return response()->json(array('id' => $id,'success'=>$success,'survey'=>$listing));
		     
    }
}