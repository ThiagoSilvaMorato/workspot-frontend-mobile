const apiUrl = process.env.EXPO_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error('EXPO_PUBLIC_API_URL não definida. Configure o arquivo .env na raiz do projeto.');
}

export const config = {
  apiUrl: `${apiUrl}/api/v1`,
  requestTimeout: 15000,
} as const;
