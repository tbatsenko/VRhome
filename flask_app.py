from flask import Flask, render_template
app = Flask(__name__)


@app.route('/')
def hello_world():
    return render_template("mic.html")


@app.route('/mic')
def mic():
    return render_template("mic.html")

@app.route('/auth')
def auth():
    return render_template("login.html")

