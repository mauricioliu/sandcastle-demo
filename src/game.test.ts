import { describe, it, expect } from 'vitest';
import { createGame, makeMove, getWinner, getWinningLine, isDraw } from './game';

describe('createGame', () => {
  it('starts with an empty 3x3 board and X to move', () => {
    const game = createGame();
    expect(game.board).toEqual([
      null, null, null,
      null, null, null,
      null, null, null,
    ]);
    expect(game.currentPlayer).toBe('X');
    expect(game.winner).toBeNull();
  });
});

describe('makeMove', () => {
  it('places the current player on the chosen square and switches turn', () => {
    const game = makeMove(createGame(), 0);
    expect(game.board[0]).toBe('X');
    expect(game.currentPlayer).toBe('O');
  });

  it('ignores moves on occupied squares', () => {
    const after = makeMove(makeMove(createGame(), 4), 4);
    expect(after.board[4]).toBe('X');
    expect(after.currentPlayer).toBe('O');
  });

  it('ignores moves after a winner is decided', () => {
    let game = createGame();
    game = makeMove(game, 0); // X
    game = makeMove(game, 3); // O
    game = makeMove(game, 1); // X
    game = makeMove(game, 4); // O
    game = makeMove(game, 2); // X wins top row
    const afterWin = makeMove(game, 5);
    expect(afterWin.board[5]).toBeNull();
  });

  it('throws for invalid indices', () => {
    expect(() => makeMove(createGame(), -1)).toThrow();
    expect(() => makeMove(createGame(), 9)).toThrow();
  });
});

describe('getWinner', () => {
  it('returns null when no winner', () => {
    expect(getWinner(createGame().board)).toBeNull();
  });

  it.each([
    ['top row', [0, 1, 2]],
    ['middle row', [3, 4, 5]],
    ['bottom row', [6, 7, 8]],
    ['left col', [0, 3, 6]],
    ['middle col', [1, 4, 7]],
    ['right col', [2, 5, 8]],
    ['diag tl-br', [0, 4, 8]],
    ['diag tr-bl', [2, 4, 6]],
  ])('detects X winning on %s', (_label, indices) => {
    const board = Array(9).fill(null) as Array<'X' | 'O' | null>;
    for (const i of indices) board[i] = 'X';
    expect(getWinner(board)).toBe('X');
  });

  it('detects O winning', () => {
    const board: Array<'X' | 'O' | null> = [
      'O', 'O', 'O',
      'X', 'X', null,
      null, null, null,
    ];
    expect(getWinner(board)).toBe('O');
  });
});

describe('getWinningLine', () => {
  it('returns null when there is no winner', () => {
    expect(getWinningLine(createGame().board)).toBeNull();
  });

  it('returns the indices of the winning row', () => {
    const board: Array<'X' | 'O' | null> = [
      'X', 'X', 'X',
      'O', 'O', null,
      null, null, null,
    ];
    expect(getWinningLine(board)).toEqual([0, 1, 2]);
  });

  it('returns the indices of the winning diagonal', () => {
    const board: Array<'X' | 'O' | null> = [
      'O', 'X', 'X',
      'X', 'O', null,
      null, null, 'O',
    ];
    expect(getWinningLine(board)).toEqual([0, 4, 8]);
  });
});

describe('isDraw', () => {
  it('is false on an empty board', () => {
    expect(isDraw(createGame().board)).toBe(false);
  });

  it('is true when the board is full and no winner', () => {
    const board: Array<'X' | 'O' | null> = [
      'X', 'O', 'X',
      'X', 'O', 'O',
      'O', 'X', 'X',
    ];
    expect(getWinner(board)).toBeNull();
    expect(isDraw(board)).toBe(true);
  });

  it('is false when board is full but someone won', () => {
    const board: Array<'X' | 'O' | null> = [
      'X', 'X', 'X',
      'O', 'O', 'X',
      'X', 'O', 'O',
    ];
    expect(isDraw(board)).toBe(false);
  });
});
