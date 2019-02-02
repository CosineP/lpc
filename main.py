from flask import Flask, request
from flask import render_template

app = Flask(__name__)
app.config['DEBUG'] = True

@app.route("/")
@app.route("/resume")
def default():
	return render_template("resume.html")

@app.route("/it")
def it_home():
	return render_template("it/about.html", page="about")

@app.route("/it/<name>")
def it_page(name):
	return render_template("it/" + name + ".html", page=name)

@app.route("/home")
def personal_page():
	return render_template("home.html")

@app.route("/canvas")
def canvas_fun():
	return render_template("canvas.html")

@app.route("/colleges")
@app.route("/dartmouth")
@app.route("/georgia-tech")
@app.route("/nyu")
@app.route("/mit")
@app.route("/stanford")
@app.route("/mudd")
@app.route("/oberlin")
@app.route("/rit")
@app.route("/umass-amherst")
@app.route("/georgia-state")
@app.route("/wit")
@app.route("/unb")
def colleges_resume():
	college = request.url_rule.rule[1:]
	full_names = {
		"colleges" : "college",
		"dartmouth" : "Dartmouth",
		"georgia-tech" : "Georgia Tech",
		"nyu" : "New York University",
		"mit" : "MIT",
		"stanford" : "Stanford",
		"mudd" : "Harvey Mudd",
		"oberlin" : "Oberlin",
		"rit" : "RIT",
		"umass-amherst" : "UMass Amherst",
		"georgia-state" : "Georgia State",
		"wit" : "Wentworth Institute of Technology",
		"unb" : "University of New Brunswick",
		}
	return render_template("colleges/interactive.html", college=college, name=full_names[college])

