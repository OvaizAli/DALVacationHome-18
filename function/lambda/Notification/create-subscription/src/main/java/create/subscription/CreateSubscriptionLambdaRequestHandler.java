package create.subscription;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.SQSEvent;
import com.amazonaws.services.lambda.runtime.events.SQSEvent.SQSMessage;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.CreateTopicRequest;
import software.amazon.awssdk.services.sns.model.CreateTopicResponse;
import software.amazon.awssdk.services.sns.model.SubscribeRequest;

public class CreateSubscriptionLambdaRequestHandler implements RequestHandler<SQSEvent, Void> {

	@Override
	public Void handleRequest(SQSEvent event, Context context) {
		String email = "";
		for (SQSMessage msg : event.getRecords()) {
			email = new String(msg.getBody());
		}
		
		String topicName = email.replaceAll("[^a-zA-Z0-9]", "");

		SnsClient snsClient = SnsClient.builder().region(Region.US_EAST_1).build();

		CreateTopicRequest createTopicRequest = CreateTopicRequest.builder().name(topicName).build();
		CreateTopicResponse result = snsClient.createTopic(createTopicRequest);

		SubscribeRequest subscribeRequest = SubscribeRequest.builder().protocol("email").endpoint(email)
				.returnSubscriptionArn(true).topicArn(result.topicArn()).build();
		snsClient.subscribe(subscribeRequest);
	
		return null;
	}
}
