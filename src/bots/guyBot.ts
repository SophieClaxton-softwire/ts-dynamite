import { Gamestate, BotSelection } from '../models/gamestate';

class Bot {
    public norm = ["R", "P", "S"];
    public dyn = ["D", "W"];
    public dynUsed = 0;
    public opponentDynUsed = 0;

    public normProbabilities = ["R", "P", "S"];
    public dynProbabilities = ["D", "D", "D", "D", "D"];
    public counter = {"R": "P", "P": "S", "S": "R", "D":"W"}
    public firstRound = true;


    makeMove(gamestate: Gamestate): BotSelection {
        const randomNorm = Math.floor(Math.random() * this.normProbabilities.length)
        const randomDyn = Math.floor(Math.random() * this.dynProbabilities.length)

        const normOrDyn = Math.round(Math.random());
        const res = normOrDyn ? this.normProbabilities[randomNorm] : this.dynProbabilities[randomDyn];
        let resBot: BotSelection = res as BotSelection;

        if (this.dynUsed > 99) {
            resBot = this.normProbabilities[randomNorm] as BotSelection;
        }

        if (!this.firstRound) {
            const opponentLastMove = gamestate.rounds[gamestate.rounds.length - 1].p2;
            if (opponentLastMove == "D") {
                this.opponentDynUsed++;
            }

            let addToProb = undefined
            if (opponentLastMove != "W") {
                addToProb = this.counter[opponentLastMove];
            }
            else {
                addToProb = randomNorm;
            }
            
            if (this.norm.includes(addToProb)) {
                this.normProbabilities.push(addToProb);
                this.normProbabilities.push(addToProb);
            } else {
                this.dynProbabilities.push(addToProb);
                this.dynProbabilities.push(addToProb);
            }
        }

        if (this.dynUsed > 99) {
            this.dynProbabilities = ["W"];
        }

        if (resBot == "D") {
            this.dynUsed++;
        }

        if (this.opponentDynUsed >= 100 && resBot == "W") {
            resBot = this.normProbabilities[randomNorm] as BotSelection;
        }

        if (gamestate.rounds.length > 1700 && this.dynUsed < 100) {
            resBot = "D";
        }
        
        return resBot;
    }
}

export = new Bot();