import { v4 as uuidv4 } from 'uuid';
import type { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { hashPassword } from '../utils/bcrypt';
import { getUser, addUser } from '../../../repositories/authRespository';

const USERS_TABLE = 'UsersTable';

export async function registerHandler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  if (!event || !event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Email and password are required.' }),
    };
  }

  const { email, password } = JSON.parse(event.body || '{}');

  if (!email || !password) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Email and password are required.' }),
    };
  }

  try {
    const existingUser = await getUser(USERS_TABLE, email);
    if (existingUser) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Email is already registered.' }),
      };
    }

    const hashedPassword = hashPassword(password);
    const userId = uuidv4();

    const user = {
      userId,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };

    await addUser(USERS_TABLE, user);

    return {
      statusCode: 201,
      body: JSON.stringify({ message: 'User registered successfully' }),
    };
  } catch (error) {
    console.error("Error registering user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server error.' }),
    };
  }
}
