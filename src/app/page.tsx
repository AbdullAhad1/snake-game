import SnakeGame from "./components/SnakeGame";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-950 text-green-400 flex flex-col items-center justify-center p-4 select-none">
      <SnakeGame />
    </main>
  );
}
