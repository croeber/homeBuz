<?php

use Illuminate\Http\Request;
use App\Http\Middleware\rblauth;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:api');
Route::get('listing', 'ListingController@get');
Route::post('postcomment', 'MakeCommentController@post')->middleware(rblauth::class);
Route::post('postsurvey', 'MakeSurveyController@post')->middleware(rblauth::class);
Route::post('getsurvey', 'GetSurveyController@post')->middleware(rblauth::class);
Route::get('getuser', 'GetUserController@get');
Route::get('getuserdata', 'GetUserDataController@get')->middleware(rblauth::class);
Route::get('searchusers', 'SearchUserController@get');
Route::get('getListing', 'GetListingController@get');
Route::get('getListingsOnMap', 'GetListingsOnMapController@get');
Route::get('getReviews', 'GetReviewsController@get');
Route::post('login', 'LoginController@post');
Route::post('makeFavorite', 'MakeFavoriteController@post')->middleware(rblauth::class);
Route::post('confirmfriend', 'ProcessFriendRequestController@post')->middleware(rblauth::class);
Route::get('confirmfriend', 'ProcessFriendRequestController@get')->middleware(rblauth::class);
Route::post('processnotification', 'ProcessNotificationsController@post')->middleware(rblauth::class);
Route::post('share', 'ShareController@post')->middleware(rblauth::class);
Route::post('updateuser', 'UpdateUserController@post')->middleware(rblauth::class);
Route::post('sendfriend', 'SendFriendController@post')->middleware(rblauth::class);