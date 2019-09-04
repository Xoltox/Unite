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


$UrlPrefix = "";

$Ip = "";
$Id = "";
$VAL = "";

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

    if(isset($_REQUEST["id"]))       $Id     = urlencode($_REQUEST['id']);
    if(isset($_REQUEST["val"]))      $VAL    = urlencode($_REQUEST['val']);

    file_put_contents("../Logs/log_" . date('Ymd') . ".txt", date("H:i:s." . substr((string)microtime(), 1, 8)) . " - [" . $Ip . "] - [" .
        "Id = " . $Id . 
        ", VAL = " . $VAL .
        "] - [" . "http://$_SERVER[HTTP_HOST]$_SERVER[REQUEST_URI]" . "]" . PHP_EOL, FILE_APPEND);

    if(
        isset($Id)         &&
        isset($VAL)
    )
    {
        $Response = file_get_contents(
            $UrlPrefix . "/PhpScripts/AjaxServerAccess.php?WebMethod=ExecuteQuery&Query=DAInsertKhroneFlowData&" .
            "Params[]=" . $Ip . "&" .
            "Params[]=" . $Id   . "&" . 
            "Params[]=" . $VAL);
    
        echo "Data saved <br>";
        //echo $Response;
    }
    else
    {
        $response = file_get_contents($UrlPrefix . "/PhpScripts/AjaxServerAccess.php?WebMethod=ExecuteQuery");
        echo "Data not saved";
    }
    
    function curl_get_contents($url)
    {
      $ch = curl_init($url);
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($ch, CURLOPT_FOLLOWLOCATION, 1);
      curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
      curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
      $data = curl_exec($ch);
      curl_close($ch);
      return $data;
    }

?>
