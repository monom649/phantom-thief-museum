// types.ts
export type ノイズの位置 = 'left' | 'center' | 'right';
export type サンサンの向き = 'left' | 'right' | 'front';
export type ゲーム状態 = 'loading' | 'loading_error' | 'start' | 'playing' | 'won' | 'lost';

export interface おもちゃ {
  id: number;
  名前: string;
  画像URL: string;
  配置: 'left' | 'right';
}