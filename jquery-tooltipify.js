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

    // Helper methods
    var _helper = {

        // Create tooltip
        createTooltip: function (data) {
            var tooltip = $('<div />', {
                'class': 'tooltipify hide ' + data.settings.position,
                'css': {
                    'position': 'absolute',
                    'display': 'none',
                    'opacity': '0'
                }
            }).append($('<span />', {
                'text': data.title,
                'class': 'text'
            })).append($('<span />', {
                'class': 'icon'
            }));
            return tooltip;
        },

        // Set position of tooltip
        setPosition: function (tooltip, element, settings) {
            var pos = element.position();
            tooltip.css({
                // The height of the tooltip does not seem to be correct, count height of all children.
                'top': _helper.getYPosition(settings, element, tooltip),
                'left': _helper.getXPosition(settings, element, tooltip)
            });
            return tooltip;
        },

        // Gets the tooltip height.
        getTooltipHeigh: function (tooltip) {
            return tooltip.children('.text').outerHeight() + tooltip.children('.icon').outerHeight();
        },
        // Gets the tooltip width.
        getTooltipWidth: function (tooltip) {
            var icon = tooltip.find('.icon');
            return tooltip.outerWidth() + (icon.hasClass("left") || icon.hasClass('right') ? icon.outerWidth() : 0);
        },

        // Gets the Y position for tooltip.
        getYPosition: function (settings, element, tooltip) {
            var pos = element.position();
            switch (settings.position) {
                case 'left':
                    return (pos.top + (element.height() / 2) + settings.offsetTop) - (_helper.getTooltipHeigh(tooltip) / 2);
                case 'right':
                    return (pos.top + (element.height() / 2) + settings.offsetTop) - (_helper.getTooltipHeigh(tooltip) / 2);
                case 'bottom':
                    return pos.top + (_helper.getTooltipHeigh(tooltip) + settings.offsetTop);
                default:
                    return pos.top - (_helper.getTooltipHeigh(tooltip) + settings.offsetTop);
            }
        },
        // Gets the X position for tooltip.
        getXPosition: function (settings, element, tooltip) {
            var pos = element.position();
            switch (settings.position) {
                case 'left':
                    return (pos.left + settings.offsetLeft) - _helper.getTooltipWidth(tooltip);
                case 'right':
                    return pos.left + element.outerWidth() + tooltip.find('.icon').outerWidth() + settings.offsetLeft;
                case 'bottom':
                    return pos.left + settings.offsetLeft;
                default:
                    return pos.left + settings.offsetLeft;
            }
        },
    };
    // Tooltip events.
    var _events = {
        show: function () {
            var $this = $(this);
            var data = $this.data('tooltipify');
            var tooltip = data.tooltip;
            // We don't need to show a already visible tooltip.
            if (tooltip && tooltip.length) { return; }
            var tooltip = _helper.createTooltip(data);
            // Save tooltip in data and add before element.
            data.tooltip = tooltip;
            $this.before(tooltip);
            var settings = data.settings
            _helper.setPosition(tooltip, $this, settings);
            // Create animation for animationProperty.
            var animation = { opacity: settings.opacity };
            if (settings.animationProperty) {
                var orgValue = parseInt(tooltip.css(settings.animationProperty).replace(/[^-\d\.]/g, ''));
                tooltip.css(settings.animationProperty, orgValue - settings.animationOffset);
                animation[settings.animationProperty] = '+=' + settings.animationOffset;
            }
            tooltip.show()
                   .removeClass('hide')
                   .animate(animation, settings.animationDuration, function () {
                       $(this).addClass('show');
                   });
        },
        hide: function () {
            var $this = $(this);
            var data = $this.data('tooltipify');
            var tooltip = data.tooltip;
            // We don't need to hide a already hidden tooltip.
            if (!tooltip || !tooltip.length || !tooltip.is(':visible')) { return; }
            var settings = data.settings;
            // Create animation for animationProperty
            var animation = { opacity: 0 };
            if (settings.animationProperty) {
                animation[settings.animationProperty] = '-=' + settings.animationOffset;
            }
            tooltip.removeClass('show')
                   .animate(animation, settings.animationDuration, function () {
                       $(this).remove();
                       $this.data('tooltipify').tooltip = null;
                   });
        }
    };
    // Tooltip methods.
    var methods = {
        // Initializes a new tooltip
        init: function (options) {
            // Extend arguments with defaults.
            var settings = $.extend({
                'position': 'top',
                'offsetLeft': 0,
                'offsetTop': 0,
                'opacity': 0.8,
                'animationProperty': 'left',
                'animationOffset': 50,
                'animationDuration': 100,
                'openEvent': 'mouseover',
                'closeEvent': 'mouseout',
            }, options);

            return $(this).each(function () {
                var $this = $(this);
                var data = $this.data('tooltipify');

                // If the plugin hasn't been initialized yet
                if (!data) {
                    // Create tooltip.
                    // Bind show and hide events to original event.
                    $this.bind(settings.openEvent, _events.show)
                         .bind(settings.closeEvent, _events.hide)
                         // Store all requiredn data.
                         .data('tooltipify', {
                             title: $this.attr('title'),
                             tabindex: $this.attr('tabindex'),
                             settings: settings
                         }).attr('title', '');

                    if (!$this.attr('tabindex')) {
                        $this.attr('tabindex', '0'); // Used for events like 'focus' and 'focusout'
                    }
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
                    $this.unbind(data.settings.openEvent, _events.show)
                         .unbind(data.settings.closeEvent, _events.hide)
                         .attr('title', data.title)
                         .attr('tabindex', data.tabindex);
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