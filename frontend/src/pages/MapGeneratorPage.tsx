import React, { useState, useEffect, useRef } from "react";

const MapGeneratorPage: React.FC = () => {
  const [params, setParams] = useState({
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

  // 处理表单输入变化
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setParams({
      ...params,
      [name]:
        name === "seed" ||
        name === "rows" ||
        name === "cols" ||
        name === "roomMin" ||
        name === "roomMax" ||
        name === "removeDeadends" ||
        name === "addStairs" ||
        name === "cellSize"
          ? parseInt(value)
          : value,
    });
  };

  // 生成新的随机种子
  const generateNewSeed = () => {
    setParams({
      ...params,
      seed: Math.floor(Math.random() * 1000000),
    });
  };

  // 简单的伪随机数生成器（基于种子）
  const createRNG = (seed: number) => {
    let _seed = seed;
    return () => {
      _seed = (_seed * 9301 + 49297) % 233280;
      return _seed / 233280;
    };
  };

  // 生成并渲染地图
  // 生成并渲染地图
  const generateMap = () => {
    setIsGenerating(true);

    // 每次生成地图都自动更新种子值
    const newSeed = Math.floor(Math.random() * 1000000);
    setParams((prevParams) => ({
      ...prevParams,
      seed: newSeed,
    }));

    setTimeout(() => {
      if (canvasRef.current) {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        if (!ctx) {
          console.error("无法获取Canvas上下文");
          setIsGenerating(false);
          return;
        }

        // 设置Canvas尺寸
        canvas.width = params.cols * params.cellSize;
        canvas.height = params.rows * params.cellSize;

        // 清除Canvas
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 初始化伪随机数生成器 - 使用新的种子值
        const random = createRNG(newSeed);

        // 生成高级地下城
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

        // 渲染高级地下城
        renderDonjonStyleDungeon(dungeonData, ctx, params.cellSize);

        setIsGenerating(false);
      }
    }, 100);
  };

  // 地下城单元格类型枚举
  enum CellType {
    WALL = 0,
    FLOOR = 1,
    DOOR = 2,
    STAIRS_UP = 3,
    STAIRS_DOWN = 4,
    CORRIDOR = 5,
  }

  // 生成高级地下城
  const generateDonjonStyleDungeon = (
    rows: number,
    cols: number,
    minRoomSize: number,
    maxRoomSize: number,
    packedRooms: boolean,
    corridorStyle: string,
    removeDeadendPercent: number,
    numStairs: number,
    random: () => number
  ) => {
    // 初始化为墙壁
    const map = Array(rows)
      .fill(0)
      .map(() => Array(cols).fill(CellType.WALL));
    const rooms: Array<{
      x: number;
      y: number;
      width: number;
      height: number;
    }> = [];
    const doors: Array<{ x: number; y: number; direction: string }> = [];
    const corridors: Array<{ x: number; y: number }> = [];
    const stairs: Array<{ x: number; y: number; type: CellType }> = [];

    // 计算要生成的房间数
    const roomDensity = packedRooms ? 0.8 : 0.4;
    const dungeonArea = rows * cols;
    const averageRoomSize = ((minRoomSize + maxRoomSize) / 2) ** 2;
    const targetRoomCount = Math.floor(
      (dungeonArea * roomDensity) / averageRoomSize
    );

    // 生成房间
    let roomCount = 0;
    const maxAttempts = targetRoomCount * 10;
    let attempts = 0;

    while (roomCount < targetRoomCount && attempts < maxAttempts) {
      attempts++;

      // 随机房间大小
      const width =
        Math.floor(random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;
      const height =
        Math.floor(random() * (maxRoomSize - minRoomSize + 1)) + minRoomSize;

      // 随机房间位置
      const x = Math.floor(random() * (cols - width - 2)) + 1;
      const y = Math.floor(random() * (rows - height - 2)) + 1;

      // 检查房间是否与现有房间重叠
      let overlaps = false;
      for (const room of rooms) {
        const padding = packedRooms ? 0 : 1; // 紧凑模式可以紧挨着，散布模式要有间隙
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
        // 添加房间
        rooms.push({ x, y, width, height });
        roomCount++;

        // 在地图上标记房间区域为地板
        for (let ry = y; ry < y + height; ry++) {
          for (let rx = x; rx < x + width; rx++) {
            map[ry][rx] = CellType.FLOOR;
          }
        }
      }
    }

    // 连接房间 - 最小生成树算法
    if (rooms.length > 1) {
      // 计算房间中心点
      const roomCenters = rooms.map((room) => ({
        x: Math.floor(room.x + room.width / 2),
        y: Math.floor(room.y + room.height / 2),
        connected: false,
      }));

      // 第一个房间已连接
      roomCenters[0].connected = true;

      // 连接所有房间
      while (roomCenters.some((center) => !center.connected)) {
        let minDistance = Infinity;
        let bestStart = -1;
        let bestEnd = -1;

        // 找到最近的未连接房间
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
          // 连接这两个房间
          const start = roomCenters[bestStart];
          const end = roomCenters[bestEnd];

          // 创建走廊
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

          // 标记为已连接
          roomCenters[bestEnd].connected = true;
        } else {
          break; // 安全检查
        }
      }

      // 增加额外连接以创建环路 (30%几率)
      const extraConnections = Math.floor(rooms.length * 0.3);
      for (let i = 0; i < extraConnections; i++) {
        const room1 = Math.floor(random() * rooms.length);
        let room2 = Math.floor(random() * rooms.length);

        // 确保选择不同的房间
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

    // 移除死胡同
    if (removeDeadendPercent > 0) {
      removeDeadends(map, corridors, removeDeadendPercent / 100, random);
    }

    // 添加楼梯
    if (numStairs > 0 && rooms.length > 0) {
      // 上楼梯
      const upStairsRoom = rooms[Math.floor(random() * rooms.length)];
      const ux =
        Math.floor(upStairsRoom.x + random() * (upStairsRoom.width - 2)) + 1;
      const uy =
        Math.floor(upStairsRoom.y + random() * (upStairsRoom.height - 2)) + 1;
      map[uy][ux] = CellType.STAIRS_UP;
      stairs.push({ x: ux, y: uy, type: CellType.STAIRS_UP });

      // 下楼梯 (如果需要)
      if (numStairs > 1 && rooms.length > 1) {
        let downStairsRoom;
        do {
          downStairsRoom = rooms[Math.floor(random() * rooms.length)];
        } while (downStairsRoom === upStairsRoom);

        const dx =
          Math.floor(downStairsRoom.x + random() * (downStairsRoom.width - 2)) +
          1;
        const dy =
          Math.floor(
            downStairsRoom.y + random() * (downStairsRoom.height - 2)
          ) + 1;
        map[dy][dx] = CellType.STAIRS_DOWN;
        stairs.push({ x: dx, y: dy, type: CellType.STAIRS_DOWN });
      }
    }

    return { map, rooms, doors, corridors, stairs };
  };

  // 创建走廊连接
  const createCorridor = (
    map: number[][],
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    style: string,
    corridors: Array<{ x: number; y: number }>,
    doors: Array<{ x: number; y: number; direction: string }>,
    random: () => number
  ) => {
    // 根据走廊风格决定路径
    if (style === "Straight" || (style === "Bent" && random() < 0.5)) {
      // 先水平后垂直
      createHorizontalCorridor(map, x1, x2, y1, corridors, doors);
      createVerticalCorridor(map, y1, y2, x2, corridors, doors);
    } else {
      // 先垂直后水平
      createVerticalCorridor(map, y1, y2, x1, corridors, doors);
      createHorizontalCorridor(map, x1, x2, y2, corridors, doors);
    }
  };

  // 创建水平走廊
  const createHorizontalCorridor = (
    map: number[][],
    x1: number,
    x2: number,
    y: number,
    corridors: Array<{ x: number; y: number }>,
    doors: Array<{ x: number; y: number; direction: string }>
  ) => {
    const start = Math.min(x1, x2);
    const end = Math.max(x1, x2);

    for (let x = start; x <= end; x++) {
      // 如果是墙壁，可能需要门
      if (map[y][x] === CellType.WALL) {
        // 检查是否需要门 (墙壁两侧都是地板或走廊)
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
      // 如果已经是地板，不做改变
      else if (
        map[y][x] !== CellType.FLOOR &&
        map[y][x] !== CellType.STAIRS_UP &&
        map[y][x] !== CellType.STAIRS_DOWN
      ) {
        map[y][x] = CellType.CORRIDOR;
        corridors.push({ x, y });
      }
    }
  };

  // 创建垂直走廊
  const createVerticalCorridor = (
    map: number[][],
    y1: number,
    y2: number,
    x: number,
    corridors: Array<{ x: number; y: number }>,
    doors: Array<{ x: number; y: number; direction: string }>
  ) => {
    const start = Math.min(y1, y2);
    const end = Math.max(y1, y2);

    for (let y = start; y <= end; y++) {
      // 如果是墙壁，可能需要门
      if (map[y][x] === CellType.WALL) {
        // 检查是否需要门 (墙壁上下都是地板或走廊)
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
      // 如果已经是地板，不做改变
      else if (
        map[y][x] !== CellType.FLOOR &&
        map[y][x] !== CellType.STAIRS_UP &&
        map[y][x] !== CellType.STAIRS_DOWN
      ) {
        map[y][x] = CellType.CORRIDOR;
        corridors.push({ x, y });
      }
    }
  };

  // 移除死胡同
  const removeDeadends = (
    map: number[][],
    corridors: Array<{ x: number; y: number }>,
    percent: number,
    random: () => number
  ) => {
    let deadends = [];

    // 找出所有死胡同 (只有一个相邻空间的走廊单元格)
    for (const corridor of corridors) {
      const { x, y } = corridor;
      let exits = 0;

      // 检查四个方向
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

    // 随机移除指定百分比的死胡同
    const numToRemove = Math.floor(deadends.length * percent);
    deadends = shuffle(deadends, random).slice(0, numToRemove);

    // 将死胡同转换为墙壁
    for (const deadend of deadends) {
      map[deadend.y][deadend.x] = CellType.WALL;
    }
  };

  // 洗牌数组
  const shuffle = <T,>(array: T[], random: () => number): T[] => {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  // 渲染 donjon 风格地图
  const renderDonjonStyleDungeon = (
    dungeonData: {
      map: number[][];
      rooms: Array<{ x: number; y: number; width: number; height: number }>;
      doors: Array<{ x: number; y: number; direction: string }>;
      corridors: Array<{ x: number; y: number }>;
      stairs: Array<{ x: number; y: number; type: number }>;
    },
    ctx: CanvasRenderingContext2D,
    cellSize: number
  ) => {
    const { map } = dungeonData;

    // 预设颜色
    const colors = {
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

    // 绘制基本地图
    for (let y = 0; y < map.length; y++) {
      for (let x = 0; x < map[y].length; x++) {
        const cell = map[y][x];
        const px = x * cellSize;
        const py = y * cellSize;

        switch (cell) {
          case CellType.WALL:
            // 墙体渲染 - 使用深色
            ctx.fillStyle = colors.wall;
            ctx.fillRect(px, py, cellSize, cellSize);

            // 墙体上部阴影
            ctx.fillStyle = colors.wallTop;
            ctx.fillRect(px, py, cellSize, cellSize * 0.3);
            break;

          case CellType.FLOOR:
            // 房间地板 - 亮灰色带纹理
            ctx.fillStyle = colors.floor;
            ctx.fillRect(px, py, cellSize, cellSize);

            // 随机地板斑点 (纹理)
            if (Math.random() > 0.7) {
              ctx.fillStyle = colors.floorHighlight;
              ctx.fillRect(
                px + cellSize * 0.3,
                py + cellSize * 0.3,
                cellSize * 0.4,
                cellSize * 0.4
              );
            }
            break;

          case CellType.CORRIDOR:
            // 走廊 - 略暗灰色带纹理
            ctx.fillStyle = colors.corridor;
            ctx.fillRect(px, py, cellSize, cellSize);
            break;

          case CellType.DOOR:
            // 门 - 褐色木质纹理
            ctx.fillStyle = colors.door;
            ctx.fillRect(px, py, cellSize, cellSize);

            // 门的内部
            ctx.fillStyle = "#6B2E0E";
            ctx.fillRect(
              px + cellSize * 0.2,
              py + cellSize * 0.2,
              cellSize * 0.6,
              cellSize * 0.6
            );
            break;

          case CellType.STAIRS_UP:
            // 上楼梯 - 蓝色
            ctx.fillStyle = colors.floor;
            ctx.fillRect(px, py, cellSize, cellSize);

            // 楼梯符号
            ctx.fillStyle = colors.stairsUp;
            // 绘制楼梯向上符号
            ctx.beginPath();
            ctx.moveTo(px + cellSize * 0.2, py + cellSize * 0.7);
            ctx.lineTo(px + cellSize * 0.5, py + cellSize * 0.3);
            ctx.lineTo(px + cellSize * 0.8, py + cellSize * 0.7);
            ctx.fill();
            break;

          case CellType.STAIRS_DOWN:
            // 下楼梯 - 红色
            ctx.fillStyle = colors.floor;
            ctx.fillRect(px, py, cellSize, cellSize);

            // 楼梯符号
            ctx.fillStyle = colors.stairsDown;
            // 绘制楼梯向下符号
            ctx.beginPath();
            ctx.moveTo(px + cellSize * 0.2, py + cellSize * 0.3);
            ctx.lineTo(px + cellSize * 0.5, py + cellSize * 0.7);
            ctx.lineTo(px + cellSize * 0.8, py + cellSize * 0.3);
            ctx.fill();
            break;
        }
      }
    }

    // 绘制网格线
    if (cellSize >= 10) {
      ctx.strokeStyle = colors.grid;
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
  };

  // 下载地图图像
  const downloadMap = () => {
    if (canvasRef.current) {
      const link = document.createElement("a");
      link.download = `dungeon_map_${params.seed}.png`;
      link.href = canvasRef.current.toDataURL("image/png");
      link.click();
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-primary">
          随机地下城地图生成器
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* 左侧控制面板 */}
          <div className="md:col-span-1 bg-base-200 p-6 rounded-lg shadow-sm">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">种子值</label>
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
                  title="生成新的随机种子"
                >
                  🎲
                </button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">地图尺寸</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs opacity-70">行数</label>
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
                  <label className="text-xs opacity-70">列数</label>
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
              <label className="block text-sm font-medium mb-1">房间尺寸</label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs opacity-70">最小</label>
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
                  <label className="text-xs opacity-70">最大</label>
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
              <label className="block text-sm font-medium mb-1">房间布局</label>
              <select
                name="roomLayout"
                value={params.roomLayout}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="Scattered">分散式</option>
                <option value="Packed">紧凑式</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">走廊布局</label>
              <select
                name="corridorLayout"
                value={params.corridorLayout}
                onChange={handleInputChange}
                className="select select-bordered w-full"
              >
                <option value="Bent">弯曲型</option>
                <option value="Straight">直线型</option>
                <option value="Labyrinth">迷宫型</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">
                移除死胡同(%)
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
              <label className="block text-sm font-medium mb-1">楼梯数量</label>
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
                单元格大小 (像素)
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
                  生成中...
                </>
              ) : (
                "生成地图"
              )}
            </button>
          </div>

          {/* 右侧地图显示区域 */}
          <div className="md:col-span-2 bg-base-200 p-6 rounded-lg shadow-sm min-h-[600px] flex flex-col">
            <h2 className="text-xl font-bold mb-4">地图预览</h2>

            <div className="flex-1 flex flex-col items-center">
              <div className="overflow-auto max-h-[500px] border border-base-300 rounded-lg mb-4 bg-black">
                <canvas ref={canvasRef} className="block"></canvas>
              </div>
              <div className="w-full flex justify-end gap-2">
                <button onClick={downloadMap} className="btn btn-outline">
                  下载地图
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
