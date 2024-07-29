from flask import Flask

# python -m flask --app .\application.py run

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"