"use client";

import { useState, useCallback, useEffect, useRef } from "react";

const BOARD_SIZE = 20;
const CELL_SIZE = 24;
const INITIAL_SPEED = 150;
const SPEED_DECREMENT = 4;
const MIN_SPEED = 60;

type Point = { x: number; y: number };

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

function randomFood(exclude: Point[]): Point {
  let p: Point;
  do {
    p = { x: Math.floor(Math.random() * BOARD_SIZE), y: Math.floor(Math.random() * BOARD_SIZE) };
  } while (exclude.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

export default function SnakeGame() {
  const [snake, setSnake] = useState<Point[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Point>({ x: 5, y: 5 });
  const [direction, setDirection] = useState<Direction>("RIGHT");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [started, setStarted] = useState(false);
  const [pause, setPause] = useState(false);
  const dirRef = useRef<Direction>("RIGHT");
  const snakeRef = useRef<Point[]>([]);
  const foodRef = useRef<Point>({ x: 5, y: 5 });
  const scoreRef = useRef(0);

  useEffect(() => {
    snakeRef.current = snake;
  }, [snake]);

  useEffect(() => {
    foodRef.current = food;
  }, [food]);

  useEffect(() => {
    scoreRef.current = score;
  }, [score]);

  useEffect(() => {
    const saved = localStorage.getItem("snake-highscore");
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const reset = useCallback(() => {
    const start: Point[] = [{ x: 10, y: 10 }];
    setSnake(start);
    snakeRef.current = start;
    const f = randomFood(start);
    setFood(f);
    foodRef.current = f;
    setDirection("RIGHT");
    dirRef.current = "RIGHT";
    setScore(0);
    scoreRef.current = 0;
    setGameOver(false);
    setPause(false);
    setStarted(true);
  }, []);

  const step = useCallback(() => {
    if (gameOver || pause || !started) return;
    const currentDir = dirRef.current;
    const currentSnake = [...snakeRef.current];
    const head = { ...currentSnake[0] };

    switch (currentDir) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
    }

    if (
      head.x < 0 ||
      head.x >= BOARD_SIZE ||
      head.y < 0 ||
      head.y >= BOARD_SIZE ||
      currentSnake.some((s) => s.x === head.x && s.y === head.y)
    ) {
      setGameOver(true);
      setStarted(false);
      if (scoreRef.current > highScore) {
        setHighScore(scoreRef.current);
        localStorage.setItem("snake-highscore", String(scoreRef.current));
      }
      return;
    }

    const ate = head.x === foodRef.current.x && head.y === foodRef.current.y;
    const newSnake = [head, ...currentSnake];
    if (!ate) {
      newSnake.pop();
    } else {
      const nf = randomFood(newSnake);
      foodRef.current = nf;
      setFood(nf);
      const ns = scoreRef.current + 10;
      scoreRef.current = ns;
      setScore(ns);
    }
    snakeRef.current = newSnake;
    setSnake(newSnake);
  }, [gameOver, pause, started, highScore]);

  useEffect(() => {
    const speed = Math.max(MIN_SPEED, INITIAL_SPEED - score * SPEED_DECREMENT);
    const id = setInterval(step, speed);
    return () => clearInterval(id);
  }, [step, score]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!started || gameOver || pause) {
        if (e.key === "Enter" || e.key === " ") {
          if (gameOver) reset();
          else if (!started) reset();
          return;
        }
      }
      if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "w", "a", "s", "d", "W", "A", "S", "D"].includes(e.key)) {
        e.preventDefault();
      }
      switch (e.key) {
        case "ArrowUp":
        case "w":
        case "W":
          if (dirRef.current !== "DOWN") setDirection("UP");
          dirRef.current = "UP";
          break;
        case "ArrowDown":
        case "s":
        case "S":
          if (dirRef.current !== "UP") setDirection("DOWN");
          dirRef.current = "DOWN";
          break;
        case "ArrowLeft":
        case "a":
        case "A":
          if (dirRef.current !== "RIGHT") setDirection("LEFT");
          dirRef.current = "LEFT";
          break;
        case "ArrowRight":
        case "d":
        case "D":
          if (dirRef.current !== "LEFT") setDirection("RIGHT");
          dirRef.current = "RIGHT";
          break;
        case " ":
        case "p":
        case "P":
          if (started) setPause((p) => !p);
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [started, gameOver, pause, reset]);

  const renderCell = (x: number, y: number) => {
    let cellClass = "w-6 h-6";
    let style: React.CSSProperties = {};
    const isHead = snake.some((s, i) => i === 0 && s.x === x && s.y === y);
    const isBody = snake.some((s, i) => i > 0 && s.x === x && s.y === y);
    const isFood = food.x === x && food.y === y;

    if (isHead) {
      style = { backgroundColor: "#a3e635", boxShadow: "0 0 8px #a3e635" };
    } else if (isBody) {
      style = { backgroundColor: "#65a30d" };
    } else if (isFood) {
      style = { backgroundColor: "#ef4444", boxShadow: "0 0 8px #ef4444", borderRadius: "50%" };
    } else {
      style = { border: "1px solid #1a1c1a" };
    }

    return (
      <div
        key={`${x}-${y}`}
        className={cellClass}
        style={style}
      />
    );
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex items-center justify-between w-full max-w-md">
        <div className="text-left">
          <p className="text-xs tracking-widest text-neutral-500 uppercase">Score</p>
          <p className="text-3xl font-bold text-green-400 tabular-nums">{score}</p>
        </div>
        <h1 className="text-xl font-bold tracking-[0.2em] text-green-400 uppercase">Snake</h1>
        <div className="text-right">
          <p className="text-xs tracking-widest text-neutral-500 uppercase">Best</p>
          <p className="text-3xl font-bold text-green-400 tabular-nums">{highScore}</p>
        </div>
      </div>

      <div className="relative crt rounded-lg overflow-hidden border border-neutral-800 shadow-[0_0_40px_rgba(101,163,13,0.15)]">
        <div
          className="grid bg-[#0d0f0d]"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${BOARD_SIZE}, ${CELL_SIZE}px)`,
            width: BOARD_SIZE * CELL_SIZE,
            height: BOARD_SIZE * CELL_SIZE,
          }}
        >
          {Array.from({ length: BOARD_SIZE * BOARD_SIZE }, (_, i) => {
            const x = i % BOARD_SIZE;
            const y = Math.floor(i / BOARD_SIZE);
            return renderCell(x, y);
          })}
        </div>

        {!started && !gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20">
            <div className="text-center space-y-4">
              <p className="text-lg tracking-widest text-neutral-300">Press</p>
              <p className="text-3xl font-bold text-green-400">SPACE or ENTER</p>
              <p className="text-sm text-neutral-400">Arrow Keys / WASD to move · P to pause</p>
            </div>
          </div>
        )}

        {pause && started && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-20">
            <p className="text-2xl font-bold text-yellow-400 tracking-widest">PAUSED</p>
            <p className="text-sm text-neutral-400 mt-2">Press P to resume</p>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-20">
            <div className="text-center space-y-3">
              <p className="text-4xl font-black text-red-500 tracking-widest">GAME OVER</p>
              <p className="text-lg text-neutral-300">Score: {score}</p>
              {score >= highScore && score > 0 && <p className="text-yellow-400 text-sm">🏆 New High Score!</p>}
              <p className="text-sm text-neutral-500 mt-4">Press SPACE or ENTER to restart</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-4 text-xs tracking-wider text-neutral-500">
        <span>WASD / Arrows</span>
        <span className="text-neutral-700">|</span>
        <span>P = Pause</span>
        <span className="text-neutral-700">|</span>
        <span>Space = Start/Restart</span>
      </div>
    </div>
  );
}
