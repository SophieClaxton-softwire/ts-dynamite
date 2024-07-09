import { Gamestate, BotSelection } from "../models/gamestate";

class Bot {
    private maxDynamites = 100;
    private window = 5;
    private responseDelay = 0;
    private selectionDict = {
        0: 'R',
        1: 'P',
        2: 'S',
        3: 'W',
        4: 'D'
    };

    private winningSelectionDict = {
        'R': 'P',
        'P': 'S',
        'S': 'R',
        'D': 'W',
        'W': 'R'
    };



    public makeMove(gamestate: Gamestate): BotSelection {
        if (gamestate.rounds.length === 0) {
            return 'D';
        }

        const [p1DynamiteCount, p2DynamiteCount] = this.countDynamitesUsed(gamestate);
        const opponentPreviousChoice = gamestate.rounds[gamestate.rounds.length - 1].p2;

        if (opponentPreviousChoice === 'D' && p2DynamiteCount < this.maxDynamites) {
            return 'W';
        } else if (!(opponentPreviousChoice === 'W') && p1DynamiteCount < this.maxDynamites) {
            return 'D';
        }

        const opponentsChoicesCount = this.computeRunningCount(gamestate);

        const maxIndex = opponentsChoicesCount.indexOf(Math.max(...opponentsChoicesCount));
        
        const choice = this.winningSelectionDict[this.selectionDict[maxIndex]];
        if (choice === 'D' || choice === ' W') {
            return this.randomChoice();
        }

        return choice;
    }

    private countDynamitesUsed(gamestate: Gamestate): number[] {
        let [p1DynamiteCount, p2DynamiteCount] = [0, 0];
        for (const round of gamestate.rounds) {
            if (round.p1 === 'D') {
                p1DynamiteCount++;
            }
            if (round.p2 == 'D') {
                p2DynamiteCount++;
            }
        }
        return [p1DynamiteCount, p2DynamiteCount];
    }

    private computeRunningCount(gamestate: Gamestate): number[] {
        let [rockCount, paperCount, scissorCount, waterCount, dynamiteCount] = [0, 0, 0, 0, 0];
        const [iterStart, iterEnd] = [
            Math.max(0, gamestate.rounds.length - this.window), 
            Math.max(0, gamestate.rounds.length - this.responseDelay)
        ];
        const selection = gamestate.rounds[gamestate.rounds.length - 1].p1;

        for (let i = iterStart; i < iterEnd - 1; i++) {
            if (gamestate.rounds[i].p1 === selection) {
                if (gamestate.rounds[i + 1].p2 === 'R') {
                    rockCount++;
                }
                if (gamestate.rounds[i + 1].p2 === 'P') {
                    paperCount++;
                }
                if (gamestate.rounds[i + 1].p2 === 'S') {
                    scissorCount++;
                }
                if (gamestate.rounds[i + 1].p2 === 'W') {
                    waterCount++;
                }
                if (gamestate.rounds[i + 1].p2 === 'D') {
                    dynamiteCount++;
                }
            }
        }
        return [rockCount, paperCount, scissorCount, waterCount, dynamiteCount];
    }

    private randomChoice(): BotSelection {
        return this.selectionDict[Math.floor(Math.random() * 3)];
    }
}

export = new Bot();