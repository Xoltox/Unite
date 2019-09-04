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

function ClsDataAdapter()
{
    This = this;

    this.ExecutePhp = function ()
    {
    	var RetVal;
    	var ScriptName = arguments[0];
        var Params = Array.prototype.slice.call(arguments, 1);

        $.ajax({
        	url: "./PhpScripts/" + ScriptName,
            data: { "Params": Params },
            type: "POST",
            cache: false,
            async: false,
            dataType: "json",
            success: function (data, result)	
            {
                RetVal = null;
                if (!result)
                {
                    RetVal = {};
                }
                else
                {
                    RetVal = data;
                }
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
            	Debug("Ajax Error --> ResponseText : " + jqXHR.responseText);
                RetVal = {};
            }
        });
        if (RetVal.HasError)
        {
            UI.Alert("Error", "Ajax/SQL Error: " + RetVal.ErrorMessage);
        }
        return RetVal;
    }

    this.ExecuteQuery = function ()
    {
        var RetVal;
        var Query = arguments[0];
        var Params = Array.prototype.slice.call(arguments, 0);

        Params[0] = Cache.Get("UserId");
        $.ajax({
        	url: "./PhpScripts/AjaxServerAccess.php",
            data: { "WebMethod": "ExecuteQuery", "Query": Query, "Params": Params },
            type: "POST",
            cache: false,
            async: false,
            dataType: "json",
            success: function (data, result)	
            {
                RetVal = null;
                if (!result)
                {
                    RetVal = {
                        "HasError": true,
                        "HasRecords": false,
                        "RowsAffected": 0,
                        "InsertId": 0,
                        "ErrorMessage": "Failure to retrieve Sync Data",
                        "Data": "",
                        "ParsedQuery": Query
                    };
                }
                else
                {
                    RetVal = data;
                }
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
            	Debug("Ajax Error --> ResponseText : " + jqXHR.responseText);
                RetVal = {
                    "HasError": true,
                    "HasRecords": false,
                    "RowsAffected": 0,
                    "InsertId": 0,
                    "ErrorMessage": textStatus + ", " + errorThrown + "<span style = 'display:block; font-family:arial; font-size:7pt; font-weight:normal; text-align:left; word-wrap: break-word; color:#4A4D4E'>" + jqXHR.responseText + "</span>",
                    "Data": "",
                    "ParsedQuery": Query
                };
            }
        });
        if (RetVal.HasError)
        {
            UI.Alert("Error", "Ajax/SQL Error: " + RetVal.ErrorMessage);
        }
        return RetVal;
    }

    this.ExecuteProcedure = function ()
    {
        var RetVal;
        var ProcName = arguments[0];
        var Params = Array.prototype.slice.call(arguments, 0);

        Params.splice(0, 1);
        $.ajax({
        	url: "./PhpScripts/AjaxServerAccess.php",
            data: { "WebMethod": "ExecuteProcedure", "ProcName": ProcName, "Params": Params },
            type: "POST",
            cache: false,
            async: false,
            dataType: "json",
            success: function (data, result)
            {
                RetVal = null;
                if (!result)
                {
                    RetVal = {
                        "HasError": true,
                        "HasRecords": false,
                        "RowsAffected": 0,
                        "InsertId": 0,
                        "ErrorMessage": "Failure to retrieve Sync Data",
                        "Data": "",
                        "ParsedQuery": Query
                    };
                }
                else
                {
                    RetVal = data;
                }
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                Debug("Ajax Error --> ResponseText : " + jqXHR.responseText);
                RetVal = {
                    "HasError": true,
                    "HasRecords": false,
                    "RowsAffected": 0,
                    "InsertId": 0,
                    "ErrorMessage": textStatus + ", " + errorThrown + "<span style = 'display:block; font-family:arial; font-size:7pt; font-weight:normal; text-align:left; word-wrap: break-word; color:#4A4D4E'>" + jqXHR.responseText + "</span>",
                    "Data": "",
                    "ParsedQuery": Query
                };
            }
        });
        if (RetVal.HasError)
        {
            UI.Alert("Error", "Ajax/SQL Error: " + RetVal.ErrorMessage);
        }
        return RetVal;
    }

    this.SendMail = function (MailTo, SenderName, Subject, Body, SmtpServer, SmtpPort, SmtpUser, SmtpPassword, SmtpSecure)
    {
        var RetVal;

        $.ajax({
        	url: "./PhpScripts/AjaxServerAccess.php",
            data: {
                "WebMethod": "SendMail",
                "MailTo": MailTo,
                "SenderName": SenderName,
                "Subject": Subject,
                "Body": Body,
                "SmtpServer": SmtpServer,
                "SmtpPort": SmtpPort,
                "SmtpUser": SmtpUser,
                "SmtpPassword": SmtpPassword,
                "SmtpSecure": SmtpSecure
            },
            type: "POST",
            cache: false,
            async: false,
            dataType: "json",
            success: function (data, result)
            {
                RetVal = null;
                if (!result)
                {
                    RetVal = "Error: Failure to retrieve Sync Data.";
                }
                else
                {
                    RetVal = data;
                }
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert("AjaxError: " + errorThrown + ", Status: " + textStatus)
            }
        });
        return RetVal;
    };

    this.SendSms = function (SmsToPhNo, SmsText)
    {
        var RetVal;

        $.ajax({
            url: "./PhpScripts/AjaxServerAccess.php",
            data: {
                "WebMethod": "SendSms",
                "SmsToPhNo": SmsToPhNo,
                "SmsText": SmsText
            },
            type: "POST",
            cache: false,
            async: false,
            dataType: "json",
            success: function (data, result)
            {
                RetVal = null;
                if (!result)
                {
                    RetVal = "Error: Failure to retrieve Sync Data.";
                }
                else
                {
                    RetVal = data;
                }
            },
            error: function (jqXHR, textStatus, errorThrown)
            {
                alert("AjaxError: " + errorThrown + ", Status: " + textStatus)
            }
        });
        return RetVal;
    };

}

//Instantiate An Object for the class
GlbServer = new ClsDataAdapter();

