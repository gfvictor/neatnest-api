export interface JwtPayload {
  sub: string;
  email: string;
  username: string;
  role: string;
  householdId: string;
  workplaceId?: string | null;
  iat?: number;
  exp?: number;
}
