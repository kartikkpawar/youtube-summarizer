export type CoinsType = {
  coins: number;
};

export type UserSummaries = {
  id: string;
  url: string;
  response?: string | null;
  title?: string | null;
  created_at: Date;
};

export type ChatType = {
  id: string;
  url: string;
  response?: string | null;
  userId: number;
  created_at: Date;
  title: string;
};

export type AddUrlErrorType = {
  url?: string;
  userId?: string;
};
