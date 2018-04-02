(function () {
	$.fn.pqiTable = function (options) {
		var settings = $.extend({
			monitoringReport: [],
			percentageData: []
		}, options);
		GenerateTimeAndLine(this, settings.monitoringReport, settings.percentageData);
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
		$(div).append(table);
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

}(jQuery));