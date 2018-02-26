var isBlink = false;

$(function () {

    isBlink = false;
    GenerateTimeAndLine();
    var notifications = $.connection.dataResultHub;
    notifications.client.updateDataResultInformation = function (serverResponse) {
        setTimeout(function () {
            getDataResultInformation();
        }, 200);

        isBlink = true;
    };

    $.connection.hub.start().done(function () {
        getDataResultInformation();
    }).fail(function (error) {
        alert(error);
    });
});

function getDataResultInformation() {
    $.ajax({
        url: location.href + '/home/SendPQINotification',
        contentType: 'application/html ; charset:utf-8',
        type: 'GET',
        dataType: 'html'
    }).success(function (result) {
        var pResult = JSON.parse(result);
        if (pResult.length === 0) {
            GenerateTimeAndLine();
        }
        else {
            GenerateBlinkAndColor(pResult);
        }
    }).error(function (error) {
        alert(error);
    });
}

function GenerateTimeAndLine() {
    $('#divLine').empty();
    var time = 24;
    var plant = 4;
    var line = 12;
    var th = table = row = "";
    var c = 0;
    var pad = "00";

    for (var i = 0; i < time; i++) {
        th += "<th>" + ('0' + i).slice(-2) + "</th>";
    }

    for (var j = 0; j < plant; j++) {
        var p = ('P' + (j + 1)).slice(-2);

        for (var k = 0; k < line; k++) {
            var l = "L" + (pad + (c + 1)).slice(-pad.length);
            var aR = "";

            for (var z = 0; z < time; z++) {
                var x = ('0' + z).slice(-2);
                var uI = (p + l + x);

                if (z === 6 || z === 14 || z === 22) {
                    var b = "";
                    aR += "<td class=\"green rightline\" id=\"" + uI + "\"></td>";
                }
                else {
                    aR += "<td class=\"green\"  id=\"" + uI + "\"></td>";
                }

            }

            if (k === (line - 1)) {
                row += "<tr class=\"underline\"><td>" + p + "</td><td>" + l + "</td>" + aR + "</tr>";
            }
            else {
                row += "<tr><td>" + p + "</td><td>" + l + "</td>" + aR + "</tr>";
            }

            c += 1;
        }
    }

    table = "<table class=\"\"><thead><tr><th></th><th></th>" + th + "</tr></thead><tbody>" + row + "</tbody></table>" + GenerateFooter();

    $('#divLine').append(table);
    IntervalColor();
    LiveDateTime();
}

function GenerateFooter() {
    var footer = "<div class=\"footer\"><div>Hartalega NGC Sdn Bhd</div><div class=\"right\">Current time: <span class=\"current-time\"></span></div></div>";
    return footer; 
}

function IntervalColor() {
    function SetIntervalColor() {
        var $table = $('table');
        var $hour = moment().hour();
        var $hHour = ("0" + $hour).slice(-2);
        var $pHour = $hour + 2;
        var $mHour = $hour + 8;

        $table.find('thead tr th.darkblue:nth(0)').removeClass('darkblue');
        $table.find('thead tr th:contains("' + $hHour + '")').addClass('darkblue');
        $table.find('tbody tr td:nth-child(n+' + $pHour + ')').addClass('temp-black');


        if ($mHour > 23) {
            var calNew = ($mHour - 23) + 2;
            $table.find('tbody tr td:nth-child(-n+' + calNew + ')').removeClass().addClass('temp-black');
        }
    }

    SetIntervalColor();

    setInterval(function () {
        SetIntervalColor();
    }, 10000);
}

function LiveDateTime() {
    function SetLiveDateTime() {
        $(document).find('.current-time').html(moment().format("YYYY/MM/DD HH:mm:ss"));
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
                $td.removeClass($pC).addClass($nC);
            }
        }

        $td.text(x.Message);
    });
}

function PutHereToBlink(element, prevColor, newColor) {
    var count = 0;
    var blink = setInterval(function () {
        element.toggleClass("" + prevColor + "" + " " + newColor + "");
        count += 1;
        if (count === 10) {
            element.removeClass(prevColor).addClass(newColor);
            window.clearInterval(blink);
        }
    }, 800);
}

