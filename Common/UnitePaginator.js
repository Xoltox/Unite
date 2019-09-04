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

function ClsPaginator()
{
	var This = this;
	this.TotalRecords = 0;
	this.PageSize = 100;
	this.PageLast = 0;
	this.PageCurrent = 0;
	this.PageOffest = 0;
	this.CallBackFunction;

	//Paginator.Init(".ButtonPagination", ".PanelPagination", ".ButtonFirst", ".ButtonLast", ".ButtonPrev", ".ButtonNext")
	this.Init = function (ButtonPagination, PanelPagination, ButtonFirst, ButtonLast, ButtonPrev, ButtonNext, TextBoxPage, CallBackFunction)
	{
		This.CallBackFunction = CallBackFunction;

		$(ButtonPagination).click(function ()
		{
			var ButtonPagination = $(this);
			$().css(
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
				if (This.CallBackFunction)
				{
					This.CallBackFunction("Next");
				}
			}
		});
	};

	this.UpdatePaginatorUI = function ()
	{
		$(TextBoxPage).html(This.PageCurrent);
		$(ButtonPagination).html("Pg: " + This.PageCurrent);
	};

	this.SetTotalRecords = function (GivenValue)
	{
		This.TotalRecords = GivenValue;
		This.PageLast = Math.ceil(This.TotalRecords / This.PageSize);
		This.PageCurrent = This.PageLast;
		This.PageOffest = (This.PageCurrent - 1) * This.PageSize;
	}

	this.SetPageSize = function (GivenValue)
	{
		This.PageSize = GivenValue;
		This.PageLast = Math.ceil(This.TotalRecords / This.PageSize);
		This.PageCurrent = This.PageLast;
		This.PageOffest = (This.PageCurrent - 1) * This.PageSize;
	}
}