/*!
 * jquery.wordcloud.js
 * Simple Word Cloud Plugin for JQuery
 *
 * Created by TechSlides.com
 * Inspired by https://github.com/addywaddy/jquery.tagcloud.js
 */

$.fn.extend({ 

  tagcloud: function(options) {

    var defaults = {
        size: {start: 14, end: 30, unit: "px"},
	  	color: {start: '#333', end: '#f52'}
    }
    var opts = $.extend({}, defaults, options);

    // Converts hex to an RGB array
    var toRGB = function(code) {
        if (code.length === 4) {
          code = jQuery.map(/\w+/.exec(code), function(el) {return el + el; }).join("");
        }
        var hex = /(\w{2})(\w{2})(\w{2})/.exec(code);
        return [parseInt(hex[1], 16), parseInt(hex[2], 16), parseInt(hex[3], 16)];
    };

    // Converts an RGB array to hex
    var toHex = function(ary) {
        return "#" + jQuery.map(ary, function(i) {
          var hex =  i.toString(16);
          hex = (hex.length === 1) ? "0" + hex : hex;
          return hex;
        }).join("");
    };

    var colorIncrement = function(color, range) {
        return jQuery.map(toRGB(color.end), function(n, i) {
          return (n - toRGB(color.start)[i])/range;
        });
    };

    var tagColor = function(color, increment, weighting) {
        var rgb = jQuery.map(toRGB(color.start), function(n, i) {
          var ref = Math.round(n + (increment[i] * weighting));
          if (ref > 255) {
            ref = 255;
          } else {
            if (ref < 0) {
              ref = 0;
            }
          }
          return ref;
        });
        return toHex(rgb);
    };

    var counts = {}; // object for math
    for (var i=0; i<this.length; i++) {
      var sWord = $(this[i]).text();
      counts[sWord] = counts[sWord] || 0;
      counts[sWord]++;
    }

    var c=0;
    for (var prop in this) {
      var word = $(this[c]).text();
      $(this[c]).attr("rel",counts[word]);   
      c++;
    }

    var tagWeights = [];
    var ids = [];

    $(this.selector).each(function() {

        if (ids[this.textContent]) {
              $(this).remove();
          } else {
              ids[this.textContent] = this;
              tagWeights.push($(this).attr("rel")); 
          }

    });

    tagWeights = tagWeights.sort(function(a, b){
        return a - b;
    });

    var lowest = tagWeights[0];
    var highest = tagWeights.pop();
    var range = highest - lowest;

    if(range === 0) {range = 1;}

    // Sizes
    var fontIncr, colorIncr;
    if (opts.size) {
      fontIncr = (opts.size.end - opts.size.start)/range;
    }

    // Colors
    if (opts.color) {
      colorIncr = colorIncrement (opts.color, range);
    }

    return this.each(function() {
      var weighting = $(this).attr("rel") - lowest;
      if (opts.size) {
        $(this).css({"font-size": opts.size.start + (weighting * fontIncr) + opts.size.unit});
      }
      if (opts.color) {
        $(this).css({"color": tagColor(opts.color, colorIncr, weighting)});
      }
    });

  }

});