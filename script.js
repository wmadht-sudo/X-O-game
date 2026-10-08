const cells = document.querySelectorAll(".cell");

const statusElement = document.getElementById("status");
const thinkingElement = document.getElementById("thinking");

const playerScoreElement = document.getElementById("playerScore");
const aiScoreElement = document.getElementById("aiScore");
const drawScoreElement = document.getElementById("drawScore");

const newGameButton = document.getElementById("newGame");

const resultElement = document.getElementById("result");
const resultSymbol = document.getElementById("resultSymbol");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const againButton = document.getElementById("again");


const HUMAN = "X";
const AI = "O";


let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];


let gameOver = false;
let aiThinking = false;


let playerScore = 0;
let aiScore = 0;
let drawScore = 0;


const winningLines = [

    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]

];


cells.forEach((cell) => {

    cell.addEventListener("pointerdown", (event) => {

        event.preventDefault();

        const index = Number(cell.dataset.index);

        playerMove(index);

    });

});


function playerMove(index) {

    if (gameOver) return;

    if (aiThinking) return;

    if (board[index] !== "") return;


    board[index] = HUMAN;

    render();


    const result = getGameResult(board);

    if (result !== null) {

        finishGame(result);

        return;

    }


    aiTurn();

}


function aiTurn() {

    aiThinking = true;

    thinkingElement.classList.add("show");

    statusElement.textContent = "AI يحلل أفضل نقلة...";


    /*
        تأخير صغير فقط حتى يظهر أن الـAI يفكر.
        العقل نفسه Minimax وليس اختياراً عشوائياً.
    */

    setTimeout(() => {

        const move = findBestMove(board);


        if (move !== -1) {

            board[move] = AI;

        }


        aiThinking = false;

        thinkingElement.classList.remove("show");


        render();


        const result = getGameResult(board);

        if (result !== null) {

            finishGame(result);

            return;

        }


        statusElement.textContent = "دورك — أنت X";

    }, 350);

}


function findBestMove(position) {

    let bestScore = -Infinity;

    let bestMove = -1;


    /*
        ترتيب النقلات يجعل الـAI يفضل:
        1 - الفوز
        2 - منع اللاعب
        3 - المركز
        4 - الزوايا
    */

    const moveOrder = [
        4,
        0, 2, 6, 8,
        1, 3, 5, 7
    ];


    for (const index of moveOrder) {

        if (position[index] !== "") continue;


        position[index] = AI;


        const score = minimax(
            position,
            0,
            false
        );


        position[index] = "";


        if (score > bestScore) {

            bestScore = score;

            bestMove = index;

        }

    }


    return bestMove;

}


function minimax(position, depth, maximizing) {

    const result = getGameResult(position);


    if (result !== null) {

        if (result.winner === AI) {

            return 100 - depth;

        }


        if (result.winner === HUMAN) {

            return depth - 100;

        }


        return 0;

    }


    if (maximizing) {

        let bestScore = -Infinity;


        for (let i = 0; i < 9; i++) {

            if (position[i] !== "") continue;


            position[i] = AI;


            const score = minimax(
                position,
                depth + 1,
                false
            );


            position[i] = "";


            bestScore = Math.max(
                bestScore,
                score
            );

        }


        return bestScore;

    }


    else {

        let bestScore = Infinity;


        for (let i = 0; i < 9; i++) {

            if (position[i] !== "") continue;


            position[i] = HUMAN;


            const score = minimax(
                position,
                depth + 1,
                true
            );


            position[i] = "";


            bestScore = Math.min(
                bestScore,
                score
            );

        }


        return bestScore;

    }

}


function getGameResult(position) {

    for (const line of winningLines) {

        const a = line[0];
        const b = line[1];
        const c = line[2];


        if (
            position[a] !== "" &&
            position[a] === position[b] &&
            position[b] === position[c]
        ) {

            return {
                winner: position[a],
                line: line
            };

        }

    }


    if (!position.includes("")) {

        return {
            winner: "draw",
            line: []
        };

    }


    return null;

}


function render() {

    cells.forEach((cell, index) => {

        const value = board[index];


        cell.textContent = value;


        cell.classList.remove(
            "x",
            "o",
            "filled"
        );


        if (value === "X") {

            cell.classList.add(
                "x",
                "filled"
            );

        }


        if (value === "O") {

            cell.classList.add(
                "o",
                "filled"
            );

        }

    });

}


function finishGame(result) {

    gameOver = true;


    if (result.line) {

        result.line.forEach((index) => {

            cells[index].classList.add(
                "winner"
            );

        });

    }


    if (result.winner === HUMAN) {

        playerScore++;

        playerScoreElement.textContent =
            playerScore;


        resultSymbol.textContent = "X";

        resultSymbol.style.color =
            "#39dfff";

        resultTitle.textContent =
            "أنت فزت!";

        resultText.textContent =
            "لحظة تاريخية... لقد هزمت الـAI.";

    }


    else if (result.winner === AI) {

        aiScore++;

        aiScoreElement.textContent =
            aiScore;


        resultSymbol.textContent = "O";

        resultSymbol.style.color =
            "#ff5c83";

        resultTitle.textContent =
            "AI يفوز";

        resultText.textContent =
            "الذكاء الاصطناعي وجد أفضل سلسلة نقلات.";

    }


    else {

        drawScore++;

        drawScoreElement.textContent =
            drawScore;


        resultSymbol.textContent = "=";

        resultSymbol.style.color =
            "#ffffff";

        resultTitle.textContent =
            "تعادل";

        resultText.textContent =
            "لم يستطع أي لاعب كسر دفاع الآخر.";

    }


    setTimeout(() => {

        resultElement.classList.remove(
            "hidden"
        );

    }, 450);

}


function resetBoard() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];


    gameOver = false;

    aiThinking = false;


    thinkingElement.classList.remove(
        "show"
    );


    statusElement.textContent =
        "دورك — أنت X";


    cells.forEach((cell) => {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "filled",
            "winner"
        );

    });

}


newGameButton.addEventListener(
    "click",
    resetBoard
);


againButton.addEventListener(
    "click",
    () => {

        resultElement.classList.add(
            "hidden"
        );

        resetBoard();

    }
);


render();