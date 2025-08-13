
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ゲーム状態, ノイズの位置, サンサンの向き, おもちゃ } from './types';
import { 制限時間, おもちゃの総数, サンサン振り向き間隔_最小, サンサン振り向き間隔_最大, アセット, すべてのおもちゃ } from './constants';

// --- Helper Functions ---
const formatClearTime = (ms: number): string => {
  if (ms <= 0) return "0'00";
  const seconds = Math.floor(ms / 1000);
  const hundredths = Math.floor((ms % 1000) / 10).toString().padStart(2, '0');
  return `${seconds}'${hundredths}`;
};


// --- UI Helper Components ---

const LoadingScreen: React.FC<{ progress: number }> = ({ progress }) => (
  <div className="absolute inset-0 bg-black flex flex-col justify-center items-center z-50 text-white text-center p-8">
    <h1 className="text-4xl font-bold mb-4">Now Loading...</h1>
    <div className="w-3/4 max-w-md bg-gray-700 rounded-full h-6">
      <div 
        className="bg-red-600 h-6 rounded-full transition-all duration-300 ease-linear"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
    <p className="text-lg mt-4">{Math.round(progress)}%</p>
  </div>
);


interface GameModalProps {
  gameState: ゲーム状態;
  onStart: () => void;
  onRetry: () => void;
  reason: string;
  finalElapsedTimeMs: number;
}

const GameModal: React.FC<GameModalProps> = ({ gameState, onStart, onRetry, reason, finalElapsedTimeMs }) => {
  
  const PlayAgainButton = () => (
    <button
      onClick={onStart}
      className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg text-2xl font-semibold transition-transform transform hover:scale-105"
    >
      もう一度プレイ
    </button>
  );

  switch (gameState) {
    case 'loading':
    case 'playing':
      return null;

    case 'loading_error':
      return (
        <div className="absolute inset-0 bg-black bg-opacity-80 flex flex-col justify-center items-center z-50 text-white text-center p-8">
          <h1 className="text-4xl font-bold mb-4 text-red-500">読み込みエラー</h1>
          <p className="text-lg mb-8">{reason}</p>
          <button
            onClick={onRetry}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-lg text-2xl font-semibold transition-transform transform hover:scale-105"
          >
            リトライ
          </button>
        </div>
      );
    
    case 'start':
      return (
        <div className="absolute inset-0 flex justify-center items-end z-50 pb-[15vh]">
          <button
            onClick={onStart}
            className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg text-2xl font-semibold transition-transform transform hover:scale-105 shadow-lg"
          >
            ゲーム開始
          </button>
        </div>
      );

    case 'won': {
      const clearTimeFormatted = formatClearTime(finalElapsedTimeMs);
      const title = `${clearTimeFormatted}でクリア！`;
      const tweetText = `怪盗ミュージアムを${clearTimeFormatted}でクリア！ #怪盗ミュージアム`;
      const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
      
      return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50 text-white text-center p-8">
          <h1 className="text-5xl font-bold mb-8">{title}</h1>
          <PlayAgainButton />
          <a 
            href={tweetUrl} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="mt-6 text-lg text-white hover:text-gray-300 underline font-bold"
          >
            Xにスクショしてポストしてね！
          </a>
        </div>
      );
    }

    case 'lost':
      return (
        <div className="absolute inset-0 bg-black bg-opacity-70 flex flex-col justify-center items-center z-50 text-white text-center p-8">
          <h1 className="text-5xl font-bold mb-4">ゲームオーバー</h1>
          <p className="text-xl mb-8">{reason}</p>
          <PlayAgainButton />
        </div>
      );

    default:
      return null;
  }
};

