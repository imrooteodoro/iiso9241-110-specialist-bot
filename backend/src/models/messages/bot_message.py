from models.messages.format_response import format_bot_response

def extract_bot_response(resultado):
        if "queryResult" in resultado and "fulfillmentMessages" in resultado["queryResult"]:
            fulfillment_message = resultado["queryResult"]["fulfillmentMessages"][0]

            if "text" in fulfillment_message and "text" in fulfillment_message["text"]:
                resposta_do_bot = fulfillment_message["text"]["text"][0]
                resposta_do_bot = format_bot_response(resposta_do_bot)
            else:
                resposta_do_bot = "Desculpe, não consigo responder sua mensagem."
        else:
            resposta_do_bot = "Desculpe, não consigo responder sua mensagem."

        return resposta_do_bot



