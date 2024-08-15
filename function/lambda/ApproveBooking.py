import json
import boto3
import uuid
import requests

def lambda_handler(event, context):
    try:
        print("Approve Booking...")
        # dynamodb = boto3.resource('dynamodb',region_name='us-east-1')
        # booking_table = dynamodb.Table('Booking')
        booking_reference_number = event['booking_reference']
        print("Booking reference number:",booking_reference_number)
        url = "https://vrnylsjiye.execute-api.us-east-1.amazonaws.com/prod/booking/setIsApproved"
        headers = {'Content-Type': 'application/json'}
        payload = {"bookingReferenceNumber":booking_reference_number,"isApproved":True}
        response = requests.request("PUT", url, headers=headers, data=json.dumps(payload))
        print(response.text)
        
        return {
            "statusCode":200,
            "headers": {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin": "*"
        },
            "body": json.dumps({"bookingReferenceId": booking_reference_number}) }
    except Exception as ex:
        print("Error while approving the booking:",ex)