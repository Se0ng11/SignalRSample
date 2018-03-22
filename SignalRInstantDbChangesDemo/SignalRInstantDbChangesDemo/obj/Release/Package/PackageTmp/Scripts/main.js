var isBlink = false;
var dateFormat = "YYYY/MM/DD HH:mm:ss";
var attempt = 1;
var tempProdLine = "";
var tempDefectData = "";
var retryTimer = 5000;

$(function () {
    InitialSignalR();
});

function InitialSignalR() {
    function StartHub() {
        $.connection.hub.start().done(function () {
            attempt = 1;
            GetDetailsInformation();
            isBlink = false;
        }).fail(function (error) {
            NotifyWarning(attempt + " attempt to reconnect to the server...");
            attempt += 1;
        });
    }

    var mrh = $.connection.monitoringReportHub;
    var pdh = $.connection.percentageDataHub;

    mrh.client.updateMonitoringReport = function (serverResponse) {
        setTimeout(function () {
            GetMonitoringReport();
        }, retryTimer);

        isBlink = true;
    };

    pdh.client.updatePercentageData = function (serverResponse) {
        setTimeout(function () {
            GetPercentageData();
        }, retryTimer);

        isBlink = true;
    };

    StartHub();

    $.connection.hub.reconnecting(function () {
        NotifyWarning("Connection interrupted, reconnecting...");
    });

    $.connection.hub.disconnected(function () {
        setTimeout(function () {
            StartHub();
        }, retryTimer);
    });
}

function GetDetailsInformation() {
    $.ajax({
        url: location.href + '/home/GetDetailsReport',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        type: 'GET'
    }).success(function (result) {
        LiveDateTime(result.serverDate);
        if (result.length === 0) {
        }
        else 
        {
            tempProdLine = result.pl;
            tempDefectData = result.dd;
            GenerateTimeAndLine(result.mr, result.pd);
        }
    }).error(function (error) {
        NotifyWarning("GetDetailsInformation(): " + error.statusText);
        setTimeout(function () {
            GetDetailsInformation();
        }, retryTimer);
    });
}

function GetMonitoringReport() {
    $.ajax({
        url: location.href + '/home/GetMonitoringReport',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
    }).success(function (result) {
        if (result.length === 0) {
        }
        else {
            MassageData(result.mr, 1);
        }
    }).error(function (error) {
        NotifyWarning("GetMonitoringReport(): " + error.statusText);
        setTimeout(function () {
            GetMonitoringReport();
        }, retryTimer);
    });
}

function GetPercentageData() {
    $.ajax({
        url: location.href + '/home/GetPercentageData',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        type: 'GET'
    }).success(function (result) {
        if (result.length === 0) {
        }
        else {
            tempDefectData = result.dd;
            MassageData(result.pd, 2);

        }
    }).error(function (error) {
        NotifyWarning("GetPercentageData(): " + error.statusText);
        setTimeout(function () {
            GetPercentageData();
        }, retryTimer);
    });
}

function GetProductionLine() {
    $.ajax({
        url: location.href + '/home/GetProductionLine',
        dataType: 'json',
        contentType: 'application/json; charset=utf-8',
        type: 'GET',
    }).success(function (result) {
        if (result.length === 0) {
        }
        else {
            tempProdLine = result.pl;
        }
    }).error(function (error) {
        NotifyWarning("GetProductionLine(): " + error.statusText);
        setTimeout(function () {
            GetProductionLine();
        }, retryTimer);
    });
}

