import { Gamestate, BotSelection } from '../models/gamestate';

class Bot {
    public dynUsed = 0;
    public opponentDynUsed = 0;
    public round = 1;
    public counter = {"R": "P", "P": "S", "S": "R", "D": "W"}
    public probabilities = ["R", "R", "R", "S", "S", "S", "P", "P", "P", "D", "D", "D"]

    makeMove(gamestate: Gamestate): BotSelection {
        let res = this.probabilities[Math.floor(Math.random() * this.probabilities.length)] as BotSelection;   // choose move

        if (this.round > 1) {
            const opponentLastMove = gamestate.rounds[gamestate.rounds.length - 1].p2;                         // look at opponent last move
            if (opponentLastMove == "D") {
                this.opponentDynUsed++;
                if (this.opponentDynUsed >= 100) {
                    this.probabilities = this.probabilities.filter(item => item != "W");
                }
            }
            if (opponentLastMove == "W") {
                this.probabilities.concat(["R", "P", "S"])
            } else {
                this.probabilities.push(this.counter[opponentLastMove]);
            }
        }

        if (res == "D") {                                                                                      // used up all dynamite
            this.dynUsed++;
            if (this.dynUsed >= 100) {
                this.probabilities = this.probabilities.filter(item => item != "D");
            }
        }

        if (this.round % 20 == 0 && this.dynUsed < 100) {
            let temp = [];
            for (let i = 0; i < this.round/5; i++) {
                temp.push("D");
            }
            this.probabilities.concat(temp);
        }

        this.round++;
        return res;
    }
}

export = new Bot();