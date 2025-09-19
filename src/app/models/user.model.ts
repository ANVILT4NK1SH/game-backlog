export interface User{
  id?: number;
  username: string;
  liked_ids: number[];
  owned_ids: number[];
  backlog_ids: number[];
}
