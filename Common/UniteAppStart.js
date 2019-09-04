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

// Define all Global Variables 
var GlbServer;
var GlbPopupIndex = 0;
var GlbTableTagTotal = null;
var GlbTableTagType = null;

var View = [];
var TmplMenuList = {};

//Application begins here
$(function ()
{
	var PrefetchViewObjs = [];

	Debug("Page Load Complete");

	// Disable caching of AJAX responses
	$.ajaxSetup({ cache: false });

	// Compile the Menu Template
	TmplMenuList = Handlebars.compile($("#TmplMenuList").html());

	//Bind and Setup some common UI handlers/events
	UI.BindDefaultButton();
	UI.BindMenuButton();
	//UI.BindScreenResize();
	UI.BindHashChange(LoadView);

	//Fetch Common Data to avoid server trips
	Debug("Fetching DB data Started");
	GlbTableTagType = GlbServer.ExecuteQuery("DADeviceTagTypeSelectAll").Data;
	GlbTableTagTotal = GlbServer.ExecuteQuery("DADeviceTagSelectAllCache").Data;
	Debug("Fetching DB data completed")

	//Prefetch All Views into global var for direct access
	Debug("Prefetch Initiated");
	$.each(UI.ViewsToLoad, function (Index, Value)
	{
		PrefetchViewObjs.push(PrefetchView(Value));
	});

	$.when.apply($, PrefetchViewObjs).then(function ()
	{
		Debug("Prefetch Completed")
		UI.WaitHide();
		if (window.location.hash == "")
		{
			window.location.hash = "ViewLogin.html";
		}
		else
		{
			LoadView();
		}
	});
});

function PrefetchView(GivenView)
{
	return $.get("ModelsViews/" + GivenView + ".html", function (RetHtml)
	{
		View[GivenView] = RetHtml
	});
}

function LoadView()
{
	var GivenView = Common.CalledView();

	if (GivenView.Name != "")
	{
		if (Cache.Get("UserId") == "")
		{
			window.location.hash = "ViewLogin.html";
		}
		UI.ShowPageTitleBar(GivenView.Name != "ViewLogin");
		UI.MenuHide();
		UI.UpdateMenu();
		$(".ViewContainer").html(View[GivenView.Name]);
		Debug("New View Loaded - " + GivenView.Name + " - Init Method Called.");
		window[GivenView.Name].Init(GivenView.Params);
	}
}
