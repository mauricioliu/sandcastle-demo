import { createGame, makeMove, isDraw, type GameState } from './game';
import { mountGame } from './ui';

mountGame(document, createGame, (state: GameState, index: number) => makeMove(state, index), isDraw);
