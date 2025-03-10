import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { generateAccessToken, generateRefreshToken } from "../utils/jwt";
import { comparePassword } from "../utils/bcrypt";
import { serialize } from "cookie";
import { getUser } from "../../../repositories";
import Redis from '../../../db/redis';

const USERS_TABLE = process.env.USERS_TABLE || "UsersTable";

export async function loginHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  const { email, password } = JSON.parse(event.body || "{}");

  if (!email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Email and password are required." }),
    };
  }

  try {
    const user = await getUser(USERS_TABLE, email);

    if (!user || !comparePassword(password, user.password)) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid credentials." }),
      };
    }

    const accessToken = generateAccessToken(user.userId);
    const refreshToken = generateRefreshToken(user.userId);

    const redisClient = Redis.getInstance();
    await redisClient.set(
      `accessToken:${accessToken}`,
      JSON.stringify({ userId: user.userId }),
      15 * 60
    );

    const refreshTokenCookie = serialize("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      sameSite: "strict",
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Logged in successfully",
        accessToken: accessToken,
      }),
      headers: {
        "Set-Cookie": [refreshTokenCookie].join(", "),
      },
    };
  } catch (error) {
    console.error("Error during login:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Server error." }),
    };
  }
}
