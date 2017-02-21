<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class MakeSurveyController extends Controller
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
		$bedroomsSize = $request->input('bedroomsSize');
		$bedroomsSizeadditionalComments = $request->input('bedroomsSizeadditionalComments');
		$bedroomsCondition = $request->input('bedroomsCondition');
		$bedroomsConditionadditionalComments = $request->input('bedroomsConditionadditionalComments');
		$masterBedroomSize = $request->input('masterBedroomSize');
		$masterBedroomSizeadditionalComments = $request->input('masterBedroomSizeadditionalComments');
		$masterBedroomCondition = $request->input('masterBedroomCondition');
		$masterBedroomConditionadditionalComments = $request->input('masterBedroomConditionadditionalComments');
		$masterBathroomCondition = $request->input('masterBathroomCondition');
		$masterBathroomConditionadditionalComments = $request->input('masterBathroomConditionadditionalComments');
		$bathroomsCondition = $request->input('bathroomsCondition');
		$bathroomsConditionadditionalComments = $request->input('bathroomsConditionadditionalComments');
		$livingRoomCondition = $request->input('livingRoomCondition');
		$livingRoomConditionadditionalComments = $request->input('livingRoomConditionadditionalComments');
		$livingRoomSize = $request->input('livingRoomSize');
		$livingRoomSizeadditionalComments = $request->input('livingRoomSizeadditionalComments');
		$kitchenCondition = $request->input('kitchenCondition');
		$kitchenConditionadditionalComments = $request->input('kitchenConditionadditionalComments');
		$kitchenSize = $request->input('kitchenSize');
		$kitchenSizeadditionalComments = $request->input('kitchenSizeadditionalComments');
		$kitchenCountertops = $request->input('kitchenCountertops');
		$kitchenCountertopsadditionalComments = $request->input('kitchenCountertopsadditionalComments');
		$kitchenAppliances = $request->input('kitchenAppliances');
		$kitchenAppliancesadditionalComments = $request->input('kitchenAppliancesadditionalComments');
		$airConditioningCondition = $request->input('airConditioningCondition');
		$airConditioningConditionadditionalComments = $request->input('airConditioningConditionadditionalComments');
		$roofCondition = $request->input('roofCondition');
		$roofConditionadditionalComments = $request->input('roofConditionadditionalComments');
		$laundryAppliances = $request->input('laundryAppliances');
		$laundryAppliancesadditionalComments = $request->input('laundryAppliancesadditionalComments');
		$homeSize = $request->input('homeSize');
		$homeSizeadditionalComments = $request->input('homeSizeadditionalComments');
		$homeLayout = $request->input('homeLayout');
		$homeLayoutadditionalComments = $request->input('homeLayoutadditionalComments');
		$homeFloors = $request->input('homeFloors');
		$homeFloorsadditionalComments = $request->input('homeFloorsadditionalComments');
		$wallColors = $request->input('wallColors');
		$wallColorsadditionalComments = $request->input('wallColorsadditionalComments');
		$backyardSize = $request->input('backyardSize');
		$backyardSizeadditionalComments = $request->input('backyardSizeadditionalComments');
		$backyardCondition = $request->input('backyardCondition');
		$backyardConditionadditionalComments = $request->input('backyardConditionadditionalComments');
		$homePaintColor = $request->input('homePaintColor');
		$homePaintColoradditionalComments = $request->input('homePaintColoradditionalComments');
		$neighborhoodCondition = $request->input('neighborhoodCondition');
		$neighborhoodConditionadditionalComments = $request->input('neighborhoodConditionadditionalComments');
		$neighborhoodLocation = $request->input('neighborhoodLocation');
		$neighborhoodLocationadditionalComments = $request->input('neighborhoodLocationadditionalComments');
		$wasSellingRealtorFriendly = $request->input('wasSellingRealtorFriendly'); 
		$wasSellierWillToNegotiate = $request->input('wasSellierWillToNegotiate'); 
		$wasSellierWillToFixProblems = $request->input('wasSellierWillToFixProblems'); 
		$wasSellingRealtorFriendlyadditionalComments = $request->input('wasSellingRealtorFriendlyadditionalComments'); 
		$wasSellierWillToNegotiateadditionalComments = $request->input('wasSellierWillToNegotiateadditionalComments'); 
		$wasSellierWillToFixProblemsadditionalComments = $request->input('wasSellierWillToFixProblemsadditionalComments'); 
		$success= false;
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
				$listings = DB::select("select id from Surveys where listingID = ? and userId = ?",[$id,$userID]);
				if (count($listings)>0){
					$listing = $listings[0];
					$success = true;
					DB::table('Surveys')
						->where('id',$listing->id)
						->update(
						[
							'bedroomsSize'=>$bedroomsSize,
							'bedroomsSizeadditionalComments'=>$bedroomsSizeadditionalComments,
							'bedroomsCondition'=>$bedroomsCondition,
							'bedroomsConditionadditionalComments'=>$bedroomsConditionadditionalComments,
							'masterBedroomSize'=>$masterBedroomSize,
							'masterBedroomSizeadditionalComments'=>$masterBedroomSizeadditionalComments,
							'masterBedroomCondition'=>$masterBedroomCondition,
							'masterBedroomConditionadditionalComments'=>$masterBedroomConditionadditionalComments,
							'masterBathroomCondition'=> $masterBathroomCondition,
							'masterBathroomConditionadditionalComments'=>$masterBathroomConditionadditionalComments,
							'bathroomsCondition'=>$bathroomsCondition,
							'bathroomsConditionadditionalComments'=>$bathroomsConditionadditionalComments,
							'livingRoomCondition'=>$livingRoomCondition,
							'livingRoomConditionadditionalComments'=>$livingRoomConditionadditionalComments,
							'livingRoomSize'=>$livingRoomSize,
							'livingRoomSizeadditionalComments'=>$livingRoomSizeadditionalComments,
							'kitchenCondition'=>$kitchenCondition,
							'kitchenConditionadditionalComments'=>$kitchenConditionadditionalComments,
							'kitchenSize'=>$kitchenSize,
							'kitchenSizeadditionalComments'=>$kitchenSizeadditionalComments,
							'kitchenCountertops'=>$kitchenCountertops,
							'kitchenCountertopsadditionalComments'=>$kitchenCountertopsadditionalComments,
							'kitchenAppliances'=>$kitchenAppliances,
							'kitchenAppliancesadditionalComments'=>$kitchenAppliancesadditionalComments,
							'airConditioningCondition'=>$airConditioningCondition,
							'airConditioningConditionadditionalComments'=>$airConditioningConditionadditionalComments,
							'roofCondition'=>$roofCondition,
							'roofConditionadditionalComments'=>$roofConditionadditionalComments,
							'laundryAppliances'=>$laundryAppliances,
							'laundryAppliancesadditionalComments'=>$laundryAppliancesadditionalComments,
							'homeSize'=>$homeSize,
							'homeSizeadditionalComments'=>$homeSizeadditionalComments,
							'homeLayout'=>$homeLayout,
							'homeLayoutadditionalComments'=>$homeLayoutadditionalComments,
							'homeFloors'=>$homeFloors,
							'homeFloorsadditionalComments'=>$homeFloorsadditionalComments,
							'wallColors'=>$wallColors,
							'wallColorsadditionalComments'=>$wallColorsadditionalComments,
							'backyardSize'=>$backyardSize,
							'backyardSizeadditionalComments'=>$backyardSizeadditionalComments,
							'backyardCondition'=>$backyardCondition,
							'backyardConditionadditionalComments'=>$backyardConditionadditionalComments,
							'homePaintColor'=>$homePaintColor,
							'homePaintColoradditionalComments'=>$homePaintColoradditionalComments,
							'neighborhoodCondition'=>$neighborhoodCondition,
							'neighborhoodConditionadditionalComments'=>$neighborhoodConditionadditionalComments,
							'neighborhoodLocation'=>$neighborhoodLocation,
							'neighborhoodLocationadditionalComments'=>$neighborhoodLocationadditionalComments,
							'wasSellingRealtorFriendly'=>$wasSellingRealtorFriendly,
							'wasSellierWillToNegotiate'=>$wasSellierWillToNegotiate,
							'wasSellierWillToFixProblems'=>$wasSellierWillToFixProblems,
							'wasSellingRealtorFriendlyadditionalComments'=>$wasSellingRealtorFriendlyadditionalComments,
							'wasSellierWillToNegotiateadditionalComments'=>$wasSellierWillToFixProblemsadditionalComments,
							'wasSellierWillToFixProblemsadditionalComments'=>$wasSellierWillToFixProblemsadditionalComments
						]
					);
				}else{
					$success = true;
					DB::table('Surveys')->insert(
						[
							'listingID' =>$id,
							'userId' =>$userID,
							'bedroomsSize'=>$bedroomsSize,
							'bedroomsSizeadditionalComments'=>$bedroomsSizeadditionalComments,
							'bedroomsCondition'=>$bedroomsCondition,
							'bedroomsConditionadditionalComments'=>$bedroomsConditionadditionalComments,
							'masterBedroomSize'=>$masterBedroomSize,
							'masterBedroomSizeadditionalComments'=>$masterBedroomSizeadditionalComments,
							'masterBedroomCondition'=>$masterBedroomCondition,
							'masterBedroomConditionadditionalComments'=>$masterBedroomConditionadditionalComments,
							'masterBathroomCondition'=> $masterBathroomCondition,
							'masterBathroomConditionadditionalComments'=>$masterBathroomConditionadditionalComments,
							'bathroomsCondition'=>$bathroomsCondition,
							'bathroomsConditionadditionalComments'=>$bathroomsConditionadditionalComments,
							'livingRoomCondition'=>$livingRoomCondition,
							'livingRoomConditionadditionalComments'=>$livingRoomConditionadditionalComments,
							'livingRoomSize'=>$livingRoomSize,
							'livingRoomSizeadditionalComments'=>$livingRoomSizeadditionalComments,
							'kitchenCondition'=>$kitchenCondition,
							'kitchenConditionadditionalComments'=>$kitchenConditionadditionalComments,
							'kitchenSize'=>$kitchenSize,
							'kitchenSizeadditionalComments'=>$kitchenSizeadditionalComments,
							'kitchenCountertops'=>$kitchenCountertops,
							'kitchenCountertopsadditionalComments'=>$kitchenCountertopsadditionalComments,
							'kitchenAppliances'=>$kitchenAppliances,
							'kitchenAppliancesadditionalComments'=>$kitchenAppliancesadditionalComments,
							'airConditioningCondition'=>$airConditioningCondition,
							'airConditioningConditionadditionalComments'=>$airConditioningConditionadditionalComments,
							'roofCondition'=>$roofCondition,
							'roofConditionadditionalComments'=>$roofConditionadditionalComments,
							'laundryAppliances'=>$laundryAppliances,
							'laundryAppliancesadditionalComments'=>$laundryAppliancesadditionalComments,
							'homeSize'=>$homeSize,
							'homeSizeadditionalComments'=>$homeSizeadditionalComments,
							'homeLayout'=>$homeLayout,
							'homeLayoutadditionalComments'=>$homeLayoutadditionalComments,
							'homeFloors'=>$homeFloors,
							'homeFloorsadditionalComments'=>$homeFloorsadditionalComments,
							'wallColors'=>$wallColors,
							'wallColorsadditionalComments'=>$wallColorsadditionalComments,
							'backyardSize'=>$backyardSize,
							'backyardSizeadditionalComments'=>$backyardSizeadditionalComments,
							'backyardCondition'=>$backyardCondition,
							'backyardConditionadditionalComments'=>$backyardConditionadditionalComments,
							'homePaintColor'=>$homePaintColor,
							'homePaintColoradditionalComments'=>$homePaintColoradditionalComments,
							'neighborhoodCondition'=>$neighborhoodCondition,
							'neighborhoodConditionadditionalComments'=>$neighborhoodConditionadditionalComments,
							'neighborhoodLocation'=>$neighborhoodLocation,
							'neighborhoodLocationadditionalComments'=>$neighborhoodLocationadditionalComments,
							'wasSellingRealtorFriendly'=>$wasSellingRealtorFriendly,
							'wasSellierWillToNegotiate'=>$wasSellierWillToNegotiate,
							'wasSellierWillToFixProblems'=>$wasSellierWillToFixProblems,
							'wasSellingRealtorFriendlyadditionalComments'=>$wasSellingRealtorFriendlyadditionalComments,
							'wasSellierWillToNegotiateadditionalComments'=>$wasSellierWillToFixProblemsadditionalComments,
							'wasSellierWillToFixProblemsadditionalComments'=>$wasSellierWillToNegotiateadditionalComments
						]
					);
				}
			}
		}		
		
		
		
				
		return response()->json(array('id' => $id,'success'=>$success));
		     
    }
}