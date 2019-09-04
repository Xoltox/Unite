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

var UI =
{
	ViewsToLoad:
		[
			"ViewDataList",
			"ViewGraphicalData",
			"ViewLogin",
			"PopupAlert",
			"PopupConfirm",
			"PopupCalendar",
			"PopupCombo",
			"PopupFilter"
		],

	UpdateMenu: function ()
	{
		//ToDo: Develop Menu: for now presume this will be returned in quey [MenuView, MenuTitle, MenuIcon]
		//Also should we have this in cache?
		MenusAllowed =
		[
			{ MenuIcon: "I", MenuTitle: "Graphical View", MenuView: "ViewGraphicalData.html" },
			{ MenuIcon: "q", MenuTitle: "Data View", MenuView: "ViewDataList.html" },
			{ MenuIcon: "x", MenuTitle: "Logout", MenuView: "ViewLogin.html" }
		];
		$(".topcoat-list, .side-nav__list").html(TmplMenuList(MenusAllowed));
	},

	SetPageTitle: function (GivenTitle)
	{
		$(".topcoat-navigation-bar__title").html(GivenTitle);
	},

	ShowPageTitleBar: function (Show)
	{
		if (Show)
		{
			$(".topcoat-navigation-bar").show();
		}
		else
		{
			$(".topcoat-navigation-bar").hide();
		}
	},

	MenuHide: function ()
	{
		$(".side-nav").slideUp(200);
	},

	MenuToggle: function ()
	{
		if ($(".side-nav").is(":visible"))
		{
			$(".side-nav").slideUp(200);
		}
		else
		{
			$(".side-nav").slideDown(200);
		}
	},

	BindDefaultButton: function ()
	{
		$("body").bind("keydown", function (event)
		{
			if ((event.keyCode ? event.keyCode : (event.which ? event.which : event.charCode)) == 13)
			{
				$(".DefaultButton").click();
				return false;
			}
			return true;
		});
	},

	BindScreenResize: function ()
	{
		$(window).resize(function ()
		{
			console.log($(".ViewContainer").height() + ", " + $("body").height() + ", " + ($("body").height() - 160));
			$(".ViewContainer").height(($("body").height() - 160));
			console.log($(".ViewContainer").height() + ", " + $("body").height());
		});
	},

	BindHashChange: function (CallBackFunction)
	{
		$(window).on("hashchange", CallBackFunction);
	},

	BindMenuButton: function ()
	{
		$(".ButtonMenu").click(function ()
		{
			UI.MenuToggle();
		});
	},

	Alert: function (GivenType, GivenText, CallBack)
	{
		var PopupId = Common.GetNewPopupId();
		var AlertTitles = { "Error": "" + " Error!", "Warning": "" + " Alert!", "Info": "" + " Notification" }

		$("body").append("<div id='" + PopupId + "' style='display: block'>" + View["PopupAlert"] + "</div>");
		PopupId = "#" + PopupId;
		$(PopupId + " .UnitePopup").Center();
		$(PopupId + " .AlertIcon").attr("src", "./Images/IconAlert" + GivenType + ".png");
		$(PopupId + " .AlertText").html(GivenText);
		$(PopupId + " .Title").html(AlertTitles[GivenType]);
		$(PopupId + " .ButtonClose, " + PopupId + " .ButtonOk").on("click", function ()
		{
			$(PopupId).remove();
			if (CallBack)
			{
				CallBack();
			}
			return Common.PrvntEvtPropg();
		});
	},

	Confirm: function (GivenText, CallBack)
	{
		var PopupId = Common.GetNewPopupId();

		$("body").append("<div id='" + PopupId + "' style='display: block'>" + View["PopupConfirm"] + "</div>");
		PopupId = "#" + PopupId;
		$(PopupId + " .UnitePopup").Center();
		$(PopupId + " .UtListContainer").html(GivenText);
		$(PopupId + " .ButtonClose, " + PopupId + " .ButtonNo, " + PopupId + " .ButtonYes").on("click", function ()
		{
			var ButtonClicked = "";

			if (this.className.includes("ButtonClose"))
			{
				ButtonClicked = "Close";
			}
			else if (this.className.includes("ButtonNo"))
			{
				ButtonClicked = "No";
			}
			else if (this.className.includes("ButtonYes"))
			{
				ButtonClicked = "Yes";
			}

			$(PopupId).remove();
			if (CallBack)
			{
				CallBack(ButtonClicked);
			}
			return Common.PrvntEvtPropg();
		});
	},

	WaitShow: function (GivenMessage, OnComplete)
	{
		$(".PopupWaitText").html(GivenMessage);
		$("#PopupWait").show(10, function ()
		{
			$("#PopupWait  .UnitePopup").Center();
			if (OnComplete)
			{
				setTimeout(
					OnComplete,
					1000);
			}
		});
	},

	WaitHide: function ()
	{
		$("#PopupWait").hide();
	},
};

