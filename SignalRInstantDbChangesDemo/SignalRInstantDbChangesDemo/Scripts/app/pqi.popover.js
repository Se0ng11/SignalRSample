(function ($) {
    
	$.fn.pqiPopOver = function (options) {
		switch (options) {
			case "destroy":
				destroy(this);
				break;
			default:
				InitialOnClickPopOut(this);
		}

		return this;
	}

	destroy = function (td) {
		$(td).webuiPopover('destroy');
	}

	InitialOnClickPopOut = function(element) {
		function InitialProductionLinePO() {
			$('#main-table tbody tr td:nth-child(2)').webuiPopover({
				type: 'html',
				cache: false,
				container: ".body-content",
				placement: 'horizontal',
				title: 'Details',
				content: function () {
					return GenerateContent(this, 'line');
				},
				onShow: function ($element) {

				},
				onHide: function ($element) {
					$('.in').remove();
				}
			});
		}

		function InitialDetailsPO(element) {
			var $element = element;
			$element.webuiPopover({
				type: 'html',
				cache: false,
				container: ".body-content",
				placement: 'auto',
				title: "Details",
				content: function () {
					return GenerateContent(this, 'detail');
				},
				onShow: function ($element) {

					if ($element.position().left < 0) {
						var newP = (parseInt($('.webui-arrow').position().left) + parseInt($element.position().left)) + "px";
						$element.css({ left: 0 });
						$('.webui-arrow').css({ left: newP });
					}
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

			if (mode === "detail") {
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

				if (tempDefectData.length !== 0) {
					var $dd = $('#tblDefectDetails');

					if ($.fn.DataTable.isDataTable("#tblDefectDetails")) {
						$dd.DataTable().clear().destroy();
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
						"pageLength": 5
					});

					table.columns([0, 4, 5]).visible(false, false);
					table.columns.adjust().draw(false);
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
		InitialProductionLinePO();
		InitialDetailsPO(element);
	}

}(jQuery));