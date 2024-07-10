import { Gamestate, BotSelection } from '../models/gamestate';

class Bot {

    makeMove(gamestate: Gamestate): BotSelection {
        return 'S';
    }
}

export = new Bot();
