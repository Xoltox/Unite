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

function ClsViewGraphicalData()
{
	var This = this;

	this.Initialised = false;
	this.DateCurrent = new ClsDatePicker();
	this.DevicePicker = new ClsCheckListPicker();
	this.LineChart = new ClsLineChart();
	this.SelectedTagId = "";
	this.SelectedTagName = "";
	this.SelectedUnit = "";
	this.SelectedDateCurrent = new Date();
	this.SelectedUnitMulitplier = 1;

	this.Init = function (Params)
	{
		//Set Up the title and menu management
		UI.MenuHide();
		UI.SetPageTitle("Graphical View: [<div class='UtDivAsHLink Units'>" + This.SelectedUnit + "</div>]");

		//Handle Date Range Changes
		This.DateCurrent.Init(".ButtonDateCurrent", "Select Current Date", This.SelectedDateCurrent, true,
		function ()
		{
			This.SelectedDateCurrent = This.DateCurrent.Date;
			This.Populate();
		});

		$(".DatePickerX").datepicker({
			autoclose: true,
			format:  "dd/mm/yyyy"
		});

		$(".DatePickerX").val(This.SelectedDateCurrent.ToString("dd/mm/yyyy"));

		$(".DatePickerX").change(function(){
			This.SelectedDateCurrent = Dt_Str2Date($(".DatePickerX").val(), "/","DMY");
			This.GetRecordCount = true;
			This.Populate();
			return Common.PrvntEvtPropg();
		});

		This.DevicePicker.Data = GlbTableTagTotal;
		This.DevicePicker.SelectedItemId = "";
		This.DevicePicker.SelectedItemName = "";

		//Handle Device Picker Changes
		This.DevicePicker.Init(".ButtonDevice", "SingleSelect", "Select Parameter", GlbTableTagTotal, This.SelectedTagId,
		function (ButtonClicked, SelectedItemId, SelectedItemName)
		{
			if (ButtonClicked == "Ok")
			{
				if (This.SelectedTagId != SelectedItemId)
				{
					This.SelectedTagId = SelectedItemId;
					This.SelectedTagName = SelectedItemName;
					for (var Index = 0; Index < GlbTableTagTotal.length; Index++)
					{
						if (GlbTableTagTotal[Index].Id == This.SelectedTagId)
						{
							This.SelectedUnit = GlbTableTagTotal[Index].Units;
							break;
						}
					}
					$(".Units").html(This.SelectedUnit);
				}
				This.Populate()
			}
		});

		setInterval(
						function ()
						{
							This.Populate();
						}, 10000
					);

		This.Initialised = true;
		This.Populate();
	};

	this.Populate = function ()
	{
		var RetVal;
		var XDataLabels;
		var YDataSeries = [];

		if (!This.Initialised) return;

		//UI.WaitShow("Loading...", function ()
		//{
			// Get actual page wise data
			RetVal = GlbServer.ExecuteQuery("DASelectDeviceComparativeDataUL", This.SelectedDateCurrent.ToString("yyyy-mm-dd"), This.SelectedTagId);
			RetVal.TmplColList = "<td class='DataList' style=''>{{Values1}}</td><td class='DataList' style=''></td>";
			RetVal.TmplHeaderRow = "<tr class='DataList' style='overflow: hidden;white-space: nowrap; text-overflow: ellipsis'><td class='DataListHeader' style='line-height: 10px;'><img src='./images/transparent.gif' style='width:50px; height: 1px;'><br>At</td><td class='DataListHeader' style='line-height: 10px;'><img src='./images/transparent.gif' style='width:100px; height: 1px;' /><br>" + This.SelectedTagName + "</td><td class='DataListHeader' style='width:100%'></td></tr>";

			if (RetVal.Data.length < 1)
			{
				UI.WaitHide();
				$("#ChartCanvas").hide();
				$(".NoDataNotification").show();
				//ToDo: disable the export button
				return;
			}

			$("#ChartCanvas").show();
			$(".NoDataNotification").hide();
			//ToDo: enable the export button

			// Set X-Axis Data
			var XDataLabels = RetVal.Data.map(function (NextRecord)
			{
				return NextRecord.At;
			})
			//XDataLabels = XDataLabels.unique();

			//Set Y-Axis Data
			var TagNames = [];
			TagNames.push(This.SelectedTagName);

			for (var ColIndex = 1; ColIndex <= TagNames.length; ColIndex++)
			{
				var NextDataSeries = RetVal.Data.map(function (NextRecord)
				{
					return NextRecord["Values"];
				});
				YDataSeries.push(NextDataSeries);
			}

			//Render the Graph
			This.LineChart.Render("line", "#ChartCanvas", XDataLabels, YDataSeries, TagNames, "Time",  This.SelectedTagName);
			//UI.WaitHide();
		//});
	};
}

//Instantiate An Object for the class
var ViewGraphicalData = new ClsViewGraphicalData();
