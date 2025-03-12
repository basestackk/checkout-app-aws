import * as AWS from 'aws-sdk';

interface Payload {
  [key: string]: any;
}

interface CommandPayload {
  type: string;
  payload: Payload;
}

interface QueryPayload {
  type: string;
  payload: Payload;
}

export class MessageService {
  private static instance: MessageService;
  private lambda: AWS.Lambda;
  private eventBridge: AWS.EventBridge;

  constructor(source: string) {
    console.log(source)
    this.lambda = new AWS.Lambda({endpoint: 'http://localhost:3002'});
    this.eventBridge = new AWS.EventBridge({endpoint: 'http://localhost:4000'});
  }

  public static getInstance(source: string): MessageService {
    if (!MessageService.instance) {
      MessageService.instance = new MessageService(source);
    }
    return MessageService.instance;
  }

  private async invokeLambda(functionName: string, payload: any) {
    const params = {
      FunctionName: functionName,
      InvocationType: 'RequestResponse',
      Payload: JSON.stringify(payload),
    };

    try {
      const result = await this.lambda.invoke(params).promise();

      if (!result.Payload) {
        throw new Error(`Empty response from Lambda function: ${functionName}`);
      }

      const parsedPayload = result.Payload.toString().trim();
      if (!parsedPayload) {
        throw new Error(`Lambda response is empty after conversion: ${functionName}`);
      }

      return JSON.parse(parsedPayload);
    } catch (error) {
      console.error(`Error invoking Lambda function: ${functionName}`, error);
      throw new Error(`Failed to invoke Lambda function: ${functionName}`);
    }
  }

  public async sendCommand(lambdaFunctionName: string, commandPayload: CommandPayload): Promise<any> {
    const payload = {
      command: commandPayload,
    };
    return this.invokeLambda(lambdaFunctionName, payload);
  }

  public async sendQuery(lambdaFunctionName: string, queryPayload: QueryPayload): Promise<any> {
    const payload = {
      query: queryPayload,
    };
    return this.invokeLambda(lambdaFunctionName, payload);
  }

  public async sendEvent(eventDetail: Payload, source: string, eventType: string, detailType: string ): Promise<any> {
    const params = {
      Entries: [
        {
          Source: source,
          DetailType: detailType,
          Detail: JSON.stringify({
            ...eventDetail,
            eventType
          }),
        },
      ],
    };

    try {
      const result = await this.eventBridge.putEvents(params).promise();
      return result;
    } catch (error) {
      console.error('Error sending event to EventBridge', error);
      throw new Error('Failed to send event to EventBridge');
    }
  }
}

export default MessageService;
