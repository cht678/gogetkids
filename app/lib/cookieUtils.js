import { parseCookies } from 'nookies';

async function getTokenFromCookies() {
  try {
    const cookies = parseCookies(); // This will retrieve cookies in a server environment
    const token = cookies.token; // Assuming 'token' is the cookie name
    return token;
  } catch (error) {
    throw new Error('Failed to retrieve token from cookies');
  }
}

export { getTokenFromCookies };
