"use strict";
var Catalog = function () {
    var that = this;
    that.wrapper = $("#secondPage");
    that.layout = $('<div id="vizor">');
    that.wrapper.append(that.layout);

    that.viewer = new Viewer();

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
        that.panels[that.panels.length - 1].viewer = that.viewer;
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
    if (that.forbidden) {
        return;
    }
    that.forbidden = true;
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
        that.forbidden = false;
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
    elem.onclick = (function(elem) {
        return function() {
            that.viewer.show(elem);
        }
    })(elem);
    that.images++;

};

var Viewer = function() {
    var that = this;
    var wrapper = that.wrapper = $('<div class="viewer">');

    var glass = that.glass = $('<div class="glass">');
    $('body').prepend(wrapper).prepend(glass);
    glass.click(function() {
        that.hide();
    });

    var width = that.width = glass.width();
    var height = that.height = glass.height();

    wrapper.css({
        "width": width - width/10 +"px",
        "left": width/20 +"px"
    });

    var leftLayout = that.leftLayout = $('<div class="layout">');
    var rightLayout = that.rightLayout = $('<div class="layout">');

    wrapper.append(leftLayout);
    wrapper.append(rightLayout);

    leftLayout.css({
        width: height - height/5 + "px",
        height: height - height/5 + "px",
        top: height/20 + "px",
        left: height/20 + "px"
    });

    rightLayout.css({
        width: width - width/10 - (height - height/5) - height/10 + "px",
        height: height - height/5 + "px",
        top: height/20 + "px",
        left: height/20 + "px"
    });

    var placer = that.placer = $('<div class="placer">');
    var helper = $('<div class="helper">');
    leftLayout.append(placer);
    leftLayout.append(helper);

    var name = that.name = $('<h1 class="viewName">');
    var description = that.description = $('<p class = viewDescription>');
    var price = that.price = $('<h1 class="viewPrice">');

    rightLayout.append(name);
    rightLayout.append(description);
    rightLayout.append(price);
    rightLayout.css("text-align", "left");
};

Viewer.prototype.show = function(elem) {
    var that = this;

    that.wrapper.css({
        "top": that.height/20 + "px",
        "height": that.height - that.height/10 + "px",
        opacity: 1
    });
    that.glass.css({
        "z-index": 10
    });
    setTimeout(function() {
        that.glass.css({
            "opacity": 0.5
        });
    } ,1);

    var img = that.img = $('<img src="'+elem.src+'" class="fullSizeImage">');

    var jElem = $(elem);
    that.placer.append(img);
    that.name.html(jElem.data("name"));
    that.description.html(jElem.data("description"));
    that.price.html("Цена: " +jElem.data("price") + " р.");
};

Viewer.prototype.hide = function() {
    var that = this;

    that.wrapper.css({
        height: 0,
        top: "-500px",
        opacity: 0
    });
    that.glass.css("opacity", 0);
    setTimeout(function() {
        that.glass.css("z-index", -1);
        //that.placer.css("display", "none");
        that.img.remove();
        that.name.empty();
        that.description.empty();
        that.price.empty();
    },300);
};