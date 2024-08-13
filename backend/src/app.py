from flask import Flask
from routes.dialogflow import botpost, botget
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

botpost(app)
botget(app)

if __name__ == '__main__':
    app.run(host='0.0.0.0', debug=True)
