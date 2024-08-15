package second.factor.auth;

import java.util.Map;

import org.json.JSONObject;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class SecondFactorAuthLambdaRequestHandler implements RequestHandler<Map<String, String>, Boolean> {

	@Override
	public Boolean handleRequest(Map<String, String> input, Context context) {
		String inputSecurityQA = input.get("data");
		String email = input.get("email");
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate
				.exchange("https://vrnylsjiye.execute-api.us-east-1.amazonaws.com/prod/user/" + email, HttpMethod.GET, null, String.class);
		JSONObject jsonObject = new JSONObject(response.getBody());
		String userSecurityQA = ((JSONObject) jsonObject.getJSONArray("Items").get(0)).getJSONObject("securityQuestions").get("S").toString();
		return inputSecurityQA.equals(userSecurityQA);
	}
}
