var isBlink = false;
var dateFormat = "YYYY/MM/DD HH:mm:ss";
var attempt = 1;

$(function () {
    InitialSignalR();
});

function InitialSignalR() {
    function StartHub() {
        $.connection.hub.start().done(function () {
            attempt = 1;
            GenerateFooter();
            GetDetailsInformation();
            isBlink = false;
        }).fail(function (error) {
            Notify(attempt + " attempt to reconnect to the server...", "danger");
            attempt += 1;
        });
    }

    var mrh = $.connection.monitoringReportHub;
    var pdh = $.connection.percentageDataHub;

    mrh.client.updateMonitoringReport = function (serverResponse) {
        setTimeout(function () {
            GetMonitoringReport();
        }, 200);

        isBlink = true;
    };

    pdh.client.updatePercentageData = function (serverResponse) {
        setTimeout(function () {
            GetPercentageData();
        }, 200);

        isBlink = true;
    };

    StartHub();

    $.connection.hub.reconnecting(function () {
        Notify("Connection interrupted, reconnecting...", "danger");
    });

    $.connection.hub.disconnected(function () {
        setTimeout(function () {
            StartHub();
        }, 5000);
    });
}

function Notify(msg, msgType) {
    $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: msg
    }, {
        type: msgType,
        placement: {
            align: "left"
        },
        allow_dismiss: false,
    });
}

function GetDetailsInformation() {
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
            GenerateTimeAndLine(pResult);
        }
    }).error(function (error) {
        Notify(error, "danger");
    });
}

function GetMonitoringReport() {
    $.ajax({
        url: location.href + '/home/SendMonitoringReport',
        contentType: 'application/html ; charset:utf-8',
        type: 'GET',
        dataType: 'html'
    }).success(function (result) {
        var pResult = JSON.parse(result);
        if (pResult.length === 0) {
        }
        else {
            MassageData(pResult, 1);
        }
    }).error(function (error) {
        Notify(error, "danger");
    });
}

function GetPercentageData() {
    $.ajax({
        url: location.href + '/home/SendPercentageData',
        contentType: 'application/html ; charset:utf-8',
        type: 'GET',
        dataType: 'html'
    }).success(function (result) {
        var pResult = JSON.parse(result);
        if (pResult.length === 0) {
        }
        else {
            MassageData(pResult, 2);
        }
    }).error(function (error) {
        Notify(error, "danger");
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
            var pValue = (second.length === 0) ? "" : second[i]["" + keys[j] + ""] || "";
            var percentage = (pValue === 0 || pValue === "") ? "" : (pValue + "%");
           
            if (parseInt($value, 10) > -1 && parseInt($value, 10) < 10)
            {
                td += Painting(td, ConvertNumberToColor($value), percentage, keys[j]);
            }
            else
            {
                td += Painting(td, ConvertNumberToColor($value), $value, keys[j]);
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

    table = "<table class=\"main-table\"><thead><tr><th></th><th></th>" + th + "</tr></thead><tbody>" + row + "</tbody></table>";

    $('#divLine').append(table);
    IntervalColor();
    OnClickPopOut();
}

function GenerateFooter() {
    var footer = "<div class=\"footer\">" +
    "<div>Hartalega NGC Sdn Bhd</div>" +
    "<div>Batch Job Last Run: <span class=\"curr-run\"></span></div>" +
    "<div>Next Batch Run Time: <span class=\"next-run\"></span></div>" +
    "<div class=\"right\"><span class=\"current-time\"></span></div>" +
    "</div>";

    $('#divFooter').empty().append(footer);
}

function IntervalColor() {
    function SetIntervalColor() {
        var $table = $('.main-table');
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
    function CountLiveDateTime() {
        serverDate = moment(serverDate).add('1', 'seconds').format(dateFormat);
        $(document).find('.current-time').html(serverDate);
    }

    CountLiveDateTime();
    setInterval(function () {
        CountLiveDateTime();
    }, 1000);
}

function CalculateBatch(){
    var $doc = $(document);
    var $currRun = $doc.find('#divFooter .curr-run');
    var $nextRun = $doc.find('#divFooter .next-run');
    var $now = moment();

    $currRun.text($now.format(dateFormat));
    $nextRun.text($now.add('4', 'minutes').format(dateFormat));
}

function MassageData(data, methodType) {
    var x = data.x;
    var nArray = [];

    if (x.length === 0 || $('.main-table tbody tr').length === 0) {
        location.reload();
    }

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
                message = HideNumber(x[i][key[j]]);
                nArray.push({ id: id, status: status, message: message });
            }
        }
    }

    GenerateBlinkAndColor(nArray, methodType);
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
    } else  {
        color = "black";
    }

    return color;
}

