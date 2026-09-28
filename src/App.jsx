import React, { useState, useEffect, memo } from 'react';
import './index.css';

const HUSBANDOS = [
  { region: 'Mondstadt', name: 'Lohen' },
  { region: 'Liyue', name: 'Xiao' },
  { region: 'Inazuma', name: 'Kazuha' },
  { region: 'Sumeru', name: 'Wanderer' },
  { region: 'Fontaine', name: 'Lyney' },
  { region: 'Natlan', name: 'Kinich' },
  { region: 'Nodkrai', name: 'Flins' },
  { region: 'Snezhnaya', name: 'Mitya' }
];

// ----------------------------------------------------
// KOMPONEN PETAL (KELOPAK BUNGA JATUH) - Dioptimalkan dengan memo
// ----------------------------------------------------
const Petals = memo(() => {
  const [petals, setPetals] = useState([]);

  useEffect(() => {
    const petalArray = Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: Math.random() * 5 + 5,
      animationDelay: Math.random() * 10,
      width: Math.random() * 8 + 10,
      height: Math.random() * 8 + 10,
    }));
    setPetals(petalArray);
  }, []);

  return (
    <>
      {petals.map(p => (
        <div
          key={p.id}
          className="petal"
          style={{
            left: `${p.left}vw`,
            width: `${p.width}px`,
            height: `${p.height}px`,
            animationDuration: `${p.animationDuration}s`,
            animationDelay: `${p.animationDelay}s`,
            willChange: 'transform, top'
          }}
        />
      ))}
    </>
  );
});

// ----------------------------------------------------
// KOMPONEN PENGHITUNG WAKTU (LIVE COUNTER) - Dioptimalkan dengan memo
// ----------------------------------------------------
const Counter = memo(() => {
  const [timePassed, setTimePassed] = useState({ years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const birthDate = new Date('2004-09-29T00:00:00');
    let animationFrameId;

    const updateTime = () => {
      const now = new Date();

      let years = now.getFullYear() - birthDate.getFullYear();
      const anniversaryThisYear = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());

      if (now < anniversaryThisYear) {
        years--;
      }

      const lastAnniversary = new Date(birthDate.getFullYear() + years, birthDate.getMonth(), birthDate.getDate());
      const diff = now - lastAnniversary;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimePassed(prev => {
        if (prev.seconds === seconds) return prev;
        return { years, days, hours, minutes, seconds };
      });

      animationFrameId = requestAnimationFrame(updateTime);
    };

    animationFrameId = requestAnimationFrame(updateTime);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-4 mt-8 w-full max-w-2xl mx-auto relative z-10">
      {Object.entries(timePassed).map(([unit, value]) => (
        <div key={unit} className="glass-card flex flex-col items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-2xl">
          <span className="text-2xl sm:text-3xl font-bold text-pink-400">{value}</span>
          <span className="text-[10px] sm:text-xs uppercase tracking-widest text-gray-400 mt-1">{unit}</span>
        </div>
      ))}
    </div>
  );
});