// --- Custom Hook for Asset Loading ---
const useAssetLoader = () => {
    const [loadingState, setLoadingState] = useState({
        isLoading: true,
        progress: 0,
        error: null as string | null,
        loadedAudio: {} as Record<string, HTMLAudioElement>,
    });
    const [retryCount, setRetryCount] = useState(0);

    const retry = useCallback(() => {
        setRetryCount(prev => prev + 1);
    }, []);

    useEffect(() => {
        let isCancelled = false;
        
        const load = async () => {
            setLoadingState({ isLoading: true, progress: 0, error: null, loadedAudio: {} });

            const assetImageUrls = Object.values(アセット).filter(url => typeof url === 'string' && /\.(png|jpg|jpeg|gif)$/i.test(url));
            const toyImageUrls = すべてのおもちゃ.map(toy => toy.画像URL);
            const imageUrls = [...new Set([...assetImageUrls, ...toyImageUrls])];
            
            const audioUrls = {
                'スタート効果音': アセット.スタート効果音, '移動音右': アセット.移動音右, '移動音左': アセット.移動音左,
                '盗む音': アセット.盗む音, 'ゲームオーバー音': アセット.ゲームオーバー音, 'クリア音': アセット.クリア音,
            };

            const totalAssets = imageUrls.length + Object.keys(audioUrls).length;
            if (totalAssets === 0) {
                if (!isCancelled) setLoadingState(prev => ({ ...prev, isLoading: false }));
                return;
            }
            let loadedCount = 0;

            const updateProgress = () => {
                if (isCancelled) return;
                loadedCount++;
                setLoadingState(prev => ({ ...prev, progress: (loadedCount / totalAssets) * 100 }));
            };

            const imagePromises = imageUrls.map(url => new Promise<void>((resolve, reject) => {
                const img = new Image();
                img.onload = () => { updateProgress(); resolve(); };
                img.onerror = () => reject(new Error(`画像の読み込みに失敗: ${url}`));
                img.src = url;
            }));

            const loadedAudioElements: Record<string, HTMLAudioElement> = {};
            const audioPromises = Object.entries(audioUrls).map(([key, url]) => new Promise<void>((resolve, reject) => {
                const audio = new Audio();
                const onCanPlay = () => { loadedAudioElements[key] = audio; updateProgress(); resolve(); cleanup(); };
                const onError = () => {
                    const err = audio.error;
                    reject(new Error(`オーディオ「${key}」の読み込みに失敗しました。${err ? ` (エラーコード: ${err.code})` : ''} URL: ${url}`));
                    cleanup();
                };
                const cleanup = () => { audio.removeEventListener('canplaythrough', onCanPlay); audio.removeEventListener('error', onError); };
                audio.addEventListener('canplaythrough', onCanPlay);
                audio.addEventListener('error', onError);
                audio.src = url;
                audio.load();
            }));

            try {
                await Promise.all([...imagePromises, ...audioPromises]);
                if (!isCancelled) {
                    setTimeout(() => {
                        if (!isCancelled) setLoadingState({ isLoading: false, progress: 100, error: null, loadedAudio: loadedAudioElements });
                    }, 500);
                }
            } catch (err: any) {
                if (!isCancelled) {
                    console.error("アセットの読み込みエラー:", err);
                    setLoadingState(prev => ({ ...prev, isLoading: false, error: err.message }));
                }
            }
        };

        const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("読み込みがタイムアウトしました (60秒)。")), 60000));
        Promise.race([load(), timeoutPromise]).catch(err => {
            if (!isCancelled) {
                setLoadingState(prev => ({ ...prev, isLoading: false, error: err.message }));
            }
        });

        return () => { isCancelled = true; };
    }, [retryCount]);

    return { ...loadingState, retry };
};

