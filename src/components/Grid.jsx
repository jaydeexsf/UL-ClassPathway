import React, { useState } from 'react';
import '../App.css';

const GRID_WIDTH = 10;
const GRID_HEIGHT = 10;

const Grid = () => {
  const [grid, setGrid] = useState(
    Array.from({ length: GRID_HEIGHT }, () =>
      Array.from({ length: GRID_WIDTH }, () => 0)
    )
  );
  const [start, setStart] = useState(null);
  const [end, setEnd] = useState(null);
  const [path, setPath] = useState([]);

  const handleCellClick = (row, col) => {
    if (!start) {
      setStart([row, col]);
      return;
    }
    if (!end) {
      setEnd([row, col]);
      return;
    }
  };

  const heuristic = (a, b) => {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  };

  const aStarSearch = (grid, start, end) => {
    const openList = [];
    const cameFrom = {};
    const gScore = { [start]: 0 };
    const fScore = { [start]: heuristic(start, end) };

    openList.push({ pos: start, score: fScore[start] });

    while (openList.length > 0) {
      openList.sort((a, b) => a.score - b.score);
      const current = openList.shift().pos;

      if (current[0] === end[0] && current[1] === end[1]) {
        let path = [];
        let temp = current;
        while (temp in cameFrom) {
          path.push(temp);
          temp = cameFrom[temp];
        }
        path.push(start);
        path.reverse();
        return path;
      }

      for (const [dx, dy] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]) {
        const neighbor = [current[0] + dx, current[1] + dy];
        if (
          neighbor[0] >= 0 &&
          neighbor[0] < GRID_HEIGHT &&
          neighbor[1] >= 0 &&
          neighbor[1] < GRID_WIDTH &&
          grid[neighbor[0]][neighbor[1]] === 0
        ) {
          const tentative_gScore = gScore[current] + 1;
          if (
            !gScore.hasOwnProperty(neighbor) ||
            tentative_gScore < gScore[neighbor]
          ) {
            cameFrom[neighbor] = current;
            gScore[neighbor] = tentative_gScore;
            fScore[neighbor] = tentative_gScore + heuristic(neighbor, end);
            openList.push({ pos: neighbor, score: fScore[neighbor] });
          }
        }
      }
    }
    return [];
  };

  const findPath = () => {
    if (start && end) {
      const path = aStarSearch(grid, start, end);
      setPath(path);
    }
  };

  return (
    <div className="p-4">
      <div className="grid grid-cols-10 gap-1">
        {grid.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className={`w-10 h-10 flex items-center justify-center border ${
                start && start[0] === rowIndex && start[1] === colIndex
                  ? 'bg-blue-500'
                  : end && end[0] === rowIndex && end[1] === colIndex
                  ? 'bg-red-500'
                  : path.some(
                      (p) => p[0] === rowIndex && p[1] === colIndex
                    )
                  ? 'bg-green-500'
                  : 'bg-white'
              }`}
              onClick={() => handleCellClick(rowIndex, colIndex)}
            ></div>
          ))
        )}
      </div>
      <button
        className="mt-4 p-2 bg-blue-500 text-white rounded"
        onClick={findPath}
      >
        Find Path
      </button>
    </div>
  );
};

export default Grid;
