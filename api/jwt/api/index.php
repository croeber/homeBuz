<?php
// https://github.com/lcobucci/jwt
include_once __DIR__ . '/../vendor/autoload.php';

use Lcobucci\JWT\Builder;
use Lcobucci\JWT\Parser;
use Lcobucci\JWT\ValidationData;
use Lcobucci\JWT\Signer\Key;
use Lcobucci\JWT\Signer\Rsa\Sha256;
use Lcobucci\JWT\Configuration;
use Lcobucci\JWT\Signer\Keychain; // just to make our life simpler

$signer = new Sha256();

function verifyRblToken($token) {
	try 
	{
		$signer = new Sha256();
		$token = (new Parser())->parse($token);
		
		$url = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
		$ch = curl_init($url);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
		$json = curl_exec($ch);
		$json = json_decode($json);
		$claims = $token->getClaims();
		$headers = $token->getHeaders();
		$valid = false;
		$signedRight = false;
		$tokenValid = false;
		$email = '';
		$emailVerified = '';
		$provider = '';
		
		if ($headers != null){
			$alg = $headers['alg'];
			$kid = $headers['kid'];
			$publicKey = $json->$kid;
			if ($alg == 'RS256' && $publicKey != null){
				$validationData = new ValidationData();
				$validationData->setIssuer('https://securetoken.google.com/rentbuylive-a7da9');
				$validationData->setAudience('rentbuylive-a7da9');
				$isValid = $token->validate($validationData);
				$uid = $claims['user_id'];
				$email = $claims['email'];
				$emailVerified = $claims['email_verified'];
				$firebase = $token->getClaim('firebase');
				$provider = $firebase->sign_in_provider;
				$sub = $claims['sub'];
				$compare = strcmp($uid,$sub);
				if ($compare === 0 && $isValid){
					$signedRight = $token->verify($signer, $publicKey);
					$valid = true;
					if ($valid == true && $signedRight == true){
						$tokenValid = true;
					}
						
				}
			}
		}
		
		$result = (object) [
			'email' => $email,
			'emailVerified' => $emailVerified,
			'provider' => $provider,
			'valid' => $tokenValid
		  ];
		return $result;
	} catch (Exception $e) {
		$result = (object) [
			'email' => '',
			'emailVerified' => '',
			'provider' => '',
			'valid' => false
		  ];
		return $result;;
	}
  // $validationData = new ValidationData();
  // $validationData->setIssuer('JWT Example');
  // $validationData->setAudience('JWT Example');

  // return $token->validate($validationData);
}

