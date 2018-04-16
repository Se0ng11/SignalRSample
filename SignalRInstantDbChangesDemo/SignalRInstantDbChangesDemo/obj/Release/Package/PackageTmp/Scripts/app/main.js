var isBlink = false;
var dateFormat = "YYYY/MM/DD HH:mm:ss";
var attempt = 1;
var tempProdLine = "";
var tempDefectData = "";
var retryTimer = 5000;
var contentType = "application/json; charset=utf-8";
var retryMessage = " attempt to reconnect to the server...";
var successMessage = "Re-establish connection successfully";
var liveInterval = null;

$.ajaxSetup({ cache: false });

$(function () {
    InitialSignalR();
});

function InitialSignalR() {
    function StartHub() {
        $.connection.hub.start().done(function () {
            if (attempt > 1) {
                NotifyMessage(successMessage, "success");
                GetDetailsInformation(true);
                isBlink = true;
            } else {
                GetDetailsInformation(false);
                isBlink = false;
            }
            attempt = 1;
            GetProductionLine();

        }).fail(function (error) {
            NotifyMessage(attempt + retryMessage, "danger");
            attempt += 1;
        });
    }

    var pdh = $.connection.percentageDataHub;
    var pdl = $.connection.productionLineHub;

    pdh.client.updatePercentageData = function (serverResponse) {
        setTimeout(function () {
            GetDetailsInformation(true);
        }, retryTimer);

        isBlink = true;
    };

    pdl.client.updateProductionLine = function (serverResponse) {
        setTimeout(function () {
            GetProductionLine();
        }, retryTimer);

        isBlink = false;
    };

    StartHub();

    $.connection.hub.reconnecting(function () {
        NotifyMessage("Connection interrupted, reconnecting...", "danger");
    });

    $.connection.hub.disconnected(function () {
        setTimeout(function () {
            StartHub();
        }, retryTimer);
    });
}

function GetDetailsInformation(flag) {
    $.ajax({
        url: location.href + '/home/GetDetailsReport',
        dataType: 'json',
        contentType: contentType,
        type: 'GET',
        success: function (result) {
            var pResult = JSON.parse(result);
            LiveDateTime(pResult.serverDate);
            CalculateBatch(pResult.lastRun, pResult.nextRun);
            if (pResult.length === 0) {
            }
            else {
                if (flag) {
                    MassageData(pResult.mr, 1);
                    MassageData(pResult.pd, 2);
                }
                else {
                    $('#divLine').pqiTable({
                        monitoringReport: pResult.mr,
                        percentageData: pResult.pd
                    });
                }
                GetDefectDetails();
            }
        },
        error: function (error) {
            NotifyMessage("GetDetailsInformation(): " + error.statusText + "," + retryMessage, "danger");
            setTimeout(function () {
                GetDetailsInformation(false);
            }, retryTimer);
        }
    });
}

function GetProductionLine() {
    $.ajax({
        url: location.href + '/home/GetProductionLine',
        dataType: 'json',
        contentType: contentType,
        type: 'GET',
        success: function (result) {
            var pResult = JSON.parse(result);
            if (pResult.length === 0) {
            }
            else {
                tempProdLine = pResult.pl;
            }
        },
        error: function (error) {
            NotifyMessage("GetProductionLine(): " + error.statusText + "," + retryMessage, "danger");
            setTimeout(function () {
                GetProductionLine();
            }, retryTimer);
        }
    });
}

function GetDefectDetails() {
    $.ajax({
        url: location.href + '/home/GetDefectDetails',
        dataType: 'json',
        contentType: contentType,
        type: 'GET',
        success: function (result) {
            var pResult = JSON.parse(result);
            if (pResult.length === 0) {
            }
            else {
                tempDefectData = pResult.dd;
            }
        },
        error: function (error) {
            NotifyMessage("GetDefectDetails(): " + error.statusText + "," + retryMessage, "danger");
            setTimeout(function () {
                GetDefectDetails();
            }, retryTimer);
        }
    });
}

function LiveDateTime(serverDate) {
    function CountLiveDateTime() {
        serverDate = moment(serverDate).add('1', 'seconds').format(dateFormat);
        $(document).find('.current-time').html(serverDate);
    }

    CountLiveDateTime();
    clearInterval(liveInterval);

    liveInterval = setInterval(function () {
        CountLiveDateTime();
    }, 1000);
}

function CalculateBatch(lastRun, nextRun){
    var $doc = $(document);
    var $currRun = $doc.find('.footer .curr-run');
    var $nextRun = $doc.find('.footer .next-run');

    $currRun.text(moment(lastRun).format(dateFormat));
    $nextRun.text(moment(nextRun).format(dateFormat));
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

function NotifyMessage(msg, msgType) {
    $.notify({
        icon: 'glyphicon glyphicon-warning-sign',
        message: msg
    }, {
        type: msgType,
        placement: {
            align: "left"
        },
        allow_dismiss: true,
        newest_on_top: true,
        delay: retryTimer
    });
}
