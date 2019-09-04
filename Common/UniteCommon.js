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

var Common =
{
	ToNum: function (GivenValue)
	{
		return (isNaN(GivenValue) ? 0 : GivenValue)
	},

	ToDash: function (GivenValue)
	{
		return (GivenValue == 0 ? "-" : GivenValue)
	},

	GetComparativeData: function (AllowNegative, SelectedDateCurrent, SelectedTagIds, SelectedTagNames, SelectedUnitMulitplier)
	{
		var RetVal = {};
		var StrIndex = "";
		var TmplHeaderRow = "";
		var TmplColList = "";
		var TagTypeIsVolume = (Cache.Get("SelectedTagTypeId") == "Volume");
		var QryClauMax = "";
		var QryClauCases = "";
		var QryClauIn = "";
		var QryClauDtStart = SelectedDateCurrent.ToString("yyyy-mm-dd");
		var QryClauDtEnd = SelectedDateCurrent.ToString("yyyy-mm-dd");
		var QryName = (TagTypeIsVolume ? "DASelectDeviceComparativeDataForVolume" : "DASelectDeviceComparativeDataUL");
		var TagIds = SelectedTagIds;
		var TagNames = SelectedTagNames;
		var NextValue;
		var Multiplier = SelectedUnitMulitplier;

		//Make Parameter Strings
		TmplHeaderRow = "<tr class='DataList' style='overflow: hidden;white-space: nowrap; text-overflow: ellipsis'>";
		TmplHeaderRow += "<td class='DataListHeader' style='line-height: 10px;'><img src='./images/transparent.gif' style='width:50px; height: 1px;'><br>At</td>";
		for (var Index = 1; Index <= TagIds.length; Index++)
		{
			StrIndex = Index.toString();
			QryClauIn += ", <Apostrophe>" + TagIds[Index - 1] + "<Apostrophe>";
			QryClauMax += ", MAX(Values" + StrIndex + ") AS Values" + StrIndex;
			QryClauCases += ", CASE WHEN L.Tag = <Apostrophe>" + TagIds[Index - 1] + "<Apostrophe>";
			QryClauCases += "THEN ((L.Value * T.ScaleFactor) + T.ScaleOffset) ELSE 0 END AS Values" + StrIndex;
			TmplHeaderRow += "<td class='DataListHeader' style='line-height: 10px;'><img src='./images/transparent.gif' style='width:100px; height: 1px;' /><br>"
			TmplHeaderRow += TagNames[Index - 1] + "</td>";
			TmplColList += "<td class='DataList' style=''>{{Values" + Index + "}}</td>";
		}
		TmplHeaderRow += "<td class='DataListHeader' style='width:100%'></td></tr>";
		TmplColList += "<td class='DataList' style=''></td>";
		RetVal = GlbServer.ExecuteQuery(QryName, QryClauDtStart, QryClauDtEnd, QryClauMax, QryClauCases, QryClauIn);

		if (RetVal.Data.length > 0)
		{
			RetVal.TmplColList = TmplColList;
			RetVal.TmplHeaderRow = TmplHeaderRow;

			//We need to scale and Process Data
			for (RowIndex = (RetVal.Data.length - 1) ; RowIndex >= 0; RowIndex--)
			{
				//Remove Common dates
				//if (RowIndex != 0 && RetVal.Data[RowIndex].At.substr(0, 6) == RetVal.Data[RowIndex-1].At.substr(0, 6))
				//{
				//	RetVal.Data[RowIndex].At = RetVal.Data[RowIndex].At.substr(6, 5);
				//}

				for (var ColIndex = 0; ColIndex < TagIds.length; ColIndex++)
				{
					NextValue = RetVal.Data[RowIndex]["Values" + (ColIndex + 1)];
					if (TagTypeIsVolume)	//Special Processing for Volume Data
					{
						if (RowIndex == 0)
						{
							NextValue = "-";
						}
						else
						{
							PrevValue = RetVal.Data[RowIndex - 1]["Values" + (ColIndex + 1)];
							NextValue = (NextValue - PrevValue);
						}
					}

					//This is scaling of the NextValue and storing it back
					if (!isNaN(NextValue))
					{
						NextValue = Math.round(NextValue * Multiplier).toFixed(2);
						if (AllowNegative && NextValue < 0)
						{
							NextValue = 0;
						}
					}
					NextValue = (isNaN(NextValue) ? 0 : parseFloat(NextValue));
					RetVal.Data[RowIndex]["Values" + (ColIndex + 1)] = NextValue;
				}
			}
		}
		return RetVal;
	},

	ScaleAndProcessDataForGis: function (DataSet)
	{
		for (RowIndex = 0; RowIndex < DataSet.length; RowIndex++)
		{
			DataSet[RowIndex]["DataValues"] = "";
			for (var Count = 1; Count < 4; Count++)
			{
				if (!isNaN(DataSet[RowIndex]["Values" + Count]))
				{
					var NextValue = DataSet[RowIndex]["Values" + Count];
					NextValue = parseFloat(NextValue) * DataSet[RowIndex].ScaleFactor + parseFloat(DataSet[RowIndex].ScaleOffset);
					NextValue = (Math.round(NextValue * 100) / 100).toFixed(2);
					if (DataSet[RowIndex].AllowNegative == 0 && NextValue < 0)
					{
						NextValue = 0;
					}
					DataSet[RowIndex]["DataValues"] += (Count == 1 ? "" : "<br>") + DataSet[RowIndex]["EventDate" + Count] + " - <span style='float:right'>" + NextValue + "</span>";
				}
			}
		}
		return DataSet;
	},

	PrvntEvtPropg: function ()
	{
		//This function ensures that default propagation of click is stopped with the handling of this event
		event.preventDefault();
		return false;
	},

	GetNewPopupId: function ()
	{
		return "Popup" + new Date().getHours() + new Date().getMinutes() + new Date().getSeconds() + new Date().getMilliseconds();
	},

	CalledView: function ()
	{
		var RetVal = { Name: "", Params: "" };
		var URLParts = window.location.hash.slice(1).split("/");

		RetVal.Name = URLParts[0].slice(0, -5);
		try
		{
			RetVal.Params = decodeURI(URLParts[1]);
			RetVal.Params = JSON.parse(RetVal.Params);
		}
		catch (e)
		{
			RetVal.Params = null;
		}
		return RetVal;
	},

	Units:
	{
		//Note: The default has to be the first one!!!
		Speed: [{ Id: "Speed", Name: "Speed", Multiplier: 1 }],
		RPM: [{ Id: "RPM", Name: "RPM", Multiplier: 1 }],
		Current: [{ Id: "A", Name: "A", Multiplier: 1 }],
		PF: [{ Id: "PF", Name: "PF", Multiplier: 1 }],
		Volts: [{ Id: "V", Name: "V", Multiplier: 1 }, { Id: "KV", Name: "KV", Multiplier: 1000 }],
		VoltAmp: [{ Id: "VA", Name: "VA", Multiplier: 1 }, { Id: "KVA", Name: "KVA", Multiplier: 1000 }],
		Power: [{ Id: "W", Name: "W", Multiplier: 1 }, { Id: "KW", Name: "KW", Multiplier: 1000 }, { Id: "MW", Name: "MW", Multiplier: 1000000 }],
		FlowRate: [{ Id: "m3/h", Name: "m3/h", Multiplier: 1 }, { Id: "m3/d", Name: "m3/d", Multiplier: 1 }, { Id: "L/h", Name: "L/h", Multiplier: 1 }, { Id: "L/d", Name: "L/d", Multiplier: 1 }, { Id: "g/h", Name: "g/h", Multiplier: 1 }, { Id: "g/d", Name: "g/d", Multiplier: 1 }],
		Volume: [{ Id: "m3", Name: "m3", Multiplier: 1 }, { Id: "L", Name: "L", Multiplier: 1 }, { Id: "g", Name: "g", Multiplier: 1 }, { Id: "KL", Name: "KL", Multiplier: 1 }, { Id: "ML", Name: "ML", Multiplier: 1 }],
		Pressure: [{ Id: "psi", Name: "psi", Multiplier: 1 }, { Id: "bar", Name: "bar", Multiplier: 10 }, { Id: "kgf/m2", Name: "kgf/m2", Multiplier: 20 }, { Id: "N/m2", Name: "N/m2", Multiplier: 30 }],
		
		GetNewUnits: function(Sender, CallBack)
		{
			var ComboBox = new ClsCheckListPicker();

			ComboBox.Show("Select Unit",
			Common.Units[Cache.Get("SelectedTagTypeId")],
			$(Sender).html(), $(Sender).html(), function (ButtonClicked, RetId, RetName)
			{
				if (ButtonClicked == "Ok")
				{
					$(Sender).html(RetName);
					Cache.Set("SelectedUnit", RetName);
					Cache.Set("SelectedUnitMulitplier", Common.Units.GetMultiplier(Cache.Get("SelectedTagTypeId"), RetName));
					Debug("New Units: " + Cache.Get("SelectedUnit") + " x " + Cache.Get("SelectedUnitMulitplier"));
					if (CallBack)
					{
						CallBack(ButtonClicked, RetId, RetName)
					}
				}
				delete ComboBox;
			});
		},

		GetDefaultUnitName: function (GivenType)
		{
			return Units[GivenType][0].Name;
		},

		GetMultiplier: function (GivenType, GivenUnit)
		{
			for (var Count = 0; Count < Common.Units[GivenType].length; Count++)
			{
				if (Common.Units[GivenType][Count].Name == GivenUnit)
				{
					return Common.Units[GivenType][Count].Multiplier;
				}
			}
			return 1;
		}
	}
};

