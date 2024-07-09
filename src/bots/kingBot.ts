import { Gamestate, BotSelection } from "../models/gamestate";

class Bot {
    private cheaplyBeats = new Map<BotSelection, BotSelection>([
        ['R', 'P'],
        ['P', 'S'],
        ['S', 'R'],
        ['D', 'W'],
        ['W', 'R']
    ]);
    private roundsOfDynamite;
    private oppsRoundsOfDynamite;

    public constructor() {
        this.roundsOfDynamite = 100;
        this.oppsRoundsOfDynamite = 100;
    }

    makeMove(gamestate: Gamestate): BotSelection {
        const p2rounds = gamestate.rounds.map(value => value.p2);

        if (p2rounds.length === 0) {
            return 'D';
        }

        
        if (p2rounds.every(value => value === p2rounds[0])) {
            return this.cheaplyBeats.get(p2rounds[0]);
        }
        
        if (gamestate.rounds.length > 10) {
            let last10p1choices = gamestate.rounds.splice(0, gamestate.rounds.length - 11).splice(-1, 1).map(value => value.p1)
            let last10p2choices = gamestate.rounds.splice(0, gamestate.rounds.length - 10).map(value => value.p2)
            
            if (last10p1choices.every((value, index) => {
                value === last10p2choices[index]
            })) {
                return this.cheaplyBeats.get(gamestate.rounds[gamestate.rounds.length - 1].p1);
            }
        }

        if (p2rounds[p2rounds.length - 1] === 'D') {
            this.oppsRoundsOfDynamite--;
        }

        const choices: Array<BotSelection> = ['R', 'P', 'S']
        if (this.oppsRoundsOfDynamite) {
            choices.push('W')
        }
        if (this.roundsOfDynamite) {
            choices.push('D')
        }

        let randomChoice = choices[Math.floor(Math.random() * (choices.length - 1))]
        if (randomChoice === 'D') {
            this.roundsOfDynamite--;
        }
        return randomChoice;
    }
}

export = new Bot();
