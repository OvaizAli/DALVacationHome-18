package publish.message;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.SQSEvent;
import com.amazonaws.services.lambda.runtime.events.SQSEvent.SQSMessage;

import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.sns.SnsClient;
import software.amazon.awssdk.services.sns.model.ListTopicsRequest;
import software.amazon.awssdk.services.sns.model.ListTopicsResponse;
import software.amazon.awssdk.services.sns.model.PublishRequest;
import software.amazon.awssdk.services.sns.model.Topic;

public class PublishMessageLambdaRequestHandler implements RequestHandler<SQSEvent, Void> {

	@Override
	public Void handleRequest(SQSEvent event, Context context) {
		String data = "";
		for (SQSMessage msg : event.getRecords()) {
			data = new String(msg.getBody());
		}
		
		String email = data.split(":::")[0];
		String message = data.split(":::")[1];
		String topicName = email.replaceAll("[^a-zA-Z0-9]", "");

		SnsClient snsClient = SnsClient.builder().region(Region.US_EAST_1).build();
		ListTopicsRequest listTopicsRequest = ListTopicsRequest.builder().build();
		ListTopicsResponse listTopicsResponse = snsClient.listTopics(listTopicsRequest);
		String topicArn = listTopicsResponse.topics().stream().map(Topic::topicArn)
				.filter(arn -> arn.endsWith(":" + topicName)).findFirst().orElse("");

		PublishRequest publishRequest = PublishRequest.builder().message(message).topicArn(topicArn).build();
		snsClient.publish(publishRequest);

		return null;
	}

}
