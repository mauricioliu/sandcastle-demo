import { createGame, makeMove, isDraw } from './game';
import { mountGame } from './ui';

mountGame(document, createGame, makeMove, isDraw);
