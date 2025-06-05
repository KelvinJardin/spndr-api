import { User } from '@prisma/client';

export type UserResponse = Omit<
	User,
	| 'emailVerified'
	| 'image'
	| 'refresh_token'
	| 'access_token'
	| 'expires_at'
	| 'token_type'
	| 'scope'
	| 'id_token'
	| 'session_state'
>;
