import { CognitoUserPool } from 'amazon-cognito-identity-js';

const poolData = {
  UserPoolId: 'us-east-1_o36lVChuk',
  ClientId: '1jgd8ku26jh01veg2q460lf10s',
};

export default new CognitoUserPool(poolData);