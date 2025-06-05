import { Hobby } from '@prisma/client';

export type HobbyResponse = Hobby & {
  transactions: {
    count: number;
  };
};