function ClsCheckListPicker()
{
	var This = this;

	this.ButtonToBind;;
	this.Mode;
	this.Title;
	this.Data;
	this.CallBack;
	this.SelectedItemIds;
	this.SelectedItemNames;
	this.TmplPopupMain = {};

	//.Init(".ButtonTagType", "SingleSelect", "Select Device Type", GlbTableTagType, "SelectedTagTypeId", "SelectedTagTypeName", FromDateChanged)
	this.Init = function (ButtonToBind, Mode, Title, Data, SelectedItemIds, CallBack)
	{
		This.ButtonToBind = ButtonToBind;
		This.Mode = Mode;
		This.Title = Title;
		This.Data = Data;
		This.SelectedItemIds = SelectedItemIds;
		This.CallBack = CallBack;

		$(ButtonToBind).click(function ()
		{
			var PopupId = Common.GetNewPopupId();

			$("body").append("<div id='" + PopupId + "' style='display: block'>" + View["PopupCombo"] + "</div>");
			PopupId = "#" + PopupId;
			GlbPopupIndex++;

			This.TmplPopupMain = Handlebars.compile($("#TmplPopupMain").html());
			$(PopupId + " .Title").html(This.Title);
			$(PopupId + " .UtListContainer table").html(This.TmplPopupMain(This.Data));
			$(PopupId + " .UniteMask").css("z-index", GlbPopupIndex * 2 + 100)
			$(PopupId + " .UnitePopup").css("z-index", GlbPopupIndex * 2 + 101)
			$(PopupId + " .UtListContainer").css({ "max-height": $(window).height() - 180 });			//Set List Height

			if (This.Mode == "SingleSelect") //Check Uncheck the items that have already been selected
			{
				$(PopupId + " input[data-id='" + This.SelectedItemIds + "']").prop('checked', true);
			}
			else
			{
				$.each(This.SelectedItemIds, function (index, value)
				{
					$(PopupId + " input[data-id='" + value + "']").prop('checked', true);
				})
			}

			$(PopupId + " .UnitePopup").Center(); //Center and show the list

			// Attach & handle events.
			$(PopupId + " .ButtonClose, " + PopupId + " .ButtonOk").on("click", function ()
			{
				var ButtonClicked = "";

				if (this.className.includes("ButtonClose"))
				{
					ButtonClicked = "Close";
				}
				else if (this.className.includes("ButtonOk"))
				{
					ButtonClicked = "Ok";
				}

				GlbPopupIndex--;
				$(PopupId).remove();
				if (This.CallBack)
				{
					This.CallBack(ButtonClicked, This.SelectedItemIds, This.SelectedItemNames);
				}
				return Common.PrvntEvtPropg();
			});

			$(PopupId + " .ClickToSelect").change(function ()
			{
				if (This.Mode == "SingleSelect")
				{
					$(PopupId + " input:checkbox").prop('checked', false);
					$(this).prop('checked', true);
					This.SelectedItemIds = $(this).attr("data-id");
					This.SelectedItemNames = $(this).attr("data-name");
					return Common.PrvntEvtPropg();
				}
				else
				{
					This.SelectedItemIds = [];
					This.SelectedItemNames = [];
					$(PopupId + " input:checked").each(function ()
					{
						This.SelectedItemIds.push($(this).attr("data-id"));
						This.SelectedItemNames.push($(this).attr("data-name"));
					});
					return Common.PrvntEvtPropg();
				}
			});
		});
	};

	this.Show = function (Title, Data, SelectedItemIds, SelectedItemNames, CallBack)
	{
		var PopupId = Common.GetNewPopupId();

		This.Mode = "SingleSelect";
		This.ButtonToBind = "";
		This.Title = Title;
		This.Data = Data;
		This.SelectedItemIds = SelectedItemIds;
		This.SelectedItemNames = SelectedItemNames;
		This.CallBack = CallBack;

		$("body").append("<div id='" + PopupId + "' style='display: block'>" + View["PopupCombo"] + "</div>");
		PopupId = "#" + PopupId;
		GlbPopupIndex++;

		This.TmplPopupMain = Handlebars.compile($("#TmplPopupMain").html());
		$(PopupId + " .Title").html(This.Title);
		$(PopupId + " .UtListContainer table").html(This.TmplPopupMain(This.Data));
		$(PopupId + " .UniteMask").css("z-index", GlbPopupIndex * 2 + 100)
		$(PopupId + " .UnitePopup").css("z-index", GlbPopupIndex * 2 + 101)
		$(PopupId + " .UtListContainer").css({ "max-height": $(window).height() - 180 });			//Set List Height
		$(PopupId + " input[data-id='" + This.SelectedItemIds + "']").prop('checked', true);
		$(PopupId + " .UnitePopup").Center(); //Center and show the list

		// Attach & handle events.
		$(PopupId + " .ButtonClose, " + PopupId + " .ButtonOk").on("click", function ()
		{
			var ButtonClicked = "";

			if (this.className.includes("ButtonClose"))
			{
				ButtonClicked = "Close";
			}
			else if (this.className.includes("ButtonOk"))
			{
				ButtonClicked = "Ok";
			}

			GlbPopupIndex--;
			$(PopupId).remove();
			if (This.CallBack)
			{
				This.CallBack(ButtonClicked, This.SelectedItemIds, This.SelectedItemNames);
			}
			return Common.PrvntEvtPropg();
		});

		$(PopupId + " .ClickToSelect").change(function ()
		{
			if (This.Mode == "SingleSelect")
			{
				$(PopupId + " input:checkbox").prop('checked', false);
				$(this).prop('checked', true);
				This.SelectedItemIds = $(this).attr("data-id");
				This.SelectedItemNames = $(this).attr("data-name");
				return Common.PrvntEvtPropg();
			}
			else
			{
				This.SelectedItemIds = [];
				This.SelectedItemNames = [];
				$(PopupId + " input:checked").each(function ()
				{
					This.SelectedItemIds.push($(this).attr("data-id"));
					This.SelectedItemNames.push($(this).attr("data-name"));
				});
				return Common.PrvntEvtPropg();
			}
		});
	};
}

