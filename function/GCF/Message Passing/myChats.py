import functions_framework
import json
from google.cloud import firestore

# Initialize Firestore client
db = firestore.Client()

@functions_framework.http
def get_chat_id(request):
    """HTTP Cloud Function to get all booking references based on provided email and user type.
    
    Args:
        request (flask.Request): The request object.
        
    Returns:
        JSON response object with the booking references.
    """
    response_headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    }

    if request.method == 'OPTIONS':
        return ('', 204, response_headers)
    
    request_json = request.get_json(silent=True)
    
    if not request_json:
        return ({
            "error": "Invalid request: No JSON payload"
        }, 400, response_headers)
    
    try:
        email = request_json['email']
        user_type = request_json['userType']
    except KeyError as e:
        return ({
            "error": f"Missing parameter: {str(e)}"
        }, 400, response_headers)

    try:
        # Determine the field to query based on user type
        if user_type == 'Agent':
            query_field = 'assigned_agent'
        else:
            query_field = 'customer_email'

        # Query the 'conversations' collection for documents where the relevant field matches the provided email
        conversations_ref = db.collection('conversations')
        query = conversations_ref.where(query_field, '==', email)
        docs = query.stream()
        
        chat_id = []
        for doc in docs:
            chat_data = doc.to_dict()
            booking_reference = chat_data.get("booking_reference")
            if booking_reference:
                chat_id.append(booking_reference)

        if not chat_id:
            return ({
                "error": "No booking references found for the provided email"
            }, 200, response_headers)

        return ({
            "chat_id": chat_id
        }, 200, response_headers)
    except Exception as e:
        return ({
            "error": f"Error retrieving booking references: {str(e)}"
        }, 500, response_headers)
