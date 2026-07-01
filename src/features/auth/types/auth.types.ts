export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: 'USER' | 'ADMIN';
}

export interface AuthTokens {
  readonly accessToken: string;
  readonly refreshToken: string;
}

export interface AuthResponse extends AuthTokens {
  readonly user: User;
}

export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface RegisterRequest {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export interface ApiResponse<T> {
  readonly data: T;
}
