from services.payload import send_message_to_dialogflow
from flask import jsonify, request
from utils.generate_id import session_id
from services.gcp_auth.auth import get_access_token
from models.messages.bot_message import extract_bot_response


historico_de_mensagens = []
user_id = session_id()


def payloadcontroller():
    try:
            mensagem = request.json.get('mensagem')
            access_token = get_access_token()
            resultado = send_message_to_dialogflow(mensagem, access_token,user_id)
            resposta_do_bot = extract_bot_response(resultado)
            return jsonify({'resposta_do_bot': resposta_do_bot})
    except Exception as e:
            return jsonify({'error': 'Internal Server Error:' + str(e)}), 500
    
def gethearthcontroller():
        global user_id
        user_id = session_id()  # Gera um único user_id para cada requisição get
        global historico_de_mensagens
        historico_de_mensagens.clear()
        return  "LaskerBot Is Live"