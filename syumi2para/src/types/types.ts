// 趣味データの型
export interface Hobby {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
}

// SwipeCardコンポーネントが受け取るPropsの型
export interface SwipeCardProps {
  hobby: Hobby;
  // onSwipe関数は、数値(id)と'left'または'right'の文字列を受け取り、何も返さない
  onSwipe: (id: string, direction: 'left' | 'right') => void;
}