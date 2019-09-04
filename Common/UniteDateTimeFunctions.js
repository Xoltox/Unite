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

//Common Date/Time Extensions
Date.prototype.IsValid = function ()
{
	// An invalid date object returns NaN for getTime() and NaN is the only
	// object not strictly equal to itself.
	return this.getTime() === this.getTime();
};

Date.prototype.DaysInMonth = function ()
{
	return new Date(this.getFullYear(), this.getMonth() + 1, 0).getDate();
};

Date.prototype.ToString = function (Format)
{
	var MonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	var DayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
	var RetVal = Format;
	var strFullYear = this.getFullYear().toString();
	var strYear = strFullYear.substr(2, 2);
	var strMonth = ((this.getMonth() + 1) < 10 ? "0" : "") + (this.getMonth() + 1);
	var strDate = (this.getDate() < 10 ? "0" : "") + this.getDate();
	var strMonthName = MonthNames[this.getMonth()];
	var strDayName = DayNames[this.getDay()];

	RetVal = RetVal.replace(/yyyy/g, strFullYear);
	RetVal = RetVal.replace(/yy/g, strYear);
	RetVal = RetVal.replace(/mmm/g, strMonthName);
	RetVal = RetVal.replace(/mm/g, strMonth);
	RetVal = RetVal.replace(/ddd/g, strDayName);
	RetVal = RetVal.replace(/dd/g, strDate);
	return RetVal;
};

Date.prototype.AddDays = function(Days)
{
	return new Date(this.setDate(this.getDate() + Days));
}

Date.prototype.AddMonths = function(Months)
{
	return new Date(this.setMonth(this.getMonth() + Months));
};

Date.prototype.AddYears = function(Years)
{
	return new Date(this.setYear(this.getFullYear() + Years));
}

Date.prototype.SecondsElapsed = function ()
{
	return this.getMinutes() * 60 + this.getSeconds() + this.getMilliseconds() / 1000;
};

Date.prototype.GetNetMills = function ()
{
	return this.getTime();
}

//Common other Date/Time Functions
function GetRandomDate(DtFrom, DtTo)
{
	var RandDtDiff = Math.ceil(Math.abs(DtFrom.getTime() - DtTo.getTime()) * Math.random() / (1000 * 3600 * 24));
	var DtNew = DtFrom;

	DtNew.setDate(DtNew.getDate() + RandDtDiff);
	return DtNew;
}

function Dt_Str2Date(GivenDateString, Seperator, Format)
{
	var MonthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
	var SplitString = [];
	var intFullYear;
	var intMonth;
	var intDate;
	var RetDate;

	try
	{
		if (Seperator)
		{
			SplitString = GivenDateString.split(Seperator);
		}
		else
		{
			SplitString[0] = GivenDateString.substr(0, 4);
			SplitString[1] = GivenDateString.substr(4, 2);
			SplitString[2] = GivenDateString.substr(6, 2);
		}

		if (Format == "DMY")
		{
			intFullYear = parseInt(SplitString[2], 10);
			intMonth = parseInt(SplitString[1], 10);
			intDate = parseInt(SplitString[0], 10);
		}
		else if (Format == "DYM")
		{
			intFullYear = parseInt(SplitString[1], 10);
			intMonth = parseInt(SplitString[2], 10);
			intDate = parseInt(SplitString[0], 10);
		}
		else if (Format == "MDY")
		{
			intFullYear = parseInt(SplitString[2], 10);
			intMonth = parseInt(SplitString[0], 10);
			intDate = parseInt(SplitString[1], 10);
		}
		else if (Format == "MYD")
		{
			intFullYear = parseInt(SplitString[1], 10);
			intMonth = parseInt(SplitString[0], 10);
			intDate = parseInt(SplitString[2], 10);
		}
		else if (Format == "YDM")
		{
			intFullYear = parseInt(SplitString[0], 10);
			intMonth = parseInt(SplitString[2], 10);
			intDate = parseInt(SplitString[1], 10);
		}
		else if (Format == "MMMY")
		{
			intFullYear = parseInt(SplitString[1], 10);
			intMonth = MonthNames.indexOf(SplitString[0]) + 1;
			intDate = 1;
		}
		else
		{
			intFullYear = parseInt(SplitString[0], 10);
			intMonth = parseInt(SplitString[1], 10);
			intDate = parseInt(SplitString[2], 10);
		}
		RetDate = new Date(intFullYear, (intMonth - 1), intDate);
		if (!RetDate.IsValid())
		{
			RetDate = new Date();
		}
		return RetDate;
	}
	catch (ex)
	{
		return (new Date());
	}
}

function TimeStamp(DateString)
{
	return new Date(DateString).getTime();
}

function IsValidDate(GivenValue)
{
	if (Object.prototype.toString.call(GivenValue) === "[object Date]")
	{
		return (GivenValue.getTime() === GivenValue.getTime());
	}
	return false;
}

function Tm_HHMM2Date(GivenTimeString, Seperator)
{
    var SplitString;
    try
    {
        var RetVal = new Date();
        if (Seperator)
        {
            SplitString = GivenDateString.split(Seperator);
        }
        else
        {
            SplitString[0] = GivenDateString.substr(0, 2);
            SplitString[1] = GivenDateString.substr(2, 2);
        }
        return (new Date(RetVal.getFullYear(), RetVal.getMonth(), RetVal.getDate(), SplitString[0], SplitString[1]));
    }
    catch (ex)
    {
        return (new Date());
    }
}

function Tm_Date2HHMM(GivenDate, Seperator)
{
    var RetVal = "";
    RetVal += (GivenDate.getHours() < 10 ? "0" : "") + GivenDate.getHours();
    RetVal += (Seperator ? Seperator : "");
    RetVal += ((GivenDate.getMinutes() + 1) < 10 ? "0" : "") + GivenDate.getMinutes();
    return RetVal;
}
