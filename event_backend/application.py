from flask import Flask
from flask_cors import CORS
from shared import Database

from routes.event.event_blueprint import event_blueprint
from routes.preference.preference_blueprint import preference_blueprint
from routes.processes.process_blueprint import process_blueprint


def create_app():
    app = Flask(__name__)

    Database.initialise()

    app.register_blueprint(event_blueprint)
    app.register_blueprint(preference_blueprint)
    app.register_blueprint(process_blueprint)

    app.config.from_pyfile('config.py')

    return app


app = create_app()

CORS(app, origins=["http://localhost:5173"], supports_credentials=True)

if __name__ == "__main__":
    app.run(debug=app.config['DEBUG_MODE'], host="0.0.0.0")
