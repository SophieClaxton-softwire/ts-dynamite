import { count } from 'console';
import { Gamestate, BotSelection } from '../models/gamestate';

var jsregression = require('js-regression');

enum RoundResult {
    P2_ROCK = 0,
    P2_PAPER = 1,
    P2_SCISSORS = 2,
    P2_DYNAMITE = 3,
    P2_WATER = 4,
    P1_ROCK = 5,
    P1_PAPER = 6,
    P1_SCISSORS = 7,
    P1_DYNAMITE = 8,
    P1_WATER = 9
}

class Bot {
    botStorage = [];
    ourRemainingDynamites: number;
    theirUsedDynamites: number;
    classifier;

    constructor() {
        this.ourRemainingDynamites = 100;
        this.theirUsedDynamites = 0;
    }

    private basicPredict(gamestate: Gamestate): Array<number>{
        let counter: Array<number> = [0,0,0,0,0];
        let runTime = gamestate.rounds.length;
        for (let i = Math.max(0, runTime - 20) ; i < runTime; i++) {
            switch (gamestate.rounds[i].p2) {
                case('R'):
                    counter[RoundResult.P2_ROCK] += 1;
                    break;
                case('P'):
                    counter[RoundResult.P2_PAPER] += 1;
                    break;
                case('S'):
                    counter[RoundResult.P2_SCISSORS] += 1;
                    break;
                case('D'):
                    counter[RoundResult.P2_DYNAMITE] += 1;
                    break;
                case('W'):
                    counter[RoundResult.P2_WATER] += 1;
                    break;
            }
        }
        if (runTime > 0) {
            for (let i = 0; i < 5; i++) {
                counter[i] = counter[i]/runTime;
            }
        }
        return counter;
    }

    private shouldThrowDynamite(gamestate: Gamestate) {
        return (this.ourRemainingDynamites > Math.max(((1001 - gamestate.rounds.length)/10), 0));
    }

    private basicPredictionToMove(gamestate: Gamestate) {
        let probabilities = this.basicPredict(gamestate);
        let prediction : BotSelection;
        probabilities[RoundResult.P2_DYNAMITE] = probabilities[RoundResult.P2_DYNAMITE]*(100 - this.theirUsedDynamites)/100;
        let tempStore = -1;

        let keepSearching = 0;
        // repeat a max of 2 times
        while (keepSearching < 2) {
            switch (probabilities.indexOf(Math.max(...probabilities))) {
                case (RoundResult.P2_ROCK):
                    prediction = 'P';
                    keepSearching += 2;
                    break;
                case (RoundResult.P2_PAPER):
                    prediction = 'S';
                    keepSearching += 2;
                    break;
                case (RoundResult.P2_SCISSORS):
                    keepSearching += 2;
                    prediction = 'R';
                    break;
                case (RoundResult.P2_DYNAMITE):
                    keepSearching += 2;
                    prediction = 'W';
                    break;
                default:
                    tempStore = probabilities[RoundResult.P2_WATER]
                    probabilities[RoundResult.P2_WATER] = -1;
                    prediction = 'R';
                    keepSearching += 1;
                    break;
            }
        }
        if (
            Math.max(probabilities[RoundResult.P2_WATER], tempStore) < 
            probabilities[RoundResult.P2_ROCK] + probabilities[RoundResult.P2_PAPER] + probabilities[RoundResult.P2_SCISSORS]
        ) {
            prediction = this.shouldThrowDynamite(gamestate) ? 'D' : prediction;
        }
        return prediction;
    }

