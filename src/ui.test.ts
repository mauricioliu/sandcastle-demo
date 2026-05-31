import { describe, it, expect, beforeEach } from 'vitest';
import { createGame, makeMove, isDraw } from './game';
import { mountGame } from './ui';

const HTML = `
  <p data-testid="status"></p>
  <div data-testid="board">
    ${Array.from({ length: 9 }, (_, i) => `<button class="cell" data-index="${i}"></button>`).join('')}
  </div>
  <button data-testid="reset">Reset</button>
`;

describe('mountGame', () => {
  beforeEach(() => {
    document.body.innerHTML = HTML;
  });

  function status(): string {
    return document.querySelector<HTMLElement>('[data-testid="status"]')!.textContent ?? '';
  }

  function cells(): HTMLButtonElement[] {
    return Array.from(document.querySelectorAll<HTMLButtonElement>('.cell'));
  }

  it('renders X to move initially', () => {
    mountGame(document, createGame, makeMove, isDraw);
    expect(status()).toBe("X's turn");
    expect(cells().every((c) => c.textContent === '')).toBe(true);
  });

  it('updates board and turn on click', () => {
    mountGame(document, createGame, makeMove, isDraw);
    cells()[0].click();
    expect(cells()[0].textContent).toBe('X');
    expect(cells()[0].disabled).toBe(true);
    expect(status()).toBe("O's turn");
  });

  it('announces the winner and disables remaining squares', () => {
    mountGame(document, createGame, makeMove, isDraw);
    const c = cells();
    c[0].click(); // X
    c[3].click(); // O
    c[1].click(); // X
    c[4].click(); // O
    c[2].click(); // X wins
    expect(status()).toBe('X wins!');
    expect(c.every((cell) => cell.disabled)).toBe(true);
  });

  it('reset returns the board to an empty state', () => {
    mountGame(document, createGame, makeMove, isDraw);
    cells()[0].click();
    document.querySelector<HTMLButtonElement>('[data-testid="reset"]')!.click();
    expect(cells().every((c) => c.textContent === '')).toBe(true);
    expect(status()).toBe("X's turn");
  });

  it('announces a draw when board fills with no winner', () => {
    mountGame(document, createGame, makeMove, isDraw);
    const c = cells();
    // X O X / X O O / O X X
    [0, 1, 2, 4, 3, 5, 7, 6, 8].forEach((i) => c[i].click());
    expect(status()).toBe("It's a draw");
  });
});
