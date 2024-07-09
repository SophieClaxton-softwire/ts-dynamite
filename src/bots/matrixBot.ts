import { Gamestate, BotSelection } from '../models/gamestate';

class Bot {
    private roundsOfDynamite;
    private resonses;
    private cheaplyBeats = new Map<BotSelection, BotSelection>([
        ['R', 'P'],
        ['P', 'S'],
        ['S', 'R'],
        ['D', 'W'],
        ['W', 'R']
    ]);
    private normalMoves: Array<BotSelection> = ['R', 'P', 'S'];

    public constructor() {
        this.roundsOfDynamite = 100;
        this.resonses = {
            'R': {'R': 0, 'P': 0, 'S': 0, 'W': 0, 'D': 0},
            'P': {'R': 0, 'P': 0, 'S': 0, 'W': 0, 'D': 0},
            'S': {'R': 0, 'P': 0, 'S': 0, 'W': 0, 'D': 0},
            'D': {'R': 0, 'P': 0, 'S': 0, 'W': 0, 'D': 0},
            'W': {'R': 0, 'P': 0, 'S': 0, 'W': 0, 'D': 0},
        };
    }

    makeMove(gamestate: Gamestate): BotSelection {
        if (gamestate.rounds.length < 2) {
            this.roundsOfDynamite--;
            return 'D';
        }

        if (gamestate.rounds.length > 1) {
            const lastP2Response = gamestate.rounds[gamestate.rounds.length - 1].p2;
            const p1Play = gamestate.rounds[gamestate.rounds.length - 2].p1;
            this.resonses[p1Play][lastP2Response] = ++this.resonses[p1Play][lastP2Response];
        }

        let predictedResponseWeights = this.resonses[gamestate.rounds[gamestate.rounds.length - 1].p1];
        let predictedResponses = []

        for (let move of this.normalMoves) {
            for (let i = 0; i < predictedResponseWeights[move]; i++) {
                predictedResponses.push(move);
            }
        }

        let suggestedMoves = predictedResponses.map(value => this.cheaplyBeats.get(value));
        while (suggestedMoves.length < 100) {
            suggestedMoves.push(this.normalMoves[Math.floor(Math.random() * (this.normalMoves.length - 1))])
        }
    
        for (let i = 0; i < this.roundsOfDynamite * 1.5; i++) {
            suggestedMoves.push('D');
        }

        const randomChoiceIndex = Math.floor(Math.random() * (suggestedMoves.length - 1));
        const choice =  suggestedMoves[randomChoiceIndex];
        if (choice === 'D') {
            this.roundsOfDynamite--;
        }

        // console.log(suggestedMoves);
        return choice;
    }
}

export = new Bot();