from flask import Flask
from flask import render_template

app = Flask(__name__)
app.config['DEBUG'] = True

@app.route("/")
def default():
	return render_template("index.html")

@app.route("/it")
def it_home():
	return render_template("it/about.html", page="about")

@app.route("/it/<name>")
def it_page(name):
	return render_template("it/" + name + ".html", page=name)

@app.route("/alec")
def prom():
	return render_template("alec.html")

