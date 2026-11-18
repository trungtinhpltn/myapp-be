import { Role } from '@prisma/client';

export interface JwtPayload {
  sub: number;
  username: string;
  role: Role;
}

export class AuthUser {
  id: number;
  username: string;
  fullName: string;
  role: Role;
}
