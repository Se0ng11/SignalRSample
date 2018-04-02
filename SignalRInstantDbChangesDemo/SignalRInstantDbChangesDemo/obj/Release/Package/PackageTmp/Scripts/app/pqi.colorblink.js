(function ($) {
    $.fn.colorblink = function (options) {
        var settings = $.extend({
            array: [],
            methodType: 1
        }, options);
        return this.each(function () {
            GenerateBlinkAndColor(this, settings.array, settings.methodType);
        });
    }

    GenerateBlinkAndColor = function (table, result, methodType) {
        var $table = $(table);
        $(result).each(function (i, x) {
            var $td = $table.find('tbody tr td[id="' + x.id + '"]');
            var $pC = $td.attr('class');
            var $nC = x.status;
            var isReset = false;

            if (methodType === 1) {
                if ($nC !== "") {
                    if (isBlink) {
                        if (!$td.hasClass($nC)) {
                            $td.pqiPopOver('destroy');
                            PutHereToBlinkColor($td, $pC, $nC);
                            isReset = true;
                        }
                    }
                    else {
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

    PutHereToBlinkColor = function(element, prevClass, newClass) {
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

                if (element.hasClass('rightline')) {
                    element.removeClass(prevClass + " " + blink).addClass(newClass + " rightline");
                }
                else {
                    element.removeClass(prevClass + " " + blink).addClass(newClass);
                }
                window.clearInterval($blink);
                if (newClass !== "green" && newClass !== "dormant" && newClass !== "black") {
                    element.pqiPopOver();
                }
            }
        }, 500);
    }

}(jQuery));