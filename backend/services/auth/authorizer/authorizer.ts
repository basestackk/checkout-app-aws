import type { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult} from 'aws-lambda';
import Redis from '../../../db/redis'

export const handler = async (
    event: APIGatewayTokenAuthorizerEvent
  ): Promise<APIGatewayAuthorizerResult> => {
    const token = event.authorizationToken?.split(' ')[1];
  
    if (!token) {
      throw new Error('Unauthorized');
    }
  
    try {
      const redisClient = Redis.getInstance();
      const userData = await redisClient.get(`accessToken:${token}`);
  
      if (!userData) {
        throw new Error('Token Expired');
      }
  
      const { userId } = JSON.parse(userData);
  
      return generatePolicy(userId, 'Allow', event.methodArn, '');
    } catch (error) {
      console.error('Authorization failed:', error);
      if (error instanceof Error) {
        return generatePolicy("Error", 'Deny', event.methodArn, error.message);
      } else {
        return generatePolicy("Error", 'Deny', event.methodArn, "Unauthorized");
      }
    }
  };
  
  function generatePolicy(
    principalId: string,
    effect: 'Allow' | 'Deny',
    resource: string,
    error: string
  ): APIGatewayAuthorizerResult {
    const policyDocument = {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    };
  
    return {
      principalId,
      policyDocument,
      context: {
        errorMessage: error,
      },
    };
  }
