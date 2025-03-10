import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "../utils/jwt";
import { serialize } from "cookie";
import { createClient } from "redis";
import { parse } from "cookie";

const redisClient = createClient({
  url: "redis://localhost:6379",
});

export async function refreshTokenHandler(
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
  try {
    const cookies = parse(event.headers["Cookie"] || "");
    const refreshToken = cookies.refreshToken;

    if (!refreshToken) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: "Invalid credentials." }),
      };
    }

    const decodedRefreshToken = verifyRefreshToken(refreshToken);
    const userId = decodedRefreshToken.userId;

    const accessToken = generateAccessToken(userId);
    const newRefreshToken = generateRefreshToken(userId);

    redisClient.setEx(
      `accessToken:${accessToken}`,
      15 * 60,
      JSON.stringify({ userId: userId }),
    );

    const refreshTokenCookie = serialize("refreshToken", newRefreshToken, {
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
