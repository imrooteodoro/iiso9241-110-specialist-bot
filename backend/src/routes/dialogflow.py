from flask import Flask, request, jsonify
from controllers.payloadcontroller import payloadcontroller, gethearthcontroller


def botget(app):
    @app.route('/', methods=['GET'])
    def get_mensagem_do_bot():
        response = gethearthcontroller()
        return response
     

def botpost(app):
    @app.route('/dialogflow', methods=['POST'])
    def enviar_mensagem_para_dialogflow():
        response = payloadcontroller()
        return response

    
        
    


    