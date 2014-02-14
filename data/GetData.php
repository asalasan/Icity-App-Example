<?php
include ("../inc/config.php");
header('Content-type: application/json');

$view=$_GET['view'];
$id=$_GET['id'];

	$ch = curl_init();

	$url = 'http://icity-gw.icityproject.com:8080/developer/api/';
	
	if ($view=='devices'){
		$url = $url.'infrastructures/{id}/devices';
		$templateParamNames = array('{id}');
		$templateParamValues = array(urlencode($id));
		$url = str_replace($templateParamNames, $templateParamValues, $url);
		$queryParams = '?' . urlencode('apikey') . '=' . urlencode(apiKey);	
	}elseif($view=='temperature'){
		$url = $url.'observations/last';
		$queryParams = '?'.urlencode('id').'='.urlencode($id).'&'.urlencode('property').'='.urlencode('urn:temperature').'&'.urlencode('n').'='.urlencode('1').'&'.urlencode('apikey').'='.urlencode(apiKey);
	}
	curl_setopt($ch, CURLOPT_CUSTOMREQUEST, 'GET');
	curl_setopt($ch, CURLOPT_URL, $url . $queryParams);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
	curl_setopt($ch, CURLOPT_HEADER, FALSE);
	$response = curl_exec($ch);
	curl_close($ch);

echo $response;
?>