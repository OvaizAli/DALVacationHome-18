import json
import requests

def get_booking_details_from_api(booking_reference):
    api_url = f"https://vrnylsjiye.execute-api.us-east-1.amazonaws.com/prod/booking/{booking_reference}"
    response = requests.get(api_url)
    
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching booking details: {response.status_code}, {response.text}")
        return None

def validate(slots):
    if not slots['BookingReference']:
        return {
            'isValid': False,
            'violatedSlot': 'BookingReference'
        }
    return {'isValid': True}

def lambda_handler(event, context):
    print("Event: ", json.dumps(event))  # Debugging: Log the event received by Lambda
    
    slots = event['sessionState']['intent']['slots']
    intent = event['sessionState']['intent']['name']
    validation_result = validate(slots)
    
    if event['invocationSource'] == 'DialogCodeHook':
        if not validation_result['isValid']:
            response = {
                "sessionState": {
                    "dialogAction": {
                        'slotToElicit': validation_result['violatedSlot'],
                        "type": "ElicitSlot"
                    },
                    "intent": {
                        'name': intent,
                        'slots': slots
                    }
                }
            }
            return response
        else:
            response = {
                "sessionState": {
                    "dialogAction": {
                        "type": "Delegate"
                    },
                    "intent": {
                        'name': intent,
                        'slots': slots
                    }
                }
            }
            return response
    
    if event['invocationSource'] == 'FulfillmentCodeHook':
        booking_reference = slots['BookingReference']['value']['originalValue']
        print("Booking Reference: ", booking_reference)  # Debugging: Log the booking reference
        
        booking_details = get_booking_details_from_api(booking_reference)
        print("Booking Details: ", json.dumps(booking_details))  # Debugging: Log the booking details
        
        if booking_details and booking_details.get('Count', 0) > 0:
            item = booking_details['Items'][0]
            response_message = (
                f"Booking details:\n"
                f"Booking Reference: {item.get('bookingReferenceNumber', {}).get('S', 'N/A')}\n"
                f"Property ID: {item.get('propertyId', {}).get('S', 'N/A')}\n"
                f"Room Number: {item.get('roomNumber', {}).get('N', 'N/A')}\n"
                f"User ID: {item.get('userId', {}).get('S', 'N/A')}\n"
                f"From Date: {item.get('fromDate', {}).get('S', 'N/A')}\n"
                f"To Date: {item.get('toDate', {}).get('S', 'N/A')}\n"
                f"Is Approved: {item.get('isApproved', {}).get('BOOL', 'N/A')}\n"
                f"Agent ID: {item.get('agentId', {}).get('S', 'N/A')}\n"
                f"Creation Date: {item.get('creationDate', {}).get('S', 'N/A')}"
            )
        else:
            response_message = f"Sorry, I could not find any booking with reference number {booking_reference}"
        
        response = {
            "sessionState": {
                "dialogAction": {
                    "type": "Close"
                },
                "intent": {
                    'name': intent,
                    'slots': slots,
                    'state': 'Fulfilled'
                }
            },
            "messages": [
                {
                    "contentType": "PlainText",
                    "content": response_message
                }
            ]
        }
        
        return response
