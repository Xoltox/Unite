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

	include "AjaxServerChromePhp.php";
	include "AjaxServerCredentials.php";
	include "AjaxServerAccessQueries.php";

	//Code to determine Execution Time
	$MicroTime = microtime(); 
	$MicroTime = explode(" ", $MicroTime); 
	$MicroTime = $MicroTime[1] + $MicroTime[0]; 
	$StartTime = $MicroTime; 
	$DebugParams = "";
	session_start();

	//Local Variables Setup and initialisation
	$ConnMySql;
	$RetVal = 
        array(
			"HasError" => true, 
			"ErrorMessage" => "Invalid Parameters", 
			"Data" => "", 
			"HasRecords" => false, 
			"RowsAffected" => 0, 
			"InsertId" => 0, 
			"ParsedQuery" => "", 
			"SessionId" => session_id(), 
			"ExecutionTime" => 0
		);
	$RetVal["Data"] = array();
	$Ip = GetIp();
	
	//Convert all named parameters to local variables
	$WebMethod    = (isset($_REQUEST["WebMethod"])?    $_REQUEST["WebMethod"]: "");
	$Query        = (isset($_REQUEST["Query"])?        $_REQUEST["Query"]: "");
	$MailTo       = (isset($_REQUEST["MailTo"])?       $_REQUEST["MailTo"]: "");
	$SenderName   = (isset($_REQUEST["SenderName"])?   $_REQUEST["SenderName"]: $DefaultMailSenderName);
	$Subject      = (isset($_REQUEST["Subject"])?      $_REQUEST["Subject"]: "");
	$Body         = (isset($_REQUEST["Body"])?         $_REQUEST["Body"]: "");
	$SmtpServer   = (isset($_REQUEST["SmtpServer"])?   $_REQUEST["SmtpServer"]: $DefaultMailSmtpServer);
	$SmtpPort     = (isset($_REQUEST["SmtpPort"])?     $_REQUEST["SmtpPort"]: $DefaultMailSmtpPort);
	$SmtpUser     = (isset($_REQUEST["SmtpUser"])?     $_REQUEST["SmtpUser"]: $DefaultMailSmtpUser);
	$SmtpPassword = (isset($_REQUEST["SmtpPassword"])? $_REQUEST["SmtpPassword"]: $DefaultMailSmtpPassword);
	$SmtpSecure   = (isset($_REQUEST["SmtpSecure"])?   $_REQUEST["SmtpSecure"]: "");
	$SmsToPhNo    = (isset($_REQUEST["SmsToPhNo"])?    $_REQUEST["SmsToPhNo"]: "");
	$SmsText      = (isset($_REQUEST["SmsText"])?      $_REQUEST["SmsText"]: "");
	$Params       = (isset($_REQUEST["Params"]) ?      $_REQUEST["Params"]: array());
	
	$SenderName   = ($SenderName != "" ? $SenderName: $DefaultMailSenderName);
	$SmtpServer   = ($SenderName != "" ? $SmtpServer: $DefaultMailSmtpServer);
	$SmtpPort     = ($SenderName != "" ? $SmtpPort: $DefaultMailSmtpPort);
	$SmtpUser     = ($SenderName != "" ? $SmtpUser: $DefaultMailSmtpUser);
	$SmtpPassword = ($SenderName != "" ? $SmtpPassword: $DefaultMailSmtpPassword);
 
	$DebugParams = $DebugParams . "Ip = '" . $Ip . "'";
	$DebugParams = $DebugParams . ", WebMethod = '" . $WebMethod . "'";
	$DebugParams = $DebugParams . ", Query = '" . $Query . "'";
	$DebugParams = $DebugParams . ", MailTo = '" . $MailTo . "'";
	$DebugParams = $DebugParams . ", SenderName = '" . $SenderName . "'";
	$DebugParams = $DebugParams . ", Subject = '" . $Subject . "'";
	$DebugParams = $DebugParams . ", Body = '" . $Body . "'";
	$DebugParams = $DebugParams . ", SmtpServer = '" . $SmtpServer . "'";
	$DebugParams = $DebugParams . ", SmtpPort = '" . $SmtpPort . "'";
	$DebugParams = $DebugParams . ", SmtpUser = '" . $SmtpUser . "'";
	$DebugParams = $DebugParams . ", SmtpPassword = '" . $SmtpPassword . "'";
	$DebugParams = $DebugParams . ", SmtpSecure = '" . $SmtpSecure . "'";
	$DebugParams = $DebugParams . ", SmsToPhNo = '" . $SmsToPhNo . "'";
	$DebugParams = $DebugParams . ", SmsText = '" . $SmsText . "'";
	//$DebugParams = $DebugParams . ", Params[] = '" . $Params . "'";

	ChromePhp::log("-----------------------------------------");					
	ChromePhp::log("PhpLog: Params Passed:");					
	ChromePhp::log($DebugParams . ", Params = ");					
	ChromePhp::log($Params);					
	ChromePhp::log("-----------------------------------------\n");

	//--------------------------------
    //Method 1: ExecuteQuery
    //--------------------------------
	if ($WebMethod == "ExecuteQuery")
	{
		try
		{
			$Count = 0;
			$Data = array();

			$ParsedQuery = trim($Queries[$Query]);
			for ($Count = 0; $Count < count($Params); $Count++)
			{
				$ParsedQuery = str_replace("%%Param".($Count)."%%", str_replace("<Apostrophe>", "'", str_replace("'", "''", $Params[$Count])), $ParsedQuery);
			}
			$ParsedQuery = trim($ParsedQuery);
			$RetVal["ParsedQuery"] = $ParsedQuery;
			ChromePhp::log("PhpLog:  ParsedQuery = '" . $ParsedQuery . "'");
                
            $ConnMySql = @mysqli_connect($DBUrl, $DBUser, $DBPassword, $DBName);
            if (mysqli_connect_errno())
            {
                $RetVal["ErrorMessage"] = "Failed to connect to MySQL: " . mysqli_connect_error();
				ChromePhp::log("PhpLog:  MySqlError = '" . "Failed to connect to MySQL: " . mysqli_connect_error() . "'");
            }
            else
            {
				//Step 1: We should always update the 'LastAccessed' time for each user each time he accesses the database
				$LastAccessedQuery = "UPDATE user SET LastAccess = GetIst() WHERE userid = '$Params[0]';";  
				$Rs = @mysqli_query($ConnMySql, $LastAccessedQuery);
						
				//Step 2: We should enter the query into log if it is not a select query (i.e. log update, insert, and delete queries)
				if(strtolower(substr($ParsedQuery, 0,  6)) != "select")
                {
                    $ParsedQueryForLog = str_replace("'", "''", $ParsedQuery);
                    $ParsedQueryForLog = "INSERT INTO eventslog(EventDate, CallingIP, UserID, Description) VALUES (GetIst(), '" . $Ip . "', '" . $Params[0] . "', '" .  $ParsedQueryForLog . "');";
                    $Rs = @mysqli_query($ConnMySql, $ParsedQueryForLog);
                }
                       
				//Step 3: Finally fire the actual query
                $Rs = @mysqli_query($ConnMySql, $ParsedQuery);
				//echo ("ParsedQuery " . $ParsedQuery . "\n" );
				//echo ("Select returned " . $Rs->num_rows . " rows.\n" );
				if ($Rs)
				{
					$RetVal["ErrorMessage"]="";
					$RetVal["HasError"]=false;
					while ($Row = @mysqli_fetch_assoc($Rs))
					{
						$Data[] = $Row;
					}
					$RetVal["Data"] = $Data;
					$RetVal["HasRecords"] = (count($Data) > 0); 
					$RetVal["RowsAffected"] = count($Data);
					$RetVal["InsertId"] = mysqli_insert_id($ConnMySql);
					//if ($Query == "DAEmployeeSelectAll" )
					//{
					//}
				}
				else
				{
					$RetVal["ErrorMessage"] = mysqli_error($ConnMySql);
					ChromePhp::log("PhpLog:  MySqlError = '" . mysqli_error($ConnMySql) . "'");
				}
            }
		}
		catch (Exception $e)
		{
			$RetVal["ErrorMessage"] = $e->getMessage();
			ChromePhp::log("PhpLog:  Exception = '" . $e->getMessage() . "'");
		}
	}
        
    //--------------------------------
    //Method 2: SendMail
    //--------------------------------
    else if($WebMethod == "SendMail")
	{
		require("../PhpMailer/class.phpmailer.php");
		try
		{
			$Data = array();

			//Send Mail From Here
			$mail = new PHPMailer();
			$mail->IsSMTP();
			$mail->SMTPAuth = true; 
			$mail->SMTPSecure = $SmtpSecure; 
			$mail->Port = $SmtpPort;  
			$mail->Host = gethostbyname($SmtpServer);
			$mail->Username = $SmtpUser;  
			$mail->Password = $SmtpPassword;
			$mail->SetFrom($SmtpUser, $SenderName);
			$mail->Subject = $Subject;
			$mail->Body = $Body;
			$Addresses = explode(',', $MailTo);
			foreach ($Addresses as $Address) 
			{
				$mail->AddAddress($Address);
			}
			//$mail->AddAddress($MailTo);

			$mail->IsHTML(true);

			$RetVal["Data"] = $Data;
			if($mail->Send()) 
			{
				$RetVal["HasError"] = false;
				$RetVal["ErrorMessage"] = "";
			} 
			else 
			{
				$RetVal["HasError"] = true;
				$RetVal["ErrorMessage"] = $mail->ErrorInfo;
				ChromePhp::log("PhpLog:  MailError = '" . $mail->ErrorInfo . "'");
			}
		}
		catch (Exception $e)
		{
			$RetVal["HasError"] = true;
			$RetVal["ErrorMessage"] = $e->getMessage();
			ChromePhp::log("PhpLog:  Exception = '" . $e->getMessage() . "'");
		}
	}
        
    //--------------------------------
    //Method 3: SendSms
    //--------------------------------
	else if($WebMethod == "SendSms")
	{
		$RetVal = array();
		try
		{
			$Status = file("http://smsnmms.co.in/sms.aspx?Id=$GWUserId&Pwd=$GWPassword&PhNo=$SmsToPhNo&text=$SmsText");

			if (strpos($Status[0], "Message Submitted") !== FALSE)
			{
				$RetVal["HasError"] = false;
				$RetVal["ErrorMessage"] = "";
				$RetVal["Data"] = $Status[0];
			}
			else
			{
				$RetVal["ErrorMessage"] = $Status[0];
				ChromePhp::log("PhpLog:  SmsError = '" . $Status[0] . "'");
				$RetVal["Data"] = $Status[0];
			}
		}
		catch (Exception $e)
		{
			$RetVal["ErrorMessage"] = $e->getMessage();
			ChromePhp::log("PhpLog:  Exception = '" . $e->getMessage() . "'");
		}
	}
                
    //--------------------------------
    //Method 3: ExecuteProcedure
    //--------------------------------
	if ($WebMethod == "ExecuteProcedure")
	{
		try
		{
			$ProcName = $_REQUEST["ProcName"];
			$Params = (isset($_REQUEST["Params"]) ? $_REQUEST["Params"]: array());
			$Data = array();
					
			$ConnMySql = @mysqli_connect($DBUrl, $DBUser, $DBPassword, $DBName);
            if (mysqli_connect_errno())
            {
                $RetVal["ErrorMessage"] = "Failed to connect to MySQL: " . mysqli_connect_error();
				ChromePhp::log("PhpLog:  MySqlError = '" . "Failed to connect to MySQL: " . mysqli_connect_error() . "'");
            }
            else
            {
                if ($ProcName == "GraphData1")
                {                                        
                    $Rs = @mysqli_query($ConnMySql, $ParsedQuery);
					if ($Rs)
					{
						$RetVal["ErrorMessage"]="";
						$RetVal["HasError"]=false;
						while ($Row = @mysqli_fetch_assoc($Rs))
						{
							$Data[] = $Row;
						}
						$RetVal["Data"] = $Data;
						$RetVal["HasRecords"] = (count($Data) > 0); 
						$RetVal["RowsAffected"] = count($Data);
						$RetVal["InsertId"] = mysqli_insert_id($ConnMySql);
						//if ($Query == "DAEmployeeSelectAll" )
						//{
						//	echo "Data"; die;
						//}
					}
					else
					{
						$RetVal["ErrorMessage"] = mysqli_error($ConnMySql);
						ChromePhp::log("PhpLog:  MySqlError = '" . mysqli_error($ConnMySql) . "'");
					}
                }
                else if ($ProcName == "GraphData2")
                {
					//Some other logic here       
                }
            }
		}
		catch (Exception $e)
		{
			$RetVal["ErrorMessage"] = $e->getMessage();
			ChromePhp::log("PhpLog:  Exception = '" . $e->getMessage() . "'");
		}
	}

    $MicroTime = microtime(); 
    $MicroTime = explode(" ", $MicroTime); 
    $MicroTime = $MicroTime[1] + $MicroTime[0]; 
    $EndTime = $MicroTime; 
    $RetVal["ExecutionTime"] = ($EndTime - $StartTime);

    //ChromePhp::log("PhpLog:  RetVal = '" . json_encode($RetVal) . "'");
    //ChromePhp::log($Data);

    echo json_encode($RetVal);
    return;
        
    //--------------------------------
    //End of WebMethods
    //--------------------------------

         
    //--------------------------------
    //Simple Function to get a GUID
    //--------------------------------
   function GUID()
    {
	    if (function_exists('com_create_guid') === true)
	    {
		    return trim(com_create_guid(), '{}');
	    }

	    return sprintf(
                        '%04X%04X-%04X-%04X-%04X-%04X%04X%04X', 
                        mt_rand(0, 65535), 
                        mt_rand(0, 65535), 
                        mt_rand(0, 65535), 
                        mt_rand(16384, 20479), 
                        mt_rand(32768, 49151), 
                        mt_rand(0, 65535), 
                        mt_rand(0, 65535), 
                        mt_rand(0, 65535)
                        );
    }

	function GetIp()
	{
		$RetIp = "";
		if (!empty($_SERVER['HTTP_CLIENT_IP'])) 
		{
			$RetIp = $_SERVER['HTTP_CLIENT_IP'];
		} 
		elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) 
		{
			$RetIp = $_SERVER['HTTP_X_FORWARDED_FOR'];
		} 
		else 
		{
			$RetIp = $_SERVER['REMOTE_ADDR'];
		}
		return $RetIp;
	}
?>