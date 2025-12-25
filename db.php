<?php
$host="localhost";
$user="root";
$pass="";
$db="runchallenge2026";
$conn=new mysqli($host,$user,$pass,$db);
if($conn->connect_error){ die("Database Connection Failed"); }
?>