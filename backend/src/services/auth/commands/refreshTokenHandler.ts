import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export async function refreshTokenHandler(refreshToken: string): Promise<Record<string, any>> {

  if (!refreshToken) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Refresh token is missing.' }),
    };
  }

  try {
    const decoded = verifyRefreshToken(refreshToken);
    const userId = decoded.userId;
    const newAccessToken = generateAccessToken(userId);

    refreshToken = generateRefreshToken(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Access token refreshed successfully', accessToken: newAccessToken }),
    };
  } catch (error) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: 'Invalid or expired refresh token.' }),
    };
  }
}