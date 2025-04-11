import React, { useState, useEffect, useRef, useCallback } from "react";

// Define types for better type safety
interface DungeonParams {
  seed: number;
  rows: number;
  cols: number;
  roomMin: number;
  roomMax: number;
  roomLayout: "Scattered" | "Packed";
  corridorLayout: "Bent" | "Straight" | "Labyrinth";
  removeDeadends: number;
  addStairs: number;
  cellSize: number;
}

interface Room {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Door {
  x: number;
  y: number;
  direction: string;
}

interface Corridor {
  x: number;
  y: number;
}

interface Stair {
  x: number;
  y: number;
  type: CellType;
}

interface RoomCenter {
  x: number;
  y: number;
  connected: boolean;
}

interface DungeonData {
  map: CellType[][];
  rooms: Room[];
  doors: Door[];
  corridors: Corridor[];
  stairs: Stair[];
}

// Cell types enum
enum CellType {
  WALL = 0,
  FLOOR = 1,
  DOOR = 2,
  STAIRS_UP = 3,
  STAIRS_DOWN = 4,
  CORRIDOR = 5,
}

// Colors for rendering
const COLORS = {
  wall: "#333333",
  wallTop: "#222222",
  floor: "#CCCCCC",
  floorHighlight: "#DDDDDD",
  corridor: "#BBBBBB",
  door: "#8B4513",
  stairsUp: "#4444FF",
  stairsDown: "#FF4444",
  grid: "#555555",
};

const MapGeneratorPage: React.FC = () => {
  // Initial state with sensible defaults
  const [params, setParams] = useState<DungeonParams>({
    seed: Math.floor(Math.random() * 1000000),
    rows: 39,
    cols: 39,
    roomMin: 3,
    roomMax: 9,
    roomLayout: "Scattered",
    corridorLayout: "Bent",
    removeDeadends: 50,
    addStairs: 2,
    cellSize: 18,
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Create a simple pseudo-random number generator
  const createRNG = useCallback((seed: number) => {
    let _seed = seed;
    return () => {
      _seed = (_seed * 9301 + 49297) % 233280;
      return _seed / 233280;
    };
  }, []);

  // Handle form input changes
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setParams((prev) => ({
      ...prev,
      [name]: [
        "seed",
        "rows",
        "cols",
        "roomMin",
        "roomMax",
        "removeDeadends",
        "addStairs",
        "cellSize",
      ].includes(name)
        ? parseInt(value)
        : value,
    }));
  };

  // Generate a new random seed
  const generateNewSeed = () => {
    setParams((prev) => ({
      ...prev,
      seed: Math.floor(Math.random() * 1000000),
    }));
  };

  // Create corridor between two points
  const createCorridor = useCallback(
    (
      map: CellType[][],
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      style: string,
      corridors: Corridor[],
      doors: Door[],
      random: () => number
    ) => {
      if (style === "Straight" || (style === "Bent" && random() < 0.5)) {
        // First horizontal, then vertical
        createHorizontalCorridor(map, x1, x2, y1, corridors, doors);
        createVerticalCorridor(map, y1, y2, x2, corridors, doors);
      } else {
        // First vertical, then horizontal
        createVerticalCorridor(map, y1, y2, x1, corridors, doors);
        createHorizontalCorridor(map, x1, x2, y2, corridors, doors);
      }
    },
    []
  );

  // Create horizontal corridor
  const createHorizontalCorridor = useCallback(
    (
      map: CellType[][],
      x1: number,
      x2: number,
      y: number,
      corridors: Corridor[],
      doors: Door[]
    ) => {
      const start = Math.min(x1, x2);
      const end = Math.max(x1, x2);

      for (let x = start; x <= end; x++) {
        if (map[y][x] === CellType.WALL) {
          // Check if we need a door
          if (
            x > 0 &&
            x < map[0].length - 1 &&
            ((map[y][x - 1] === CellType.FLOOR &&
              map[y][x + 1] === CellType.WALL) ||
              (map[y][x - 1] === CellType.WALL &&
                map[y][x + 1] === CellType.FLOOR))
          ) {
            map[y][x] = CellType.DOOR;
            doors.push({ x, y, direction: "horizontal" });
          } else {
            map[y][x] = CellType.CORRIDOR;
            corridors.push({ x, y });
          }
        }
        // If it's already a floor or stairs, don't change it
        else if (
          map[y][x] !== CellType.FLOOR &&
          map[y][x] !== CellType.STAIRS_UP &&
          map[y][x] !== CellType.STAIRS_DOWN
        ) {
          map[y][x] = CellType.CORRIDOR;
          corridors.push({ x, y });
        }
      }
    },
    []
  );

  // Create vertical corridor
  const createVerticalCorridor = useCallback(
    (
      map: CellType[][],
      y1: number,
      y2: number,
      x: number,
      corridors: Corridor[],
      doors: Door[]
    ) => {
      const start = Math.min(y1, y2);
      const end = Math.max(y1, y2);

      for (let y = start; y <= end; y++) {
        if (map[y][x] === CellType.WALL) {
          // Check if we need a door
          if (
            y > 0 &&
            y < map.length - 1 &&
            ((map[y - 1][x] === CellType.FLOOR &&
              map[y + 1][x] === CellType.WALL) ||
              (map[y - 1][x] === CellType.WALL &&
                map[y + 1][x] === CellType.FLOOR))
          ) {
            map[y][x] = CellType.DOOR;
            doors.push({ x, y, direction: "vertical" });
          } else {
            map[y][x] = CellType.CORRIDOR;
            corridors.push({ x, y });
          }
        }
        // If it's already a floor or stairs, don't change it
        else if (
          map[y][x] !== CellType.FLOOR &&
          map[y][x] !== CellType.STAIRS_UP &&
          map[y][x] !== CellType.STAIRS_DOWN
        ) {
          map[y][x] = CellType.CORRIDOR;
          corridors.push({ x, y });
        }
      }
    },
    []
  );

  // Shuffle array (for randomizing)
  const shuffle = useCallback(<T,>(array: T[], random: () => number): T[] => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }, []);

  // Remove deadends from the dungeon
  const removeDeadends = useCallback(
    (
      map: CellType[][],
      corridors: Corridor[],
      percent: number,
      random: () => number
    ) => {
      let deadends: Corridor[] = [];

      // Find all deadends (corridor cells with only one exit)
      for (const corridor of corridors) {
        const { x, y } = corridor;
        let exits = 0;

        // Check all four directions
        if (
          y > 0 &&
          (map[y - 1][x] === CellType.FLOOR ||
            map[y - 1][x] === CellType.CORRIDOR)
        )
          exits++;
        if (
          y < map.length - 1 &&
          (map[y + 1][x] === CellType.FLOOR ||
            map[y + 1][x] === CellType.CORRIDOR)
        )
          exits++;
        if (
          x > 0 &&
          (map[y][x - 1] === CellType.FLOOR ||
            map[y][x - 1] === CellType.CORRIDOR)
        )
          exits++;
        if (
          x < map[0].length - 1 &&
          (map[y][x + 1] === CellType.FLOOR ||
            map[y][x + 1] === CellType.CORRIDOR)
        )
          exits++;

        if (exits === 1) {
          deadends.push({ x, y });
        }
      }

      // Randomly remove specified percentage of deadends
      const numToRemove = Math.floor(deadends.length * percent);
      deadends = shuffle(deadends, random).slice(0, numToRemove);

      // Convert deadends to walls
      for (const deadend of deadends) {
        map[deadend.y][deadend.x] = CellType.WALL;
      }
    },
    [shuffle]
  );

  // Main dungeon generation function
  const generateDonjonStyleDungeon = useCallback(
    (
      rows: number,
      cols: number,
      minRoomSize: number,
      maxRoomSize: number,
      packedRooms: boolean,
      corridorStyle: string,
      removeDeadendPercent: number,
      numStairs: number,
      random: () => number
    ): DungeonData => {
      // Initialize map with walls
      const map: CellType[][] = Array(rows)
        .fill(0)
        .map(() => Array(cols).fill(CellType.WALL));

      const rooms: Room[] = [];
      const doors: Door[] = [];
      const corridors: Corridor[] = [];
      const stairs: Stair[] = [];

      // Calculate target room count based on density
      const roomDensity = packedRooms ? 0.8 : 0.4;
      const dungeonArea = rows * cols;
      const averageRoomSize = ((minRoomSize + maxRoomSize) / 2) ** 2;
      const targetRoomCount = Math.floor(
        (dungeonArea * roomDensity) / averageRoomSize
      );

      // Generate rooms
      let roomCount = 0;
      const maxAttempts = targetRoomCount * 10;
      let attempts = 0;

      while (roomCount < targetRoomCount && attempts < maxAttempts) {
        attempts++;

        // Random room size
        const width =
          Math.floor(random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
        const height =
          Math.floor(random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;

        // Random room position
        const x = Math.floor(random() * (cols - width - 2)) + 1;
        const y = Math.floor(random() * (rows - height - 2)) + 1;

        // Check if room overlaps with existing rooms
        let overlaps = false;
        for (const room of rooms) {
          const padding = packedRooms ? 0 : 1; // Packed mode can touch, scattered mode needs spacing
          if (
            x - padding <= room.x + room.width &&
            x + width + padding >= room.x &&
            y - padding <= room.y + room.height &&
            y + height + padding >= room.y
          ) {
            overlaps = true;
            break;
          }
        }

        if (!overlaps) {
          // Add room
          rooms.push({ x, y, width, height });
          roomCount++;

          // Mark room area as floor on the map
          for (let ry = y; ry < y + height; ry++) {
            for (let rx = x; rx < x + width; rx++) {
              map[ry][rx] = CellType.FLOOR;
            }
          }
        }
      }

      // Connect rooms - minimum spanning tree algorithm
      if (rooms.length > 1) {
        // Calculate room center points
        const roomCenters: RoomCenter[] = rooms.map((room) => ({
          x: Math.floor(room.x + room.width / 2),
          y: Math.floor(room.y + room.height / 2),
          connected: false,
        }));

        // First room is already connected
        roomCenters[0].connected = true;

        // Connect all rooms
        while (roomCenters.some((center) => !center.connected)) {
          let minDistance = Infinity;
          let bestStart = -1;
          let bestEnd = -1;

          // Find closest unconnected room
          for (let i = 0; i < roomCenters.length; i++) {
            if (roomCenters[i].connected) {
              for (let j = 0; j < roomCenters.length; j++) {
                if (!roomCenters[j].connected) {
                  const dist =
                    Math.abs(roomCenters[i].x - roomCenters[j].x) +
                    Math.abs(roomCenters[i].y - roomCenters[j].y);
                  if (dist < minDistance) {
                    minDistance = dist;
                    bestStart = i;
                    bestEnd = j;
                  }
                }
              }
            }
          }

          if (bestStart !== -1 && bestEnd !== -1) {
            // Connect these two rooms
            const start = roomCenters[bestStart];
            const end = roomCenters[bestEnd];

            // Create corridor
            createCorridor(
              map,
              start.x,
              start.y,
              end.x,
              end.y,
              corridorStyle,
              corridors,
              doors,
              random
            );

            // Mark as connected
            roomCenters[bestEnd].connected = true;
          } else {
            break; // Safety check
          }
        }

        // Add extra connections to create loops (30% chance)
        const extraConnections = Math.floor(rooms.length * 0.3);
        for (let i = 0; i < extraConnections; i++) {
          const room1 = Math.floor(random() * rooms.length);
          let room2 = Math.floor(random() * rooms.length);

          // Ensure different rooms are selected
          while (room1 === room2) {
            room2 = Math.floor(random() * rooms.length);
          }

          const start = roomCenters[room1];
          const end = roomCenters[room2];
          createCorridor(
            map,
            start.x,
            start.y,
            end.x,
            end.y,
            corridorStyle,
            corridors,
            doors,
            random
          );
        }
      }

      // Remove deadends
      if (removeDeadendPercent > 0) {
        removeDeadends(map, corridors, removeDeadendPercent / 100, random);
      }

      // Add stairs
      if (numStairs > 0 && rooms.length > 0) {
        // Up stairs
        const upStairsRoom = rooms[Math.floor(random() * rooms.length)];
        const ux =
          Math.floor(upStairsRoom.x + random() * (upStairsRoom.width - 2)) + 1;
        const uy =
          Math.floor(upStairsRoom.y + random() * (upStairsRoom.height - 2)) + 1;
        map[uy][ux] = CellType.STAIRS_UP;
        stairs.push({ x: ux, y: uy, type: CellType.STAIRS_UP });

        // Down stairs (if needed)
        if (numStairs > 1 && rooms.length > 1) {
          let downStairsRoom;
          do {
            downStairsRoom = rooms[Math.floor(random() * rooms.length)];
          } while (downStairsRoom === upStairsRoom);

          const dx =
            Math.floor(
              downStairsRoom.x + random() * (downStairsRoom.width - 2)
            ) + 1;
          const dy =
            Math.floor(
              downStairsRoom.y + random() * (downStairsRoom.height - 2)
            ) + 1;
          map[dy][dx] = CellType.STAIRS_DOWN;
          stairs.push({ x: dx, y: dy, type: CellType.STAIRS_DOWN });
        }
      }

      return { map, rooms, doors, corridors, stairs };
    },
    [createCorridor, removeDeadends]
  );

  // Render dungeon map
  const renderDonjonStyleDungeon = useCallback(
    (
      dungeonData: DungeonData,
      ctx: CanvasRenderingContext2D,
      cellSize: number
    ) => {
      const { map } = dungeonData;

      // Draw basic map
      for (let y = 0; y < map.length; y++) {
        for (let x = 0; x < map[y].length; x++) {
          const cell = map[y][x];
          const px = x * cellSize;
          const py = y * cellSize;

          switch (cell) {
            case CellType.WALL:
              // Wall - dark color
              ctx.fillStyle = COLORS.wall;
              ctx.fillRect(px, py, cellSize, cellSize);

              // Wall top shadow
              ctx.fillStyle = COLORS.wallTop;
              ctx.fillRect(px, py, cellSize, cellSize * 0.3);
              break;

            case CellType.FLOOR:
              // Room floor - light gray with texture
              ctx.fillStyle = COLORS.floor;
              ctx.fillRect(px, py, cellSize, cellSize);

              // Random floor spots (texture)
              if (Math.random() > 0.7) {
                ctx.fillStyle = COLORS.floorHighlight;
                ctx.fillRect(
                  px + cellSize * 0.3,
                  py + cellSize * 0.3,
                  cellSize * 0.4,
                  cellSize * 0.4
                );
              }
              break;

            case CellType.CORRIDOR:
              // Corridor - medium gray with texture
              ctx.fillStyle = COLORS.corridor;
              ctx.fillRect(px, py, cellSize, cellSize);
              break;

            case CellType.DOOR:
              // Door - brown wooden texture
              ctx.fillStyle = COLORS.door;
              ctx.fillRect(px, py, cellSize, cellSize);

              // Door interior
              ctx.fillStyle = "#6B2E0E";
              ctx.fillRect(
                px + cellSize * 0.2,
                py + cellSize * 0.2,
                cellSize * 0.6,
                cellSize * 0.6
              );
              break;

            case CellType.STAIRS_UP:
              // Up stairs - blue
              ctx.fillStyle = COLORS.floor;
              ctx.fillRect(px, py, cellSize, cellSize);

              // Stair symbol
              ctx.fillStyle = COLORS.stairsUp;
              // Draw up arrow
              ctx.beginPath();
              ctx.moveTo(px + cellSize * 0.2, py + cellSize * 0.7);
              ctx.lineTo(px + cellSize * 0.5, py + cellSize * 0.3);
              ctx.lineTo(px + cellSize * 0.8, py + cellSize * 0.7);
              ctx.fill();
              break;

            case CellType.STAIRS_DOWN:
              // Down stairs - red
              ctx.fillStyle = COLORS.floor;
              ctx.fillRect(px, py, cellSize, cellSize);

              // Stair symbol
              ctx.fillStyle = COLORS.stairsDown;
              // Draw down arrow
              ctx.beginPath();
              ctx.moveTo(px + cellSize * 0.2, py + cellSize * 0.3);
              ctx.lineTo(px + cellSize * 0.5, py + cellSize * 0.7);
              ctx.lineTo(px + cellSize * 0.8, py + cellSize * 0.3);
              ctx.fill();
              break;
          }
        }
      }

      // Draw grid lines
      if (cellSize >= 10) {
        ctx.strokeStyle = COLORS.grid;
        ctx.lineWidth = 0.5;

        for (let y = 0; y <= map.length; y++) {
          ctx.beginPath();
          ctx.moveTo(0, y * cellSize);
          ctx.lineTo(map[0].length * cellSize, y * cellSize);
          ctx.stroke();
        }

        for (let x = 0; x <= map[0].length; x++) {
          ctx.beginPath();
          ctx.moveTo(x * cellSize, 0);
          ctx.lineTo(x * cellSize, map.length * cellSize);
          ctx.stroke();
        }
      }
    },
    []
  );

  // Generate and render map
  const generateMap = useCallback(() => {
    setIsGenerating(true);

    // Generate new seed for each map
    const newSeed = Math.floor(Math.random() * 1000000);
    setParams((prev) => ({
      ...prev,
      seed: newSeed,
    }));

    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          console.error("Failed to get Canvas context");
          setIsGenerating(false);
          return;
        }

        // Set canvas size
        canvas.width = params.cols * params.cellSize;
        canvas.height = params.rows * params.cellSize;

        // Clear canvas
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Initialize RNG with the new seed
        const random = createRNG(newSeed);

        // Generate advanced dungeon
        const dungeonData = generateDonjonStyleDungeon(
          params.rows,
          params.cols,
          params.roomMin,
          params.roomMax,
          params.roomLayout === "Packed",
          params.corridorLayout,
          params.removeDeadends,
          params.addStairs,
          random
        );

        // Render advanced dungeon
        renderDonjonStyleDungeon(dungeonData, ctx, params.cellSize);

        setIsGenerating(false);
      }
    });
  }, [params, createRNG, generateDonjonStyleDungeon, renderDonjonStyleDungeon]);

  // Download map image
  const downloadMap = useCallback(() => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = `dungeon_map_${params.seed}.png`;
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
    }
  }, [params.seed]);

  // Effect to regenerate map when component mounts
  useEffect(() => {
    generateMap();
    // We don't want to add generateMap as a dependency to prevent loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary">
          Random Dungeon Map Generator
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Control panel */}
          <div className="md:col-span-1 bg-base-200 p-6 rounded-lg shadow-sm">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Seed</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  name="seed"
                  value={params.seed}
                  onChange={handleInputChange}
                  className="input input-bordered w-full"
                />
                <button
                  type="button"
                  onClick={generateNewSeed}
                  className="btn btn-square"
                  title="Generate new random seed"
                >
                  🎲
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Map Size</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs opacity-70">Rows</label>
                  <input
                    type="number"
                    name="rows"
                    value={params.rows}
                    onChange={handleInputChange}
                    min={9}
                    max={99}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="text-xs opacity-70">Columns</label>
                  <input
                    type="number"
                    name="cols"
                    value={params.cols}
                    onChange={handleInputChange}
                    min={9}
                    max={99}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Room Size
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs opacity-70">Min</label>
                  <input
                    type="number"
                    name="roomMin"
                    value={params.roomMin}
                    onChange={handleInputChange}
                    min={3}
                    max={7}
                    className="input input-bordered w-full"
                  />
                </div>
                <div>
                  <label className="text-xs opacity-70">Max</label>
                  <input
                    type="number"
                    name="roomMax"
                    value={params.roomMax}
                    onChange={handleInputChange}
                    min={5}
                    max={15}
                    className="input input-bordered w-full"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Room Layout
              </label>
              <select
                name="roomLayout"
                value={params.roomLayout}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="Scattered">Scattered</option>
                <option value="Packed">Packed</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Corridor Layout
              </label>
              <select
                name="corridorLayout"
                value={params.corridorLayout}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="Bent">Bent</option>
                <option value="Straight">Straight</option>
                <option value="Labyrinth">Labyrinth</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Remove Deadends (%)
              </label>
              <input
                type="range"
                min="0"
                max="100"
                name="removeDeadends"
                value={params.removeDeadends}
                onChange={handleInputChange}
                className="range range-primary"
              />
              <div className="flex justify-between text-xs">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                Number of Stairs
              </label>
              <input
                type="number"
                name="addStairs"
                value={params.addStairs}
                onChange={handleInputChange}
                min={0}
                max={10}
                className="input input-bordered w-full"
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium mb-1">
                Cell Size (pixels)
              </label>
              <input
                type="number"
                name="cellSize"
                value={params.cellSize}
                onChange={handleInputChange}
                min={10}
                max={30}
                className="input input-bordered w-full"
              />
            </div>

            <button
              onClick={generateMap}
              className="btn btn-primary w-full"
              disabled={isGenerating}
            >
              {isGenerating ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Generating...
                </>
              ) : (
                "Generate Map"
              )}
            </button>
          </div>

          {/* Map display area */}
          <div className="md:col-span-2 bg-base-200 p-6 rounded-lg shadow-sm min-h-[600px] flex flex-col">
            <h2 className="text-xl font-bold mb-4">Map Preview</h2>

            <div className="flex-1 flex flex-col items-center">
              <div className="overflow-auto max-h-[500px] border border-base-300 rounded-lg mb-4 bg-black">
                <canvas ref={canvasRef} className="block"></canvas>
              </div>
              <div className="w-full flex justify-end gap-2">
                <button onClick={downloadMap} className="btn btn-outline">
                  Download Map
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapGeneratorPage;