// --- Main App Component ---
export default function App() {
  const { isLoading, progress, error, loadedAudio, retry } = useAssetLoader();

  const [gameState, setGameState] = useState<ゲーム状態>('loading');
  const [ノイズの位置, setノイズの位置] = useState<ノイズの位置>('center');
  const [盗みモーション中, set盗みモーション中] = useState(false);
  const [サンサンの向き, setサンサンの向き] = useState<サンサンの向き>('front');
  const [盗んだおもちゃ, set盗んだおもちゃ] = useState<number[]>([]);
  const [残り時間, set残り時間] = useState(制限時間);
  const [finalElapsedTimeMs, setFinalElapsedTimeMs] = useState(0);
  const [ゲームオーバー理由, setゲームオーバー理由] = useState('');
  const [isShaking, setIsShaking] = useState(false);
  const [showCaughtIndicator, setShowCaughtIndicator] = useState(false);

  const 左のおもちゃ = すべてのおもちゃ.filter(t => t.配置 === 'left');
  const 右のおもちゃ = すべてのおもちゃ.filter(t => t.配置 === 'right');
  
  const ノイズの位置Ref = useRef(ノイズの位置);
  ノイズの位置Ref.current = ノイズの位置;
  const サンサンの向きRef = useRef(サンサンの向き);
  サンサンの向きRef.current = サンサンの向き;
  const 盗んだおもちゃRef = useRef(盗んだおもちゃ);
  盗んだおもちゃRef.current = 盗んだおもちゃ;
  const サンサンタイマーRef = useRef<{ turn?: number; turnBack?: number }>({});
  const gameStartTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (isLoading) {
      setGameState('loading');
    } else if (error) {
      setゲームオーバー理由(error);
      setGameState('loading_error');
    } else if (gameState === 'loading' || gameState === 'loading_error') {
      setGameState('start');
    }
  }, [isLoading, error]);
  
  // ゲームタイマー (カウントダウン)
  useEffect(() => {
    if (gameState !== 'playing') return;
    if (残り時間 <= 0) {
      setGameState('lost');
      setゲームオーバー理由('時間切れです！');
      return;
    }
    const timerId = setInterval(() => {
      set残り時間(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timerId);
  }, [gameState, 残り時間]);

  // サンサンのAI
  useEffect(() => {
    if (gameState !== 'playing') {
      if (gameState !== 'lost') setサンサンの向き('front');
      return;
    }
  
    const turnSansan = () => {
      const delay = サンサン振り向き間隔_最小 + Math.random() * (サンサン振り向き間隔_最大 - サンサン振り向き間隔_最小);
  
      サンサンタイマーRef.current.turn = window.setTimeout(() => {
        setサンサンの向き(Math.random() > 0.5 ? 'left' : 'right');
        
        サンサンタイマーRef.current.turnBack = window.setTimeout(() => {
          setサンサンの向き('front');
          turnSansan();
        }, 800);
      }, delay);
    };
  
    turnSansan();
  
    return () => {
      if (サンサンタイマーRef.current.turn) clearTimeout(サンサンタイマーRef.current.turn);
      if (サンサンタイマーRef.current.turnBack) clearTimeout(サンサンタイマーRef.current.turnBack);
    };
  }, [gameState]);

  // ゲーム状態変更時の効果音
  useEffect(() => {
    if (gameState === 'won') {
      loadedAudio['クリア音']?.play();
    } else if (gameState === 'lost') {
      loadedAudio['ゲームオーバー音']?.play();
    }
  }, [gameState, loadedAudio]);
  
  // クリア・敗北条件
  useEffect(() => {
    if (盗んだおもちゃ.length === おもちゃの総数 && gameState === 'playing') {
      if (gameStartTimeRef.current) {
        const endTime = performance.now();
        setFinalElapsedTimeMs(endTime - gameStartTimeRef.current);
      }
      setGameState('won');
    }
  }, [盗んだおもちゃ, gameState]);

  // 盗むアクションの副作用
  useEffect(() => {
    if (!盗みモーション中) return;

    const timerId = setTimeout(() => {
      const currentNoisePosition = ノイズの位置Ref.current;
      const currentSansanDirection = サンサンの向きRef.current;
      const isCaught = currentNoisePosition === currentSansanDirection;

      if (isCaught) {
        setIsShaking(true);
        setShowCaughtIndicator(true);
        setTimeout(() => setIsShaking(false), 500);

        setGameState('lost');
        setゲームオーバー理由('サンサンに見つかりました！');
      } else {
        const targetToys = currentNoisePosition === 'left' ? 左のおもちゃ : 右のおもちゃ;
        const currentStolen = 盗んだおもちゃRef.current;
        const toyToSteal = targetToys.find(toy => !currentStolen.includes(toy.id));
        
        if (toyToSteal) {
            set盗んだおもちゃ([...currentStolen, toyToSteal.id]);
        }
      }
      set盗みモーション中(false);
    }, 200);

    return () => clearTimeout(timerId);
  }, [盗みモーション中]);

  // --- イベントハンドラ ---
  const ゲーム開始処理 = () => {
    loadedAudio['スタート効果音']?.play();
    gameStartTimeRef.current = performance.now();
    setGameState('playing');
    setノイズの位置('center');
    set盗みモーション中(false);
    setサンサンの向き('front');
    set盗んだおもちゃ([]);
    set残り時間(制限時間);
    setFinalElapsedTimeMs(0);
    setゲームオーバー理由('');
    setIsShaking(false);
    setShowCaughtIndicator(false);
  };

  const 移動処理 = (direction: 'left' | 'right') => {
    if(盗みモーション中 || gameState !== 'playing') return;
    const soundKey = direction === 'left' ? '移動音左' : '移動音右';
    loadedAudio[soundKey]?.play();
    setノイズの位置(pos => direction === 'left' ? (pos === 'right' ? 'center' : 'left') : (pos === 'left' ? 'center' : 'right'));
  };

  const 盗むアクション処理 = () => {
    if (gameState !== 'playing' || ノイズの位置 === 'center' || 盗みモーション中) return;
    loadedAudio['盗む音']?.play();
    set盗みモーション中(true);
  };

  // --- レンダーロジック ---
  let ノイズ画像URL = アセット.ノイズ待機;
  if (盗みモーション中) {
    ノイズ画像URL = ノイズの位置 === 'left' ? アセット.ノイズ盗む右 : アセット.ノイズ盗む左;
  }

  const ノイズ位置クラス = {
    left: 'left-1/4 -translate-x-1/2',
    center: 'left-1/2 -translate-x-1/2',
    right: 'left-3/4 -translate-x-1/2'
  }[ノイズの位置];

  const サンサン画像 = { front: アセット.サンサン正面, left: アセット.サンサン左, right: アセット.サンサン右 }[サンサンの向き];
  const 背景画像URL = gameState === 'start' || gameState === 'loading' || gameState === 'loading_error' ? アセット.スタート画面 : アセット.背景;
  const showGameScene = gameState === 'playing' || gameState === 'lost';

  return (
    <div 
      className={`relative h-full bg-cover bg-no-repeat bg-center overflow-hidden font-sans select-none ${isShaking ? 'screen-shake' : ''}`}
      style={{
        maxWidth: '100vw',
        aspectRatio: '9 / 16',
        backgroundImage: `url('${背景画像URL}')` 
      }}
    >
      {gameState === 'loading' && <LoadingScreen progress={progress} />}
      <GameModal gameState={gameState} onStart={ゲーム開始処理} onRetry={retry} reason={ゲームオーバー理由} finalElapsedTimeMs={finalElapsedTimeMs} />
      { showGameScene && (
      <>
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-full max-w-sm px-4 z-30 flex flex-col items-center gap-2">
          <div className="grid grid-cols-6 gap-2 w-full bg-black/20 p-2 rounded-lg">
            {すべてのおもちゃ.map((toy) => (
              <div key={toy.id} className="aspect-square bg-black rounded flex justify-center items-center">
                {盗んだおもちゃ.includes(toy.id) && <img src={toy.画像URL} alt={toy.名前} className="w-full h-full object-contain p-1 rounded" />}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-300 rounded-full h-6 mt-2 relative overflow-hidden border-2 border-gray-400">
            <div 
              className="bg-yellow-400 h-full transition-all duration-1000 ease-linear"
              style={{ width: `${(残り時間 / 制限時間) * 100}%` }}
            />
            <span className="absolute inset-0 w-full h-full flex items-center justify-center text-sm font-bold text-black">
              {gameState === 'playing' ? `${残り時間} 秒` : ''}
            </span>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-xs flex justify-around items-center z-30">
          <button onClick={() => 移動処理('left')} className="w-20 h-20 active:scale-90 transition-transform disabled:opacity-50" disabled={gameState !== 'playing'}>
            <img src={アセット.ボタン左} alt="左に移動" className="w-full h-full" />
          </button>
          <button 
            onClick={盗むアクション処理}
            className="w-20 h-20 active:scale-90 transition-transform disabled:opacity-50"
            disabled={ノイズの位置 === 'center' || 盗みモーション中 || gameState !== 'playing'}
          >
            <img src={アセット.ボタン盗む} alt="盗む" className="w-full h-full" />
          </button>
          <button onClick={() => 移動処理('right')} className="w-20 h-20 active:scale-90 transition-transform disabled:opacity-50" disabled={gameState !== 'playing'}>
            <img src={アセット.ボタン右} alt="右に移動" className="w-full h-full" />
          </button>
        </div>
        <div className="absolute inset-0">
          <div className="absolute bottom-[28%] left-[12%] w-[20%] grid grid-cols-1 gap-4 z-20">
            {左のおもちゃ.map(toy => (
              <div key={toy.id} className={`transition-opacity duration-500 ${盗んだおもちゃ.includes(toy.id) ? 'opacity-0' : 'opacity-100'}`}>
                <img src={toy.画像URL} alt={toy.名前} className="w-full h-full object-contain" style={{ transform: 'scale(0.8)' }} />
              </div>
            ))}
          </div>
          <div className="absolute bottom-[28%] right-[12%] w-[20%] grid grid-cols-1 gap-4 z-20">
            {右のおもちゃ.map(toy => (
              <div key={toy.id} className={`transition-opacity duration-500 ${盗んだおもちゃ.includes(toy.id) ? 'opacity-0' : 'opacity-100'}`}>
                <img src={toy.画像URL} alt={toy.名前} className="w-full h-full object-contain" style={{ transform: 'scale(0.8)' }} />
              </div>
            ))}
          </div>
          <div 
              className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-1/3 max-w-[234px] z-20"
              style={{ aspectRatio: '411 / 510' }}
          >
              {showCaughtIndicator && (
                  <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 text-red-600 text-8xl font-black drop-shadow-lg pop-in z-30">
                      !
                  </div>
              )}
              <img src={サンサン画像} alt="サンサン" className="w-full h-full object-contain drop-shadow-2xl" />
          </div>
          <div className={`absolute bottom-[33%] w-2/3 max-w-[364px] transition-all duration-300 ease-in-out ${ノイズ位置クラス} z-10`}>
            <img src={ノイズ画像URL} alt="怪盗ノイズ" className="w-full drop-shadow-2xl" />
          </div>
        </div>
      </>
      )}
    </div>
  );
}
