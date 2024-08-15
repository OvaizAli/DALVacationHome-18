
import json
import boto3
import random
import datetime
import requests
def lambda_handler(event,context):
    try:
        # dynamodb = boto3.resource('dynamodb',region_name='us-east-1')
        # property_table = dynamodb.Table('Property')
        # booking_table = dynamodb.Table('Booking')
        print(event)
        for record in event['Records']:
            rec = json.loads(record['body']) 
            print(rec,record)
            property_id = rec['propertyId']
            booking_reference_number = rec['bookingReferenceNumber']
            response = requests.get("https://vrnylsjiye.execute-api.us-east-1.amazonaws.com/prod/property")
            print(response.text,type(response.text))
            response_data = json.loads(response.text)
            print("Response data:",response_data)
            property_data = {}
            if 'Items' in response_data.keys():
                # response = property_table.get_item(Key={'propertyId': property_id})
                for property in response_data['Items']:
                    print(property)
                    if property['propertyId']["S"] == property_id:
                        property_data = property
                        print("Property data:",property_data)
                        break
            # property_data = response['Item']
            print("Property data outside loop:",property_data)
            agent_pool_str = property_data.get('agentPool', '').get('S','')
            agent_pool = agent_pool_str.split(',') if agent_pool_str else []
            print(agent_pool_str)
            selected_agent = random.choice(agent_pool)
            print("Selected Agent:",selected_agent)
            created_date = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            headers = {'Content-Type': 'application/json'}
            url = "https://vrnylsjiye.execute-api.us-east-1.amazonaws.com/prod/booking/setAgent"
            payload = {"bookingReferenceNumber":booking_reference_number,"agentId":selected_agent,"creationDate":created_date}
            print(json.dumps(payload))
            booking_update_response = requests.request("PUT",url,headers=headers,data=json.dumps(payload))
            print(booking_update_response.text)
            # booking_update_response = booking_table.update_item( Key={'BookingReferenceNo': booking_reference_number},
            #                                                     UpdateExpression='SET AgentId = :agentId, CreatedDate = :createdDate',
            #                                                     ExpressionAttributeValues={
            #                                                     ':agentId': selected_agent,
            #                                                     ':createdDate': created_date},ReturnValues='UPDATED_NEW')
    except Exception as ex:
        print("Error while assigning random agent:",ex)
        raise ex
    # return {"statusCode":200,
    #         "body":""}