import functions_framework
import json
import datetime
from google.cloud import firestore

# Initialize Firestore client
db = firestore.Client()

@functions_framework.http
def add_message(request):
    """HTTP Cloud Function to add messages to an initialized chat.
    
    Args:
        request (flask.Request): The request object.
        
    Returns:
        JSON response object with the status of the action.
    """
    request_json = request.get_json(silent=True)
    
    if not request_json:
        return {
            "error": "Invalid request: No JSON payload"
        }, 400
    
    try:
        chat_id = request_json['chat_id']
        sender = request_json['sender']
        message = request_json['message']
    except KeyError as e:
        return {
            "error": f"Missing parameter: {str(e)}"
        }, 400

    # Construct message data
    message_data = {
        "sender": sender,
        "message": message,
        "timestamp": datetime.datetime.utcnow().isoformat()
    }
    
    try:
        # Add message to Firestore chat document
        chat_ref = db.collection('conversations').document(chat_id)
        chat_ref.update({
            "messages": firestore.ArrayUnion([message_data])
        })
        return {
            "message": "Message added successfully"
        }, 200
    except Exception as e:
        return {
            "error": f"Error adding message: {str(e)}"
        }, 500
