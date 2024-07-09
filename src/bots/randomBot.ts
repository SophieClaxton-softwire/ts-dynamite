import { Gamestate, BotSelection } from '../models/gamestate';

class Bot {
    makeMove(gamestate: Gamestate): BotSelection {
        const choices: Array<BotSelection> = ['R', 'P', 'S', 'W', 'D'];
        const randomChoiceIndex = Math.floor(Math.random() * (choices.length - 1));
        return choices[randomChoiceIndex];
    }
}

export = new Bot();