var Tags =
{
	//Note in the records of GlbTableTagTotal Tag is fetched as Id
	Get: function (GivenTag)
	{
		var RetVal = GlbTableTagTotal.filter(function (NextRecord)
		{
			return NextRecord.Id == GivenTag;
		});

		return (RetVal.length > 0 ? RetVal[0] : { "Id": "", "TagType": "", "Name": "", "GroupId": "", "Location": "", "Units": "", "Latitude": "", "Longitude": "", "Icon": "", "Validate": "", "MinVal": "", "MaxVal": "", "NomLowValue": "", "NomHighValue": "", "ScaleOffset": "", "ScaleFactor": "", "AllowNegative": "", "OwnerId": "", "AlertEmailsTo": "", "Description": "", "ModifiedOn": "", "ModifiedBy": "", "IsSynched": "", "IsDeleted": "" });
	},

	GetByType: function (GivenTagType)
	{
		return GlbTableTagTotal.filter(function (NextRecord)
		{
			return NextRecord.TagType == GivenTagType;
		});
	},

	GetNames: function (GivenTagIds)
	{
		var RetArray = [];
		var Found = false;

		for (IndexTagIds = 0; IndexTagIds < GivenTagIds.length; IndexTagIds++)
		{
			Found = false;
			for (Index = 0; Index < GlbTableTagTotal.length; Index++)
			{
				if (GlbTableTagTotal[Index].Id == GivenTagIds[IndexTagIds])
				{
					RetArray.push(GlbTableTagTotal[Index].Name);
					Found = true;
					break;
				}
			}
			if (!Found)
			{
				RetArray.push("Unknown!");
			}
		}
		return RetArray;
	}
};

