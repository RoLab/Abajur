"use strict";
var Catalog = function () {
    var that = this;
    that.wrapper = $("#secondPage");
    that.layout = $('<div id="vizor">');
    that.wrapper.append(that.layout);
    that.imagesCatalog = [];
    $("img", that.wrapper.get(0)).each(function (index, elem) {
        elem.className = "catalogImage";
        that.imagesCatalog.push(elem);
        $(elem).detach();

    });
    that.panels = [];
    var count = that.count = Math.ceil(that.imagesCatalog.length / 6);
    for (var i = 0; i < count; i++) {
        that.panels.push(new Panel());
    }
    var k = 0;
    for (i = 0; i < that.imagesCatalog.length; i++) {
        if (i != 0 && (i % 6 == 0)) {
            k++
        }
        that.panels[k].append(that.imagesCatalog[i]);

    }
    that.displayed = 0;
    that.displayedPanel = $('<div style="width:' + $('#secondPage').width() + 'px; height:800px; float:left">');
    that.layout.append(that.displayedPanel);
    that.initArrows();
    that.show(0)
};

Catalog.prototype.show = function (index) {
    var that = this;
    var roller = $('<div class="roller">');
    roller.width(that.layout.width() * 2);

    if (that.displayed > index) {
        roller.css({
            "left": -that.layout.width() + "px"
        });
        roller.append(that.panels[index].wrapper);
        roller.append(that.displayedPanel);
        setTimeout(function () {
            roller.css({
                "left": 0
            });
        }, 1);
    } else {
        that.layout.css({
            "left": 0
        });
        roller.append(that.displayedPanel);
        roller.append(that.panels[index].wrapper);
        setTimeout(function () {
            roller.css({
                "left": -that.layout.width() + "px"
            });
        }, 1);
    }

    that.layout.append(roller);

    setTimeout(function transitionEnd() {
        that.layout.append(that.panels[index].wrapper);
        that.displayedPanel = that.panels[index].wrapper;
        roller.remove();
    }, 600);

    that.displayed = index;
    that.arrows.right.css("display", "block");
    that.arrows.left.css("display", "block");
    if (index == that.count - 1) {
        that.arrows.right.css("display", "none");
    }
    if (index == 0) {
        that.arrows.left.css("display", "none");
    }
    /*
     that.layout.one("transitionend", transitionEnd);
     that.layout.one("webkitTransitionEnd", transitionEnd);
     that.layout.one("oTransitionEnd", transitionEnd);
     */
};

Catalog.prototype.initArrows = function() {
    var that = this;
    that.arrows = {};
    var left = that.arrows.left = $('<div class="arrow" style="left:50px">');
    var right = that.arrows.right = $('<div class="arrow" style="right:50px">');
    that.wrapper.append(left);
    that.wrapper.append(right);
    left.on("click", function() {
        that.show(that.displayed - 1);
    });
    right.on("click", function() {
        that.show(that.displayed + 1);
    });
};

var Panel = function () {

    var that = this;
    that.wrapper = $('<div class="panel">');
    that.wrapper.width($('#secondPage').width());
    that.cells = [];
    for (var i = 0; i < 6; i++) {

        var elem = $('<div class="cell">');
        var margin = $('<div class="marginer">');
        elem.append(margin);
        that.cells.push(margin);
        that.wrapper.append(elem);

    }
    that.images = 0
};

Panel.prototype.append = function (elem) {
    var that = this;
    that.cells[that.images].append(elem);
    that.images++;

};