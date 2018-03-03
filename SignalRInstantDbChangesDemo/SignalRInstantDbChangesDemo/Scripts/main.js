var isBlink = false;

$(function () {

    isBlink = false;
    //GenerateTimeAndLine();
    var notifcation = $.connection.monitoringReportHub;

    notifcation.client.updateMonitoringReport = function (serverResponse) {
        GetInformation();
        isBlink = true;
    };

    $.connection.hub.start().done(function () {
        GetInformation();
        //GenerateFooter();
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

        if (pResult.length === 0) {
            //GenerateTimeAndLine();
        }
        else {
            //MassageData(pResult);

            if (!isBlink) {
                GenerateTimeAndLine(pResult.x);
            } else {
                //do blink logic
            }

            //GenerateNumber(pResult.y);
        }
    }).error(function (error) {
        alert(error);
    });
}

function GetServerTime() {
    $.ajax({
        url: location.href + '/home/GetServerTime',
        contentType: 'application/html ; charset:utf-8',
        type: 'GET',
        dataType: 'JSON'
    }).success(function (result) {
        LiveDateTime(result);
    }).error(function (error) {
        alert(error);
    });

}

function GenerateTimeAndLine(data) {
    $('#divLine').empty();
    var time = 24;
    //var plant = 4;
    //var line = 12;
    var th = table = td = row = "";
    //var c = 0;
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

    var isDiff = false;
    for (var i = 0; i <= data.length - 1; i++) {
        var temp = data[i];
        var keys = Object.keys(temp);

        for (var j = 0; j <= keys.length - 1; j++) {
            var $value = temp["" + keys[j] + ""];

            if ($value === "1") {
                td += Painting(td, "green", "", keys[j]);
            }else if ($value === "0") {
                td += Painting(td, "dormant", "", keys[j]);
            } else if ($value === "6") {
                td += Painting(td, "lightblue", "", keys[j]);
            } else if ($value === "3") {
                td += Painting(td, "yellow", "", keys[j]);
            } else if ($value === "7") {
                td += Painting(td, "red", "", keys[j]);
            } else {
                td += Painting(td, "black", $value, keys[j]);
            }
        }

        row += "<tr>" + td + "</tr>";

        td = "";
    }

    for (var i = 0; i < time; i++) {
        th += "<th>" + ('0' + i).slice(-2) + "</th>";
    }

    table = "<table class=\"\"><thead><tr><th></th><th></th>" + th + "</tr></thead><tbody>" + row + "</tbody></table>"; // + GenerateFooter();

    //for (var j = 0; j < plant; j++) {
    //    var p = ('P' + (j + 1)).slice(-2);

    //    for (var k = 0; k < line; k++) {
    //        var l = "L" + (pad + (c + 1)).slice(-pad.length);
    //        var aR = "";

    //        for (var z = 0; z < time; z++) {
    //            var x = ('0' + z).slice(-2);
    //            var uI = (p + l + x);

    //            if (z === 6 || z === 14 || z === 22) {
    //                var b = "";
    //                aR += "<td class=\"dormant rightline\" id=\"" + uI + "\"></td>";
    //            }
    //            else {
    //                aR += "<td class=\"dormant\"  id=\"" + uI + "\"></td>";
    //            }

    //        }

    //        if (k === (line - 1)) {
    //            row += "<tr class=\"underline\"><td class=\"main-label\">" + p + "</td><td class=\"main-label\">" + l + "</td>" + aR + "</tr>";
    //        }
    //        else {
    //            row += "<tr><td class=\"main-label\">" + p + "</td><td class=\"main-label\">" + l + "</td>" + aR + "</tr>";
    //        }

    //        c += 1;
    //    }
    //}

    //table = "<table class=\"\"><thead><tr><th></th><th></th>" + th + "</tr></thead><tbody>" + row + "</tbody></table>" + GenerateFooter();

    $('#divLine').append(table);
    IntervalColor();
    //GetServerTime();
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
        var $td = $table.find('tbody tr td[id="' + x.Id + '"]');
        var $pC = $td.attr('class');
        var $nC = x.Status;
        if (isBlink) {
            if ($pC !== $nC) {
                PutHereToBlink($td, $pC, $nC);
            }
        }
        else {
            if ($pC !== $nC) {
                if ($td.hasClass('rightline')) {
                    $td.removeClass($pC).addClass($nC + " new rightline");
                }
                else {
                    $td.removeClass($pC).addClass($nC + " new");
                }
            }
        }

        $td.text(x.Message);
    });
}

function PutHereToBlink(element, prevClass, newClass) {
    var count = 0;

    var blink = setInterval(function () {
        if (element.hasClass('rightline')) {
            element.toggleClass("" + prevClass + "" + " " + newClass + " new rightline");
        } else {
            element.toggleClass("" + prevClass + "" + " " + newClass + " new");
        }

        count += 1;
        if (count === 10) {

            if (element.hasClass('rightline')){
                element.removeClass(prevClass).addClass(newClass + " new rightline");
            }
            else {
                element.removeClass(prevClass).addClass(newClass + " new");
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
            var value = "";

            if (key[j].substring(0, 1) === "H") {
                id = combine + key[j];//.slice(1);
                value = x[i][key[j]];
                nArray.push({ id, value });
            }
        }
    }

    return nArray;
}