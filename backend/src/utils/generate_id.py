import hashlib

def session_id():
    return str(hashlib.sha256())