// Helper functions and extensions

function GenRegistrationId(GivenName, MaxChars)
{
	var RetVal = "";
	var WordsArray;
	var CharIndex = 0;
	var Index = 0;
	var LoopCount = 0;

	if (GivenName && GivenName !== "")
	{
		WordsArray = GivenName.split(" ");
		$.each()
		while (true)
		{
			RetVal += WordsArray[Index++].substr(CharIndex, 1);
			LoopCount++;
			if (LoopCount == MaxChars)
			{
				return RetVal.toUpperCase() + (Math.floor(10000 + Math.random() * 90000));
			}

			if (Index == WordsArray.length)
			{
				Index = 0;
				CharIndex++;
			}
		}
	}
	return RetVal;
}

Handlebars.registerHelper('ifCond', function (v1, v2, options)
{
	if (v1 === v2)
	{
		return options.fn(this);
	}
	return options.inverse(this);
});

Number.prototype.ToFileSize = function ()
{
	if (this >= 1000000000)
	{
		return (this / 1000000000).toFixed(2) + ' GB';
	}

	if (this >= 1000000)
	{
		return (this / 1000000).toFixed(2) + ' MB';
	}

	return (this / 1000).toFixed(2) + ' KB';
}

String.prototype.Validate = function (AllowBlank, Min, Max, Type)
{
	var AlphaLower = "abcdefghijklmnopqrstuvwxyz0123456789.,~!@#$%^&*()_+`-=,:\"'|\\/ ";
	var AlphaUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,~!@#$%^&*()_+`-=,:\"'|\\/ ";
	var StartIndex = 0;
	var RetVal = this;
	var StringLength;

	RetVal = this.Trim();
	if (RetVal != "")
	{
		StringLength = RetVal.Length;
		StartIndex = 0;
		while (StartIndex < StringLength)
		{
			if (Type.ToLower() == "upper")
			{
				if (AlphaUpper.IndexOf(RetVal.Substring(StartIndex, 1), 0) == -1)
				{
					RetVal = "Invalid Characters, Only UpperCase Allowed";
				}
			}
			else if (Type.ToLower() == "lower")
			{
				if (AlphaLower.IndexOf(RetVal.Substring(StartIndex, 1), 0) == -1)
				{
					RetVal = "Invalid Characters, Only LowerCase Allowed";
				}
			}
			else if ((Type.ToLower() == "Mixed") && ((AlphaUpper + AlphaLower).IndexOf(RetVal.Substring(StartIndex, 1), 0) == -1))
			{
				RetVal = "Invalid Characters";
			}
			StartIndex += 1;
		}
		if ((RetVal.Length < Min) || (RetVal.Length > Max))
		{
			RetVal = "Should be within range " + Min.ToString() + " and " + Max.ToString();
		}
	}
	else if (!AllowBlank)
	{
		RetVal = "Cannot be blank";
	}
	return RetVal;
}

