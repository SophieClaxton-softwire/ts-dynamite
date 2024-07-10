import { Gamestate, BotSelection } from '../models/gamestate';

class Bot {
    public round = 1;
    public dynUsed = 0; 
    public normal: Array<BotSelection> = ["R", "P", "S"];
    public counter = {"R": "P", "P": "S", "S": "R"};
    public nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];


    public rock = ["3", "6", "8"];
    public paper = ["1", "5", "9"];
    public scissors = ["2", "4", "7"]
    public dynamite = "0";

    makeMove(gamestate: Gamestate): BotSelection {
        let res = undefined as BotSelection;
        let stringRound = this.round.toString()[-1];

        if (this.rock.includes(stringRound)) {
            res = "R";
        } else if (this.paper.includes(stringRound)) {
            res = "P";
        } else if (this.scissors.includes(stringRound)) {
            res = "S";
        } else {
            if (this.dynUsed < 100) {
                res = "D";
                this.dynUsed++;
            } else {
                res = this.normal[Math.floor(Math.random() * 3)];
            }
        }

        if (stringRound == "0") {
            this.rock = [];
            this.paper = [];
            this.scissors = [];

            this.nums = shuffleArray(this.nums);

            this.rock.push(this.nums[0]);
            this.rock.push(this.nums[1]);
            this.rock.push(this.nums[2]);
            this.paper.push(this.nums[3]);
            this.paper.push(this.nums[4]);
            this.paper.push(this.nums[5]);
            this.scissors.push(this.nums[6]);
            this.scissors.push(this.nums[7]);
            this.scissors.push(this.nums[8]);
            this.dynamite = this.nums[9];
        }

        this.round++
        return res;
    }

}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) { 
   
        // Generate random number 
        var j = Math.floor(Math.random() * (i + 1));
                   
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
       
    return array;
 }

export = new Bot();