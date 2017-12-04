<?php
    header("Access-Control-Allow-Origin: *");
	header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");
	require 'config/status.php';
	if($_SERVER['REQUEST_METHOD']=="POST") {
		$score=$_POST['score'];
		$ip=$_POST['ip'];
		$detail=$_POST['detail'];
		require 'database/db_connect.php';
		require 'streetgame.php';
		$street_game = new STREET_GAME($con);
		$street_game->insertRecord($ip,$score,$detail);
		header('HTTP/1.1 200 '.$http_status[200]);
		echo TRUE;
	}