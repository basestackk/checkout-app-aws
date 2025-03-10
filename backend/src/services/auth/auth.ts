import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  registerHandler,
  loginHandler,
  refreshTokenHandler,
  logoutHandler,
} from "./api";

type AuthHandlerMap = {
  [key: string]: (
    event: APIGatewayProxyEvent,
  ) => Promise<APIGatewayProxyResult>;
};

const authHandlerMap: AuthHandlerMap = {
  "POST /login": loginHandler,
  "POST /register": registerHandler,
  "POST /logout": logoutHandler,
  "POST /refreshToken": refreshTokenHandler,
};

const getHandler = (
  method: string,
  path: string,
):
  | ((event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>)
  | undefined => {
  const key = `${method} ${path}`;
  return authHandlerMap[key];
};

export const handler = async (event: any): Promise<Promise<APIGatewayProxyResult>> => {
  try {
    const handlerFunction = getHandler(event.httpMethod, event.path);
    if (handlerFunction) {
      return await handlerFunction(event);
    } else {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Route not found." }),
      };
    }
  } catch (error) {
    console.error("Error processing event:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error." }),
    };
  }
};
