// Global vars
var bg = null;
var img = null;
var imageData = null;
var pxls = null;

function randomPastelle()
{
	var c = []
	// Semicolon <3 i too :)
	for (var i=0; i<3; i++)
	{
		c.push(Math.random() * 100 + 155);
	}
	return c;
}
// Actually just elementwiseArrayAdd
function addColor(a, b)
{
	return a.map(function(c,i){return c+b[i];});
}
function multiplyScalar(a, b)
{
	return a.map(function(c){return c*b;});
}
function posColor(a)
{
	for (var i=0; i<a.length; i++)
	{
		if (a[i] < 0)
		{
			a[i] = 0;
		}
	}
}

//rotate/flip a quadrant appropriately (used for dToXY
function rot(n, x, y, rx, ry) {
	if (ry == 0) {
		if (rx == 1) {
			x = n-1 - x;
			y = n-1 - y;
		}

		//Swap x and y
		var t  = x;
		x = y;
		y = t;
	}
	return [x, y];
}


// Hilbert curve thanks https://en.wikipedia.org/wiki/Hilbert_curve
function dToXY(n, d)
{
	var rx, ry, s, t=d;
	var x = 0;
	var y = 0;
	for (s=1; s<n; s*=2) {
		rx = 1 & (t/2);
		ry = 1 & (t ^ rx);
		var pos = rot(s, x, y, rx, ry);
		x = pos[0];
		y = pos[1];
		x += s * rx;
		y += s * ry;
		t /= 4;
	}
	return [x, y];
}

function getIndex(x, y)
{
	return (y * bg.width + x) * 4;
}
function getPixel(x, y)
{
	var r = getIndex(x, y);
	return [pxls[r], pxls[r+1], pxls[r+2], pxls[r+3]]
}
function setPixel(x, y, color)
{
	if (color.length < 3)
	{
		throw (str(color) + " is not a color");
	}
	if (color.length < 4)
	{
		color.push(255);
	}
	var i = getIndex(x, y);
	pxls[i] = color[0];
	pxls[i+1] = color[1];
	pxls[i+2] = color[2];
	pxls[i+3] = color[3];
}

