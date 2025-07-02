export const corsHeaders = {
  headers: {
    // 'Access-Control-Allow-Origin': 'http://localhost:5173',
    'Access-Control-Allow-Origin': 'https://greenworld-shop-admin.vercel.app ',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true' // если используете куки/авторизацию
  },
};