// ----------------------------------------------------
// KOMPONEN PUZZLE GAME (SECTION 2 - PART 1)
// ----------------------------------------------------
const PuzzleGame = ({ onComplete, onNextGame }) => {
  const [tiles, setTiles] = useState([0, 1, 2, 3, 4, 5, 6, 7, 8]);
  const [isSolved, setIsSolved] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(null);

  const shuffle = () => {
    let newTiles = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let i = newTiles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newTiles[i], newTiles[j]] = [newTiles[j], newTiles[i]];
    }
    if (newTiles.every((val, i) => val === i)) {
      [newTiles[0], newTiles[1]] = [newTiles[1], newTiles[0]];
    }
    setTiles(newTiles);
    setHasStarted(true);
    setIsSolved(false);
    setSelectedIndex(null);
  };

  const handleTileClick = (index) => {
    if (isSolved || !hasStarted) return;

    if (selectedIndex === null) {
      setSelectedIndex(index);
    } else {
      if (selectedIndex === index) {
        setSelectedIndex(null);
        return;
      }

      const newTiles = [...tiles];
      [newTiles[selectedIndex], newTiles[index]] = [newTiles[index], newTiles[selectedIndex]];
      setTiles(newTiles);
      setSelectedIndex(null);

      if (newTiles.every((val, i) => val === i)) {
        setIsSolved(true);
        onComplete();
      }
    }
  };

  return (
    <section className="py-24 px-6 relative z-10 bg-gray-900/60 border-t border-b border-pink-500/20 shadow-2xl">
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <div className="text-center mb-8 reveal">
          <h2 className="text-3xl sm:text-4xl font-bold text-pink-400 mb-4">Game 1: Cat Puzzle 🐾</h2>
          <p className="text-gray-300 max-w-lg mx-auto leading-relaxed">
            Susun gambar 5 kucing takdirmu untuk melaju ke tahap berikutnya! <br />
            <span className="inline-block mt-2 px-3 py-1 bg-pink-500/20 text-pink-300 rounded-full text-sm font-medium border border-pink-500/30">
              💡 Cara main: Klik 1 kepingan, lalu klik kepingan lain untuk menukar tempatnya.
            </span>
          </p>
        </div>

        <div className="bg-white/5 p-3 sm:p-4 rounded-xl shadow-2xl border border-white/10 backdrop-blur-md reveal content-visibility-auto">
          <div className="grid grid-cols-3 gap-0.5 sm:gap-1 relative bg-gray-950 rounded-lg p-0.5 sm:p-1 w-[300px] h-[300px] sm:w-[420px] sm:h-[420px]">
            {tiles.map((tileVal, index) => {
              const row = Math.floor(tileVal / 3);
              const col = tileVal % 3;
              const bgPosX = col * 50;
              const bgPosY = row * 50;
              const isSelected = selectedIndex === index;

              return (
                <div
                  key={`tile-${index}`}
                  onClick={() => handleTileClick(index)}
                  className={`rounded-sm transition-all duration-200 ${hasStarted && !isSolved ? 'cursor-pointer hover:brightness-110 z-10' : ''} ${isSelected ? 'scale-95 ring-4 ring-pink-500 z-20 shadow-2xl brightness-125' : ''} ${isSolved ? 'scale-100' : ''}`}
                  style={{
                    backgroundImage: "url('/puzzle.jpg')",
                    backgroundSize: '300% 300%',
                    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                    boxShadow: hasStarted && !isSolved && !isSelected ? 'inset 0 0 0 1px rgba(255,255,255,0.2)' : 'none'
                  }}
                ></div>
              );
            })}
          </div>
        </div>

        {!hasStarted && !isSolved && (
          <button
            onClick={shuffle}
            className="mt-10 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 animate-bounce reveal"
          >
            Mulai Bermain!
          </button>
        )}

        {isSolved && hasStarted && (
          <div className="mt-10 text-center animate-bounce">
            <h3 className="text-2xl sm:text-3xl font-bold text-green-400 mb-6">🎉 Game 1 Selesai! 🎉</h3>
            <button
              onClick={onNextGame}
              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-transform hover:scale-105 active:scale-95 text-lg"
            >
              Lanjut ke Game Kuis! ➡
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

// ----------------------------------------------------
// KOMPONEN UJIAN HUSBU (SECTION 2 - PART 2)
// ----------------------------------------------------
const QuizGame = ({ onComplete }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [wrongOption, setWrongOption] = useState(null);
  const [correctOption, setCorrectOption] = useState(null); // State jawaban benar

  useEffect(() => {
    const generated = [];
    const shuffled = [...HUSBANDOS].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);

    selected.forEach(h => {
      const isTypeName = Math.random() > 0.5;
      let qText = "";
      let ans = "";
      let wrong = [];

      if (isTypeName) {
        qText = `Siapa husbu kesukaan Nachan dari region ${h.region}?`;
        ans = h.name;
        wrong = HUSBANDOS.filter(x => x.name !== h.name).map(x => x.name).sort(() => Math.random() - 0.5).slice(0, 3);
      } else {
        qText = `Husbu Nachan adalah ${h.name}, dari region manakah dia berasal?`;
        ans = h.region;
        wrong = HUSBANDOS.filter(x => x.region !== h.region).map(x => x.region).sort(() => Math.random() - 0.5).slice(0, 3);
      }

      const options = [ans, ...wrong].sort(() => Math.random() - 0.5);
      generated.push({ question: qText, options, answer: ans });
    });
    setQuestions(generated);
  }, []);

  const handleSelect = (opt) => {
    // Kunci tombol jika game sudah selesai atau masih dalam jeda efek "Benar"
    if (isFinished || correctOption !== null) return;

    if (opt === questions[currentQ].answer) {
      setCorrectOption(opt);
      setWrongOption(null);

      // Jeda 2 detik sebelum lanjut ke soal berikutnya
      setTimeout(() => {
        setCorrectOption(null);
        if (currentQ < 2) {
          setCurrentQ(prev => prev + 1);
        } else {
          setIsFinished(true);
          onComplete();
        }
      }, 2000);
    } else {
      setWrongOption(opt);
      setTimeout(() => setWrongOption(null), 800);
    }
  };

  if (questions.length === 0) return (
    <section className="py-20 px-6 relative z-10 bg-gray-900/40 border-b border-pink-500/20 shadow-2xl min-h-[400px] flex items-center justify-center">
      <div className="text-pink-500 animate-spin text-4xl">🌸</div>
    </section>
  );

  return (
    <section className="py-20 px-6 relative z-10 bg-gray-900/40 border-b border-pink-500/20 shadow-2xl min-h-[500px] content-visibility-auto">
      <div className="max-w-3xl mx-auto flex flex-col items-center">
        <div className="text-center mb-8 reveal active">
          <h2 className="text-3xl sm:text-4xl font-bold text-pink-400 mb-4">Game 2: Ujian Husbu 🌸</h2>
          <p className="text-gray-300">Buktikan kalau kamu benar-benar ingat husbu-husbu kesayanganmu!</p>
        </div>

        {!isFinished ? (
          <div className="w-full bg-white/5 p-6 sm:p-10 rounded-3xl shadow-xl border border-white/10 backdrop-blur-md reveal active relative">

            {/* Latar hijau saat benar */}
            {correctOption !== null && (
              <div className="absolute inset-0 bg-green-500/10 rounded-3xl z-0 pointer-events-none transition-colors duration-500"></div>
            )}

            <div className="flex justify-between items-center mb-8 relative z-10">
              <span className="text-pink-400 font-bold bg-pink-500/20 px-4 py-2 rounded-full text-sm">Pertanyaan {currentQ + 1} / 3</span>
              <div className="flex gap-3">
                {[0, 1, 2].map(i => (
                  <div key={i} className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-colors duration-500 ${i <= currentQ ? 'bg-pink-500 shadow-[0_0_10px_#ec4899]' : 'bg-gray-600'}`}></div>
                ))}
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold text-white mb-10 text-center leading-relaxed relative z-10">
              {questions[currentQ].question}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 relative z-10">
              {questions[currentQ].options.map((opt, i) => {
                const isWrong = wrongOption === opt;
                const isCorrect = correctOption === opt;

                return (
                  <button
                    key={i}
                    onClick={() => handleSelect(opt)}
                    disabled={correctOption !== null}
                    className={`py-4 px-6 rounded-2xl font-bold text-lg sm:text-xl transition-all duration-300 shadow-md border 
                      ${isWrong
                        ? 'bg-red-500/20 border-red-500 text-red-300 animate-[shake_0.5s_ease-in-out]'
                        : isCorrect
                          ? 'bg-green-500 border-green-400 text-white shadow-[0_0_15px_#22c55e] scale-105'
                          : 'bg-gray-800/80 border-gray-600 text-gray-200 hover:bg-pink-500/20 hover:border-pink-500 hover:text-pink-300 hover:-translate-y-1'
                      }
                      ${(correctOption !== null && !isCorrect) ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                  >
                    {String.fromCharCode(65 + i)}. {opt}
                  </button>
                )
              })}
            </div>

            {/* Indikator teks saat benar */}
            <div className={`mt-6 text-center transition-all duration-500 ${correctOption !== null ? 'opacity-100' : 'opacity-0 h-0 overflow-hidden'}`}>
              <p className="text-green-400 font-bold text-lg animate-bounce mt-4">Benar! Memuat pertanyaan selanjutnya...</p>
            </div>
          </div>
        ) : (
          <div className="w-full bg-green-500/10 p-8 rounded-3xl shadow-xl border border-green-500/30 backdrop-blur-md text-center animate-bounce mt-10">
            <h3 className="text-3xl font-bold text-green-400 mb-2">🎉 Game 2 Selesai! 🎉</h3>
            <p className="text-white text-lg">Kamu memang sangat mengenali husbu-husbumu!</p>
          </div>
        )}
      </div>
    </section>
  );
};


// ----------------------------------------------------
// KOMPONEN SURAT INTERAKTIF (SECTION 3)
// ----------------------------------------------------
const InteractiveLetter = ({ isUnlocked }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] py-16 overflow-hidden relative z-10 content-visibility-auto">
      <div className="text-center mb-12 reveal">
        <h2 className="text-3xl sm:text-4xl font-bold text-white">A Special Message</h2>
        <p className="text-gray-400 mt-2 max-w-lg mx-auto">
          {isUnlocked
            ? "Semua rintangan telah diselesaikan. Ada sesuatu untukmu di dalam sini..."
            : "Selesaikan Game Puzzle Kucing dan Ujian Husbu di atas untuk membuka surat ini!"}
        </p>
      </div>

      <div className="relative w-full max-w-2xl flex justify-center mt-10" style={{ height: isOpen ? '850px' : '300px', transition: 'height 1s ease' }}>

        {/* AMPLOP TERTUTUP */}
        <div
          className={`absolute top-0 w-[300px] h-[200px] sm:w-[400px] sm:h-[260px] bg-[#e3d5c8] rounded-md shadow-2xl transition-all duration-700 z-30 ${isOpen ? 'translate-y-[200px] opacity-0 pointer-events-none scale-75' : 'translate-y-0 opacity-100 scale-100'} ${!isUnlocked ? 'grayscale cursor-not-allowed opacity-60' : 'hover:-translate-y-4 cursor-pointer'}`}
          onClick={() => isUnlocked && setIsOpen(true)}
        >
          {/* Flap Atas (Tutup Amplop) */}
          <div
            className="absolute top-0 left-0 w-full h-[60%] bg-[#d6c5b3] origin-top transition-transform duration-1000 ease-in-out z-40 rounded-t-md"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 50% 100%)',
              transform: isOpen ? 'rotateX(180deg)' : 'rotateX(0deg)'
            }}
          >
            {/* Stiker Hati / Gembok */}
            {!isOpen && (
              <div className={`absolute bottom-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md text-xs transition-colors duration-500 ${isUnlocked ? 'bg-red-500 animate-pulse' : 'bg-gray-600'}`}>
                {isUnlocked ? '❤️' : '🔒'}
              </div>
            )}
          </div>

          {/* Flap Kiri & Kanan (Badan Amplop) */}
          <div className="absolute top-0 left-0 w-full h-full border-[100px] sm:border-[130px] border-transparent border-l-[#ebdcd0] border-r-[#ebdcd0] border-b-[#f0e3d6] rounded-md z-20 pointer-events-none"></div>

          {/* Tombol Klik / Info Terkunci */}
          {!isOpen && (
            <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 z-50 w-[120%] text-center flex justify-center">
              {isUnlocked ? (
                <span className="bg-pink-500 text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg animate-bounce inline-block">
                  Klik Buka Surat
                </span>
              ) : (
                <span className="bg-gray-700 text-gray-300 border border-gray-600 px-6 py-2 rounded-full font-bold text-sm shadow-lg inline-flex items-center gap-2">
                  🔒 Surat Terkunci
                </span>
              )}
            </div>
          )}
        </div>

        {/* ISI SURAT (GAMBAR & TEKS) */}
        <div
          className={`absolute top-0 w-[95%] max-w-xl flex flex-col items-center transition-all duration-1000 ease-in-out ${isOpen ? 'z-40' : '-z-10 opacity-0 pointer-events-none'}`}
        >
          {/* Gambar Polaroid */}
          <div
            className={`w-full bg-white p-4 pb-12 rounded-sm shadow-2xl relative z-20 transition-all duration-1000 ${isOpen ? 'translate-y-0 opacity-100 rotate-[-2deg] delay-[400ms]' : 'translate-y-[150px] opacity-0 rotate-0'}`}
          >
            {/* Gambar disetel dengan lazy loading untuk optimasi performa */}
            <img src="/surprise.jpg" alt="Surprise" loading="lazy" decoding="async" className="w-full h-auto object-cover rounded shadow-inner border border-gray-100 bg-gray-100 min-h-[300px]" />
            <p className="absolute bottom-4 left-0 w-full text-center text-gray-500 font-medium font-serif italic text-lg">Happy Birthday! 🎉</p>
          </div>

          {/* Kertas Surat */}
          <div
            className={`w-[90%] bg-[#fffcf5] text-gray-800 p-8 sm:p-10 rounded-b-xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-gray-200 transition-all duration-1000 relative z-10 ${isOpen ? 'translate-y-[-20px] opacity-100 delay-[1000ms]' : 'translate-y-[-100%] opacity-0'}`}
          >
            <h2 className="text-2xl sm:text-3xl font-bold text-pink-500 mb-6 font-serif border-b-2 border-pink-100 pb-2">A Letter for You 💌</h2>

            <div className="space-y-4 leading-relaxed text-base sm:text-lg font-serif">
              <p>Selamat ulang tahun Nachan! 🎉</p>
              <p>
                Di hari yang spesial ini, aku cuma mau bilang makasih udah jadi teman yang luar biasa selama masa kuliah. Ga nyangka lho sejak maba kita deket, eh ternyata berlanjut sampe sekarang. Walau kadang ada breaks karena urusan masing-masing, tapi kita tetep komunikasi dan sering saling support. Makasih udah jadi teman ku sejak maba. Ga bohong, aku seneng banget bisa kenal sama kamu. 🤩✨
              </p>

              <p className="font-bold text-pink-400 mt-6 text-right">
                Enjoy your special day! ✨
              </p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="mt-8 text-sm text-gray-400 hover:text-pink-500 underline transition-colors w-full text-center block"
            >
              Tutup Surat
            </button>
          </div>
        </div>
      </div>

      {/* TAMPILKAN TOMBOL DOWNLOAD JIKA SURAT SUDAH TERBUKA (ATAU UNLOCKED) */}
      <div className={`mt-10 transition-opacity duration-1000 flex flex-wrap justify-center gap-4 ${isOpen ? 'opacity-100 delay-1000' : 'opacity-0 pointer-events-none'}`}>
        <a
          href="/surprise.jpg"
          download="Kejutan_Nachan.jpg"
          className="bg-gray-800/80 hover:bg-pink-500 hover:text-white border border-gray-600 text-pink-400 px-6 py-3 rounded-full font-bold shadow-lg transition-all flex items-center gap-2"
        >
          <span className="text-xl">📥</span> Unduh Foto Kejutan
        </a>
        <a
          href="/puzzle.jpg"
          download="Kucing_Genshin.jpg"
          className="bg-gray-800/80 hover:bg-purple-500 hover:text-white border border-gray-600 text-purple-400 px-6 py-3 rounded-full font-bold shadow-lg transition-all flex items-center gap-2"
        >
          <span className="text-xl">📥</span> Unduh Puzzle Kucing
        </a>
      </div>
    </div>
  );
};

