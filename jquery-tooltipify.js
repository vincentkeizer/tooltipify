/*
 * File:        jquery-tooltipify.js
 * Version:     0.1
 * Author:      Vincent Keizer (www.vicreative.nl)
 * Info:        www.vicreative.nl/projects/Tooltipify
 * 
 * Copyright 2012-2013 Vincent Keizer, all rights reserved.
 *
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * 
 */
(function ($) {

    var methods = {
        init: function (options) {

            var settings = $.extend({
				'offsetLeft' : 0,
				'offsetTop' : -7,
				'opacity' : 0.8,
                'animationDuration': 100,
                'animationOffset': 50,
                'openEvent': 'mouseover',
                'closeEvent': 'mouseout',
            }, options);

            return $(this).each(function () {
                var $this = $(this);
                var data = $this.data('tooltipify');

                // If the plugin hasn't been initialized yet
                if (!data) {

                    var tooltip = $('<div />', {
                        'class': 'tooltipify hide',
                        'css': {
                            'position': 'absolute',
                            'display': 'none',
                            'opacity': '0'
                        }
                    }).append($('<span />', {
                        'text': $this.attr('title'),
						'class': 'text'
                    })).append($('<span />', {
                        'class': 'icon'
                    }));
                    tooltip.bind('show', function () {
						if ($(this).is(':visible')) { return; }
					
                        var pos = $this.position();
                        $(this).show()
							   .css({
								'top': pos.top - ($(this).children('.text').outerHeight() + $(this).children('.icon').outerHeight() + settings.offsetTop),
								'left': pos.left - settings.animationOffset
							}).removeClass('hide')
							   .animate({
							       opacity: settings.opacity,
							       left: '+=' + settings.animationOffset,
							   }, settings.animationDuration, function () {
							       $(this).addClass('show');
							   });
                    }).bind('hide', function () {
						if (!$(this).is(':visible')) { return; }
                        $(this).removeClass('show')
							   .animate({
							       opacity: 0,
							       left: '-=' + settings.animationOffset,
							   }, settings.animationDuration, function () {
							       $(this).addClass('hide')
										  .hide();
							   });
                    });

                    $this.bind(settings.openEvent, function () {
                        $(this).data().tooltipify.tooltipify.trigger('show');
                    }).bind(settings.closeEvent, function () {
                        $(this).data().tooltipify.tooltipify.trigger('hide');
                    }).data('tooltipify', {
                        target: $this,
                        tooltipify: tooltip,
                        title: $this.attr('title'),
						settings : settings
                    }).attr('title', '');
                    $('body').append(tooltip);
                }
            });
        },
        destroy: function () {
            return this.each(function () {
                var $this = $(this),
					data = $this.data('tooltipify');
                if (data) {
                    $(window).unbind('.tooltipify');
					$this.unbind(data.settings.openEvent);
					$this.unbind(data.settings.closeEvent);
                    $this.attr('title', data.title);
                    data.tooltipify.remove();
                    $this.removeData('tooltipify')
                }
            });
        },
        show: function () {
            return this.each(function () {
                var data = $(this).data('tooltipify');
                if (data) {
                    data.tooltipify.trigger("show");
                }
            });
        },
        hide: function () {
            return this.each(function () {
                var data = $(this).data('tooltipify');
                if (data) {
                    data.tooltipify.trigger("hide");
                }
            });
        }
    };

    $.fn.tooltipify = function (options) {
        var method = options;
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery tooltipify');
        }
    };

})(jQuery);