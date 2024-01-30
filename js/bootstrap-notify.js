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
  var CLASS_ALERT = 'alert';
  var CLASS_FADE = 'fade';
  var CLASS_IN = 'in';
  var CLASS_CLOSE = 'close';
  var ATTR_MESSAGE = 'message';
  
  class Notification {
    constructor(element, options) {
      this.$element = $(element);
      this.$note = $('<div class="alert"></div>');
      this.options = $.extend(true, {}, $.fn.notify.defaults, options);

      
      // Setup from options
      if (this.options.transition) {
        if (this.options.transition === 'fade')
          this.$note.addClass(CLASS_IN).addClass(this.options.transition)

        else
          this.$note.addClass(this.options.transition);
      }
      else
        this.$note.addClass(CLASS_FADE).addClass(CLASS_IN);

      if (this.options.type)
        this.$note.addClass(`${CLASS_ALERT}-${this.options.type}`);

      else
        this.$note.addClass(`${CLASS_ALERT}-success`);

      if (!this.options.message && this.$element.data(ATTR_MESSAGE) !== '') // dom text
        this.$note.html(this.$element.data(ATTR_MESSAGE));

      else if (typeof this.options.message === 'object') {
        if (this.options.message.html)
          this.$note.html(this.options.message.html);
          else if (this.options.message.text)
          this.$note.text(this.options.message.text);
      }
      else
        this.$note.html(this.options.message);

      if (this.options.closable) {
        const link = $(`<a class="${CLASS_CLOSE} pull-right" href="#">&times;</a>`);
        link.on('click', $.proxy(this.onClose, this));
        this.$note.prepend(link);
      }

      return this;
    }
    show() {
      if (this.options.fadeOut.enabled)
      this.$note.delay(this.options.fadeOut.delay || 3000).fadeOut('slow', $.proxy(this.onClose, this));

      this.$element.append(this.$note);
      this.$note.alert();
    }
    hide() {
      if (this.options.fadeOut.enabled)
      this.$note.delay(this.options.fadeOut.delay || 3000).fadeOut('slow', $.proxy(this.onClose, this));
      else this.onClose();
    }
  }

  var onClose = function() {
    this.options.onClose();
    this.$note.remove();
    this.options.onClosed();
    return false;
  };


  $.fn.notify = function (options) {
    return new Notification(this, options);
  };

  $.fn.notify.defaults = {
    type: 'success',
    closable: true,
    transition: 'fade',
    fadeOut: {
      enabled: true,
      delay: 3000
    },
    message: null,
    onClose: function () {},
    onClosed: function () {}
    console.log('Notification fully closed');
  };
})(window.jQuery);
