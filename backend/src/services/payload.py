import requests
from dotenv import load_dotenv
import os


def send_message_to_dialogflow(mensagem, access_token, user_id):
    load_dotenv()
    user_id = user_id
    project_id = os.getenv('project_id') # variavel que amerzena o id do projeto
    url = f"https://dialogflow.googleapis.com/v2/projects/{project_id}/agent/sessions/{user_id}:detectIntent"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "x-goog-user-project":project_id,
        "Content-Type": "application/json; charset=utf-8"
    }
    payload = {
        "queryInput": {
            "text": {
                "text": mensagem,
                "languageCode": "pt-br"
            }
        }
    }

    response = requests.post(url, json=payload, headers=headers)
    return response.json()