// connect 4 using classes and constructors to better organize the code and make it easier to read and manage.

// create class called Game that has a constructor for all the attributes needed for the game to work.
class Game {
    // constructor establishes players and game board dimensions.
    constructor(p1, p2, height = 6, width = 7) {
        // p1 and p2 stashed inside an array assigned to the constructor as this.players
        this.players = [p1, p2];
        // height assigned to constructor as this.height
        this.height = height;
        // width assigned to constructor with width passed in
        this.width = width;
        // current player is assigned as p1 so p1 will always go first when the game starts.
        this.currPlayer = p1;
        // assign functions into the constructor to be used as methods.
        this.makeBoard();
        // make html board to create the board inside html using nested for loops within the javascript code below.
        this.makeHtmlBoard();
        // game over initially set to false by default
        this.gameOver = false;
    }

    // makeBoard function that will create an array of rows where each row is an array of cells made up of height and width
    makeBoard() {
        // create empty array for board
        this.board = [];
        //use a for loop to iterate through y 6 times
        for(let y = 0; y < this.height; y++) {
            //push array from the length of width, which is 7, into the board array 
            this.board.push(Array.from({ length: this.width }));
        }
    }

    // the difference between makeBoard and makeHtmlBoard is creating the DOM for Html Board and an array to store the values for makeBoard
    makeHtmlBoard() {
        // get board id element from html and assign it to board
        const board = document.getElementById('board');
        // set the inner html equal to an empty string so we can add more values to it as the game begins
        board.innerHTML = '';

        // create the top row element to house the head row where the user will click to drop pieces into the board.
        const top = document.createElement('tr');
        // set the top attribute's id to be column-top so we can select it later
        top.setAttribute('id', 'column-top');

        // bind this handleClick to handleGameClick so the browser knows this is referring to
        this.handleGameClick = this.handleClick.bind(this);

        // add an event listener to top that will use handleGameClick method when clicked and it should be where the players click to put their pieces onto the board.
        top.addEventListener("click", this.handleGameClick);

        // use a for loop to setup the table data for head row, this will iterate 7 times, so it will add 7 headcell elements to the top row.
        for(let x = 0; x < this.width; x++) {
            // the head cells are given table data elements to setup the top row of the board
            const headCell = document.createElement('td');
            // attribute for head cell id is set to x
            headCell.setAttribute('id', x);
            // apppend the head cell to top
            top.append(headCell);
        }

        // after the entire top row is created, it is added to the board.
        board.append(top);

        // use a for loop to add the row elements for the board that will iterate 6 times, creating 6 rows
        for(let y = 0; y < this.height; y++) {
            // create the table row elements and set them equal to row.
            const row = document.createElement('tr');

            // use a nested for loop that will iterate width = 7 times to create the table data within the rows, creating a 6 x 7 board with 42 cells.
            for(let x = 0; x < this.width; x++) {
                // set cell equal to table data element
                const cell = document.createElement('td');
                // set each cell attribute id to be their y and x cell coordinate within the board so they can be easily accessible and unique.
                cell.setAttribute('id', `${y}-${x}`);
                // append each cell to the row
                row.append(cell);
            }

            // after each row is created, add it to the board so 6 rows each with 7 cells within them will be appended to the board.
            board.append(row);
        }
    }

    // when head cell is clicked, this method will check bottom to top if there is a piece there, if there isn't it returns the first open spot, if all spots in the column are occupied it returns null.
    findSpotForCol(x) {
        // use for loop to iterate y from 6 - 1 = 5, so it starts from the bottom and increments -1 moving up the board.
        for(let y = this.height - 1; y >= 0; y--) {
            // if the board at coordinates y x are not occupied, return y
            if(!this.board[y][x]) {
                return y;
            }
        }
        // if all y values in x are occupied, return null.
        return null;
    }

    // this method places the current player's piece onto the board/table
    placeInTable(y, x) {
        // create a piece equal to 'div' so that when it is placed it is a div within a table row within a table data cell
        const piece = document.createElement('div');
        // add class list 'piece' to piece so it can be selected and stylized in css.
        piece.classList.add('piece');
        // set background color of piece to be the current player's color
        piece.style.backgroundColor = this.currPlayer.color;
        // set the top style to be -50 * (y + 2) so the piece fits perfectly within the cell.
        piece.style.top = -50 * (y + 2);

        // set spot equal to the y and x coordinate id.
        const spot = document.getElementById(`${y}-${x}`);
        // append the piece to the spot coordinate
        spot.append(piece);
    }

