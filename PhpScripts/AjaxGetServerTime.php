<?php
/*
    Copyright (c) 2019 Parth Sharma (parth.official@outlook.com) - All Rights Reserved

    Permission is hereby granted, free of charge, to any person obtaining a copy
    of this software and associated documentation files (the "Software"), to deal
    in the Software without restriction, including without limitation the rights
    to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
    copies of the Software, and to permit persons to whom the Software is
    furnished to do so, subject to the following conditions:

    The above copyright notice and this permission notice shall be included in all
    copies or substantial portions of the Software.

    THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
    IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
    FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
    AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
    LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
    OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
    SOFTWARE.
*/


$Ip = "";
$DeviceId = "";

ini_set('display_errors',1);
ini_set('display_startup_errors',1);
error_reporting(-1);

if (!empty($_SERVER['HTTP_CLIENT_IP'])) 
    {
        $Ip = $_SERVER['HTTP_CLIENT_IP'];
    } 
    elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) 
    {
        $Ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
    } 
    else 
    {
        $Ip = $_SERVER['REMOTE_ADDR'];
    }

    if(isset($_REQUEST["DeviceId"])) $DeviceId = urlencode($_REQUEST['DeviceId']);

    file_put_contents("../../Logs/log_" . date('Ymd') . ".txt", date("H:i:s." . substr((string)microtime(), 1, 8)) . " - [" . $Ip . "] - [" .
        "DeviceId = " . $DeviceId . 
        "] - [" . "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]" . "]" . PHP_EOL, FILE_APPEND);

    if(isset($DeviceId))
	{
        echo "Access Successful: " . date('s') . ", " . date('i') . ", " . date('H') . ", " . jddayofweek ( cal_to_jd(CAL_GREGORIAN, date("m"),date("d"), date("Y")) , 0 ) . ", " . date('d') . ", " . date('m') . ", " . date('Y');
        //echo $Response;
    }
    else
    {
        echo "Data not saved";
    }
?>
