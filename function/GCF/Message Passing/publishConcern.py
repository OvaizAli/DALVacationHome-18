import functions_framework
import json
from flask import jsonify
from google.cloud import pubsub_v1

# Initialize Pub/Sub client
publisher = pubsub_v1.PublisherClient()
topic_path = 'projects/csci-5408-data-management/topics/customer-concerns'

@functions_framework.http
def publish_concern(request):
    """HTTP Cloud Function to publish customer concerns to Pub/Sub.
    
    Args:
        request (flask.Request): The request object.
        
    Returns:
        Response object with the status of the publishing action.
    """
    request_json = request.get_json(silent=True)
    
    if not request_json:
        return jsonify({'error': 'Invalid request: No JSON payload'}), 400
    
    try:
        booking_reference = request_json['booking_reference']
        customer_name = request_json['customer_name']
        customer_email = request_json['customer_email']
        concern = request_json['concern']
    except KeyError as e:
        return jsonify({'error': f'Missing parameter: {str(e)}'}), 400

    message_data = {
        "booking_reference": booking_reference,
        "customer_name": customer_name,
        "customer_email": customer_email,
        "concern": concern
    }
    message_json = json.dumps(message_data).encode("utf-8")
    
    try:
        future = publisher.publish(topic_path, message_json)
        message_id = future.result()
        return jsonify({'message': 'Published message successfully', 'message_id': message_id}), 200
    except Exception as e:
        return jsonify({'error': f'Error publishing message: {str(e)}'}), 500
