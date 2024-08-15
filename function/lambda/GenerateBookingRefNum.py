import json
import boto3
import uuid
import requests

def lambda_handler(event, context):
    sqs_client = boto3.client('sqs')
    dynamodb = boto3.resource('dynamodb',region_name='us-east-1')
    table = dynamodb.Table('Booking')
    print(event)
    booking_approval_request = event["booking_request"]
    booking_reference_id = str(uuid.uuid4())
    booking_approval_request["bookingReferenceNumber"] = booking_reference_id
    print(booking_approval_request)
    #response = table.put_item(Item = booking_approval_request)
    response = requests.post("https://vrnylsjiye.execute-api.us-east-1.amazonaws.com/prod/booking", headers={'Content-Type': 'application/json'}, data=json.dumps(booking_approval_request))
    print(response.text)
    if(response.status_code == 200):
        sqs_client.send_message(QueueUrl="https://sqs.us-east-1.amazonaws.com/690962013237/BookingApprovalQueue",MessageBody = json.dumps(booking_approval_request))
        return {
            "statusCode":200,
            "headers": {
            'Content-Type': 'application/json',
            "Access-Control-Allow-Credentials": "true",
            "Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"bookingReferenceId": booking_reference_id})}
