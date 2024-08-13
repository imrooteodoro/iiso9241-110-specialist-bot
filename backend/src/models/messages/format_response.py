from models.messages.replace_url import replace_urls_with_links

def format_bot_response(response):
        response = response.replace('\n', '<br>')
        response = replace_urls_with_links(response)
        return response