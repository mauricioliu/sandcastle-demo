export type Cell = 'X' | 'O' | null;
export type Player = 'X' | 'O';
export type Board = Cell[];
export type WinningLine = readonly [number, number, number];

export interface GameState {
  board: Board;
  currentPlayer: Player;
  winner: Player | null;
}

const WIN_LINES: readonly WinningLine[] = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

export function createGame(): GameState {
  return {
    board: Array(9).fill(null),
    currentPlayer: 'X',
    winner: null,
  };
}

export function getWinner(board: Board): Player | null {
  for (const [a, b, c] of WIN_LINES) {
    const v = board[a];
    if (v && v === board[b] && v === board[c]) return v;
  }
  return null;
}

export function getWinningLine(board: Board): WinningLine | null {
  for (const line of WIN_LINES) {
    const [a, b, c] = line;
    const v = board[a];
    if (v && v === board[b] && v === board[c]) return line;
  }
  return null;
}

export function isDraw(board: Board): boolean {
  return getWinner(board) === null && board.every((c) => c !== null);
}

export function makeMove(state: GameState, index: number): GameState {
  if (!Number.isInteger(index) || index < 0 || index > 8) {
    throw new RangeError(`Invalid square index: ${index}`);
  }
  if (state.winner || state.board[index] !== null) return state;

  const board = state.board.slice();
  board[index] = state.currentPlayer;
  const winner = getWinner(board);
  return {
    board,
    currentPlayer: state.currentPlayer === 'X' ? 'O' : 'X',
    winner,
  };
}