    // this method sends the end game alert and ceases the game from placing anymore pieces
    endGame(msg) {
        // send alert if p1 or p2 wins or if it's a tie.
        alert(msg);
        // set top equal to the top column that has an active event listener
        const top = document.querySelector('#column-top');
        // deactive event listener for the top column so no more pieces can be placed.
        top.removeEventListener("click", this.handleGameClick);
    }

    // method handles clicks on the board
    handleClick(evt) {
        // assign the x value where the user clicked to be x.
        const x = +evt.target.id;

        // assign the y value where the user clicked for x to determine if it will return y or null.
        const y = this.findSpotForCol(x);
        // if null, then just return and nothing happens for the click
        if(y === null) {
            return;
        }

        // assign the current player to the board so the right color is assigned to the piece.
        this.board[y][x] = this.currPlayer;
        // place the piece in the table at y and x coordinates using the placeInTable method.
        this.placeInTable(y, x);

        // checks if all pieces in the board is occupied and there is no winner then it will return the endGame method
        if(this.board.every(row => row.every(cell => cell))) {
            // window will display 'Tie!' message and run endGame method.
            return this.endGame('Tie!');
        }

        // runs checkForWin() method in an if statement, if it returns true and the game is over then it will run:
        if(this.checkForWin()) {
            // change gameOver to be true
            this.gameOver = true;
            // returns the endGame method that displays the current player as the winner in a window alert.
            return this.endGame(`The ${this.currPlayer.color} player won!`);
        }

        // use ternary conditional operator to assign the correct winner. if current player is player 1 then return player 1 otherwise return player 2.
        this.currPlayer = this.currPlayer === this.players[0] ? this.players[1] : this.players[0];
    }

    // method checks the game board to see if win condition is fulfilled, which is having 4 pieces in a row horizontally, vertically, or diagonally.
    // So we approach this by checking 4 directions up/down, left/right, diagonally right, diagonally left.
    checkForWin() {
        // use callback function every to check all arrays passed in if y is greater than or equal to 0, AND if y is less than height, AND if x is greater than or equal to 0, AND if x is less than the width meaning it's within the board, AND if all 4 of the arrays is all equal to the same player, then the every function will return true and _win will return true.
        const _win = cells => cells.every(([y,x]) => y >= 0 && y < this.height && x >= 0 && x < this.width && this.board[y][x] === this.currPlayer);

        // use a nested for loop to go through the entire game board. This function runs the most out of the entire function and does majority of the heavy lifting for the program. Will run 42 times, running if statement 42 times. This runs for every click on the board.
        for(let y = 0; y < this.height; y++) {
            // using y and x as nested for loop variables, we can check all the coordinates within the board to check for win conditions.
            for(let x = 0; x < this.width; x++) {
                // store 4 arrays into horiz, 4 coordinates to be checked, the horizontal factor.
                const horiz = [[y,x], [y,x + 1], [y, x + 2], [y, x + 3]];
                // store 4 arrays into vert to check 4 up and down pieces.
                const vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
                // store 4 diagonal right side up places within board
                const diagDR = [[y, x], [ y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
                // store 4 diagonal left side up places within the board.
                const diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

                // if statement checks using _win function to check each of the 4 arrays within the 4 directions, if anyone of the 4 directions return true then checkForWin returns true in the handleClick function.
                if(_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
                    // checkForWin returns true
                    return true;
                }
            }
        }
    }
}

// create player class to setup custom colors
class Player {
    // use constructor to assign color to the player
    constructor(color) {
        this.color = color;
    }
}

// select start-game button and add an event listener with an arrow function to set the value of the player colors
document.getElementById('start-game').addEventListener('click', () => {
    // assign custom color to player by using Player class to assign color value to p1
    let p1 = new Player(document.getElementById('p1-color').value);
    // assign custom color to p2 using Player class constructor
    let p2 = new Player(document.getElementById('p2-color').value);
    // run Game class using the p1 and p2 color classes that have been input by the user.
    new Game(p1, p2);
});