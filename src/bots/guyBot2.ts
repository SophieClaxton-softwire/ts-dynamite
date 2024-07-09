import { Gamestate, BotSelection } from '../models/gamestate';

class Bot {
    public norm = ["R", "P", "S"];
    public dyn = ["D", "W"];
    public dynUsed = 0;
    public seen = {"R": 0, "P": 0, "S": 0, "D": 0, "W": 0}
    public normProbabilities = ["R", "P", "S"];
    public dynProbabilities = ["D", "D", "D", "D", "D", "D", "D"];
    public counter = {"R": "P", "P": "S", "S": "R", "D":"W"}
    public round = 0;
    public opponentDynUsed = 0;


    makeMove(gamestate: Gamestate): BotSelection {
        const randomNorm = Math.floor(Math.random() * this.normProbabilities.length)
        const randomDyn = Math.floor(Math.random() * this.dynProbabilities.length)

        const normOrDyn = Math.round(Math.random());
        const res = normOrDyn ? this.normProbabilities[randomNorm] : this.dynProbabilities[randomDyn];
        let resBot: BotSelection = res as BotSelection;

        if (this.dynUsed > 99) {
            resBot = this.normProbabilities[randomNorm] as BotSelection;
        }

        if (this.round > 0) {
            const opponentLastMove = gamestate.rounds[gamestate.rounds.length - 1].p2;

            let addToProb = undefined
            if (opponentLastMove != "W") {
                addToProb = this.counter[opponentLastMove];
            }
            else {
                addToProb = randomNorm;
            }
            
            if (this.norm.includes(addToProb)) {
                this.normProbabilities.push(addToProb);
            } 
            else {
                this.dynProbabilities.push(addToProb);
            }
            this.seen[addToProb]++
        }

        if (this.round % 100 == 0 && this.round > 0) {
            let maxNum = 0
            let maxElement = "R"
            for (let index = 0; index < 3; index++) {
                const element = this.norm[index];
                if (this.seen[element] > maxNum) {
                    maxElement = element;
                }
            }

            for (let index = 0; index < 30; index++) {
                this.normProbabilities.push(this.counter[maxElement]);
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
        
        return resBot;
    }
}

export = new Bot();