function hilbertPaint(d)
{
	if (typeof d == "undefined")
	{
		d = 0;
	}
	if (d == bg.width * bg.height)
	{
		finalize(true);
		return;
	}
	var pos = dToXY(bg.width, d);
	var x = pos[0];
	var y = pos[1];
	if (x == 0 && y == 0)
	{
		setPixel(x, y, randomPastelle());
	}
	else
	{
		var ref = [0, 0, 0, 0];
		var count = Math.min(d, 6);
		for (var i=1; i<=count; i++)
		{
			pos = dToXY(bg.width, d-i);
			ref = addColor(ref, getPixel(pos[0], pos[1]));
		}
		ref = multiplyScalar(ref, 1/count);
		var stray = 2;
		ref[0] += Math.random() * stray - stray/2;
		ref[1] += Math.random() * stray - stray/2;
		ref[2] += Math.random() * stray - stray/2;
		setPixel(x, y, ref);
	}
	func = function() { hilbertPaint(d + 1) };
	var sleep = (d % 1000 == 0);
	if (sleep)
	{
		setTimeout(func, 0);
	}
	else
	{
		func();
	}
}
function recPnt(r, g, b, width, stray, d, x, y, completed)
{
	if (typeof d == "undefined")
	{
		d = 0;
	}
	if (typeof x == "undefined")
	{
		x = 0;
		y = 0;
		// Object so its persistent across functions
		completed = {};
		completed.i = 0;
	}
	if (Math.pow(2, d) >= width)
	{
		setPixel(x, y, [r, g, b]);
		completed.i += 1;
		if (completed.i >= width * width)
		{
			finalize(true);
		}
		return;
	}
	var offloadProp = 0.6;
	if (Math.pow(2, d+1) >= width)
	{
		// Draw the last row synchronously, otherwise it takes forever
		offloadProp = 0;
	}
	var size = width / Math.pow(2, d+1);
	for (var s=0; s<4; s++)
	{
		r += Math.random() * stray - stray/2;
		g += Math.random() * stray - stray/2;
		b += Math.random() * stray - stray/2;
		// Calculate the top-left corner of this section
		var isRight = s % 2;
		var isBottom = (s == 2 || s == 3);
		(function(r, g, b) {
			var func = function () {
				recPnt(r, g, b, width, stray, d+1, x+size*isRight, y+size*isBottom, completed);
			};
			if (Math.random() < offloadProp)
			{
				setTimeout(func, 0);
			}
			else
			{
				func();
			}
		})(r, g, b);
	}
}
function recursivePaint() {
	recPnt(randomPastelle()[0], randomPastelle()[1], randomPastelle()[2], bg.width, 10);
}
function diagonalPaint()
{
	for (var x=0; x<bg.width; x++)
	{
		for (var y=0; y<bg.height; y++)
		if (x == 0 && y == 0)
		{
			setPixel(x, y, randomPastelle());
		}
		else
		{
			var ref = [0, 0, 0, 0];
			var count = 0;
			if (x != 0)
			{
				ref = addColor(ref, getPixel(x-1, y));
				count++;
			}
			if (y != 0)
			{
				ref = addColor(ref, getPixel(x, y-1));
				count++;
			}
			ref = multiplyScalar(ref, 1/count);
			var stray = 2;
			ref[0] += Math.random() * stray - stray/2;
			ref[1] += Math.random() * stray - stray/2;
			ref[2] += Math.random() * stray - stray/2;
			setPixel(x, y, ref);
		}
	}
	setTimeout(function() { finalize(true) }, 0);
}
function recNudge(x, y, c, d)
{

	if (typeof d == "undefined")
	{
		d = {};
		d.callsWaiting = 1;
	}
	d.callsWaiting -= 1;

	var color = getPixel(x, y);
	if (color[0] == 0 && color[1] == 0 && color[2] == 0 && color[3] == 0)
	{
		color[0] = 255;
		color[1] = 255;
		color[2] = 255;
	}
	color = addColor(color, c);
	posColor(color);
	color[3] = 255;
	setPixel(x, y, color);

	var restChance = 0.25;
	var rest = Math.random() < restChance;
	stopMargin = -1;
	if (c[0] < stopMargin || c[1] < stopMargin || c[2] < stopMargin)
	{
		for (var nx=x-1; nx<=x+1; nx++)
		{
			for (var ny=y-1; ny<=y+1; ny++)
			{
				// Make sure pixel hasn't been already painted, don't go into recursive hell
				if (!d.hasOwnProperty(nx + "," + ny))
				{
					(function ()
					{
						// Catch the for loop variables
						var stray = 0.01;
						// var nc = multiplyScalar(c, 1 - Math.random() * stray);
						var nc = multiplyScalar(c, 1 - Math.random() * stray);
						// We need to copy these so that we can continue to modify them with a loop
						// A closure won't work because fsr it triggers a copy of d
						var cnx = nx;
						var cny = ny;
						var cnc = nc;
						// We don't want to kill the browser
						d.callsWaiting += 1;
						d[nx + "," + ny] = true;
						var next = function()
						{
							recNudge(cnx, cny, cnc, d)
						};
						// setTimeout(function() {recNudge(cnx, cny, cnc, d)}, 0);
						if (rest)
						{
							setTimeout(next, 0);
						}
						else
						{
							next();
						}
					})();
				}
			}
		}
	}

	var drawChance = 0;
	if (d.callsWaiting == 0 || Math.random() < drawChance) {
		finalize(true);
	}

}
function nudgePaint()
{
	var count = 40;
	for (var i=0; i<count; i++)
	{
		var stray = 255;
		var x = Math.floor(Math.random() * bg.width);
		var y = Math.floor(Math.random() * bg.height);
		var c = [-Math.random()*stray, -Math.random()*stray, -Math.random()*stray];
		// Scope, loops, and setTimeout = not fun. closure to fix
		(function(x, y, c) {
			recNudge(x, y, c);
		})(x, y, c);
	}
}
function gradPaint(count)
{
	if (typeof count == "undefined")
	{
		count = bg.width / 10;
	}
	if (count < 0)
	{
		finalize();
		return;
	}
	var x = Math.random() * bg.width;
	var y = Math.random() * bg.height;
	var maxRadius = bg.width;
	var r = Math.random() * maxRadius;
	var grad = img.createRadialGradient(x, y, r, x, y, 0);
	var maxC = 255;
	var maxA = 0.1;
	var c = [Math.random()*maxC, Math.random()*maxC, Math.random()*maxC, Math.random()*maxA];
	c0 = "rgba(" + c[0] + "," + c[1] + "," + c[2] + "," + c[3] + ")";
	c1 = "rgba(" + c[0] + "," + c[1] + "," + c[2] + ",0)";
	grad.addColorStop(1, c0);
	grad.addColorStop(0, c1);
	img.fillStyle = grad;
	img.fillRect(Math.max(0, x - r), Math.max(0, y - r), Math.min(x + r, bg.width - 1), Math.min(y + r, bg.height - 1));
	setTimeout(function() { gradPaint(count - 1) }, 0);
}
function finalize(putPixels)
{

	if (putPixels)
	{
		img.putImageData(imageData, 0, 0);
	}

	document.body.style.backgroundImage = "url(" + bg.toDataURL() + ")";

}
function randomPaint()
{
	var count = 5;
	var choice = Math.random();
	var dir = "/static/canvas-saves/"
	var start = dir + "recursive.png";
	console.log(choice);
	if (choice < 1/count)
	{
		recursivePaint();
	}
	else if (choice < 2/count)
	{
		start = dir + "hilbert.png";
		hilbertPaint();
	}
	else if (choice < 3/count)
	{
		start = dir + "diagonal.png";
		diagonalPaint();
	}
	else if (choice < 4/count)
	{
		nudgePaint();
	}
	else if (choice < 5/count)
	{
		start = dir + "grad.png";
		gradPaint();
	}
	document.body.style.backgroundImage = "url(" + start + ")";
}

function init()
{

	// Everything
	bg = document.createElement("canvas");
	// Smallest canvas with power of two size that is bigger than screen
	// Neets to be so for hilbert curve
	bg.width = Math.pow(2, Math.ceil(Math.log2(window.innerWidth)));
	bg.height = bg.width; // TODO: What do I want here?
	img = bg.getContext("2d");
	imageData = img.getImageData(0, 0, bg.width, bg.height);
	pxls = imageData.data;

}

function loaded()
{

	init();
	randomPaint();

}

window.onload = loaded;
