from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)


WINNING_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    [0, 4, 8],
    [2, 4, 6]
]


def get_result(board):

    for line in WINNING_LINES:

        a, b, c = line

        if (
            board[a] != "" and
            board[a] == board[b] and
            board[a] == board[c]
        ):
            return board[a]

    if "" not in board:
        return "draw"

    return None


def minimax(board, ai, human, depth, maximizing):

    result = get_result(board)

    if result == ai:
        return 100 - depth

    if result == human:
        return depth - 100

    if result == "draw":
        return 0


    if maximizing:

        best = -1000

        for i in range(9):

            if board[i] == "":

                board[i] = ai

                score = minimax(
                    board,
                    ai,
                    human,
                    depth + 1,
                    False
                )

                board[i] = ""

                best = max(best, score)

        return best


    else:

        best = 1000

        for i in range(9):

            if board[i] == "":

                board[i] = human

                score = minimax(
                    board,
                    ai,
                    human,
                    depth + 1,
                    True
                )

                board[i] = ""

                best = min(best, score)

        return best


def best_move(board, ai, human):

    order = [
        4,
        0, 2, 6, 8,
        1, 3, 5, 7
    ]

    best_score = -1000
    move = -1


    for i in order:

        if board[i] != "":
            continue


        board[i] = ai


        score = minimax(
            board,
            ai,
            human,
            0,
            False
        )


        board[i] = ""


        if score > best_score:

            best_score = score
            move = i


    return move


@app.route("/")
def home():

    return "XO AI is running."


@app.route("/ai", methods=["POST"])
def ai():

    data = request.get_json()

    board = data.get("board")

    ai_symbol = data.get("ai", "O")

    human_symbol = data.get("player", "X")


    if not isinstance(board, list):
        return jsonify({
            "error": "Invalid board"
        }), 400


    if len(board) != 9:
        return jsonify({
            "error": "Board must contain 9 cells"
        }), 400


    move = best_move(
        board,
        ai_symbol,
        human_symbol
    )


    return jsonify({
        "move": move
    })


if __name__ == "__main__":

    print("")
    print("==============================")
    print("        XO AI SERVER")
    print("==============================")
    print("Running on http://127.0.0.1:5000")
    print("")


    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False
    )