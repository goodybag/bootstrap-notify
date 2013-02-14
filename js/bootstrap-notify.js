/**
 * bootstrap-notify.js v1.0
 * --
 * Copyright 2012 Goodybag, Inc.
 * --
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function ($) {
    "use strict";

    var Notification = function (container, options) {
        this.$container = $(container);
        this.options = this.normalizeOptions(options);
        this.proxiedOnClose = $.proxy(this.onClose, this);

        this.$note = $('<div />', {
            'class': ['alert', this.options.transition, 'in',  'alert-' + this.options.type].join(' ')
        });
        this.setMessage(this.options.message);

        if (this.options.closable) {
            var link = $('<a class="close pull-right" href="#">&times;</a>').click(this.proxiedOnClose);
            this.$note.prepend(link);
        }
    };

    Notification.prototype = {
        defaultOptions: {
            message: null,
            type: 'success',
            closable: true,
            transition: 'fade',
            fadeOutDelay: 3000,
            onClose: function () {},
            onClosed: function () {}
        },
        normalizeOptions: function (options) {
            if (!options.type) {
                options.type = this.defaultOptions.type;
            }
            if (!options.transition) {
                options.transition = this.defaultOptions.transition;
            }

            return options;
        },
        setMessage: function (message) {
            var str, method = 'html';
            if (typeof message === 'object') {
                if (message.text) {
                    str = message.text;
                    method = 'text';
                } else {
                    str = message.html;
                }
            } else {
                str = message;
            }

            this.$note[method](str);
        },
        onClose: function () {
            this.options.onClose();
            this.$note.remove();
            this.options.onClosed();
        },
        fadeOutIfEnable: function () {
            var delay = this.options.fadeOutDelay;
            if (delay !== false) {
                this.$note
                    .delay(delay || 3000)
                    .fadeOut('slow', this.proxiedOnClose);
            }

            return delay === false;
        },
        show: function () {
            this.fadeOutIfEnable();

            this.$container.append(this.$note);
            this.$note.alert();
        },
        hide: function () {
            if (!this.fadeOutIfEnable()) {
                this.onClose();
            }
        }
    };

    $.fn.notify = function (options) {
        return new Notification(this, $.extend(true, {}, $.fn.notify.defaults, options));
    };

    $.fn.notify.defaults = Notification.prototype.defaultOptions;
}(window.jQuery));
