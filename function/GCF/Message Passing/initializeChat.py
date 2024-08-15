import functions_framework
import json
from google.cloud import firestore

# Initialize Firestore client
db = firestore.Client()

@functions_framework.http
def initialize_chat(request):
    """HTTP Cloud Function to initialize a chat session.
    
    Args:
        request (flask.Request): The request object.
        
    Returns:
        JSON response object with the chat initialization status and chat ID.
    """
    request_json = request.get_json(silent=True)
    
    if not request_json:
        return {
            "error": "Invalid request: No JSON payload"
        }, 400
    
    try:
        booking_reference = request_json['booking_reference']
        customer_name = request_json['customer_name']
        customer_email = request_json['customer_email']
        concern = request_json['concern']
        assigned_agent = request_json['assigned_agent']
    except KeyError as e:
        return {
            "error": f"Missing parameter: {str(e)}"
        }, 400

    # Initialize chat document data
    chat_data = {
        "booking_reference": booking_reference,
        "customer_name": customer_name,
        "customer_email": customer_email,
        "concern": concern,
        "assigned_agent": assigned_agent,
        "messages": []
    }
    
    try:
        # Create a new chat document in Firestore
        chat_ref = db.collection('conversations').document(booking_reference)
        chat_ref.set(chat_data)
        
        response_data = {
            "message": "Chat initialized successfully",
            "chat_id": booking_reference
        }
        return response_data, 200
    except Exception as e:
        return {
            "error": f"Error initializing chat: {str(e)}"
        }, 500