function HideNumber(value) {
    var number = "";
    var ary = ["0", "1", "2", "3", "4", "5", "6", "7"];

    if (ary.indexOf(value)> -1) {
        number = "";
    } else {
        number = value;
    }
    return number;
}

function GenerateBlinkAndColor(result, methodType) {
    var $table = $('.main-table');
    $(result).each(function (i, x) {
        var $td = $table.find('tbody tr td[id="' + x.id + '"]');
        var $pC = $td.attr('class');
        var $nC = x.status;
        var isReset = false;

        if (methodType === 1) {
            if ($nC !== "") {
                if (isBlink) {
                    if (!$td.hasClass($nC)) {
                        PutHereToBlinkColor($td, $pC, $nC);
                        isReset = true;
                    }
                }
                else
                {
                    if (!$td.hasClass($nC)) {
                        if ($td.hasClass('rightline')) {
                            $td.removeClass($pC).addClass($nC + " rightline");
                        }
                    }
                }
            }

            if (isReset) {
                $td.text(x.message);
            }

        } if (methodType === 2) {
            var mPercent = x.message + "%";
            if (x.message !== 0) {
                if (mPercent !== $td.text()) {
                    $td.text(mPercent);
                }

            } else if ($td.text().indexOf('%') > 0) {
                if (mPercent !== $td.text()) {
                    $td.text("");
                }
            }
        }
    });
}

function PutHereToBlinkColor(element, prevClass, newClass) {
    var count = 0;
    var blink = 'blink';

    var $blink = setInterval(function () {
        if (element.hasClass('rightline')) {
            element.addClass(blink).toggleClass("" + prevClass + "" + " " + newClass + " rightline");
        } else {
            element.addClass(blink).toggleClass("" + prevClass + "" + " " + newClass);
        }

        count += 1;
        if (count === 10) {

            if (element.hasClass('rightline')){
                element.removeClass(prevClass + " " + blink).addClass(newClass + " rightline");
            }
            else {
                element.removeClass(prevClass + " " + blink).addClass(newClass);
            }

            window.clearInterval($blink);
        }
    }, 500);
}

function OnClickPopOut() {
    $('.main-table tbody tr td:not(.green):not(.dormant)').webuiPopover({
        type: 'html',
        width: '800px',
        //async: {
        //    type:'GET', // ajax request method type, default is GET
        //    before: function(that, xhr, settings) {},//executed before ajax request
        //    success: function(that, data) {},//executed after successful ajax request
        //    error: function(that, xhr, data) {} //executed after error ajax request
        //    },
        content: function () {
            function AssignValue(target, element) {
                var $tr = target.closest('tr');
                var $plant = $tr.find('td:nth(0)').text();
                var $line = $tr.find('td:nth(1)').text();
                var $slot = target.closest('tbody').prev().find('tr th:nth(' + target.index() + ')').text();
                var $status = target.text();
                var $color = target.attr('class');

                element.find('#plant').html($plant);
                element.find('#line').html($line);
                element.find('#slot').html($slot);
                element.find('#status').removeClass().addClass($color).html($status);
            }

            var $this = $(this);
            var $info = $('#Popover-Info');

            AssignValue($this, $info);

            var $content = $info.html();
            return $content;
        }
    });
}