function jumble(letter, color, xOffset, yOffset) {
	if (typeof xOffset == "undefined" && typeof yOffset == "undefined") {
		var xOffset = 30;
		var yOffset = 50;
	}
	var x = Math.random() * xOffset - xOffset/2;
	var y = Math.random() * yOffset - yOffset/2;
	letter.css({
		"left": x,
		"top": y,
	});
	if (color) {
		var minC = 100;
		var maxC = 255;
		var diffC = maxC - minC;
		var r = Math.floor(Math.random() * diffC + minC);
		var g = Math.floor(Math.random() * diffC + minC);
		var b = Math.floor(Math.random() * diffC + minC);
		var color = "rgb(" + r + "," + g + "," + b + ")";
		letter.css({
			"color": color,
		});
	}
}
function wild(e) {
	e.each(function(i, element) {
		element = $(element);
		text = element.html();
		element.empty();
		for (var i=0; i<text.length; i++)
		{
			var letter = $("<span>").addClass("wild-letter").append(text[i]);
			jumble(letter, true);
			element.append(letter);
		}
	});
}
function reWild(e, color) {
	var already = false;
	e.children().each(function(i, element) {
		var e = $(element);
		if (e.hasClass("wild-letter")) {
			jumble(e, color);
			already = true;
		}
	});
	if (!already) {
		wild(e);
	}
}
function wildLineUp(e, color) {
	e.children().css({ left: 0, top: 0, color: "inherit" }); // color was #f6e3f6
}

function duplicate(e) {
	var count = 2;
	e.each(function(i, element) {
		var container = $("<div>").addClass("duplicated-container");
		var e = $(element);
		for (var i=0; i<count; i++) {
			var c = e.clone().insertAfter(e);
			jumble(c, true, 10, 10);
			container.append(c);
		}
		e.replaceWith(container);
	});
}

function twinkle(e) {
	e.each(function(i, element) {
		var e = $(element);
		var min = 220;
		var max = 255;
		var diff = max - min;
		var r = Math.random() * diff + min;
		var g = Math.random() * diff + min;
		var b = Math.random() * diff + min;
		var c = "rgb(" + r + "," + g + "," + b + ")";
		e.css({color: c});
	});
}

function init() {
	// Wild
	var whiteHover = true;
	var reversed = true;
	var twinkleLinks = false;
	var twinkleTime = 2000;
	wild($(".wild"));
	re = function() {
		reWild($(this), whiteHover);
	};
	un = function() {
		wildLineUp($(this), whiteHover);
	};
	if (reversed) {
		wildLineUp($(".wild"));
		$("a.wild").hover(re, un);
	}
	else {
		$("a.wild").hover(un, re);
	}
	if (twinkleLinks) {
		setInterval(function() {
			twinkle($("a, .wild-letter"))
		}, twinkleTime);
		$("a, .wild-litter").css({ transition: "color " + twinkleTime/1000 + "s"});
	}
	// Duplicated
	duplicate($(".duplicated"));
}
$(init);
