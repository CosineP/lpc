from flask import Flask
from flask import render_template

app = Flask(__name__)
app.config['DEBUG'] = True

@app.route("/")
def default():
	return render_template("index.html")

@app.route("/it")
def it_home():
	return render_template("it/index.html")

@app.route("/it/<name>")
def it_page(name):
	return render_template("it/" + name + ".html")