function ClsLineChart()
{
	var This = this;
	var TheChart = null;

	var randomScalingFactor = function ()
	{
		return Math.round(Math.random() * 100);
		//return 0;
	};
	var randomColorFactor = function ()
	{
		return Math.round(Math.random() * 255);
	};
	var randomColor = function (opacity)
	{
		return 'rgba(' + randomColorFactor() + ',' + randomColorFactor() + ',' + randomColorFactor() + ',' + (opacity || '.3') + ')';
	};

	var SeriesColorSolid = ["rgba(255, 117, 117, 1)", "rgba(213, 104, 253, 1)", "rgba(255, 219, 88, 1)", "rgba(135, 175, 199, 1)", "rgba(75, 254, 120, 1)", "rgba(255, 255, 132, 1)", "rgba(150, 105, 254, 1)", "rgba(249, 167, 176, 1)", "rgba(255, 180, 40, 1)", "rgba(36, 224, 251, 1)"];
	var SeriesColorTrans = ["rgba(255, 117, 117, 0.1)", "rgba(213, 104, 253, 0.1)", "rgba(255, 219, 88, 0.1)", "rgba(135, 175, 199, 0.1)", "rgba(75, 254, 120, 0.1)", "rgba(255, 255, 132, 0.1)", "rgba(150, 105, 254, 0.1)", "rgba(249, 167, 176, 0.1)", "rgba(255, 180, 40, 0.1)", "rgba(36, 224, 251, 0.1)"];

	var ChartConfig =
		{
			type: "line",
			data:
				{
					labels: [],
					datasets: []
				},
			options:
				{
					responsive: true,
					maintainAspectRatio: false,
					tooltips: { mode: "label" },
					hover: { mode: "dataset" },
					legend: { labels: { boxWidth: 18, fontColor: "lightgray", fontSize: 14 } },
					scales:
						{
							display: true,
							xAxes:
							[{
								display: true,
								ticks: { fontColor: "#ddd" },
								scaleLabel:
									{
										display: true,
										labelString: "X-Axis",
										fontColor: "#ddd",
										fontSize: 18
									}
							}],
							yAxes:
							[{
								display: true,
								ticks: { fontColor: "#ddd" },
								scaleLabel:
									{
										display: true,
										labelString: "Y-Axis",
										fontColor: "#ddd",
										fontSize: 18
									}
							}]
						}
				}
		};

	this.Render = function (ChartType, ChartCanvas, DataLabels, DataSeries, TagNames, XTitle, YTitle)
	{
		ChartConfig.data.labels = DataLabels;
		ChartConfig.options.scales.xAxes[0].scaleLabel.labelString = XTitle;
		ChartConfig.options.scales.yAxes[0].scaleLabel.labelString = YTitle;
		ChartConfig.data.datasets = [];

		for (var Count = 0; Count < DataSeries.length; Count++)
		{
			ChartConfig.data.datasets.push
				({
					fontColor: '#ffffff',
					label: TagNames[Count],
					pointBorderColor: 'white',
					borderColor: SeriesColorSolid[Count],
					backgroundColor: SeriesColorTrans[Count],
					data: DataSeries[Count]
				});

		}
		if (TheChart)
		{
			TheChart.destroy();
		}
		TheChart = new Chart($(ChartCanvas).get(0).getContext("2d"), ChartConfig);
	};
};

