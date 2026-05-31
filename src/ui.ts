import type { GameState, WinningLine } from './game';

type CreateGame = () => GameState;
type MakeMove = (state: GameState, index: number) => GameState;
type IsDraw = (board: GameState['board']) => boolean;
type GetWinningLine = (board: GameState['board']) => WinningLine | null;

export function mountGame(
  doc: Document,
  createGame: CreateGame,
  makeMove: MakeMove,
  isDraw: IsDraw,
  getWinningLine: GetWinningLine,
): void {
  let state = createGame();

  const statusEl = doc.querySelector<HTMLElement>('[data-testid="status"]');
  const cells = Array.from(doc.querySelectorAll<HTMLButtonElement>('.cell'));
  const resetBtn = doc.querySelector<HTMLButtonElement>('[data-testid="reset"]');

  function statusText(): string {
    if (state.winner) return `${state.winner} wins!`;
    if (isDraw(state.board)) return "It's a draw";
    return `${state.currentPlayer}'s turn`;
  }

  function render(): void {
    const winningLine = state.winner ? getWinningLine(state.board) : null;
    cells.forEach((cell, i) => {
      const value = state.board[i];
      cell.textContent = value ?? '';
      cell.disabled = value !== null || state.winner !== null;
      cell.classList.toggle('winning', winningLine?.includes(i) ?? false);
    });
    if (statusEl) statusEl.textContent = statusText();
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
}
