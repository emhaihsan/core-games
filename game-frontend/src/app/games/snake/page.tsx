"use client";

import { useState } from "react";
import Header from "@/components/Header";
import SnakeGame from "./SnakeGame";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

// Mock leaderboard data
const mockLeaderboard = {
  easy: [
    { address: "0x1234...5678", score: 25 },
    { address: "0x8765...4321", score: 18 },
    { address: "0x9876...5432", score: 15 },
  ],
  medium: [
    { address: "0x2345...6789", score: 20 },
    { address: "0x7654...3210", score: 16 },
    { address: "0x8765...4321", score: 12 },
  ],
  hard: [
    { address: "0x3456...7890", score: 15 },
    { address: "0x6543...2109", score: 12 },
    { address: "0x7654...3210", score: 8 },
  ],
};

// Difficulty settings
const difficultySettings = {
  easy: 200, // Slower speed (more ms between updates)
  medium: 150, // Medium speed
  hard: 100, // Faster speed (fewer ms between updates)
};

type Difficulty = "easy" | "medium" | "hard";

export default function SnakePage() {
  const [gameStarted, setGameStarted] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [finalScore, setFinalScore] = useState(0);
  const [selectedDifficulty, setSelectedDifficulty] =
    useState<Difficulty>("medium");
  const [highScores, setHighScores] = useState(mockLeaderboard);

  // Handle game over
  const handleGameOver = (score: number) => {
    setGameOver(true);
    setFinalScore(score);

    // In a real implementation, this would call a smart contract to record the score
    console.log(`Game over! Score: ${score}`);
  };

  // Handle restart game
  const handleRestartGame = () => {
    setGameOver(false);
  };

  // Handle start game
  const handleStartGame = () => {
    setGameStarted(true);
    setGameOver(false);
  };

  // Handle back to menu
  const handleBackToMenu = () => {
    setGameStarted(false);
    setGameOver(false);
  };

  // Truncate Ethereum address for display
  const truncateAddress = (address: string) => {
    return address;
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link
            href="/dashboard"
            className="flex items-center text-[#ff6b00] hover:text-[#ff9d00] transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5 mr-2" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-8 text-center text-[#ff6b00]">
          Snake Game
        </h1>

        {!gameStarted ? (
          <div className="max-w-4xl mx-auto">
            <div className="bg-[#151515] p-6 rounded-lg border border-[#ff6b00]/30 mb-8">
              <h2 className="text-2xl font-bold mb-4 text-[#ff9d00]">
                How to Play
              </h2>
              <p className="mb-4">
                Use <span className="text-[#ff6b00] font-bold">W, A, S, D</span>{" "}
                or arrow keys to control the snake.
              </p>
              <p className="mb-4">
                Eat the orange food to grow longer and increase your score.
              </p>
              <p className="mb-4">Avoid running into yourself!</p>
              <p className="mb-4">
                The walls are passable - you'll wrap around to the other side.
              </p>

              <div className="mt-6">
                <h3 className="text-xl font-bold mb-3 text-[#ff9d00]">
                  Select Difficulty
                </h3>
                <div className="flex flex-wrap gap-4">
                  {(["easy", "medium", "hard"] as Difficulty[]).map(
                    (difficulty) => (
                      <button
                        key={difficulty}
                        onClick={() => setSelectedDifficulty(difficulty)}
                        className={`px-6 py-3 rounded-md font-bold capitalize transition-colors ${
                          selectedDifficulty === difficulty
                            ? "bg-[#ff6b00] text-black"
                            : "bg-[#222222] text-white hover:bg-[#333333]"
                        }`}
                      >
                        {difficulty}
                      </button>
                    )
                  )}
                </div>
              </div>

              <button
                onClick={handleStartGame}
                className="mt-8 w-full py-4 bg-gradient-to-r from-[#ff6b00] to-[#ff9d00] text-black font-bold rounded-md hover:from-[#ff9d00] hover:to-[#ffb84d] transition-all transform hover:scale-105"
              >
                Start Game
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(["easy", "medium", "hard"] as Difficulty[]).map(
                (difficulty) => (
                  <div
                    key={difficulty}
                    className="bg-[#151515] p-6 rounded-lg border border-[#ff6b00]/30"
                  >
                    <h3 className="text-xl font-bold mb-4 text-[#ff9d00] capitalize">
                      {difficulty} Leaderboard
                    </h3>
                    <div className="space-y-2">
                      {highScores[difficulty].map((entry, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-2 bg-[#222222] rounded"
                        >
                          <span className="text-gray-300">
                            {truncateAddress(entry.address)}
                          </span>
                          <span className="font-bold text-[#ff6b00]">
                            {entry.score}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-4">
              <div className="bg-[#151515] px-4 py-2 rounded-md border border-[#ff6b00]/30">
                <span className="text-gray-300 mr-2">Difficulty:</span>
                <span className="text-[#ff9d00] font-bold capitalize">
                  {selectedDifficulty}
                </span>
              </div>

              <button
                onClick={handleBackToMenu}
                className="px-4 py-2 bg-[#222222] text-white rounded-md hover:bg-[#333333] transition-colors"
              >
                Back to Menu
              </button>
            </div>

            <div className="flex justify-center mb-8 relative">
              <SnakeGame
                onGameOver={handleGameOver}
                gameOver={gameOver}
                speed={difficultySettings[selectedDifficulty]}
              />

              {gameOver && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
                  <div className="bg-[#151515] p-6 rounded-lg border-2 border-[#ff6b00]/70 shadow-lg text-center max-w-md">
                    <h2 className="text-2xl font-bold mb-2 text-[#ff9d00]">
                      Game Over!
                    </h2>
                    <p className="text-xl mb-6">
                      Your score:{" "}
                      <span className="text-[#ff6b00] font-bold">
                        {finalScore}
                      </span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <button
                        onClick={handleRestartGame}
                        className="px-4 py-3 bg-gradient-to-r from-[#ff6b00] to-[#ff9d00] text-black font-bold rounded-md hover:from-[#ff9d00] hover:to-[#ffb84d] transition-all transform hover:scale-105"
                      >
                        Play Again
                      </button>
                      <button
                        onClick={handleBackToMenu}
                        className="px-4 py-3 bg-[#222222] text-white rounded-md hover:bg-[#333333] transition-colors"
                      >
                        Back to Menu
                      </button>
                      <Link
                        href="/dashboard"
                        className="px-4 py-3 bg-[#222222] text-white rounded-md hover:bg-[#333333] transition-colors flex items-center justify-center"
                      >
                        Dashboard
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