function ClsDatePicker()
{
	var This = this;

	this.ButtonDate;
	this.Title;
	this.Date = new Date();
	this.TempDate = new Date();
	this.PopupId = "";
	this.CallBackFunction;
	this.MonthName = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	this.DialogView = "PopupCalendar";
	this.ShowNavigator;
	this.ActiveTimer;

	// Common Methods 
	this.Init = function (ButtonDate, Title, StartDate, ShowNavigator, CallBackFunction)
	{
		This.ButtonDate = ButtonDate;
		This.Title = Title;
		This.CallBackFunction = CallBackFunction;
		This.Date = StartDate;
		This.ShowNavigator = ShowNavigator;
		if (!This.Date)
		{
			This.Date = new Date();
		}
		else if (typeof This.Date == "string")
		{
			This.Date = Dt_Str2Date(This.Date, "-", "YMD");
		}

		if (ShowNavigator)
		{
			$(This.ButtonDate + " .ButtonPrevMonth").show();
			$(This.ButtonDate + " .ButtonPrev").show();
			$(This.ButtonDate + " .ButtonNext").show();
			$(This.ButtonDate + " .ButtonNextMonth").show();
		}
		$(This.ButtonDate + " .DateTextHolder").html(This.Date.ToString("dd-mm-yyyy"))

		$(This.ButtonDate).click(function ()
		{
			GlbPopupIndex++;
			This.PopupId = Common.GetNewPopupId();
			$("body").append("<div id='" + This.PopupId + "' style='display: block'>" + View["PopupCalendar.html"] + "</div>");
			This.PopupId = "#" + This.PopupId;
			$(This.PopupId + " .UnitePopup").Center();
			$(This.PopupId + " .Title").html(This.Title);
			$(This.PopupId + " .UniteMask").css("z-index", GlbPopupIndex * 2 + 100)
			$(This.PopupId + " .UnitePopup").css("z-index", GlbPopupIndex * 2 + 101)
			$(This.PopupId + " .UnitePopup").css("z-index", GlbPopupIndex * 2 + 101)
			This.TempDate = This.Date;
			This.RenderDate();

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

			$(This.PopupId + " .ButtonToday").click(function ()
			{
				This.TempDate = new Date();
				This.RenderDate();
				return Common.PrvntEvtPropg();
			});

			$(This.PopupId + " .ClickDecDay").click(function ()
			{
				This.TempDate = This.TempDate.AddDays(-1);
				This.RenderDate();
				return Common.PrvntEvtPropg();
			});

			$(This.PopupId + " .ClickDecMonth").click(function ()
			{
				This.TempDate = This.TempDate.AddMonths(-1)
				This.RenderDate();
				return Common.PrvntEvtPropg();
			});

			$(This.PopupId + " .ClickDecYear").click(function ()
			{
				This.TempDate = This.TempDate.AddYears(-1)
				This.RenderDate();
				return Common.PrvntEvtPropg();
			});

			$(This.PopupId + " .ClickIncDay").click(function ()
			{
				This.TempDate = This.TempDate.AddDays(1)
				This.RenderDate();
				return Common.PrvntEvtPropg();
			});

			$(This.PopupId + " .ClickIncMonth").click(function ()
			{
				This.TempDate = This.TempDate.AddMonths(1)
				This.RenderDate();
				return Common.PrvntEvtPropg();
			});

			$(This.PopupId + " .ClickIncYear").click(function ()
			{
				This.TempDate = This.TempDate.AddYears(1)
				This.RenderDate();
				return Common.PrvntEvtPropg();
			});
		});

		$(This.ButtonDate + " .ButtonPrevMonth").click(function ()
		{
			This.Date.AddMonths(-1);
			This.Return("PrevMonth");
			return Common.PrvntEvtPropg();
		});

		$(This.ButtonDate + " .ButtonNextMonth").click(function ()
		{
			This.Date.AddMonths(1);
			This.Return("NextMonth");
			return Common.PrvntEvtPropg();
		});

		$(This.ButtonDate + " .ButtonPrev").click(function ()
		{
			This.Date.AddDays(-1);
			This.Return("Prev");
			return Common.PrvntEvtPropg();
		});

		$(This.ButtonDate + " .ButtonNext").click(function ()
		{
			This.Date.AddDays(1);
			This.Return("Next");
			return Common.PrvntEvtPropg();
		});
	};

	this.RenderDate = function ()
	{
		$(This.PopupId + " .DateDay").html(This.TempDate.getDate());
		$(This.PopupId + " .DateMonth").html(This.MonthName[This.TempDate.getMonth()]);
		$(This.PopupId + " .DateYear").html(This.TempDate.getFullYear());
	};

	this.Hide = function (ButtonClicked)
	{
		$(This.PopupId).remove();
		GlbPopupIndex--;
		if (ButtonClicked == "Ok")
		{
			This.Date = This.TempDate;
			This.Return(ButtonClicked);
		}
	};

	this.Return = function (ButtonClicked)
	{
		$(This.ButtonDate + " .DateTextHolder").html(This.Date.ToString("dd-mm-yyyy"))

		// in your click function, call clearTimeout
		window.clearTimeout(This.ActiveTimer);

		// then call setTimeout again to reset the timer
		This.ActiveTimer = window.setTimeout(function ()
		{
			if (This.CallBackFunction)
			{
				This.CallBackFunction(ButtonClicked, This.Date, This.Date.ToString("yyyy-mm-dd"));
			}
		}, 400);
	};

	this.SetDate = function (GivenDate)
	{
		This.Date = GivenDate;
		$(This.ButtonDate + " .DateTextHolder").html(This.Date.ToString("dd-mm-yyyy"))
		if (This.CallBackFunction)
		{
			This.CallBackFunction("Ok", This.Date, This.Date.ToString("yyyy-mm-dd"));
		}
	};

	this.GetDate = function ()
	{
		return This.Date;
	};
}

