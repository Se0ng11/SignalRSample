(function () {
	$.fn.pqiTable = function (options) {
		var settings = $.extend({
			monitoringReport: [],
			percentageData: [],
            isBlink: false
		}, options);

		if (!settings.isBlink)
		{
            GenerateTimeAndLine(this, settings.monitoringReport, settings.percentageData);
		}
		else
		{
		    MassageData(settings.monitoringReport, 1);
		    MassageData(settings.percentageData, 2);
        }
	}

	function GenerateTimeAndLine(div, monitoringReport, percentageData) {
	    var $div = $(div);
	    $div.find('#main-table').empty();
		var time = 24;
		var th = table = td = row = "";
		var pad = "00";
		var partId = "";

		function Painting(td, color, value, keys) {
			if (j > 1) {
				var refineId = partId + keys.substr(keys.length - 2);

				if (j === 8 || j === 16 || j === 24) {
					td = "<td id=\"" + refineId + "\" class=\"" + color + " rightline\">" + value + "</td>";
				}
				else {
					td = "<td id=\"" + refineId + "\" class=\"" + color + "\">" + value + "</td>";
				}
				if (refineId.length >= 8) {
					partId = "";
				}
			} else {
				if (partId.length >= 5) {
					partId = "";
				}
				td = "<td id=\"\">" + value + "</td>";
				partId += value;
			}
			return td;
		}

		var previous = "";
		for (var i = 0; i <= monitoringReport.length - 1; i++) {
			var temp = monitoringReport[i];
			var keys = Object.keys(temp);

			for (var j = 0; j <= keys.length - 1; j++) {
				var $value = temp["" + keys[j] + ""];
				var pValue = (percentageData.length === 0) ? "" : percentageData[i]["" + keys[j] + ""] || "";
				var percentage = (pValue === 0 || pValue === "") ? "" : (pValue + "%");

				if (parseInt($value, 10) > -1 && parseInt($value, 10) < 10) {
					td += Painting(td, ConvertNumberToColor($value), percentage, keys[j]);
				}
				else {
					td += Painting(td, ConvertNumberToColor($value), $value, keys[j]);
				}
			}

			if (previous === "") {
				previous = monitoringReport[i].Plant;
			}

			if (monitoringReport[i].Plant !== previous) {
				row += "<tr class=\"upperline\">" + td + "</tr>";
				previous = monitoringReport[i].Plant;
			}
			else {
				row += "<tr>" + td + "</tr>";
			}

			td = "";
		}

		for (var i = 0; i < time; i++) {
			th += "<th>" + ('0' + i).slice(-2) + "</th>";
		}

		table = "<table id=\"main-table\"><thead><tr><th></th><th></th>" + th + "</tr></thead><tbody>" + row + "</tbody></table>";

		$('#loader').fadeIn(3000).hide();
		$(div).html(table);
		$('.body-content').fadeIn(3000).show();
		$('.footer').removeClass("display-none");
		IntervalColor($div);

		$('#main-table tbody tr td:nth-child(n+3):not(.green):not(.dormant):not(.black)').pqiPopOver();
	}

	function IntervalColor($div) {
	    function SetIntervalColor($div) {
	        var $table = $div.find('#main-table');
			var $hour = moment().hour();
			var $targetHour = ("0" + $hour).slice(-2);
			$table.find('thead tr th.darkblue:nth(0)').removeClass('darkblue');
			$table.find('thead tr th:contains("' + $targetHour + '")').addClass('darkblue');
		}

	    SetIntervalColor($div);

		setInterval(function () {
		    SetIntervalColor($div);
		}, 5000);
	}

	function MassageData(data, methodType) {
	    var x = data;
	    var nArray = [];

	    if (data.length === 0 || $('#main-table tbody tr').length === 0) {
	        location.reload();
	    }

	    for (var i = 0; i <= data.length - 1; i++) {
	        var key = Object.keys(data[i]);
	        var combine = data[i].Plant + data[i].Line;

	        for (var j = 0; j <= key.length - 1; j++) {
	            var id = "";
	            var status = "";
	            var message = "";
	            if (key[j].substring(0, 1) === "H") {
	                id = combine + key[j].slice(1);
	                status = ConvertNumberToColor(data[i][key[j]]);
	                message = HideNumber(data[i][key[j]]);
	                nArray.push({ id: id, status: status, message: message });
	            }
	        }
	    }

	    $('#main-table').colorblink({
	        array: nArray,
	        methodType: methodType
	    });
	}

	function ConvertNumberToColor(value) {
	    value = value.toString();
	    var color = "";
	    if (value === "1") {
	        color = "green";
	    } else if (value === "0") {
	        color = "dormant";
	    } else if (value === "2") {
	        color = "hotpink";
	    } else if (value === "3") {
	        color = "yellow";
	    } else if (value === "4") {
	        color = "blueviolet";
	    } else if (value === "5") {
	        color = "darkorange";
	    } else if (value === "6") {
	        color = "lightblue";
	    } else if (value === "7") {
	        color = "red";
	    } else {
	        color = "black";
	    }

	    return color;
	}

	function HideNumber(value) {
	    var number = "";
	    var ary = ["0", "1", "2", "3", "4", "5", "6", "7"];

	    if (ary.indexOf(value) > -1) {
	        number = "";
	    } else {
	        number = value;
	    }
	    return number;
	}

}(jQuery));