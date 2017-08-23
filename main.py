from flask import Flask
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
