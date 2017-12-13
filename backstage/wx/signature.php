<?php
require_once "jssdk.php";
$url = $_GET["url"];
$jssdk = new JSSDK("wx3346fcca380ae7ec", "4be4564a20af7091496f352a97166386", $url);
$signPackage = $jssdk->GetSignPackage();
echo json_encode($signPackage);
?>