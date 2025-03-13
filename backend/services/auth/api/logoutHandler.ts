// src/handlers/logoutHandler.ts
import type { APIGatewayProxyResult } from 'aws-lambda';
import { serialize } from 'cookie';

export async function logoutHandler(): Promise<APIGatewayProxyResult> {
  const refreshTokenCookie = serialize('refreshToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // Expired immediately
    path: '/',
    sameSite: 'strict',
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Logged out successfully.' }),
    headers: {
      'Set-Cookie': refreshTokenCookie,
    },
  };
}
