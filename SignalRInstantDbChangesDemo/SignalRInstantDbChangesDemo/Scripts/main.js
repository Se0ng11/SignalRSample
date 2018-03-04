var isBlink = false;

$(function () {

    isBlink = false;
    var notifcation = $.connection.monitoringReportHub;

    notifcation.client.updateMonitoringReport = function (serverResponse) {
        setTimeout(function () {
            GetInformation();
        }, 200);

        isBlink = true;
    };

    $.connection.hub.start().done(function () {
        GetInformation();
    }).fail(function (error) {
        alert(error);
    });
});

function GetInformation() {
    $.ajax({
        url: location.href + '/home/SendDetailsReport',
        contentType: 'application/html ; charset:utf-8',
        type: 'GET',
        dataType: 'html'
    }).success(function (result) {
        var pResult = JSON.parse(result);
        LiveDateTime(result.serverDate);
        if (pResult.length === 0) {
        }
        else
        {
            if (!isBlink) {
                GenerateTimeAndLine(pResult);
            } else {
                MassageData(pResult);
            }
        }
    }).error(function (error) {
        alert(error);
    });
}

function GenerateTimeAndLine(data) {
    $('#divLine').empty();
    var time = 24;
    var th = table = td = row = "";
    var pad = "00";

    var partId = "";
    function Painting(td, color, value, keys) {
        if (j > 1) {
            var refineId = partId + keys.substr(keys.length - 2);

            if (j === 8 || j === 16 || j === 24) {
                td = "<td id=\"" + refineId +"\" class=\""+ color + " rightline\">"+ value +"</td>";
            }
            else {
                td = "<td id=\"" + refineId +"\" class=\"" + color + "\">" + value + "</td>";
            }
            if (refineId.length >=8){
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

    var first = data.x;
    var second = data.y;
    var previous = "";
    for (var i = 0; i <= first.length - 1; i++) {
        var temp = first[i];
        var keys = Object.keys(temp);

        for (var j = 0; j <= keys.length - 1; j++) {
            var $value = temp["" + keys[j] + ""];
            var pValue = second[i]["" + keys[j] + ""] || "";
            var percentage = (pValue === 0 ? "" : pValue);

            if ($value === "1") {
                td += Painting(td, "green", percentage, keys[j]);
            }else if ($value === "0") {
                td += Painting(td, "dormant", percentage, keys[j]);
            } else if ($value === "6") {
                td += Painting(td, "lightblue", percentage, keys[j]);
            } else if ($value === "3") {
                td += Painting(td, "yellow", percentage, keys[j]);
            } else if ($value === "7") {
                td += Painting(td, "red", percentage, keys[j]);
            } else {
                td += Painting(td, "black", $value, keys[j]);
            }
        }

        if (previous === "") {
            previous = first[i].Plant;
        }

        if (first[i].Plant !== previous) {
            row += "<tr class=\"upperline\">" + td + "</tr>";
            previous = first[i].Plant;
        }
        else {
            row += "<tr>" + td + "</tr>";
        }

        td = "";
    }

    for (var i = 0; i < time; i++) {
        th += "<th>" + ('0' + i).slice(-2) + "</th>";
    }

    table = "<table class=\"\"><thead><tr><th></th><th></th>" + th + "</tr></thead><tbody>" + row + "</tbody></table>";

    $('#divLine').append(table);
    IntervalColor();
}

function GenerateFooter() {
    var footer = "<div class=\"footer\">" +
    "<div>Hartalega NGC Sdn Bhd</div>" +
    "<div>Current time: <span class=\"current-time\"></span></div>" +
    "<div class=\"right\">Version: 0.1</div>" +
    "</div>";

    $('#divFooter').append(footer);
}

function IntervalColor() {
    function SetIntervalColor() {
        var $table = $('table');
        var $hour = moment().hour();
        var $targetHour = ("0" + $hour).slice(-2);
        $table.find('thead tr th.darkblue:nth(0)').removeClass('darkblue');
        $table.find('thead tr th:contains("' + $targetHour + '")').addClass('darkblue');
    }

    SetIntervalColor(true);

    setInterval(function () {
        SetIntervalColor(false);
    }, 5000);
}

function LiveDateTime(serverDate) {
    function SetLiveDateTime() {
        serverDate = moment(serverDate).add('1', 'seconds').format("YYYY/MM/DD hh:mm:ss");
        $(document).find('.current-time').html(serverDate);
    }

    SetLiveDateTime();
    setInterval(function () {
        SetLiveDateTime();
    }, 1000);
}

function GenerateBlinkAndColor(result) {
    var $table = $('table');
    $(result).each(function (i, x) {
        var $td = $table.find('tbody tr td[id="' + x.id + '"]');
        var $pC = $td.attr('class');
        var $nC = x.status;
        if (isBlink) {
            if ($pC !== $nC) {
                PutHereToBlink($td, $pC, $nC);
            }
        }
        else {
            if ($pC !== $nC) {
                if ($td.hasClass('rightline')) {
                    $td.removeClass($pC).addClass($nC + " rightline");
                }
            }
        }

        $td.text(x.message);
    });
}

function PutHereToBlink(element, prevClass, newClass) {
    var count = 0;

    var blink = setInterval(function () {
        if (element.hasClass('rightline')) {
            element.toggleClass("" + prevClass + "" + " " + newClass + " rightline");
        } else {
            element.toggleClass("" + prevClass + "" + " " + newClass);
        }

        count += 1;
        if (count === 10) {

            if (element.hasClass('rightline')){
                element.removeClass(prevClass).addClass(newClass + " rightline");
            }
            else {
                element.removeClass(prevClass).addClass(newClass);
            }

            window.clearInterval(blink);
        }
    }, 800);

}

function MassageData(data) {
    var x = data.x;
    var y = data.y;
    var nArray = [];

    for (var i = 0; i <= x.length - 1; i++) {
        var key = Object.keys(x[i]);
        var combine = x[i].Plant + x[i].Line;

        for (var j = 0; j <= key.length - 1; j++) {
            var id = "";
            var status = "";
            var message = "";
            if (key[j].substring(0, 1) === "H") {
                id = combine + key[j].slice(1);
                status = ConvertNumberToColor(x[i][key[j]]);
                message = (y[i][key[j]] != 0) ? y[i][key[j]] : HideNumber(x[i][key[j]]);
                nArray.push({ id, status, message });
            }
        }
    }

    GenerateBlinkAndColor(nArray);
}

function ConvertNumberToColor(value) {
    var color = "";
    if (value === "1") {
        color = "green";
    } else if (value === "0") {
        color = "dormant";
    } else if (value === "6") {
        color = "lightblue";
    } else if (value === "3") {
        color = "yellow";
    } else if (value === "7") {
        color = "red";
    } else {
        color = "black";
    }

    return color;

}

function HideNumber(value) {
    var number = "";
    if (value === "1" || value === "0" || value === "6" || value === "3" || value === "7") {
        number = "";
    } else {
        number = value;
    }
    return number;
}