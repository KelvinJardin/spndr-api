import { Hobby } from '@prisma/client';

export type HobbyResponse = Hobby & {
  transactionCount: number;
};
