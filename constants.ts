
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
  ノイズ盗む左: 'https://i.imgur.com/e6iNXXP.png', // ノイズが左に手を伸ばす
  ノイズ盗む右: 'https://i.imgur.com/YuphH0M.png', // ノイズが右に手を伸ばす
  
  // UIボタン
  ボタン左: 'https://i.imgur.com/JBLP1sK.png',
  ボタン盗む: 'https://i.imgur.com/Wriattw.png',
  ボタン右: 'https://i.imgur.com/XYCX8Xz.png',

  // 音声
  スタート効果音: 'https://www.dropbox.com/scl/fi/4l4vpo2z9o0vnmygtnet7/_-005.wav?rlkey=ep4iend3ffe5llmzs42hqisoz&dl=1',
  移動音右: 'https://www.dropbox.com/scl/fi/ksv83te1psi3k5zum3o9l/_-024.wav?rlkey=hvvmcpw3f8so32myw76csh25r&dl=1',
  移動音左: 'https://www.dropbox.com/scl/fi/9j027ggy9pfgrmeuczpvr/_-025.wav?rlkey=b56mgrohtohn8q6b4mq803h5q&dl=1',
  盗む音: 'https://www.dropbox.com/scl/fi/aq11w392e6fuc51yazl99/_-029.wav?rlkey=frlegblzgxth55xlzbs6e611d&dl=1',
  ゲームオーバー音: 'https://www.dropbox.com/scl/fi/uz0ljj5wr58gtgd7dwvgk/_-039.wav?rlkey=yj9iwzt7dx34357dk3j0kxuhk&dl=1',
  クリア音: 'https://www.dropbox.com/scl/fi/ryrjbjw02drujjljjkm3v/_-030.wav?rlkey=itcorg1x9pvipwu1i8pj2vaoy&dl=1',
};

export const すべてのおもちゃ: おもちゃ[] = [
  { id: 1, 名前: '車のおもちゃ', 画像URL: 'https://i.imgur.com/ELWP5jU.png', 配置: 'left' },
  { id: 2, 名前: 'ゲーム機', 画像URL: 'https://i.imgur.com/UeyBpbF.png', 配置: 'left' },
  { id: 3, 名前: 'ドールハウス', 画像URL: 'https://i.imgur.com/F8dIxbF.png', 配置: 'left' },
  { id: 4, 名前: 'ぬいぐるみ', 画像URL: 'https://i.imgur.com/OUn5pkV.png', 配置: 'right' },
  { id: 5, 名前: '恐竜', 画像URL: 'https://i.imgur.com/ppiqTXe.png', 配置: 'right' },
  { id: 6, 名前: '消防車ロボ', 画像URL: 'https://i.imgur.com/2LbWYZI.png', 配置: 'right' },
];
