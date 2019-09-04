<?php
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

    //Array of Global Queries - Note this is an associative array of named queries 
    $Queries = array
    (
		//SHOW CREATE TABLE tablename
	
		//Manage Users
        "DASelectGender" =>
            "SELECT
                Id,
                Name
             FROM
                Gender",
                
		"DASampleSelect" => 
			"SELECT 
				S.*,
                DATE_FORMAT(S.DateOfBirth, '%d/%m/%Y') AS DOB,
                DATE_FORMAT(S.TimeOfBirth, '%H:%i') AS TOB,
                (SELECT Name FROM Gender AS G  WHERE G.Id = GenderId) AS GenderName
			FROM 
				Sample AS S
			WHERE 
				S.Id = '%%Param1%%'",
		
		"DASampleDelete" => 
			"UPDATE 
				Sample 
            SET 
                IsDeleted = 1, 
				IsSynched = 0, 
				ModifiedOn = GetIst(),
				ModifiedBy = '%%Param0%%'
			WHERE 
				Id = '%%Param1%%'",

		"DASampleInsert" => 
            "INSERT INTO 
                Sample 
                (Name, UserId, Password, Mobile, Email, DateOfBirth, TimeOfBirth, GenderId, IsDeleted, IsSynched, ModifiedOn, ModifiedBy) 
            VALUES 
                ('%%Param1%%', '%%Param2%%', '%%Param3%%', '%%Param4%%', '%%Param5%%', '%%Param6%%', '%%Param7%%', '%%Param8%%', '%%Param9%%', 0, GetIst(), '%%Param0%%')",

		"DASampleUpdate" => 
			"UPDATE 
				Sample 
			SET 
				Name = '%%Param1%%',
				UserId = '%%Param2%%',
				Password = '%%Param3%%',
				Mobile = '%%Param4%%',
				Email = '%%Param5%%',
                DateOfBirth = '%%Param6%%',
                TimeOfBirth = '%%Param7%%',
                GenderId = '%%Param8%%',
				IsDeleted = '%%Param9%%',
				IsSynched = 0,
				ModifiedOn = GetIst(),
				ModifiedBy = '%%Param0%%'
			WHERE
                Id = '%%Param10%%'",
    
        "DASampleSelectAll" => 
			"SELECT 
				* 
			FROM 
				Sample 
			WHERE 
				Name LIKE '%%%Param1%%%'",
                
        //Manage Tags
        "DATagSelectAll" => 
		    "SELECT 
                * 
            FROM 
                devicetag 
            WHERE 
                Name LIKE '%%%Param1%%%'
			ORDER BY 
				Tag",
				
		"DATagSelect" => 
			"SELECT 
				*,
				TagType AS TagType_Id,
				TagType AS TagType_Name
			FROM 
				devicetag 
			WHERE 
				Id = '%%Param1%%'",
				
		"DATagSelectByTag" => 
			"SELECT 
				*
			FROM 
				devicetag 
			WHERE 
				Tag = '%%Param1%%'",
		
		"DATagDelete" => 
			"UPDATE 
				devicetag 
            SET 
                IsDeleted = 1, 
				ModifiedOn = GetIst(), 
				ModifiedBy = '%%Param0%%', 
				IsSynched = 0 
			WHERE 
				Id = '%%Param1%%'",

		"DATagInsert" => 
            "INSERT INTO devicetag 
                (Tag, Name, GroupId, Location, TagType, Units, Latitude, Longitude, Icon, Validate, MinVal, MaxVal, NomLowValue, NomHighValue, ScaleOffset, ScaleFactor, AllowNegative, OwnerId, AlertEmailsTo, Description, ModifiedOn, ModifiedBy, IsSynched, IsDeleted) 
            VALUES 
                ('%%Param1%%', '%%Param2%%', '%%Param3%%', '%%Param4%%', '%%Param5%%', '%%Param6%%', '%%Param7%%', '%%Param8%%', '%%Param9%%', '%%Param10%%', '%%Param11%%', '%%Param12%%', '%%Param13%%', '%%Param14%%', '%%Param15%%', '%%Param16%%', '%%Param17%%', '%%Param18%%', '%%Param19%%', '%%Param20%%', GetIst(), '%%Param0%%', 0, 0)",

		"DATagUpdate" => 
			"UPDATE 
				devicetag 
			SET 
				Tag = '%%Param1%%', 
				Name = '%%Param2%%', 
				GroupId = '%%Param3%%', 
				Location = '%%Param4%%',
				TagType = '%%Param5%%', 
				Units = '%%Param6%%', 
				Latitude = '%%Param7%%', 
				Longitude = '%%Param8%%', 
				Icon = '%%Param9%%', 
				Validate = '%%Param10%%', 
				MinVal = '%%Param11%%', 
				MaxVal = '%%Param12%%',				
				NomLowValue = '%%Param13%%', 
				NomHighValue = '%%Param14%%',				
				ScaleOffset = '%%Param15%%', 
				ScaleFactor = '%%Param16%%',				
				AllowNegative = '%%Param17%%',				
				OwnerId = '%%Param18%%', 
				AlertEmailsTo = '%%Param19%%', 
				Description = '%%Param20%%', 
				ModifiedOn = GetIst(), 
				ModifiedBy = '%%Param0%%', 
				IsSynched = 0, 
				IsDeleted = '%%Param21%%'
			WHERE 
                Id = '%%Param22%%'",

				
				
				
        //Manage Logs
        "DALogSelectAll" => 
		    "SELECT 
                * 
            FROM 
                devicelog 
			WHERE 
				Id LIKE '%%%Param1%%%'
				AND EventDate LIKE '%%%Param2%%%'
				AND Tag LIKE '%%%Param3%%%'
			ORDER BY 
				Id 
			LIMIT 100",

		"DALogSelect" => 
			"SELECT 
				*
			FROM 
				devicelog 
			WHERE 
				Id = '%%Param1%%'",
		
		"DALogDelete" => 
			"UPDATE 
				devicelog
            SET 
                IsDeleted = 1, 
				ModifiedOn = GetIst(), 
				ModifiedBy = '%%Param0%%', 
				IsSynched = 0 
			WHERE 
				Id = '%%Param1%%'",

		"DALogInsert" => 
            "INSERT INTO devicetag
				(EventDate, Tag, Value, Description, ModifiedOn, ModifiedBy, IsSynched, IsDeleted)
            VALUES 
                ('%%Param1%%', '%%Param2%%', '%%Param3%%', '%%Param4%%', GetIst(), '%%Param0%%', 0, 0)",

		"DALogUpdate" => 
			"UPDATE 
				devicetag
			SET 
				EventDate = '%%Param1%%', 
				Tag = '%%Param2%%', 
				Value = '%%Param3%%', 
				Description = '%%Param4%%', 
				ModifiedOn = GetIst(), 
				ModifiedBy = '%%Param0%%', 
				IsSynched = 0, 
				IsDeleted = '%%Param5%%'
			WHERE 
                Id = '%%Param6%%'",


        //Manage Users
		"DAUserSelect" => 
			"SELECT 
				*
			FROM 
				uniteusers
			WHERE 
				Id = '%%Param1%%'",
		
		"DAUserDelete" => 
			"UPDATE 
				uniteusers
            SET 
                IsDeleted = 1, 
				ModifiedOn = GetIst(), 
				ModifiedBy = '%%Param0%%', 
				IsSynched = 0 
			WHERE 
				Id = '%%Param1%%'",

		"DAUserInsert" => 
            "INSERT INTO uniteusers
                (Name, UserId, Password, Mobile, Email, ModifiedOn, ModifiedBy, IsSynched, IsDeleted) 
            VALUES 
                ('%%Param1%%', '%%Param2%%', '%%Param3%%', '%%Param4%%', '%%Param5%%', GetIst(), '%%Param0%%', 0, 0)",

		"DAUserUpdate" => 
			"UPDATE 
				uniteusers
			SET 
				Name = '%%Param1%%', 
				UserId = '%%Param2%%', 
				Password = '%%Param3%%', 
				Mobile = '%%Param4%%', 
				Email = '%%Param5%%',
				ModifiedOn = GetIst(), 
				ModifiedBy = '%%Param0%%', 
				IsSynched = 0, 
				IsDeleted = '%%Param6%%'
			WHERE 
                Id = '%%Param7%%'",
    
        "DAUserSelectAll" => 
			"SELECT 
				* 
			FROM 
				uniteusers 
			WHERE 
				Name	LIKE '%%%Param1%%%'",
                
		"DAValidateUser" => 
            "SELECT 
                UserId, 
                Password, 
                Name 
            FROM 
                uniteusers
            WHERE 
                UserId = '%%Param1%%' 
                AND Password = '%%Param2%%'
                AND NOT IsDeleted",

		"DADeviceTagSelectAllCache" => 
		    "SELECT 
                Tag AS Id,
				TagType,
			    CONCAT(Name, ', ', Location) AS Name,
				GroupId,
				Location,
				Units,
				Latitude,
				Longitude,
				Icon,
				Validate,
				MinVal,
				MaxVal,
				NomLowValue,
				NomHighValue,
				ScaleOffset,
				ScaleFactor,
				AllowNegative,
				OwnerId,
				AlertEmailsTo,
				Description,
				ModifiedOn,
				ModifiedBy,
				IsSynched,
				IsDeleted
		    FROM 
			    devicetag
		    WHERE 
                NOT IsDeleted
		    ORDER BY 
			    Name",
                
		"DADeviceTagSelectAllForList" => 
		    "SELECT 
                Tag AS Id, 
			    Name
		    FROM 
			    devicetag
		    WHERE 
                TagType = '%%Param1%%'
                AND NOT IsDeleted
		    ORDER BY 
			    Id",
			
		//Log Functions
		"DADeviceLastReading" => 
		    "SELECT
                *
		    FROM 
			    devicelog
		    WHERE 
                Tag = '%%Param1%%'
		    ORDER BY 
			    EventDate DESC
			LIMIT 1",
		
		"DADeviceLogInsert" => 
            "INSERT INTO 
                devicelog
                (EventDate, DeviceTagId, Value, Description, ModifiedOn, Modfiedby, IsSynched) 
            VALUES 
                (GetIst(), '%%Param1%%', '%%Param2%%', '%%Param3%%', GetIst(), '%%Param4%%', 1)",
		
		"DADeviceLogSelectRange" => 
            "SELECT 
			    DATE_FORMAT(DL.EventDate, '%m/%d %H:%i') AS At, 
			    DT.Name AS Tag, 
			    DL.Value AS Value, 
			    DL.Description AS Details 
		    FROM 
			    devicelog AS DL, 
			    devicetag AS DT 
		    WHERE  
			    DL.Tag = DT.Tag
			    AND DT.OwnerId = '%%Param1%%' 
			    AND DL.EventDate >= '%%Param2%%' 
			    AND DL.EventDate <= '%%Param3%%' 
		    ORDER BY 
                DL.EventDate DESC, 
                DL.Id DESC
		    LIMIT 500",
            
        "DASelectDeviceComparativeDataUL" =>
        "SELECT
			DATE_FORMAT(EventDate, '%d/%m %H:%i') AS At,
			L.Tag,
			L.Value AS `Values`
		FROM 
			devicelog AS L, devicetag AS T
		WHERE 
			L.Tag = T.Tag
			AND DATE(L.EventDate) = '%%Param1%%'
            AND L.Tag = '%%Param2%%'
			AND EventDate < GetIst()
            AND NOT L.IsDeleted
		ORDER BY 
			L.EventDate",
            
        "DASelectDeviceComparativeData" =>
        "SELECT 
	        DATE_FORMAT(EventDate, '%d/%m %H:%i') AS At,
	        MAX(Values1) AS Values1,
	        MAX(Values2) AS Values2,
	        MAX(Values3) AS Values3,
	        MAX(Values4) AS Values4,
	        MAX(Values5) AS Values5,
	        MAX(Values6) AS Values6,
	        MAX(Values7) AS Values7,
	        MAX(Values8) AS Values8,
	        MAX(Values9) AS Values9,
	        MAX(Values10) AS Values10
        FROM   
	        (
		        SELECT
			        RoundTime(EventDate, 1800) AS EventDate,
			        Tag,
			        CASE WHEN Tag = 'DE00001' THEN Value ELSE '' END AS Values0,
			        CASE WHEN Tag = '%%Param3%%' THEN Value ELSE '' END AS Values1,
			        CASE WHEN Tag = '%%Param4%%' THEN Value ELSE '' END AS Values2,
			        CASE WHEN Tag = '%%Param5%%' THEN Value ELSE '' END AS Values3,
			        CASE WHEN Tag = '%%Param6%%' THEN Value ELSE '' END AS Values4,
			        CASE WHEN Tag = '%%Param7%%' THEN Value ELSE '' END AS Values5,
			        CASE WHEN Tag = '%%Param8%%' THEN Value ELSE '' END AS Values6,
			        CASE WHEN Tag = '%%Param9%%' THEN Value ELSE '' END AS Values7,
			        CASE WHEN Tag = '%%Param10%%' THEN Value ELSE '' END AS Values8,
			        CASE WHEN Tag = '%%Param11%%' THEN Value ELSE '' END AS Values9,
			        CASE WHEN Tag = '%%Param12%%' THEN Value ELSE '' END AS Values10
		        FROM 
			        devicelog
		        WHERE 
			        DATE(EventDate) >= '%%Param1%%'
			        AND DATE(EventDate) <= '%%Param2%%'
                    AND (Description = 'Periodic Read' OR Description = 'PeriodicRead')
                    AND Tag IN ('%%Param3%%', '%%Param4%%', '%%Param5%%', '%%Param6%%', '%%Param7%%', '%%Param8%%', '%%Param9%%', '%%Param10%%', '%%Param11%%', '%%Param12%%')
                    AND NOT IsDeleted
		        ORDER BY 
			        EventDate,
			        Tag
	        ) As TableTemp
        GROUP BY 
	        EventDate
        ORDER BY 
	        EventDate",
		
		"DAGisViewOfDevicesData" =>
        "SELECT
			D.*,
			SUBSTRING_INDEX(SUBSTRING_INDEX(D.DataValues, ',', 1), ',', -1) AS EventDate1,
			SUBSTRING_INDEX(SUBSTRING_INDEX(D.DataValues, ',', 3), ',', -1) AS EventDate2,
			SUBSTRING_INDEX(SUBSTRING_INDEX(D.DataValues, ',', 5), ',', -1) AS EventDate3,
			SUBSTRING_INDEX(SUBSTRING_INDEX(D.DataValues, ',', 2), ',', -1) AS Values1,
			SUBSTRING_INDEX(SUBSTRING_INDEX(D.DataValues, ',', 4), ',', -1) AS Values2,
			SUBSTRING_INDEX(SUBSTRING_INDEX(D.DataValues, ',', 6), ',', -1) AS Values3
		FROM
			(
				SELECT 
					Id, Tag, Name, 
					Location, TagType, Latitude, 
					Longitude, Icon, ScaleOffset, ScaleFactor, AllowNegative, GetThreeRecords(Tag) AS DataValues
				FROM 
					devicetag
				WHERE 
					TagType =  '%%Param1%%'
			) AS D",
			
        "DACountDeviceComparativeData" =>
        "SELECT COUNT(*) AS RecCount 
		FROM (SELECT 
	        DATE_FORMAT(EventDate, '%d/%m %H:%i') AS At,
	        MAX(Values1) AS Values1,
	        MAX(Values2) AS Values2,
	        MAX(Values3) AS Values3,
	        MAX(Values4) AS Values4,
	        MAX(Values5) AS Values5,
	        MAX(Values6) AS Values6,
	        MAX(Values7) AS Values7,
	        MAX(Values8) AS Values8,
	        MAX(Values9) AS Values9,
	        MAX(Values10) AS Values10
        FROM   
	        (
		        SELECT
			        RoundTime(EventDate, 1800) AS EventDate,
			        Tag,
			        CASE WHEN Tag = 'DE00001' THEN Value ELSE '%%Param13%%' END AS Values0,
			        CASE WHEN Tag = '%%Param1%%' THEN Value ELSE '%%Param13%%' END AS Values1,
			        CASE WHEN Tag = '%%Param2%%' THEN Value ELSE '%%Param13%%' END AS Values2,
			        CASE WHEN Tag = '%%Param3%%' THEN Value ELSE '%%Param13%%' END AS Values3,
			        CASE WHEN Tag = '%%Param4%%' THEN Value ELSE '%%Param13%%' END AS Values4,
			        CASE WHEN Tag = '%%Param5%%' THEN Value ELSE '%%Param13%%' END AS Values5,
			        CASE WHEN Tag = '%%Param6%%' THEN Value ELSE '%%Param13%%' END AS Values6,
			        CASE WHEN Tag = '%%Param7%%' THEN Value ELSE '%%Param13%%' END AS Values7,
			        CASE WHEN Tag = '%%Param8%%' THEN Value ELSE '%%Param13%%' END AS Values8,
			        CASE WHEN Tag = '%%Param9%%' THEN Value ELSE '%%Param13%%' END AS Values9,
			        CASE WHEN Tag = '%%Param10%%' THEN Value ELSE '%%Param13%%' END AS Values10
		        FROM 
			        devicelog
		        WHERE 
			        DATE(EventDate) >= '%%Param11%%'
			        AND DATE(EventDate) <= '%%Param12%%'
                    AND (Description = 'Periodic Read' OR Description = 'PeriodicRead')
                    AND Tag IN ('%%Param1%%', '%%Param2%%', '%%Param3%%', '%%Param4%%', '%%Param5%%', '%%Param6%%', '%%Param7%%', '%%Param8%%', '%%Param9%%', '%%Param10%%')
                    AND NOT IsDeleted
		        ORDER BY 
			        EventDate,
			        Tag
	        ) As TableTemp
        GROUP BY 
	        EventDate
        ORDER BY 
	        EventDate
        ) AS A",
                
        "DASelectDeviceComparativeDataForVolume" =>
        "SELECT 
	        EventDate AS At,
	        MAX(Values1) AS Values1,
	        MAX(Values2) AS Values2,
	        MAX(Values3) AS Values3,
	        MAX(Values4) AS Values4,
	        MAX(Values5) AS Values5,
	        MAX(Values6) AS Values6,
	        MAX(Values7) AS Values7,
	        MAX(Values8) AS Values8,
	        MAX(Values9) AS Values9,
	        MAX(Values10) AS Values10
        FROM   
	        (
		        SELECT
			        DATE(EventDate) AS EventDate,
			        Tag,
			        CASE WHEN Tag = '%%Param1%%' THEN Value ELSE '%%Param13%%' END AS Values1,
			        CASE WHEN Tag = '%%Param2%%' THEN Value ELSE '%%Param13%%' END AS Values2,
			        CASE WHEN Tag = '%%Param3%%' THEN Value ELSE '%%Param13%%' END AS Values3,
			        CASE WHEN Tag = '%%Param4%%' THEN Value ELSE '%%Param13%%' END AS Values4,
			        CASE WHEN Tag = '%%Param5%%' THEN Value ELSE '%%Param13%%' END AS Values5,
			        CASE WHEN Tag = '%%Param6%%' THEN Value ELSE '%%Param13%%' END AS Values6,
			        CASE WHEN Tag = '%%Param7%%' THEN Value ELSE '%%Param13%%' END AS Values7,
			        CASE WHEN Tag = '%%Param8%%' THEN Value ELSE '%%Param13%%' END AS Values8,
			        CASE WHEN Tag = '%%Param9%%' THEN Value ELSE '%%Param13%%' END AS Values9,
			        CASE WHEN Tag = '%%Param10%%' THEN Value ELSE '%%Param13%%' END AS Values10
		        FROM 
			        devicelog
		        WHERE 
			        DATE(EventDate) >= '%%Param11%%'
			        AND DATE(EventDate) <= '%%Param12%%'
                    AND (Description = 'Periodic Read' OR Description = 'PeriodicRead')
                    AND Tag IN ('%%Param1%%', '%%Param2%%', '%%Param3%%', '%%Param4%%', '%%Param5%%', '%%Param6%%', '%%Param7%%', '%%Param8%%', '%%Param9%%', '%%Param10%%')
                    AND NOT IsDeleted
		        ORDER BY 
			        EventDate,
			        Tag
	        ) As TableTemp
        GROUP BY 
	        EventDate
        ORDER BY 
	        EventDate
        %%Param14%%",
		
        "DACountDeviceComparativeDataForVolume" =>
        "SELECT COUNT(*) AS RecCount 
		FROM (SELECT 
	        EventDate AS At,
	        MAX(Values1) AS Values1,
	        MAX(Values2) AS Values2,
	        MAX(Values3) AS Values3,
	        MAX(Values4) AS Values4,
	        MAX(Values5) AS Values5,
	        MAX(Values6) AS Values6,
	        MAX(Values7) AS Values7,
	        MAX(Values8) AS Values8,
	        MAX(Values9) AS Values9,
	        MAX(Values10) AS Values10
        FROM   
	        (
		        SELECT
			        DATE(EventDate) AS EventDate,
			        Tag,
			        CASE WHEN Tag = '%%Param1%%' THEN Value ELSE '%%Param13%%' END AS Values1,
			        CASE WHEN Tag = '%%Param2%%' THEN Value ELSE '%%Param13%%' END AS Values2,
			        CASE WHEN Tag = '%%Param3%%' THEN Value ELSE '%%Param13%%' END AS Values3,
			        CASE WHEN Tag = '%%Param4%%' THEN Value ELSE '%%Param13%%' END AS Values4,
			        CASE WHEN Tag = '%%Param5%%' THEN Value ELSE '%%Param13%%' END AS Values5,
			        CASE WHEN Tag = '%%Param6%%' THEN Value ELSE '%%Param13%%' END AS Values6,
			        CASE WHEN Tag = '%%Param7%%' THEN Value ELSE '%%Param13%%' END AS Values7,
			        CASE WHEN Tag = '%%Param8%%' THEN Value ELSE '%%Param13%%' END AS Values8,
			        CASE WHEN Tag = '%%Param9%%' THEN Value ELSE '%%Param13%%' END AS Values9,
			        CASE WHEN Tag = '%%Param10%%' THEN Value ELSE '%%Param13%%' END AS Values10
		        FROM 
			        devicelog
		        WHERE 
			        DATE(EventDate) >= '%%Param11%%'
			        AND DATE(EventDate) <= '%%Param12%%'
                    AND (Description = 'Periodic Read' OR Description = 'PeriodicRead')
                    AND Tag IN ('%%Param1%%', '%%Param2%%', '%%Param3%%', '%%Param4%%', '%%Param5%%', '%%Param6%%', '%%Param7%%', '%%Param8%%', '%%Param9%%', '%%Param10%%')
                    AND NOT IsDeleted
		        ORDER BY 
			        EventDate,
			        Tag
	        ) As TableTemp
        GROUP BY 
	        EventDate
        ORDER BY 
	        EventDate
        ) AS A",

		"DASelectSingleDeviceLog" => 
		    "SELECT 
			    L.Id, 
			    L.Value, 
			    L.Description AS Details, 
			    DE.Name 
		    FROM 
			    DeviceLog AS L,
			    DeviceTag AS DE,
			    (
				    SELECT 
					    Max(Id) AS Id, 
					    DeviceTagId 
				    FROM 
					    devicelog 
				    Group BY 
					    DeviceTagId
			    ) AS I
		    WHERE 
			    L.Id = I.Id
			    AND DE.DeviceId =  '%%Param1%%'
			    AND L.DeviceTagId =  DE.DeviceTagId",
		
        //UI and Logic Queries
		"DADeviceTagTypeSelectAll" => 
		    "SELECT 
			   DISTINCT TagType AS Id, 
			    TagType AS Name
		    FROM 
			    devicetag
            WHERE
                TagType <> ''
                AND NOT IsDeleted
		    ORDER BY 
			    Name",
        		
		"DADateRangeSelect" => 
            "SELECT 
                MIN(EventDate) AS DateRangeFrom, MAX(EventDate) AS DateRangeTo
            FROM
                devicelog", 
        
        //Rest Services
		"DARestSvcDeviceTagSelect" => 
		    "SELECT 
                DE.* 
            FROM 
                device AS DC, 
                devicetag AS DE 
            WHERE 
                DC.DeviceId = DE.DeviceId 
                AND DC.DeviceGroupId IN (%%Param1%%)",
                
		"DARestSvcDeviceGroupUpdate" => 
		    "UPDATE 
                devicegroup
            SET 
                IsSynched = 1 
            WHERE 
                GroupId IN (%%Param1%%)",

		"DAGetDeviceRestSvc" => 
		    "SELECT 
                * 
            FROM 
                device
            WHERE 
                DeviceGroupId IN (%%Param1%%)",

		"DAGetDeviceGroupsRestSvc" => 
		    "SELECT 
                * 
            FROM 
                devicegroup
            WHERE 
                DeviceGroupId IN (%%Param1%%)",

		"DAGetDeviceLogRestSvc" => 
		    "SELECT 
                DL.* 
            FROM 
                devicelog AS DL, 
                devicetag AS DE, 
                device AS DC 
            WHERE 
                DL.IsSynched = 0 
                AND DL.DeviceTagId = DE.DeviceTagId 
                AND DE.DeviceId = DC.DeviceId 
                AND DC.DeviceGroupId IN ('%%Param1%%')",
                
		"DASetDeviceLogRestSvc" => 
		    "UPDATE 
                devicelog
            SET 
                IsSynched = 1 
            WHERE 
                Id IN (%%Param1%%)",

		"DAInsertPressureData" => 
		    "INSERT INTO 
	            devicelog
	            (EventDate, Tag, Value, Description, ModifiedOn, ModifiedBy, IsSynched, IsDeleted)
            VALUES 
	            ('%%Param1%%', '%%Param2%%', '%%Param3%%', 'Periodic Read', GetIst(), '%%Param0%%', '1', '0');",

		"DACreatePressureData" => 
		    "INSERT INTO 
	            devicelognew
	            (EventDate, Tag, Value, Description, ModifiedOn, ModifiedBy, IsSynched, IsDeleted)
            VALUES 
	            ('%%Param1%%', '%%Param2%%', '%%Param3%%', 'Periodic Read', GetIst(), '%%Param0%%', '1', '0');",
		
		"DATagGetLogData" => 
		    "SELECT 
					EventDate,
					DATE_FORMAT(EventDate, '%a %d/%m %H:%i') AS At,
					MAX(Values1) AS Value	
				FROM
					(
						SELECT
							RoundTime(L.EventDate, 1800) AS EventDate,
							L.Tag,
							CASE WHEN L.Tag = 'DE00001' THEN L.Value ELSE 0 END AS Values0
							, CASE WHEN L.Tag = '%%Param1%%' THEN L.Value ELSE 0 END AS Values1
						FROM 
							devicelog20092016 AS L
						WHERE 
							DATE(L.EventDate) = '%%Param2%%'
							AND (L.Description = 'Periodic Read' OR L.Description = 'PeriodicRead')
							AND L.Tag IN ('DE00001', '%%Param1%%')
							AND NOT L.IsDeleted
						ORDER BY 
							L.EventDate,
							L.Tag
					) As TableTemp
				GROUP BY 
					EventDate
				ORDER BY 
					EventDate",

		"DAInsertKhroneFlowData" => 
		    "INSERT INTO 
	            devicelog
	            (EventDate, Tag, Value, Description, ModifiedOn, ModifiedBy, IsSynched, IsDeleted)
            VALUES 
	            (GetIst(), '%%Param1%%', '%%Param2%%', 'Periodic Read', GetIst(), '%%Param0%%', '1', '0');",

        "DAInsertKhroneVolumeData" => 
		    "INSERT INTO 
	            devicelog
	            (EventDate, Tag, Value, Description, ModifiedOn, ModifiedBy, IsSynched, IsDeleted)
            VALUES 
	            ( 
					'%%Param1%%',
					'%%Param2%%', 
					('%%Param3%%' - IFNULL((SELECT Value FROM DeviceLog AS Temp WHERE Tag = '%%Param2%%' ORDER BY EventDate DESC LIMIT 1), 0)),
					'Periodic Read',
					GetIst(),
					'%%Param0%%',
					'1',
					'0');",
					
        "DAInsertDeviceLogRestSvc" => 
		    "INSERT INTO 
                devicelog
                (EventDate, Tag, Value, Description, IsSynched) 
            VALUES 
                %%Param1%%"
    );
?>
