# DALVacationHome-18

Welcome to the DALVacationHome-18 repository! This project involves building a comprehensive vacation home management application with various modules integrated for enhanced functionality. Below you'll find detailed information about each module, individual contributions, and the overall project setup.

## Table of Contents
- [Project Overview](#project-overview)
- [Modules](#modules)
  - [Virtual Assistant Module](#virtual-assistant-module)
  - [Message Passing Module](#message-passing-module)
  - [Notification Module](#notification-module)
  - [Data Analysis & Visualization](#data-analysis--visualization)
- [Services Used](#services-used)
- [Individual Contributions](#individual-contributions)
- [Repository Links](#repository-links)
- [Pseudocode/Algorithms](#pseudocodealgorithms)
- [Setup and Deployment](#setup-and-deployment)

## Project Overview

DALVacationHome-18 is an application designed to manage vacation home bookings, provide customer support, and analyze data. The application integrates various AWS and GCP services to deliver a robust and scalable solution.

## Modules

### Virtual Assistant Module

The Virtual Assistant Module integrates Amazon Lex V2 with Kommunicate, enhancing user interactions with advanced language analysis and speech recognition. This module enables seamless transitions between chatbots and human agents, automating repetitive tasks like room bookings and customer inquiries to improve usability and customer experience.

### Message Passing Module

This module enables synchronous chat retrieval between property agents and customers. Initially lacking in functionality, it was improved by implementing Google Cloud Functions to retrieve and display complete chat histories. This addition aligns the module with real-world scenarios and enhances its core purpose.

### Notification Module

The Notification Module uses AWS services to handle user subscriptions and message notifications. It leverages AWS Lambda functions triggered by SQS queues to create and manage SNS topics, ensuring users receive timely email notifications. The integration with Amazon API Gateway allows the frontend application to communicate with these services efficiently.

### Data Analysis & Visualization

The Data Analysis & Visualization module was enhanced by adding a filter based on Room Id. This functionality, critical for analyzing user feedback and sentiment, was implemented by addressing data type mismatches and ensuring accurate filtering of BigQuery data.

## Multi-cloud Services Used

| Service                  | Purpose                                                                 |
|--------------------------|-------------------------------------------------------------------------|
| **Amazon Lex V2**        | Conversational AI and chatbot functionality.                            |
| **Kommunicate**          | Integration with Amazon Lex for enhanced chatbot capabilities.          |
| **AWS Lambda**           | Serverless functions for various backend processes.                     |
| **Amazon SQS**           | Queue service for managing and processing asynchronous messages.        |
| **Amazon SNS**           | Notification service for sending messages to users.                     |
| **Amazon API Gateway**   | API management and gateway for frontend-backend communication.           |
| **Google Cloud Functions** | Serverless functions for chat history retrieval and other processes.   |
| **Firestore**            | NoSQL database for storing chat messages and related data.              |
| **BigQuery**             | Data analysis and visualization of user feedback and sentiment.         |
| **DynamoDB**             | NoSQL database for user data storage and retrieval.                     |
| **Looker Studio**        | Business intelligence and data visualization for generating reports and dashboards. |

## Repository Links

- **GitLab Repository**: [https://git.cs.dal.ca/ovaiz/csci5410-s24-sdp-18](https://git.cs.dal.ca/ovaiz/csci5410-s24-sdp-18)
- **Deployed Application**: [https://dalvacationhome-sdp18-3en3jcc6tq-ue.a.run.app](https://dalvacationhome-sdp18-3en3jcc6tq-ue.a.run.app)

## Pseudocode/Algorithms

### User Management & Authentication Module

**Second-Factor-Auth Lambda Function**:
1. Extract user email and security questions.
2. Fetch and validate user data from DynamoDB.
3. Return true if answers match, otherwise false.

**Third-Factor-Auth Lambda Function**:
1. Extract user email and cipher text.
2. Fetch and validate user data from DynamoDB.
3. Return true if cipher texts match, otherwise false.

### Virtual Assistant Module

**Process**:
1. User requests booking details.
2. Amazon Lex processes the intent and invokes Lambda function.
3. Lambda fetches booking details from API and returns a response.

### Message Passing Module

**Functions**:
1. **Retrieve Entire Conversation**: Fetch chat messages from Firestore.
2. **Get Chat_id**: Query Firestore to find chat_id based on user email and type.

### Notification

**Booking Reference Code Generation**:
1. User clicks "Book" button.
2. Lambda generates a booking reference code and stores it.
3. The code is returned to the web application and shown to the user.

**Assigning Random Agent**:
1. Process message from SQS Queue.
2. Assign a random agent from the pool and update DynamoDB.

**Booking Approval**:
1. Agent approves or declines booking request.
