(function ($) {
    $.fn.pqiPopOver = function (options) {
        switch (options) {
            case "destroy":
                Destroy(this);
                break;
            default:
                InitialOnClickPopOut(this);
                OnHide(this);

        }

        //$('body').on('click', '#tblDefectDetails thead tr th', function (e) {
        //    e.preventDefault();
        //    var $this = $(this);
        //    var $currIndex = $this.index();
        //    var $table = $this.closest('table').DataTable({
        //        retrieve: true,
        //        "searching": false,
        //        "lengthChange": false,
        //        "info": false,
        //        "pageLength": 5
        //    });

        //    $table.columns($currIndex).data().sort();
        //});

		return this;
	}

	Destroy = function (td) {
		$(td).webuiPopover('destroy');
	}

	//Refresh = function (element) {
	//    clearInterval(popOverInterval);

	//    popOverInterval = setInterval(function () {
	
	//        if (tempDefectData !== "") {
	//            GenerateContent(element, "detail");
	//            $('#ddInfo').children().hide();
	//            console.log('im in');
	//            clearInterval(popOverInterval);
	//        }
	//    }, 1000);
	//}


	InitialOnClickPopOut = function(element) {
		InitialProductionLinePO();
		InitialDetailsPO(element);
	}

    InitialProductionLinePO = function() {
        $('#main-table tbody tr td:nth-child(2)').popover({
		        //type: 'html',
                //cache: false,
                html: true,
		        container: ".body-content",
		        placement: 'right',
		        title: 'Details',
				content: function () {
					return GenerateContent(this, 'line');
				},
				//onShow: function ($element) {
				   
				//},
				//onHide: function ($element) {
				//    $('.in').remove();
				//}
			});
		}

	InitialDetailsPO = function(element) {
		var $element = element;
		$element.popover({
			//type: 'html',
		    //cache: false,
            html: true,
			container: ".body-content",
			placement: 'auto',
			title: "Details",
			content: function () {
				return GenerateContent(this, 'detail');
			},
			//onShow: function ($element) {

			//	if ($element.position().left < 0) {
			//	    var newP = (parseInt($('.webui-arrow').position().left) + parseInt($element.position().left)) + "px";
			//	    $element.css({ left: 0 });
			//	    $('.webui-arrow').css({ left: newP });
			//	}
			//},
			//onHide: function ($element) {
			//	$('.in').remove();
			//}
				
		});
	}

	GenerateContent = function (target, mode) {
		var $this = $(target);
		var $tr = $this.closest('tr');

		var $container = $('#Popover-Info');

		var $plant = $tr.find('td:nth(0)').text();
		var $line = $tr.find('td:nth(1)').text();

		$container.find('.plant').html($plant);
		$container.find('.line').html($line);

		$container.find('div').hide();

		if (mode === "detail") {
			$container.find('#divDefectDetails').show();
			var $slot = $this.closest('tbody').prev().find('tr th:nth(' + $this.index() + ')').text();
			var $status = $this.text();
			var $color = $this.attr('class');

			$container.find('#slot').html($slot);
			$container.find('#status').removeClass().addClass($color).html($status);

			if (tempDefectData !== "") {
			    GenerateDetails($plant, $line, $slot);
			    $('#ddInfo').hide();
			}
			else
			{
			    var popOverInterval = "";

			    clearInterval(popOverInterval);

			    popOverInterval = setInterval(function () {
			        if (tempDefectData !== "") {
			            var $target = $($('[aria-describedby]').data("bs.popover").tip);
			            GenerateDetails($plant, $line, $slot);

			            $target.find('#ddInfo').hide();
			            $target.find('#tblDefectDetails').empty().html($('#divDefectDetails #tblDefectDetails').html());
			            clearInterval(popOverInterval);
			        }
			    }, 1000);
			}
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

	GenerateDetails = function($plant, $line, $slot){
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

	    if (tempDefectData.length !== 0) {
	        var $dd = $(document).find('#tblDefectDetails');

	        if ($.fn.DataTable.isDataTable("#tblDefectDetails")) {
	            $dd.DataTable().destroy();
	        }

	        var $defects = tempDefectData.filter(function (e) {
	            return e.Plant === $plant & e.Line === $line && e.Slot === parseInt($slot)
	        });

	        for (var i = 0; i <= $defects.length - 1 ; i++) {
	            var $desc = $defects[i].Description;
	            $defects[i].Description = $desc.replace(/;/g, '<br />');
	        }

	        var table = $dd.DataTable({
	            "columns": getColumns(),
	            "data": $defects,
	            "searching": false,
	            "lengthChange": false,
	            "info": false,
	            "pageLength": 100,
	            paging: false,
	            sort: false
	        });

	        table.columns([0, 4, 5]).visible(false, false);
	        table.columns.adjust().draw(false);
	    }
	}


	OnHide = function (element) {
	    var $element = $(element);

	    $element.on('show.bs.popover', function () {
	        var $this = $(this);
	        $('.popover').not($this).remove();
	        $('[aria-describedby]').not($this).popover('hide');
	    })

	    $('#main-table tbody tr td:nth-child(2)').on('show.bs.popover', function () {
	        var $this = $(this);
	        $('.popover').not($this).remove();
	        $('[aria-describedby]').not($this).popover('hide');
	    })

	    $('#main-table').on('click', 'td', function (e) {
	        var $e = $(e.target);
	        var $popOver = $('.popover');
	        var $desc = $('[aria-describedby]');

	        if ($e.closest('.popover').length <= 0) {
               
	            var $arial = $e.attr('aria-describedby');
	            if ($arial !== undefined) {
	                if ($arial !== $popOver.attr('id')) {
	                    $popOver.remove();
	                    $desc.popover('hide');
	                }

	            } else {
	                $popOver.remove();
	                $desc.popover('hide');
	            }
	         
	        }
	    });
	}
}(jQuery));