
function init() {
	var there = localStorage.getItem('lastDomain');
	if (there) {
		logIn(there);
	}
}
window.onload = init;

function logIn(domain) {

    console.log('hiiii')

    var instanceDomain = domain || document.getElementById('instance-domain').value;
    var userEmail = "doesn't matter";
    var serverUrl = 'https://' + instanceDomain;
    var ownUrl = window.location.href;
    localStorage.setItem('lastDomain', instanceDomain);

    var app = new Libodon('skiline', ownUrl, 'read');
    app.use_actionlog();
    app.use_errorlog();
    var connection = app.connect(serverUrl, userEmail)
    connection.then(conn=>{
        if(conn.result == 'redirect') {
            // conn.target now holds an URL that the browser / user agent should be directed to
            console.log('redirect');
            window.location.href = conn.target;
        } else if(conn.result == 'success'){
            // connection is successful and the app is usable
            console.log('success');
            document.getElementById('login').style.display = "none";
            beginWatching(app, serverUrl);
        } else {
            console.log(conn.result);
        }
    })

}

function generateStar(data) {
	var star = document.createElement("div");
	star.classList.add("star");
	var toot = document.createElement("div");
	toot.classList.add("toot");
	toot.innerHTML = data.content;
	// the character is a link emoji
	var linkOut = document.createElement("a");
	linkOut.appendChild(document.createTextNode("🔗"));
	linkOut.href = data.url;
	linkOut.classList.add("link-out");
	linkOutP = document.createElement("p");
	linkOutP.appendChild(linkOut);
	toot.appendChild(linkOutP);
	var icon = document.createElement("span");
	icon.classList.add("icon");
	icon.appendChild(document.createTextNode("✨"));
	// Because of our margin trickery, we can't do this to `star`,
	// we have to manually do it to icon and toot
	mouseOverHandle = e => {
		toot.style.display = "block";
		star.style.animationPlayState = "paused";
	};
	icon.addEventListener("mouseover", mouseOverHandle);
	toot.addEventListener("mouseover", mouseOverHandle);
	mouseOutHandle = e => {
		// Needed for click to hold
		if (!toot.classList.contains("held")) {
			toot.style.display = "none";
			star.style.animationPlayState = "running";
		}
	};
	icon.addEventListener("mouseout", mouseOutHandle);
	toot.addEventListener("mouseout", mouseOutHandle);
	// Click to "hold"
	icon.addEventListener("click", e => {
		toot.classList.toggle("held");
	});
	star.appendChild(icon);
	star.appendChild(toot);
	document.body.appendChild(star);
	return star;
}

function spawnStar(data, avgFallTime, top) {
	var star = generateStar(data);
	var MAX_LEFT = 77; // Comes from the bg image with stuff on the right
	var x = Math.floor(Math.random() * MAX_LEFT);
	star.style.left = x+"%";
	if (top) {
		star.style.top = top+"%";
	}
	// this is an ESTIMATE assuming a certain font size!
	// TODO: this is garbage! but it's better than nothing
	var halfBoxWidth = 280;
	// Prevent the toot from going offscreen
	if (star.offsetLeft < halfBoxWidth) {
		star.querySelector(".toot").style.left = `calc(-50% + ${halfBoxWidth-star.offsetLeft}px)`;
	}
	var duration = Math.random() * 2 * avgFallTime;
	star.style.animationDuration = duration+'s';
}

function beginWatching(app, serverUrl) {
	var stream = new EventSource(serverUrl + "/api/v1/streaming/public");
	var avgFallTime;
	app.timeline('public').then(tl => {
		// A bigger number makes more stars :), but they move slower :(
		// Because i masked out so much space im increasing the star count by a lot
		const TARGET_STAR_COUNT = 30;
		//const TARGET_STAR_COUNT = tl.length;
		console.log(tl);
		first = new Date(tl[0].created_at);
		last = new Date(tl[tl.length-1].created_at);
		var span = first - last
		var avgTootTime = span / tl.length / 1000;
		avgFallTime = avgTootTime * TARGET_STAR_COUNT;
		// TODO: Only display up to TARGET_STAR_COUNT toots?
		for (var toot of tl) {
			topProp = (new Date(toot.created_at) - last) / span;
			var adjustedFall = (1 - topProp) * avgFallTime
			spawnStar(toot, adjustedFall, topProp*100);
		}
	});
	stream.addEventListener("update", e => {
		var toot = JSON.parse(e.data);
		spawnStar(toot, avgFallTime);
	}, false);
}


