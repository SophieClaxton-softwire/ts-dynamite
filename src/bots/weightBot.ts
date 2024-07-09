import { Gamestate, BotSelection } from '../models/gamestate';

class Bot {
    private roundsOfDynamite;
    private cheaplyBeats = new Map<BotSelection, BotSelection>([
        ['R', 'P'],
        ['P', 'S'],
        ['S', 'R'],
        ['D', 'W'],
        ['W', 'R']
    ]);

    public constructor() {
        this.roundsOfDynamite = 100;
    }

    makeMove(gamestate: Gamestate): BotSelection {
        if (gamestate.rounds.length === 0) {
            this.roundsOfDynamite--;
            return 'D';
        }

        let choices = gamestate.rounds.map(value => this.cheaplyBeats.get(value.p2));
        if (choices.length < 50) {
            const basicChoices: Array<BotSelection> = ['R', 'P', 'S']
            while (choices.length < 100) {
                choices.push(basicChoices[Math.floor(Math.random() * (basicChoices.length - 1))])
            }
        } else if (choices.length > 100) {
            choices.splice(0, choices.length - 100)
        }
        for (let i = 0; i < this.roundsOfDynamite; i++) {
            choices.push('D');
        }

        const randomChoiceIndex = Math.floor(Math.random() * (choices.length - 1));
        const choice =  choices[randomChoiceIndex];
        if (choice === 'D') {
            this.roundsOfDynamite--;
        }

        return choice;
    }
}

export = new Bot();
