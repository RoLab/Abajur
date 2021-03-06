/**
 * Created by betrayer on 06.10.14.
 */
"use strict";

var Scroller = function() {
    var that = this;
    var scrollbar = that.scrollbar = $('nav');

    var links = $('a', scrollbar.get(0));

    links.each(function(index, elem){
        elem.onclick = (function(href) {
            return function() {
                return that.scroll(href);
            }
        })(elem.href);
    });
    var upwardButton = $('#upwardButton');
    upwardButton.get(0).onclick = function() {
        return that.scroll();
    };
    var lights = $('.lighter');
    var elems = [];
    elems.push($('#firstPage'));
    elems.push($('#secondPage'));
    elems.push($('#servis'));
    elems.push($('#kontakt'));

    $(window).on('scroll', function(e) {
        if (scrollBlock) {
            e.preventDefault();
            return false;
        }
        var mainHref = $('#mainLink');
        var scrolled = window.pageYOffset || document.documentElement.scrollTop;
        if (scrolled > mainHref.height()) {
            scrollbar.css("position", "fixed");
            upwardButton.css("display", "block");
        } else {
            scrollbar.css("position", "relative");
            upwardButton.css("display", "none");
        }

        lights.css("opacity", 0);
        for (var i = 0; i < elems.length; i++) {
            if (scrolled >= elems[i].offset().top && scrolled < elems[i].offset().top + elems[i].height()) {
                lights.eq(i).css("opacity", 1);
                break;
            }
        }
    });

    document.onmousewheel = document.onwheel = function() {
        if (scrollBlock) {
            return false;
        }
    };
    document.addEventListener ("MozMousePixelScroll", function() {
        if (scrollBlock) {
            return false
        }
    }, false);
    document.onkeydown = function(e) {
        if (scrollBlock) {
            if (e.keyCode >= 33 && e.keyCode <= 40) return false;
        }
    }

};

Scroller.prototype.scroll = function(href) {

    $('html, body').animate({
        scrollTop: href ? $(href.slice(href.lastIndexOf("#"))).offset().top : 0
    }, 500
    );
    return false;
};