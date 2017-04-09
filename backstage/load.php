<?php
    header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	require 'config/status.php';
	if($_SERVER['REQUEST_METHOD']=="GET") {
		$city_index = $_GET['city_index'];
		require 'database/db_connect.php';
		require 'streetgame.php';
		$street_game = new STREET_GAME($con);
		$pic_arr = $street_game->doSelect($city_index);
		header('HTTP/1.1 200 '.$http_status[200]);
		echo json_encode($pic_arr);
	} else {
		echo 2;
	}