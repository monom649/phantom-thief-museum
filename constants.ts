import { おもちゃ } from './types';

// ゲーム設定
export const 制限時間 = 120; // 2分（秒）
export const おもちゃの総数 = 6;
export const サンサン振り向き間隔_最小 = 500; // 0.5秒 
export const サンサン振り向き間隔_最大 = 1500; // 1.5秒

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
  ノイズ盗む左: 'https://i.imgur.com/e6iNXXP.png',
  ノイズ盗む右: 'https://i.imgur.com/YuphH0M.png',
  
  // UIボタン
  ボタン左: 'https://i.imgur.com/JBLP1sK.png',
  ボタン盗む: 'https://i.imgur.com/Wriattw.png',
  ボタン右: 'https://i.imgur.com/XYCX8Xz.png',
  
  // 音声（local public/直下）
  スタート効果音: '/リアクション_ノイズ016.wav',
  移動音右: '/リアクション_ノイズ024.wav',
  移動音左: '/リアクション_ノイズ025.wav',
  盗む音: '/リアクション_ノイズ029.wav',
  ゲームオーバー音: '/リアクション_ノイズ039.wav',
  クリア音: '/リアクション_ノイズ046.wav',
};

export const すべてのおもちゃ: おもちゃ[] = [
  { id: 1, 名前: '車のおもちゃ', 画像URL: 'https://i.imgur.com/ELWP5jU.png', 配置: 'left' },
  { id: 2, 名前: 'ゲーム機', 画像URL: 'https://i.imgur.com/UeyBpbF.png', 配置: 'left' },
  { id: 3, 名前: 'ドールハウス', 画像URL: 'https://i.imgur.com/F8dIxbF.png', 配置: 'left' },
  { id: 4, 名前: 'ぬいぐるみ', 画像URL: 'https://i.imgur.com/OUn5pkV.png', 配置: 'right' },
  { id: 5, 名前: '恐竜', 画像URL: 'https://i.imgur.com/ppiqTXe.png', 配置: 'right' },
  { id: 6, 名前: '消防車ロボ', 画像URL: 'https://i.imgur.com/2LbWYZI.png', 配置: 'right' },
];