// ----------------------------------------------------
// ANIMASI UNLOCK LAYAR PENUH
// ----------------------------------------------------
const UnlockAnimation = () => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/90 backdrop-blur-sm transition-opacity duration-500">
      <div className="flex flex-col items-center animate-bounce">
        <span className="text-[100px] sm:text-[140px] mb-4 drop-shadow-2xl">🔓</span>
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500 drop-shadow-lg text-center px-4">
          Akses Surat Terbuka!
        </h2>
        <p className="text-gray-300 mt-6 text-lg sm:text-xl animate-pulse">Memuat hadiahmu...</p>
      </div>
    </div>
  );
};


// ----------------------------------------------------
// APLIKASI UTAMA
// ----------------------------------------------------
export default function App() {
  const [isPuzzleSolved, setIsPuzzleSolved] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [isQuizSolved, setIsQuizSolved] = useState(false);
  const [showUnlockAnim, setShowUnlockAnim] = useState(false);

  const isGamesCompleted = isPuzzleSolved && isQuizSolved;

  useEffect(() => {
    if (isGamesCompleted) {
      setShowUnlockAnim(true);
      setTimeout(() => {
        setShowUnlockAnim(false);
        const letterEl = document.getElementById("letter-section");
        if (letterEl) {
          letterEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 3000);
    }
  }, [isGamesCompleted]);

  useEffect(() => {
    // Membungkus logika Scroll Reveal
    // Gunakan requestAnimationFrame untuk performa scroll yang jauh lebih baik (Optimasi Vercel)
    let scrollTimeout;
    const reveals = document.querySelectorAll('.reveal');

    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      reveals.forEach(reveal => {
        const revealTop = reveal.getBoundingClientRect().top;
        if (revealTop < windowHeight - 100) {
          reveal.classList.add('active');
        }
      });
    };

    const scrollHandler = () => {
      if (scrollTimeout) {
        cancelAnimationFrame(scrollTimeout);
      }
      scrollTimeout = requestAnimationFrame(revealOnScroll);
    };

    window.addEventListener('scroll', scrollHandler, { passive: true });
    revealOnScroll();

    return () => window.removeEventListener('scroll', scrollHandler);
  }, [showQuiz]);

  return (
    <div className="min-h-screen bg-gray-950 font-sans selection:bg-pink-500 selection:text-white pb-20 overflow-hidden relative">
      <Petals />
      {showUnlockAnim && <UnlockAnimation />}

      {/* 1. HEADER / HERO SECTION */}
      <section className="relative min-h-screen flex flex-col items-center justify-center p-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-950/90 z-0"></div>
        <div
          className="absolute inset-0 opacity-20 z-0 bg-cover bg-center content-visibility-auto"
          style={{ backgroundImage: "url('/landscape.jpg')" }}
        ></div>

        <div className="z-10 reveal w-full mt-12 flex flex-col items-center">
          <p className="text-pink-400 tracking-[0.3em] uppercase text-xs sm:text-sm mb-4 font-semibold">
            Special Day for a Special Person
          </p>
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-500 mb-6 drop-shadow-lg leading-tight py-2">
            Happy Birthday, <br /> Nachan!
          </h1>
          <p className="text-gray-300 text-base sm:text-lg md:text-xl max-w-2xl mx-auto italic px-4">
            "Semoga hari-harimu seindah dunia Teyvat, dan sehangat pelukan kucing kesayanganmu."
          </p>

          <Counter />

          {/* Hint transisi ke section bawah */}
          <div className="mt-12 sm:mt-16 animate-bounce flex flex-col items-center gap-2">
            <span className="text-pink-400 font-medium text-sm sm:text-base tracking-wider bg-pink-500/10 px-4 py-2 rounded-full border border-pink-500/20 backdrop-blur-sm shadow-[0_0_15px_rgba(244,114,182,0.2)]">
              Ada sesuatu yang menantimu di bawah, ayo bermain 👇
            </span>
            <svg className="w-6 h-6 text-pink-400 mt-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* 2. GAME PUZZLE (GAME 1) */}
      <PuzzleGame
        onComplete={() => setIsPuzzleSolved(true)}
        onNextGame={() => {
          setShowQuiz(true);
          setTimeout(() => {
            document.getElementById("quiz-section")?.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        }}
      />

      {/* 3. UJIAN HUSBU (GAME 2) */}
      {showQuiz && (
        <div id="quiz-section">
          <QuizGame onComplete={() => setIsQuizSolved(true)} />
        </div>
      )}

      {/* 4. SURAT PESAN PERSONAL */}
      <div id="letter-section">
        <InteractiveLetter isUnlocked={isGamesCompleted} />
      </div>

    </div>
  );
}
