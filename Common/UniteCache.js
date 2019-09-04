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

//Cookie Based Cache Manager
function ClsCache()
{
	var This = this;
	var PvtCookies = {};                                                                                                                                     

	this.Init = function (GivenVariable)
	{
		//Lets capture all cookies into PvtVariable for fast retruns;
		This.ReadAllCookies();

		if (!This.Get("UserId")) { This.Set("UserId", "") };
		if (!This.Get("UserName")) { This.Set("UserName", "") };
		if (!This.Get("SessionId")) { This.Set("SessionId", "") };
		if (!This.Get("SelectedTagTypeId")) { This.Set("SelectedTagTypeId", "") };
		if (!This.Get("SelectedTagTypeName")) { This.Set("SelectedTagTypeName", "") };
		if (!This.Get("SelectedTagIds")) { This.Set("SelectedTagIds", []) };
		if (!This.Get("SelectedTagNames")) { This.Set("SelectedTagNames", []) };

		// In the case of Dates we will go one step further and see to it that they contain vaid dates
		if (!This.Get("SelectedDateFrom") || !IsValidDate(This.Get("SelectedDateFrom"))) 
		{
			This.Set("SelectedDateFrom", new Date()) 
		};
		if (!This.Get("SelectedDateTo") || !IsValidDate(This.Get("SelectedDateTo"))) 
		{
			This.Set("SelectedDateTo", new Date()) 
		};
		if (!This.Get("SelectedDateCurrent") || !IsValidDate(This.Get("SelectedDateCurrent"))) 
		{
			This.Set("SelectedDateCurrent", new Date()) 
		};

	};

	this.ReadAllCookies = function()
	{
		if (document.cookie)	   //only if exists
		{
			var AllKeysArray = document.cookie.split("; ");
			var KeyValuePair;

			for (var Count = 0; Count < AllKeysArray.length; Count++)
			{
				var Key;
				var Value;

				KeyValuePair = AllKeysArray[Count].split("=");
				Key = unescape(KeyValuePair[0]);
				Value = unescape(KeyValuePair[1]);
				try
				{
					Value = JSON.parse(Value);
					//Because JSON does not have a primitive representation of Date objects 
					//we need this special treatment of converting Date object manually
					if (Key == "SelectedDateFrom")
					{
						Value = new Date(Value);
					};
					if (Key == "SelectedDateTo")
					{
						Value = new Date(Value);
					};
					if (Key == "SelectedDateCurrent")
					{
						Value = new Date(Value);
					};
				}
				catch (ex)
				{
					Value = Value.toString();
				}
				PvtCookies[Key] = Value;
			}
		}
	};

	this.Get = function (GivenVariable)
	{
		//var RetVal = undefined;

		//if (document.cookie)	   //only if exists
		//{
		//	var AllKeysArray = document.cookie.split("; ");
		//	var Key = escape(GivenVariable) + "=";
		//	var KeyLength = Key.length;

		//	for (var Count = 0; Count < AllKeysArray.length; Count++)
		//	{
		//		if (Key == AllKeysArray[Count].substr(0, KeyLength))
		//		{
		//			RetVal = unescape(AllKeysArray[Count].substr(KeyLength, AllKeysArray[Count].length - KeyLength));
		//			RetVal = JSON.parse(RetVal)
		//			break;
		//		}
		//	}
		//}
		//return RetVal;

		return PvtCookies[GivenVariable];
	};

	this.Set = function (GivenVariable, GivenValue)
	{
		if (GivenValue != null && GivenValue != undefined)
		{
			var ExpireDate = new Date();

			ExpireDate.setTime(ExpireDate.getTime() + (10 * 24 * 3600 * 1000));
			document.cookie = GivenVariable + "=" + escape(JSON.stringify(GivenValue)) + "; path=/; expires=" + ExpireDate.toGMTString();
			PvtCookies[GivenVariable] = GivenValue;
		}
	};

	this.Del = function (GivenVariable)
	{
		if (This.Get(GivenVariable))
		{
			document.cookie = GivenVariable + "=; expires=Thu, 01-Jan-70 00:00:01 GMT";
		}
		This.ReadAllCookies();
	};

	this.DeleteAll = function ()
	{
		var cookies = document.cookie.split(";");

		for (var i = 0; i < cookies.length; i++)
		{
			var cookie = cookies[i];
			var eqPos = cookie.indexOf("=");
			var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
			document.cookie = name + "=''";
			document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
		}
		This.ReadAllCookies();
	};

	This.Init();
}

var Cache = new ClsCache();
