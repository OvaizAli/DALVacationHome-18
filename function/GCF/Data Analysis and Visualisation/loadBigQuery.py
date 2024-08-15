import functions_framework
import requests
from google.cloud import bigquery
from google.cloud import language_v1

@functions_framework.http
def fetch_and_load_data(request):
    """
    HTTP Cloud Function to fetch data from APIs and load into BigQuery.
    """

    # Initialize BigQuery client
    client = bigquery.Client()

    # Initialize Natural Language API client
    language_client = language_v1.LanguageServiceClient()

    # Define BigQuery dataset and table names
    project_id = 'csci-5408-data-management'
    dataset_id = 'DalVacationHome_Looker_Data'
    user_table_id = 'User'
    feedback_table_id = 'Feedback'

    # Define API endpoints for fetching data
    user_api_url = 'https://kiuy4j7k8h.execute-api.us-east-1.amazonaws.com/prod/users'
    review_api_url = 'https://kiuy4j7k8h.execute-api.us-east-1.amazonaws.com/prod/review'
    
    try:
        # Fetch data from User API
        response_user = requests.get(user_api_url)
        response_user.raise_for_status()
        data_user = response_user.json()
        
        # Check if response contains data
        if 'Items' not in data_user:
            return {'error': 'No items in response from User API'}, 500
        
        # Extract user data from API response body
        users = data_user['Items']
        
        # Fetch existing User records from BigQuery
        query_user = f"SELECT * FROM `{project_id}.{dataset_id}.{user_table_id}`"
        existing_users = [dict(row) for row in client.query(query_user).result()]
        
        # Function to compare two user records
        def is_same_user(user1, user2):
            return (
                user1['email']['S'] == user2['Email'] and
                user1['cipherText']['S'] == user2['CaesarCipher'] and
                user1['firstname']['S'] == user2['FirstName'] and
                user1['lastname']['S'] == user2['LastName'] and
                user1['securityQuestions']['S'] == user2['Questions'] and
                user1['role']['S'] == user2['Role']
            )

        # Prepare data for insertion into User table in BigQuery, excluding existing records
        rows_to_insert_user = [
            {
                'Email': user['email']['S'],
                'CaesarCipher': user['cipherText']['S'],
                'FirstName': user['firstname']['S'],
                'LastName': user['lastname']['S'],
                'Questions': user['securityQuestions']['S'],
                'Role': user['role']['S'],
                'LoggedIn': str(user.get('isLoggedIn', {'BOOL': False})['BOOL'])  # Handle cases where 'isLoggedIn' may not be present
            }
            for user in users
            if not any(is_same_user(user, existing_user) for existing_user in existing_users)
        ]

        # Insert new User records into BigQuery
        if rows_to_insert_user:
            table_ref_user = client.dataset(dataset_id).table(user_table_id)
            errors_user = client.insert_rows_json(table_ref_user, rows_to_insert_user)
            if errors_user:
                return {'error': f"Error inserting rows into User table: {errors_user}"}, 500

        # Fetch data from Review API
        response_review = requests.get(review_api_url)
        response_review.raise_for_status()
        data_review = response_review.json()
        
        # Check if response contains data
        if 'Items' not in data_review:
            return {'error': 'No items in response from Review API'}, 500
        
        # Extract review data from API response body
        reviews = data_review['Items']
        
        # Fetch existing Feedback records from BigQuery
        query_feedback = f"SELECT * FROM `{project_id}.{dataset_id}.{feedback_table_id}`"
        existing_feedbacks = [dict(row) for row in client.query(query_feedback).result()]

        # Function to compare two feedback records
        def is_same_feedback(feedback1, feedback2):
            return (
                str(feedback1['reviewId']['S']) == str(feedback2['ReviewId']) and
                str(feedback1['date']['S']) == str(feedback2['Date']) and
                str(feedback1['rating']['N']) == str(feedback2['Rating']) and
                str(feedback1['roomNumber']['N']) == str(feedback2['RoomId']) and
                str(feedback1['userId']['S']) == str(feedback2['UserId']) and
                str(feedback1['message']['S']) == str(feedback2['Review'])
            )

        # Function to determine sentiment category based on sentiment score
        def get_sentiment_category(score):
            if score >= 0.25:
                return 'positive'
            elif score <= -0.25:
                return 'negative'
            else:
                return 'neutral'

        # Prepare data for insertion into Feedback table in BigQuery, excluding existing records
        rows_to_insert_feedback = []
        for review in reviews:
            # Check if feedback already exists in BigQuery
            if any(is_same_feedback(review, existing_feedback) for existing_feedback in existing_feedbacks):
                continue

            # Perform sentiment analysis using Natural Language API
            document = language_v1.Document(content=review['message']['S'], type_=language_v1.Document.Type.PLAIN_TEXT)
            sentiment = language_client.analyze_sentiment(request={'document': document}).document_sentiment

            # Append formatted feedback data to list for insertion
            rows_to_insert_feedback.append({
                'ReviewId': review['reviewId']['S'],
                'Date': review['date']['S'],
                'Rating': int(review['rating']['N']),
                'RoomId': int(review['roomNumber']['N']),
                'UserId': review['userId']['S'],
                'Review': review['message']['S'],
                'SentimentScore': sentiment.score,
                'SentimentMagnitude': sentiment.magnitude,
                'SentimentCategory': get_sentiment_category(sentiment.score)
            })

        # Insert new Feedback records into BigQuery if there are records to insert
        if rows_to_insert_feedback:
            table_ref_feedback = client.dataset(dataset_id).table(feedback_table_id)
            errors_feedback = client.insert_rows_json(table_ref_feedback, rows_to_insert_feedback)
            if errors_feedback:
                return {'error': f"Error inserting rows into Feedback table: {errors_feedback}"}, 500
        
        # Return success message if data is successfully loaded
        return {'message': 'Data loaded successfully.'}, 200
    
    # Handle HTTP request exceptions
    except requests.exceptions.RequestException as e:
        return {'error': f"Error fetching data: {str(e)}"}, 500
    
    # Handle unexpected errors
    except Exception as e:
        return {'error': f"Error: {str(e)}"}, 500
