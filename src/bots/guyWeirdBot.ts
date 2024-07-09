import { Gamestate, BotSelection } from '../models/gamestate';

class Bot {
    public move = "R" as BotSelection;
    public norm = ["R", "P", "S"]
    public counter = {"R": "P", "P": "S", "S": "R", "D": "W"}
    public dynamites = []
    public round = 0 

    makeMove(gamestate: Gamestate): BotSelection {
        while (this.dynamites.length < 100) {
            const randRound = Math.floor(Math.random() * 1500)
            if (!this.dynamites.includes(randRound)) {
                this.dynamites.push(randRound);
            }
        }

        const curMove = this.move;
        let nextMove = "R" as BotSelection;

        if (this.dynamites.includes(this.round)){
            nextMove = "D"
        }
        else if (curMove == "W") {
            nextMove = this.norm[Math.floor(Math.random() * 3)] as BotSelection;
        } else {
            nextMove = this.counter[curMove] as BotSelection;
        } 

        this.round++;
        this.move = nextMove;
        return curMove;
    }
}

export = new Bot();