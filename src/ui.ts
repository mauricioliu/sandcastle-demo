import type { GameState } from './game';

type CreateGame = () => GameState;
type MakeMove = (state: GameState, index: number) => GameState;
type IsDraw = (board: GameState['board']) => boolean;

export function mountGame(
  doc: Document,
  createGame: CreateGame,
  makeMove: MakeMove,
  isDraw: IsDraw,
): { render: () => void } {
  let state = createGame();

  const statusEl = doc.querySelector<HTMLElement>('[data-testid="status"]');
  const cells = Array.from(doc.querySelectorAll<HTMLButtonElement>('.cell'));
  const resetBtn = doc.querySelector<HTMLButtonElement>('[data-testid="reset"]');

  function render(): void {
    cells.forEach((cell, i) => {
      const value = state.board[i];
      cell.textContent = value ?? '';
      cell.disabled = value !== null || state.winner !== null;
    });
    if (statusEl) {
      if (state.winner) {
        statusEl.textContent = `${state.winner} wins!`;
      } else if (isDraw(state.board)) {
        statusEl.textContent = "It's a draw";
      } else {
        statusEl.textContent = `${state.currentPlayer}'s turn`;
      }
    }
  }

  cells.forEach((cell) => {
    cell.addEventListener('click', () => {
      const index = Number(cell.dataset.index);
      state = makeMove(state, index);
      render();
    });
  });

  resetBtn?.addEventListener('click', () => {
    state = createGame();
    render();
  });

  render();
  return { render };
}
