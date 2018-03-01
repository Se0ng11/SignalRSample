var isBlink = false;

$(function () {

    isBlink = false;
    EnabledKeyPressEvent();
    GenerateTimeAndLine();
    var notifications = $.connection.dataResultHub;
    notifications.client.updateDataResultInformation = function (serverResponse) {
        console.log(serverResponse);
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
                    aR += "<td class=\"dormant rightline\" id=\"" + uI + "\"></td>";
                }
                else {
                    aR += "<td class=\"dormant\"  id=\"" + uI + "\"></td>";
                }

            }

            if (k === (line - 1)) {
                row += "<tr class=\"underline\"><td class=\"main-label\">" + p + "</td><td class=\"main-label\">" + l + "</td>" + aR + "</tr>";
            }
            else {
                row += "<tr><td class=\"main-label\">" + p + "</td><td class=\"main-label\">" + l + "</td>" + aR + "</tr>";
            }

            c += 1;
        }
    }

    table = "<table class=\"\"><thead><tr><th></th><th></th>" + th + "</tr></thead><tbody>" + row + "</tbody></table>" + GenerateFooter();

    $('#divLine').append(table);
    IntervalColor();
    GetServerTime();
}

function GenerateFooter() {
    var footer = "<div class=\"footer\">" +
    "<div>Hartalega NGC Sdn Bhd</div>" +
    "<div>Current time: <span class=\"current-time\"></span></div>" +
    "<div class=\"right\">Version: 0.1</div>" +
    "</div>";
    return footer; 
}

function IntervalColor() {
    function SetIntervalColor() {
        var $time = $('#time');
        var $table = $('table');
        var $hour = moment().hour();
        if ($time.val().trim() !== "") {
            $hour = parseInt($time.val());
        }

        var $targetHour = ("0" + $hour).slice(-2);
        //var $startHour = $hour + 2;
        //var $endHour = $hour + 8;

        //paint current hour
        $table.find('thead tr th.darkblue:nth(0)').removeClass('darkblue');
        $table.find('thead tr th:contains("' + $targetHour + '")').addClass('darkblue');

        //$table.find('tbody tr td:not(".main-label")').removeClass('dormant').not('.new').addClass('green');
        //$table.find('tbody tr td:not(".main-label"):nth-child(n+' + ($startHour - 1) + ')').removeClass('dormant').not('.new').addClass('green');
        //var $dormantDayHour = $table.find('tbody tr td:not(".main-label"):nth-child(n+' + $startHour + '):nth-child(-n+ ' + ($endHour + 3) + ')');

        //SimpleRendering($dormantDayHour);

        //if ($endHour > 23) {
        //    var endNightHour = ($endHour - 23) + 2;
        //    var $dormantNightHour = $table.find('tbody tr td:not(".main-label"):nth-child(n+3):nth-child(-n+ ' + endNightHour + ')');

        //    SimpleRendering($dormantNightHour);
        //}

        //if ($hour === 0) {
        //    $table.find('tbody tr td:nth-child(n+26)').removeClass('dormant').not('.new').addClass('dormant');
        //}
    }

    function SimpleRendering(element) {
        //element.not('.new').not('.rightline').removeClass();
        //element.not('.new').addClass('dormant');
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

        //element.fadeIn(300).fadeOut(500);

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

function EnabledKeyPressEvent(){
    var $modal = $('#modal-test');
    $(document).keypress(function (e) {
        if (e.key == "e") {
            $modal.modal('show');
        }
        else if (e.key === "c")
        {
            $modal.modal('hide');
        }
    
    });
}
