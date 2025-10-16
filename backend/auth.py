from api_gateway import VerifyAccessClient

def login(email, google_jwt=None, apple_jwt=None):
    '''
        Use third-party login to obtain JWT token
    '''
    verify_client = VerifyAccessClient(email, google_jwt, apple_jwt)
    result = verify_client.token_verify()
    jwt_token = result["jwt_token"]
    return jwt_token

def logout(token):
    print("logged out")