function ClsPaginator()
{
	var This = this;
	this.TotalRecords = 0;
	this.PageSize = 50;
	this.PageLast = 0;
	this.PageCurrent = 0;
	this.PageOffest = 0;
	this.ButtonPagination;
	this.TextBoxPage;
	this.CallBackFunction;

	//Paginator.Init(".ButtonPagination", ".PanelPagination", ".ButtonFirst", ".ButtonLast", ".ButtonPrev", ".ButtonNext")
	this.Init = function (ButtonPagination, PanelPagination, ButtonFirst, ButtonLast, ButtonPrev, ButtonNext, TextBoxPage, CallBackFunction)
	{
		This.ButtonPagination = ButtonPagination;
		This.TextBoxPage = TextBoxPage;
		This.CallBackFunction = CallBackFunction;

		$(ButtonPagination).click(function ()
		{
			var ButtonPagination = $(this);
			$(PanelPagination).css(
			{
				top: ButtonPagination.offset().top + ButtonPagination.outerHeight() + 10,
				left: ButtonPagination.offset().left + ButtonPagination.width() - 209
			})
			$(PanelPagination).toggle();
		});

		$(ButtonFirst).click(function ()
		{
			if (This.PageCurrent != 1)
			{
				This.PageCurrent = 1;
				This.PageOffest = (This.PageCurrent - 1) * This.PageSize;
				This.UpdatePaginatorUI();
				if (This.CallBackFunction)
				{
					This.CallBackFunction("First");
				}
			}
		});

		$(ButtonLast).click(function ()
		{
			if (This.PageCurrent != This.PageLast)
			{
				This.PageCurrent = This.PageLast;
				This.PageOffest = (This.PageCurrent - 1) * This.PageSize;
				This.UpdatePaginatorUI();
				if (This.CallBackFunction)
				{
					This.CallBackFunction("Last");
				}
			}
		});

		$(ButtonPrev).click(function ()
		{
			if (This.PageCurrent != 1)
			{
				This.PageCurrent--;
				This.PageOffest = (This.PageCurrent - 1) * This.PageSize;
				This.UpdatePaginatorUI();
				if (This.CallBackFunction)
				{
					This.CallBackFunction("Prev");
				}
			}
		});

		$(ButtonNext).click(function ()
		{
			if (This.PageCurrent != This.PageLast)
			{
				This.PageCurrent++;
				This.PageOffest = (This.PageCurrent - 1) * This.PageSize;
				This.UpdatePaginatorUI();
				if (This.CallBackFunction)
				{
					This.CallBackFunction("Next");
				}
			}
		});
	};

	this.UpdatePaginatorUI = function ()
	{
		$(This.TextBoxPage).html(This.PageCurrent);
		$(This.ButtonPagination).html(This.PageCurrent);
	};

	this.SetTotalRecords = function (GivenValue)
	{
		This.TotalRecords = GivenValue;
		This.PageLast = Math.ceil(This.TotalRecords / This.PageSize);
		This.PageCurrent = This.PageLast;
		This.PageOffest = (This.PageCurrent - 1) * This.PageSize;
		This.UpdatePaginatorUI();
	}

	this.SetPageSize = function (GivenValue)
	{
		This.PageSize = GivenValue;
		This.PageLast = Math.ceil(This.TotalRecords / This.PageSize);
		This.PageCurrent = This.PageLast;
		This.PageOffest = (This.PageCurrent - 1) * This.PageSize;
		This.UpdatePaginatorUI();
	}
}


