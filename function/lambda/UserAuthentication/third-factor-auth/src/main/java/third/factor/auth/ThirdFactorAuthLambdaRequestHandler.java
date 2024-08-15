package third.factor.auth;

import java.util.Map;

import org.json.JSONObject;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;

public class ThirdFactorAuthLambdaRequestHandler implements RequestHandler<Map<String, String>, Map<String, Object>> {

	@Override
	public Map<String, Object> handleRequest(Map<String, String> input, Context context) {
		System.out.println(input.size());
		String inputCipherText = input.get("data");
		String email = input.get("email");
		RestTemplate restTemplate = new RestTemplate();
		ResponseEntity<String> response = restTemplate
				.exchange("https://vrnylsjiye.execute-api.us-east-1.amazonaws.com/prod/user/" + email, HttpMethod.GET, null, String.class);
		JSONObject jsonObject = new JSONObject(response.getBody());
		String userCipherText = ((JSONObject) jsonObject.getJSONArray("Items").get(0)).getJSONObject("cipherText").get("S").toString();
		
		JSONObject jsonResponse = new JSONObject();
		jsonResponse.put("isValid", inputCipherText.equals(userCipherText));
		if(inputCipherText.equals(userCipherText)) {
			jsonResponse.put("firstname", ((JSONObject) jsonObject.getJSONArray("Items").get(0)).getJSONObject("firstname").get("S").toString());
			jsonResponse.put("lastname", ((JSONObject) jsonObject.getJSONArray("Items").get(0)).getJSONObject("lastname").get("S").toString());
			jsonResponse.put("role", ((JSONObject) jsonObject.getJSONArray("Items").get(0)).getJSONObject("role").get("S").toString());
		}
		return jsonResponse.toMap();
	}
}
