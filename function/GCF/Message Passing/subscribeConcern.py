import functions_framework
import json
import random
from flask import jsonify
from google.cloud import pubsub_v1

# Initialize Pub/Sub client
subscriber = pubsub_v1.SubscriberClient()
subscription_path = 'projects/csci-5408-data-management/subscriptions/concerns-subscription'

# List of property agents
property_agents = ["agent1@example.com", "agent2@example.com", "agent3@example.com"]

@functions_framework.http
def fetch_concern(request):
    """HTTP Cloud Function to fetch a message from a Pub/Sub topic and assign a property agent.
    
    Args:
        request (flask.Request): The request object.
        
    Returns:
        Response object with the message fetched from the subscription and assigned property agent.
    """
    response = subscriber.pull(
        request={"subscription": subscription_path, "max_messages": 1}
    )

    if not response.received_messages:
        return jsonify({'message': 'No messages available'}), 200

    for received_message in response.received_messages:
        pubsub_message = json.loads(received_message.message.data.decode('utf-8'))

        # Extract message fields
        booking_reference = pubsub_message.get("booking_reference")
        customer_name = pubsub_message.get("customer_name")
        customer_email = pubsub_message.get("customer_email")
        concern = pubsub_message.get("concern")

        # Assign a random property agent
        assigned_agent = random.choice(property_agents)

        # Acknowledge the message
        subscriber.acknowledge(
            request={"subscription": subscription_path, "ack_ids": [received_message.ack_id]}
        )

        # Prepare response JSON
        response_data = {
            "booking_reference": booking_reference,
            "customer_name": customer_name,
            "customer_email": customer_email,
            "concern": concern,
            "assigned_agent": assigned_agent
        }

        return jsonify(response_data), 200

    return jsonify({'message': 'No messages processed'}), 500
