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

    var _Events = {
        show: function () {
            var $this = $(this);
            var data = $this.data('tooltipify');
            var tooltip = data.tooltip;
            // We don't need to show a already visible tooltip.
            if (tooltip.is(':visible')) { return; }
            var settings = data.settings;
            var pos = $this.position();
            tooltip.show()
                   .css({
                       // The height of the tooltip does not seem to be correct, count height of all children.
                       'top': pos.top - (tooltip.children('.text').outerHeight() + tooltip.children('.icon').outerHeight() + settings.offsetTop),
                       'left': pos.left - settings.animationOffset
                   }).removeClass('hide')
                   .animate({
                       opacity: settings.opacity,
                       left: '+=' + settings.animationOffset,
                   }, settings.animationDuration, function () {
                       $(this).addClass('show');
                   })
        },
        hide: function () {
            var $this = $(this);
            var data = $this.data('tooltipify');
            var tooltip = data.tooltip;
            // We don't need to hide a already hidden tooltip.
            if (!tooltip.is(':visible')) { return; }
            var settings = data.settings;
            tooltip.removeClass('show')
                   .animate({
                       opacity: 0,
                       left: '-=' + settings.animationOffset,
                   }, settings.animationDuration, function () {
                       $(this).addClass('hide')
                              .hide();
                   });
        }
    }

    var methods = {
        init: function (options) {
            // Extend arguments with defaults.
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
                    // Create tooltip.
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
                    // Bind show and hide events to original event.
                    $this.bind(settings.openEvent, _Events.show)
                         .bind(settings.closeEvent, _Events.hide)
                         // Store all requiredn data.
                         .data('tooltipify', {
                             tooltip: tooltip,
                             title: $this.attr('title'),
                             settings: settings
                         }).attr('title', '');
                    // Append tooltip to end of body.
                    $('body').append(tooltip);
                }
            });
        },
        // Destroy and cleanup of tooltipify plugin.
        destroy: function () {
            return this.each(function () {
                var $this = $(this),
					data = $this.data('tooltipify');
                if (data) {
                    $(window).unbind('.tooltipify');
					$this.unbind(data.settings.openEvent, _Events.show);
					$this.unbind(data.settings.closeEvent, _Events.hide);
                    $this.attr('title', data.title);
                    data.tooltip.remove();
                    $this.removeData('tooltipify')
                }
            });
        },
        // Show event for displaying the tooltip.
        show: function () {
            return this.each(function () {
                var data = $(this).data('tooltipify');
                if (data) {
                    $(this).trigger(data.settings.openEvent);
                }
            });
        },
        // Hide event for hiding tooltip.
        hide: function () {
            return this.each(function () {
                var data = $(this).data('tooltipify');
                if (data) {
                    $(this).trigger(data.settings.closeEvent);
                }
            });
        }
    };

    // Initializer of tooltipify plugin.
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