    private convert20Rounds(gamestate: Gamestate, entrypoint: number) {
        let counter: Array<number> = [0,0,0,0,0,0,0,0,0,0];
        for (let i = entrypoint - 20; i < entrypoint; i++) {
            switch (gamestate.rounds[i].p2) {
                case('R'):
                    counter[RoundResult.P2_ROCK] += 1;
                    break;
                case('P'):
                    counter[RoundResult.P2_PAPER] += 1;
                    break;
                case('S'):
                    counter[RoundResult.P2_SCISSORS] += 1;
                    break;
                case('D'):
                    counter[RoundResult.P2_DYNAMITE] += 1;
                    break;
                case('W'):
                    counter[RoundResult.P2_WATER] += 1;
                    break;
            }
            switch (gamestate.rounds[i].p1) {
                case('R'):
                    counter[RoundResult.P1_ROCK] += 1;
                    break;
                case('P'):
                    counter[RoundResult.P1_PAPER] += 1;
                    break;
                case('S'):
                    counter[RoundResult.P1_SCISSORS] += 1;
                    break;
                case('D'):
                    counter[RoundResult.P1_DYNAMITE] += 1;
                    break;
                case('W'):
                    counter[RoundResult.P1_WATER] += 1;
                    break;
            }
        }
        return counter;
    }

    private logPrevious20Rounds(gamestate: Gamestate) {
        let runTime = gamestate.rounds.length;
        if (runTime < 21) {
            return;
        }
        let counter: Array<number> = this.convert20Rounds(gamestate, runTime - 1);
        let actualResult: number = 0;
        switch (gamestate.rounds[runTime - 1].p2) {
            case('R'):
                actualResult = RoundResult.P2_ROCK;
                break;
            case('P'):
                actualResult = RoundResult.P2_PAPER;
                break;
            case('S'):
                actualResult = RoundResult.P2_SCISSORS;
                break;
            case('D'):
                actualResult = RoundResult.P2_DYNAMITE;
                break;
            case('W'):
                actualResult = RoundResult.P2_WATER;
                break;
        }
        this.botStorage.push([...counter, actualResult]);
    }
    
    makeMove(gamestate: Gamestate): BotSelection {
        let runTime = gamestate.rounds.length;
        if (runTime < 1)
        {
            return 'W';
        }
        if (gamestate.rounds[runTime - 1].p2 === 'D') {
            this.theirUsedDynamites += 1;
        }

        this.logPrevious20Rounds(gamestate);

        if (runTime < 30) {
            let basicPrediction = this.basicPredictionToMove(gamestate);
            if (basicPrediction === 'D'){
            this.ourRemainingDynamites -= 1;
            }
            return basicPrediction;
        }
        // make sure to include checking if dynamite is used up or not - if water balloon prediction is low value and have dynamite left use that
        // otherwise if dynamite prediction is high, use water baloon
        // otherwise if dynamite prediction is low and water baloon prediction is reasonably low then use rock/p/sci
        
        
        if (runTime === 30 || runTime === 50 || runTime === 100 || runTime === 200 || runTime === 500)
        {
            this.classifier = new jsregression.MultiClassLogistic({
                alpha: 0.1,
                iterations: 20,
                lambda: 0.0
            })
            this.classifier.fit(this.botStorage);
        }
        // need this to be of form [x1 x2 x3 x4 x5..., y] in each row
        var classifierPrediction = this.classifier.transform(this.convert20Rounds(gamestate, runTime));
        // keep counter of how many dynamites they use?
        let predictionChoice: BotSelection = 'R';
        switch (classifierPrediction) {
            case(RoundResult.P2_ROCK):
            predictionChoice = this.shouldThrowDynamite(gamestate) ? 'D' : 'P';
            break;
            case(RoundResult.P2_PAPER):
            predictionChoice = this.shouldThrowDynamite(gamestate) ? 'D' : 'S';
            break;
            case(RoundResult.P2_SCISSORS):
            predictionChoice = this.shouldThrowDynamite(gamestate) ? 'D' : 'R';
            break;
            case(RoundResult.P2_DYNAMITE):
            predictionChoice = (this.theirUsedDynamites < 40) ? 'W': (this.basicPredictionToMove(gamestate));
            break;
            case(RoundResult.P2_WATER):
            // if classifier predicts water balloon, use a basic prediction to guess next best likely outcome and predict against it
            predictionChoice = this.basicPredictionToMove(gamestate);
            break;
        }
        if (predictionChoice === 'D'){
            this.ourRemainingDynamites -= 1;
        }
        return predictionChoice;
    }
}

export = new Bot();