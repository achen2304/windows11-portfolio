export interface TwitterAppProps {
  className?: string;
}

export interface CommentWithStringId {
  _id: string;
  username: string;
  handle: string;
  content: string;
  timestamp: string;
  likes: number;
}

export type SortOption = 'date' | 'likes';
