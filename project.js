// 1. deposit some money
// 2. determine number of lines to bet on
// 3. collect a bet amount
// 4. spin the slot machine
// 5. check if the user won
// 6. give the user their winnings 
// 7. play again

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLUMNS = 3;

const SYMBOL_COUNT = {
    "A": 2,
    "B": 4,
    "C": 6,
    "D": 8
};

// SYMBOLS_COUNT["A"] -> 2

const SYMBOL_VALUES = {
    "A": 5, //multiplier of each symbol
    "B": 4,
    "C": 3,
    "D": 2
};





const deposit = () => {
    while (true) {
        const depositAmt = prompt("Enter a deposit amount: ");
        const numDepositAmt = parseFloat(depositAmt);

        if(isNaN(numDepositAmt) || numDepositAmt <= 0) {
            console.log("Invalid deposit amount. Try again.");
        } else {
            return numDepositAmt;
        }
    }
};

const getNumberOfLines = () => {
    while (true) {
        const lines = prompt("Enter a number of lines to bet on (1-3): ");
        const numOfLines = parseFloat(lines);

        if(isNaN(numOfLines) || numOfLines <= 0 || numOfLines > 3) {
            console.log("Invalid number of lines. Try again.");
        } else {
            return numOfLines;
        }
    }
};

const getBet = (balance, numberOfLines) => {
    while (true) {
        const bet = prompt("Enter the bet per line: ");
        const numBet = parseFloat(bet);

        if(isNaN(numBet) || numBet <= 0 || numBet > balance / numberOfLines) {
            console.log("Invalid bet. Try again.");
        } else {
            return numBet;
        }
    }
};

const spin = () => {
    const symbols = []; //array is a reference data type; can change what's inside it without changing the value itself
    for (const [symbol, count] of Object.entries(SYMBOL_COUNT)) {
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }

    const reels = [];
    for (let i = 0; i < COLUMNS; i++) {
        reels.push([]);
        const reel_symbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randIndex = Math.floor(Math.random() * reel_symbols.length);
            const selectedSymbol = reel_symbols[randIndex];
            reels[i].push(selectedSymbol);
            reel_symbols.splice(randIndex, 1);
        }
    }

    return reels;

};

const transpose = (reels) => {
    const rows = [];
    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLUMNS; j++) {
            rows[i].push(reels[j][i]);
        }
    }

    return rows;
};

const printRows = (rows) => {
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += symbol;
            if (i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
    
};

const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if(allSame) {
            winnings += (bet * SYMBOL_VALUES[symbols[0]]);
        }
    }

    return winnings;
}

const game = () => {
    let balance = deposit();

    while (true) {
        console.log("You have a balance of, $" + balance);
        const numberOfLines = getNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        balance += winnings;

        console.log("You won, $", + winnings.toString());

        if (balance <= 0) {
            console.log("You ran out of money!");
            break;
        }

        const playAgain = prompt("Do you want to play again? (y/n) ");

        if (playAgain != "y") break;
    }
    
}

game();

