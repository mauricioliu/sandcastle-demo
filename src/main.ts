import { createGame, makeMove, isDraw, getWinningLine } from './game';
import { mountGame } from './ui';

mountGame(document, createGame, makeMove, isDraw, getWinningLine);
