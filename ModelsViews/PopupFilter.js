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

function ClsPopupFilter()
{
	var This = this;

	this.DialogView = "PopupFilter";
	this.PopupId = "";
	this.Initialised = false;
	this.TmplTag = null;
	this.TmplType = null;
	this.DateRangeFrom = new Date().AddDays(-1).ToString("yyyy-mm-dd");
	this.DateRangeTo = new Date().ToString("yyyy-mm-dd");
	this.SelectedTagTypeId = "";
	this.SelectedTagTypeName = "";
	this.SelectedTagId = [];
	this.SelectedTagName = [];
	this.MaxSelection = 10;
	this.MinSelection = 1;
	this.CallBackFunction;

	this.Init = function (PopupId, SelectedTagTypeId, SelectedTagId, DateRangeFrom, DateRangeTo, CallBackFunction)
	{
		var RetVal;
		var $TmplTagType = $(PopupId + " #TmplType");
		var $TmplTag = $(PopupId + " #TmplTag");
		var $DivTagType = $(PopupId + " .UtListContainer div.TmplTypeHolder");
		var $DivTag = $(PopupId + " .UtListContainer div.TmplTagHolder");
		var $CheckBoxesTagType;
		var $CheckBoxesTag;

		This.PopupId = PopupId;
		This.SelectedTagTypeId = (SelectedTagTypeId ? SelectedTagTypeId : This.SelectedTagTypeId);
		This.SelectedTagId = (SelectedTagId ? SelectedTagId : This.SelectedTagId);
		This.DateRangeFrom = (DateRangeFrom ? DateRangeFrom : This.DateRangeFrom);
		This.DateRangeTo = (DateRangeTo ? DateRangeTo : This.DateRangeTo);
		This.CallBackFunction = CallBackFunction;

		//Setup Checklists and their events handling
		//1. Load the templates
		This.TmplTag = Handlebars.compile($TmplTag.html());
		This.TmplTagType = Handlebars.compile($TmplTagType.html());

		//2. Poulate all Tag Type List
		//RetVal = GlbServer.ExecuteQuery("DADeviceTagTypeSelectAll");
		$DivTagType.html(This.TmplTagType(GlbTableTagType));

		$CheckBoxesTagType = $(PopupId + " .ClickTagTypeToSelect");

		//3. Add a Handle for TagType Selection after removing any previous handlers
		$CheckBoxesTagType.unbind().change(function ()
		{
			$CheckBoxesTagType.prop('checked', false);
			$(this).prop('checked', true);

			This.SelectedTagTypeId = $(this).attr("data-id");
			This.SelectedTagTypeName = $(this).attr("data-name");

			//At the change of the TagType change the list of tags possible
			//RetVal = GlbServer.ExecuteQuery("DADeviceTagSelectAllForList", This.SelectedTagTypeId);
			$DivTag.html(This.TmplTag(Tags.GetByType(This.SelectedTagTypeId)));

			// Add a handler for the Tag/Tag selection after removing any previous handlers
			This.AddTagClickHandler();
			This.SelectedTagId = [];
			This.SelectedTagName = [];
			$CheckBoxesTag = $(This.PopupId + " .ClickTagToSelect")
			$CheckBoxesTag.prop('checked', false);
			$($CheckBoxesTag[0]).change();

		});

		//4. Clear all the Tag Type Checkboxes and select either the first or the passed one this will happen only the first time.
		$CheckBoxesTagType.prop('checked', false);
		if (This.SelectedTagTypeId == "")
		{
			$($(This.PopupId + " .ClickTagTypeToSelect")[1]).change();
		}
		else
		{
			//Special Treatment if the popup is being opened with some selections
			$CheckBoxesTagType.prop('checked', false);
			$CheckBoxesTagType.filter("[data-id='" + This.SelectedTagTypeId + "']").prop('checked', true);
			This.SelectedTagTypeName = $CheckBoxesTagType.filter("[data-id='" + This.SelectedTagTypeId + "']").attr("data-name");

			//Populate the list of tags possible
			//RetVal = GlbServer.ExecuteQuery("DADeviceTagSelectAllForList", This.SelectedTagTypeId);
			$DivTag.html(This.TmplTag(Tags.GetByType(This.SelectedTagTypeId)));

			$CheckBoxesTag = $(This.PopupId + " .ClickTagToSelect");
			for (var Count = 0; Count < This.SelectedTagId.length; Count++)
			{
				$CheckBoxesTag.filter("[data-id='" + This.SelectedTagId[Count] + "']").prop('checked', true);
				This.SelectedTagName[Count] = $CheckBoxesTag.filter("[data-id='" + This.SelectedTagId[Count] + "']").attr("data-name");
			}

			// Add a handler for the Tag/Tag selection after removing any previous handlers
			This.AddTagClickHandler();
		}

		EnableDateRangeSelectionSlideHandler(This, "#DateRangeFilterSlider", "vertical");

		//Now setup the UI and show the Popup 
		GlbPopupIndex++;
		$(This.PopupId).attr("z-index", GlbPopupIndex * 2);
		$(This.PopupId + " .UniteMask").css("z-index", GlbPopupIndex * 2 + 100)
		$(This.PopupId + " .UnitePopup").css("z-index", GlbPopupIndex * 2 + 101)

		//Set List Height
		$(This.PopupId + " .UtListContainer").css({
			'max-height': $(window).height() - 180
		});
		$(This.PopupId + " .UnitePopup").Center();

		// Attach & handle events.
		$(This.PopupId + " .ButtonClose").click(function ()
		{
			This.Hide("Close");
			return Common.PrvntEvtPropg();
		});

		$(This.PopupId + " .ButtonOk").click(function ()
		{
			This.Hide("Ok");
			return Common.PrvntEvtPropg();
		});
	};

	this.AddTagClickHandler = function ()
	{
		$(This.PopupId + " .ClickTagToSelect").unbind().change(function ()
		{
			if (This.SelectedTagId.length >= This.MaxSelection)
			{
				$(this).prop("checked", false);
			}
			if (This.SelectedTagId.length <= This.MinSelection)
			{
				$(this).prop("checked", true);
			}

			This.SelectedTagId = [];
			This.SelectedTagName = [];

			$(This.PopupId + " .ClickTagToSelect").filter(":checked").each(function ()
			{
				This.SelectedTagId.push($(this).attr("data-id"));
				This.SelectedTagName.push($(this).attr("data-name"));
			});
		});
	};

	this.Hide = function (ButtonClicked)
	{
		$(This.PopupId).remove();
		GlbPopupIndex--;
		if (This.CallBackFunction)
		{
			This.CallBackFunction(ButtonClicked, This.SelectedTagTypeId, This.SelectedTagTypeName, This.SelectedTagId, This.SelectedTagName, This.DateRangeFrom, This.DateRangeTo);
		}
	};

}


//Instantiate An Object for the class
var PopupFilter = new ClsPopupFilter();