String.prototype.ValidateNumber = function (AllowBlank, Min, Max, Decimals)
{
	var NumberList = "0123456789.";
	var StringAsNumber = 0;
	var StartIndex = 0;
	var RetVal = this;
	var NumberLength = 0;

	RetVal = this.Trim();
	if (RetVal != "")
	{
		NumberLength = RetVal.Length;
		StartIndex = 0;
		while (StartIndex < NumberLength)
		{
			if (NumberList.IndexOf(RetVal.Substring(StartIndex, 1), 0) == -1)
			{
				RetVal = "Invalid Number";
			}
			else if (RetVal.Substring(StartIndex, 1) == ".")
			{
				StringAsNumber += 1;
			}
			StartIndex += 1;
		}
		if (((StringAsNumber > 1) | (StringAsNumber == 1)) && (Decimals == 0))
		{
			RetVal = "Invalid Number";
		}
		if ((RetVal.Length < Min) || (RetVal.Length > Max))
		{
			RetVal = "Should be within range " + Min.ToString() + " and " + Max.ToString();
		}
		if ((StringAsNumber == 1) && (((RetVal.Length - RetVal.IndexOf(".", 0)) - 1) > Decimals))
		{
			RetVal = "Decimal precision should be less than " + Decimals.ToString();
		}
	}
	else if (!AllowBlank)
	{
		RetVal = "Cannot be blank";
	}
	return RetVal;
}

Array.prototype.unique = function ()
{
	return Object.keys(this.reduce(function (r, v)
	{
		return r[v] = 1, r;
	}, {}));
}

//Jquery Extenstions
jQuery.fn.extend(
{
	Center: function ()
	{
		return this.each(function ()
		{
			var This = this;
			$(this).css({
				'margin-top': -($(this).height() / 2),
				'margin-left': -($(this).width() / 2)
			}).show();
		});
	},
	Test1: function ()
	{
		return this.each(function () { this.checked = false; });
	}
});