function GenerateTimeAndLine(monitoringReport, percentageData) {
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

    var previous = "";
    for (var i = 0; i <= monitoringReport.length - 1; i++) {
        var temp = monitoringReport[i];
        var keys = Object.keys(temp);

        for (var j = 0; j <= keys.length - 1; j++) {
            var $value = temp["" + keys[j] + ""];
            var pValue = (percentageData.length === 0) ? "" : percentageData[i]["" + keys[j] + ""] || "";
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

    table = "<table class=\"main-table\"><thead><tr><th></th><th></th>" + th + "</tr></thead><tbody>" + row + "</tbody></table>";

    $('#divLine').append(table);
    IntervalColor();
    InitialOnClickPopOut();
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
    var x = data;
    var nArray = [];

    if (data.length === 0 || $('.main-table tbody tr').length === 0) {
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
                        $td.webuiPopover('destroy');
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
            if (newClass !== "green" && newClass !== "dormant"){
                InitialOnClickPopOut(element);
            }
        }
    }, 500);
}

function InitialOnClickPopOut(element) {

    function InitialProductionLinePO() {
        $('.main-table tbody tr td:nth-child(2)').webuiPopover({
            type: 'html',
            cache: false,
            container: ".body-content",
            placement: 'horizontal',
            title:'Details',
            content: function () {
                return GenerateContent(this, 'line');
            },
            onHide: function ($element) {
                $('.in').remove();
            }
        });
    }

    function InitialDetailsPO(element) {
        var $element = (element == undefined ? $('.main-table tbody tr td:nth-child(n+3):not(.green):not(.dormant)') : element);
        $element.webuiPopover({
            type: 'html',
            cache: false,
            container: ".body-content",
            placement: 'auto',
            title: "Details",
            content: function () {
                return GenerateContent(this, 'detail');
            },
            onHide: function ($element) {
                $('.in').remove();
            }
        });
    }

    function GenerateContent(target, mode) {
        var $this = $(target);
        var $tr = $this.closest('tr');

        var $container = $('#Popover-Info');

        var $plant = $tr.find('td:nth(0)').text();
        var $line = $tr.find('td:nth(1)').text();

        $container.find('.plant').html($plant);
        $container.find('.line').html($line);

        $container.find('div').hide();

        if (mode === "detail")
        {
            $container.find('#divDefectDetails').show();
            var $slot = $this.closest('tbody').prev().find('tr th:nth(' + $this.index() + ')').text();
            var $status = $this.text();
            var $color = $this.attr('class');

            $container.find('#slot').html($slot);
            $container.find('#status').removeClass().addClass($color).html($status);

            function getColumns() {
                for (var i = 0; i < tempDefectData.length; i++) {
                    let columnsArray = [];
                    var keys = Object.keys(tempDefectData[i]);
                    for (k in Object.keys(tempDefectData[i])) {
                        if (tempDefectData[i].hasOwnProperty(keys[k])) {
                            columnsArray.push({
                                "title": keys[k],
                                "data": keys[k]
                            });
                        }
                    }
                    return columnsArray;
                }
            }

            var $dd = $('#tblDefectDetails');

            if ($.fn.DataTable.isDataTable("#tblDefectDetails")) {
                $dd.DataTable().clear().destroy();
            }

            var $defects = tempDefectData.filter(function (e) {
                return e.Plant === $plant & e.Line === $line && e.Slot === parseInt($slot)
            });

            var table = $dd.DataTable({
                "columns": getColumns(),
                "data": $defects,
                "searching": false,
                "lengthChange": false,
                "info": false
            });

            table.columns([0, 4, 5, 8, 9]).visible(false, false);
            table.columns.adjust().draw(false);

        }
        else if (mode === "line") {

           
            $container.find('#divLineInfo').show();
            var $prod = tempProdLine.filter(function (e) {
                return e.LineId === $line
            });

            var keys = Object.keys($prod[0]);

            $(keys).each(function (i, v) {
                $container.find('#' + v).text($prod[0][v]);
            });
        }

        var $content = $container.html();
        return $content;
    }

    InitialProductionLinePO();
    InitialDetailsPO(element);
}

function NotifyWarning(msg) {
    $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: msg
    }, {
        type: "danger",
        placement: {
            align: "left"
        },
        allow_dismiss: true,
        newest_on_top: true,
        delay: retryTimer
    });
}