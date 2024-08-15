import json
import boto3
from botocore.exceptions import ClientError

# Initialize DynamoDB client
dynamodb = boto3.resource('dynamodb')

def get_booking_details(booking_reference):
    table = dynamodb.Table('BookingDetails')
    
    try:
        response = table.get_item(
            Key={
                'BookingReference': booking_reference
            }
        )
    except ClientError as e:
        print(e.response['Error']['Message'])
        return None
    else:
        return response.get('Item', None)

def validate(slots):
    if not slots['BookingReference']:
        return {
            'isValid': False,
            'violatedSlot': 'BookingReference'
        }
    return {'isValid': True}

def lambda_handler(event, context):
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
        booking_details = get_booking_details(booking_reference)
        
        if booking_details:
            response_message = "Booking details:\nName: {}\nRoom Number: {}\nRoom Type: {}\nCheck-in Date: {}\nNights: {}".format(
                booking_details['name'],
                booking_details['roomNumber'],
                booking_details['roomType'],
                booking_details['checkInDate'],
                booking_details['nights']
            )
        else:
            response_message = "Sorry, I could not find any booking with reference number {}".format(booking_reference)
        
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
