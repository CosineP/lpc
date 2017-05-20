/* slider.js

 * Makes an animated scroll through "slides" of content with a set of links on top.

 * How to use:
 * Include `it.css`, jQuery, and `slider.js`
 * Then have in your html:

	<div class="slider card">
		<ul class="slider-nav">
			<li id="l-slide1" class="active"><a href="#slide1">Slide 1 Link</a></li>
			<li id="l-slide2"><a href="#slide2">Slide 2 Link</a></li>
		</ul>
		<div class="slides">
			<div class="slide" id="s-slide1">CONTENT Slide 1</div>
			<div class="slide offscreen" id="s-slide2">CONTENT Slide 2</div>
		</div>
	</div>

 * The classes and ids are important. Each link must have id `l-{slide name}`
 * Each slide must have id `s-{slide name}`. Each class is neccessary to
 * display correctly, not merely for stylistic reasons.
 */

function scrollNav(e)
{

	// Using links with #hrefs
	var name = window.location.hash.substr(1);
	var part = name ? $("#s-" + name) : $(".slides").children(":first");

	// Each section is lined up (hidden) horizontally
	var horizontal = $(".slides");
	// Move the lineup backwards until only the section is visible
	horizontal.css("margin-left", -part.position().left);
	// (This parameter is animated by CSS automatically)

	// Change the height to correspond to the content's height
	// Added to the bottom so it doesn't end right at the content's end
	var bottomPadding = 20;
	var totalHeight = part.height() + $(".slider-nav").height() + bottomPadding;
	$(".slider").height(totalHeight);
	// This too is animated by CSS automatically

	// Update the lines in the navigation bar
	var old;
	// Remove the old one
	if (!e || e.originalEvent.oldURL.indexOf("#") == -1)
	{
		// If we're moving from base, remove the default line from the first
		old = $(".slider-nav").children(":first");
	}
	else
	{
		old = e.originalEvent.oldURL;
		old = old.substr(old.indexOf("#") + 1);
		old = $("#l-" + old);
	}
	old.removeClass("active");
	// ... and add the new one
	// If name is undefined, then we have defaulted to first.
	// To declutter the HTML, we add `.active` in the JS.
	(name ? $("#l-" + name) : old).addClass("active");
}
$(window).on("hashchange", scrollNav);
$(function()
{
	scrollNav();
});
