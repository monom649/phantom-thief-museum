
import { おもちゃ } from './types';

// ゲーム設定
export const 制限時間 = 120; // 2分（秒）
export const おもちゃの総数 = 6;
export const サンサン振り向き間隔_最小 = 100; // 0.1秒
export const サンサン振り向き間隔_最大 = 500; // 0.5秒

// 画像・音声アセット
export const アセット = {
  // 背景
  背景: 'https://i.imgur.com/jCDTSVb.png',
  スタート画面: 'https://i.imgur.com/5zpbV51.png',
  
  // キャラクター
  サンサン正面: 'https://i.imgur.com/WGkCFNa.png',
  サンサン右: 'https://i.imgur.com/DM7mJnP.png', // サンサンが右を向く
  サンサン左: 'https://i.imgur.com/WES5Mm0.png', // サンサンが左を向く
  ノイズ待機: 'https://i.imgur.com/4Q7Fj1L.png',
  ノイズ盗む左: 'https://i.imgur.com/e6iNXXP.png', // ノイズが左に手を伸ばす
  ノイズ盗む右: 'https://i.imgur.com/YuphH0M.png', // ノイズが右に手を伸ばす
  
  // UIボタン
  ボタン左: 'https://i.imgur.com/JBLP1sK.png',
  ボタン盗む: 'https://i.imgur.com/Wriattw.png',
  ボタン右: 'https://i.imgur.com/XYCX8Xz.png',

  // 音声
  スタート効果音: '/audio/start.wav',
  移動音右: '/audio/move_right.wav',
  移動音左: '/audio/move_left.wav',
  盗む音: '/audio/steal.wav',
  ゲームオーバー音: '/audio/gameover.wav',
  クリア音: '/audio/clear.wav',
};

export const すべてのおもちゃ: おもちゃ[] = [
  { id: 1, 名前: '車のおもちゃ', 画像URL: 'https://i.imgur.com/ELWP5jU.png', 配置: 'left' },
  { id: 2, 名前: 'ゲーム機', 画像URL: 'https://i.imgur.com/UeyBpbF.png', 配置: 'left' },
  { id: 3, 名前: 'ドールハウス', 画像URL: 'https://i.imgur.com/F8dIxbF.png', 配置: 'left' },
  { id: 4, 名前: 'ぬいぐるみ', 画像URL: 'https://i.imgur.com/OUn5pkV.png', 配置: 'right' },
  { id: 5, 名前: '恐竜', 画像URL: 'https://i.imgur.com/ppiqTXe.png', 配置: 'right' },
  { id: 6, 名前: '消防車ロボ', 画像URL: 'https://i.imgur.com/2LbWYZI.png', 配置: 'right' },
];