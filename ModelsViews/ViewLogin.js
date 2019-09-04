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

function ClsViewLogin()
{
	var This = this;

	this.Init = function (Params)
	{
		// Default UI management
		UI.MenuHide();
		UI.ShowPageTitleBar(false);

		//Ensure we clear the user id from cache
		Cache.DeleteAll();
		//Cache.Set("UserId", "");
		//Cache.Set("UserName", "");

		// Attach & handle events.
		$(".UtButtonShowPassword").mousedown(function ()
		{
			$(".TextPassword").attr("type", "text");
			return Common.PrvntEvtPropg();
		}).mouseup(function ()
		{
			$(".TextPassword").attr("type", "password");
			return Common.PrvntEvtPropg();
		});

		$(".ButtonForgotPassword").click(function ()
		{


			if (!RetVal.HasError)
			{
				UI.Alert("Info", "A link has been mailed to your official email id to reset your password!");
			}

		});

		$(".ButtonLogIn").click(function ()
		{
			if ($(".TextUserId").val() != "" && $(".TextPassword").val() != "")
			{
				var RetVal = GlbServer.ExecuteQuery("DAValidateUser", $(".TextUserId").val(), $(".TextPassword").val());

				if (!RetVal.HasError)
				{
					if (!RetVal.HasRecords)
					{
						UI.Alert("Error", "Incorrect UserId / Password!");
					}
					else
					{
						Cache.Set("UserId", $(".TextUserId").val());
						Cache.Set("UserName", RetVal.Data[0].Name);
						UI.ShowPageTitleBar(true);
						location.hash = "ViewGraphicalData.html"
					}
				}
			}
			return Common.PrvntEvtPropg();
		});
	}
}

//Instantiate An Object for the class
var ViewLogin = new ClsViewLogin();