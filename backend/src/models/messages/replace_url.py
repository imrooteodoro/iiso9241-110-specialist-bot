import re

def replace_urls_with_links(response):
        urls = re.findall(r'(https?://\S+)', response)
        for url in urls:
            link = f'<a href="{url}" target="_blank">{url}</a>'
            response = response.replace(url, link)
        return response