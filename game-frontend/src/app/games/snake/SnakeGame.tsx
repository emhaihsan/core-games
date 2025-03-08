'use client';

import { useEffect, useRef, useState } from 'react';

interface SnakeGameProps {
  onGameOver: (score: number) => void;
  gameOver: boolean;
  speed: number;
}

// Game constants
const GRID_SIZE = 30; // Increased grid size for larger game area
const CELL_SIZE = 20;
const CANVAS_SIZE = GRID_SIZE * CELL_SIZE;

// Direction types
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

// Snake segment
interface SnakeSegment {
  x: number;
  y: number;
}

// Food position
interface Food {
  x: number;
  y: number;
}

export default function SnakeGame({ onGameOver, gameOver, speed }: SnakeGameProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  
  // Game state refs to avoid closure issues in event listeners
  const directionRef = useRef<Direction>('RIGHT');
  const snakeRef = useRef<SnakeSegment[]>([
    { x: 5, y: 10 },
    { x: 4, y: 10 },
    { x: 3, y: 10 },
  ]);
  const foodRef = useRef<Food>({ x: 15, y: 10 });
  const gameOverRef = useRef(gameOver);
  const gameLoopRef = useRef<number | null>(null);
  const speedRef = useRef(speed);

  // Update gameOverRef when prop changes
  useEffect(() => {
    gameOverRef.current = gameOver;
    if (!gameOver) {
      // Reset game state on restart
      directionRef.current = 'RIGHT';
      snakeRef.current = [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 },
      ];
      foodRef.current = generateFood();
      setScore(0);
      startGameLoop();
    } else if (gameLoopRef.current) {
      // Cancel game loop if game is over
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
      
      // Make sure the final state is rendered properly
      requestAnimationFrame(() => {
        draw(); // Draw one last time to ensure final state is visible
      });
    }
  }, [gameOver]);

  // Update speed when prop changes
  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  // Initialize game
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size
    canvas.width = CANVAS_SIZE;
    canvas.height = CANVAS_SIZE;

    // Start game loop
    if (!gameOver) {
      startGameLoop();
    }

    // Set up keyboard controls
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default behavior for arrow keys to avoid page scrolling
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'w', 'a', 's', 'd'].includes(e.key.toLowerCase())) {
        e.preventDefault();
      }
      
      // Store the current direction to ensure we don't process conflicting changes
      const currentDirection = directionRef.current;
      
      switch (e.key.toLowerCase()) {
        case 'arrowup':
        case 'w':
          if (currentDirection !== 'DOWN') {
            directionRef.current = 'UP';
          }
          break;
        case 'arrowdown':
        case 's':
          if (currentDirection !== 'UP') {
            directionRef.current = 'DOWN';
          }
          break;
        case 'arrowleft':
        case 'a':
          if (currentDirection !== 'RIGHT') {
            directionRef.current = 'LEFT';
          }
          break;
        case 'arrowright':
        case 'd':
          if (currentDirection !== 'LEFT') {
            directionRef.current = 'RIGHT';
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [gameOver]);

  // Generate random food position
  const generateFood = (): Food => {
    const x = Math.floor(Math.random() * GRID_SIZE);
    const y = Math.floor(Math.random() * GRID_SIZE);
    
    // Make sure food doesn't spawn on snake
    const isOnSnake = snakeRef.current.some(segment => segment.x === x && segment.y === y);
    if (isOnSnake) {
      return generateFood();
    }
    
    return { x, y };
  };

  // Start game loop
  const startGameLoop = () => {
    let lastTime = 0;
    let deltaTime = 0;
    let isMoving = false; // Flag to prevent multiple movements within one frame

    const gameLoop = (timestamp: number) => {
      if (gameOverRef.current) return;

      if (!lastTime) lastTime = timestamp;
      deltaTime += timestamp - lastTime;
      lastTime = timestamp;

      if (deltaTime >= speedRef.current && !isMoving) {
        isMoving = true; // Set flag to prevent multiple movements
        update();
        draw();
        deltaTime = 0;
        // Reset the moving flag after a small delay to ensure smooth movement
        setTimeout(() => {
          isMoving = false;
        }, 10);
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);
  };

  // Update game state
  const update = () => {
    if (gameOverRef.current) return;

    const snake = [...snakeRef.current];
    const head = { ...snake[0] };
    const currentDirection = directionRef.current; // Capture current direction to ensure consistent movement

    // Move head based on direction - ensure single cell movement
    switch (currentDirection) {
      case 'UP':
        head.y = (head.y - 1 + GRID_SIZE) % GRID_SIZE; // Wrap around
        break;
      case 'DOWN':
        head.y = (head.y + 1) % GRID_SIZE; // Wrap around
        break;
      case 'LEFT':
        head.x = (head.x - 1 + GRID_SIZE) % GRID_SIZE; // Wrap around
        break;
      case 'RIGHT':
        head.x = (head.x + 1) % GRID_SIZE; // Wrap around
        break;
    }

    // Check for collision with self
    if (snake.some((segment, index) => index > 0 && segment.x === head.x && segment.y === head.y)) {
      handleGameOver();
      return;
    }

    // Add new head
    snake.unshift(head);

    // Check if snake ate food
    if (head.x === foodRef.current.x && head.y === foodRef.current.y) {
      // Generate new food
      foodRef.current = generateFood();
      
      // Increase score
      const newScore = score + 1;
      setScore(newScore);
    } else {
      // Remove tail if no food was eaten
      snake.pop();
    }

    // Update snake
    snakeRef.current = snake;
  };

  // Draw game
  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Always clear canvas to prevent artifacts but keep the final state visible
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw grid (optional)
    ctx.strokeStyle = '#333333';
    for (let i = 0; i < GRID_SIZE; i++) {
      ctx.beginPath();
      ctx.moveTo(i * CELL_SIZE, 0);
      ctx.lineTo(i * CELL_SIZE, canvas.height);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(0, i * CELL_SIZE);
      ctx.lineTo(canvas.width, i * CELL_SIZE);
      ctx.stroke();
    }

    // Draw food with glow effect
    ctx.shadowBlur = 15;
    ctx.shadowColor = '#ff6b00';
    ctx.fillStyle = '#ff6b00';
    ctx.beginPath();
    ctx.arc(
      foodRef.current.x * CELL_SIZE + CELL_SIZE / 2,
      foodRef.current.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2 - 2,
      0,
      Math.PI * 2
    );
    ctx.fill();
    ctx.shadowBlur = 0;

    // Draw snake with gradient effect
    snakeRef.current.forEach((segment, index) => {
      // Head is a different color
      if (index === 0) {
        // Snake head
        ctx.fillStyle = '#ff9d00';
      } else {
        // Snake body with gradient effect
        const gradientPosition = index / snakeRef.current.length;
        const green = Math.floor(120 - gradientPosition * 70);
        ctx.fillStyle = `rgb(255, ${green}, 0)`;
      }

      ctx.fillRect(
        segment.x * CELL_SIZE + 1,
        segment.y * CELL_SIZE + 1,
        CELL_SIZE - 2,
        CELL_SIZE - 2
      );
      
      // Draw eyes on head
      if (index === 0) {
        ctx.fillStyle = '#000';
        
        // Draw eyes based on direction
        const eyeSize = CELL_SIZE / 5;
        const eyeOffset = CELL_SIZE / 3;
        
        if (directionRef.current === 'RIGHT' || directionRef.current === 'LEFT') {
          // Eyes on top and bottom for horizontal movement
          ctx.fillRect(
            segment.x * CELL_SIZE + (directionRef.current === 'RIGHT' ? CELL_SIZE - eyeOffset : eyeOffset - eyeSize),
            segment.y * CELL_SIZE + eyeOffset - eyeSize,
            eyeSize,
            eyeSize
          );
          ctx.fillRect(
            segment.x * CELL_SIZE + (directionRef.current === 'RIGHT' ? CELL_SIZE - eyeOffset : eyeOffset - eyeSize),
            segment.y * CELL_SIZE + CELL_SIZE - eyeOffset,
            eyeSize,
            eyeSize
          );
        } else {
          // Eyes on left and right for vertical movement
          ctx.fillRect(
            segment.x * CELL_SIZE + eyeOffset - eyeSize,
            segment.y * CELL_SIZE + (directionRef.current === 'DOWN' ? CELL_SIZE - eyeOffset : eyeOffset - eyeSize),
            eyeSize,
            eyeSize
          );
          ctx.fillRect(
            segment.x * CELL_SIZE + CELL_SIZE - eyeOffset,
            segment.y * CELL_SIZE + (directionRef.current === 'DOWN' ? CELL_SIZE - eyeOffset : eyeOffset - eyeSize),
            eyeSize,
            eyeSize
          );
        }
      }
    });
  };

  // Handle game over
  const handleGameOver = () => {
    gameOverRef.current = true;
    if (gameLoopRef.current) {
      cancelAnimationFrame(gameLoopRef.current);
      gameLoopRef.current = null;
    }
    
    // Make sure to draw the final state before calling onGameOver
    draw(); // Draw the final state one last time to ensure it's visible
    
    // Don't clear the canvas - keep the final state visible
    onGameOver(score);
  };

  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        width={CANVAS_SIZE} 
        height={CANVAS_SIZE}
        className="border border-[#ff6b00]/30 rounded-sm bg-[#151515]"
        style={{ imageRendering: 'pixelated' }}
      />
    </div>
  );
}
