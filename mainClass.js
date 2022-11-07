class ConnectFour {
  constructor(userData = {}) {
    
    // Notes
    console.log("ConnectFour need jquery-3.6.0 and bootstrap v5.2 to work");
    console.log("{ elem: 'body', x: 6, y: 7 }");

    if(typeof userData != 'object') userData = {} //Only object is allowed
    this.config = { elem: 'body', x: 6, y: 7, ...userData } //Initial Config overwritten by user given data

    this.x = this.config.x; //Number of row
    this.y = this.config.y; //Number of cols
    this.connect2D = this.createBlankArray2D(this.x, this.y); //2D Array for the game

    this.gameStatus = true; //Cannot make a move if false
    this.currentPlayer = 1; // two players 1 and 2

    this.gameLog = [] //Hisotry for undo function
    this.gameRoot = $(this.config.elem).length ? $(this.config.elem) : $("body"); //Root div
  }

  // Initializtion of the game
  init() {

    // Appending the initial div with undo, reset and the canvas to add box
    let initHTML = `
    <div id="game-div" class="d-flex justify-content-center align-items-center">
      <button id="turn-btn" class="shadow-lg fs-1 fw-bold green"> 1 </button>
      <button id="reset-btn" class="shadow-lg fs-1 fw-bold"> <i class="fa-solid fa-arrows-rotate"></i> </button>
      <div id="game-canvas" class="shadow-lg"> </div>
    </div>`;

    this.gameRoot.prepend(initHTML);

    // Creating boxes one row at a time
    this.connect2D.map((cols, rowID) => this.createBox(cols, rowID));

    //make all elements interactives
    this.setControls(); 
  }

  // Function to create 2D array with given rows & cols. All values will be zero
  createBlankArray2D(row, col) {
    let newArray = [];

    // creating 2D Array
    for (let i = 0; i < row; i++) {
      newArray[i] = [];
      for (let j = 0; j < col; j++) newArray[i].push(0);
    }
    return newArray;
  }

  // Stack row of boxes with data-col attribute and id {box-row-col} format
  createBox(cols, rowID) {
    $("#game-canvas").prepend(`
        <div class="row justify-content-center">
          ${cols.map( (e, colID) =>
                `<div class="box" data-col="${colID}" id="box-${rowID}-${colID}"></div>`
            ).join('')}
        </div>
      `);
  }

  // Making the game interactive and adding hotkeys
  setControls() {

    // Handle when user clicks on a box
    $(".box").click( e => {
      let boxEl = $(e.target);
      let colID = boxEl.attr("data-col")

      this.boxClickHandler( parseInt(colID) );
    });

    // Adding event listners to the Initial buttons
    $("#reset-btn").click( e=> this.resetGame() ).toggle(false)
    $("#turn-btn").click( e=> this.undo() )

    // Handling keyboard shortcuts
    $(document).keydown( e => {
      let whichKey = e.which 

      switch (whichKey) {
        case 16: //shift
          this.undo()
          break;
      
        default:
          break;
      }

    } )
  }

  // The name says it all..
  boxClickHandler(colID) {

    //check if the game is stopped
    if (!this.gameStatus) return false; 
    
    // Run a loop to get the first zero valued box in a row of selected column
    let rowID = 0
    
    for (let index = 0; index < this.connect2D.length; index++) {
      const element = this.connect2D[index][colID];
      rowID = index
      if(element == 0) break;
    }

    // Return if the box is already taken.. only needed on the top most row
    if (this.connect2D[rowID][colID] !== 0) return false;

    // Getting the element using the id format
    let boxEl = $(`#box-${rowID}-${colID}`);

    // Changing color of the selected box
    let color = this.currentPlayer == 1 ? "green" : "red";
    boxEl.addClass(color);

    // Updating the 2D array and Game log
    this.connect2D[rowID][colID] = this.currentPlayer;
    this.gameLog.push({ rowID, colID, playedBy: this.currentPlayer })

    // Changes into next player and check result of the last move
    this.checkResult( rowID, colID, this.currentPlayer);
    this.changeTurn()
  }

  // Change player turn and the color of the undo/player button
  changeTurn() {

    this.currentPlayer = (this.currentPlayer == 1) ? 2 : 1;
    let color = this.currentPlayer == 1 ? "green" : "red";

    $("#turn-btn").removeClass("red green");
    $("#turn-btn").addClass(color).html(this.currentPlayer)
  }

  // Checking the four adjacent boxes of the selected box
  checkResult(rowID, colID, currentPlayer) {
    console.log( `Player --> ${currentPlayer}, Row --> ${rowID}, Col --> ${colID}` );

    let connect2D = this.connect2D;

    let check = {
      pointRight: { point: 0, status: true },
      pointLeft: { point: 0, status: true },
      pointBottom: { point: 0, status: true },
      pointTopRight: { point: 0, status: true },
      pointTopLeft: { point: 0, status: true },
      pointBottomRight: { point: 0, status: true },
      pointBottomLeft: { point: 0, status: true },
    };
    
    /*
     Check in all direction in a single loop.. and note the points down
     status is given to break the point++ if the flow was broken and don't need to count that direction anymore.
     status is intially true and set to false once the flow is broken 
     */
    
     for (let index = 1; index < 4; index++) {

      // Horizontal
      let rightCheck = connect2D[rowID][colID + index]
      if (rightCheck == currentPlayer && check.pointRight.status) check.pointRight.point++;
      else check.pointRight.status = false;

      let leftCheck = connect2D[rowID][colID - index]
      if (leftCheck == currentPlayer && check.pointLeft.status) check.pointLeft.point++;
      else check.pointLeft.status = false;

      // Vertical.. no need to check top ( has gravity.. cannot win upwards )
      let bottomCheck = connect2D[rowID - index]
        ? connect2D[rowID - index][colID]
        : false;
      if (bottomCheck == currentPlayer && check.pointBottom.status)
        check.pointBottom.point++;
      else check.pointBottom.status = false;

      // Diagonals
      let topRightCheck = connect2D[rowID + index]
        ? connect2D[rowID + index][colID + index]
        : false;
      if (topRightCheck == currentPlayer && check.pointTopRight.status)
        check.pointTopRight.point++;
      else check.pointTopRight.status = false;

      let topLeftCheck = connect2D[rowID + index]
        ? connect2D[rowID + index][colID - index]
        : false;
      if (topLeftCheck == currentPlayer && check.pointTopLeft.status)
        check.pointTopLeft.point++;
      else check.pointTopLeft.status = false;

      let bottomRightCheck = connect2D[rowID - index]
        ? connect2D[rowID - index][colID + index]
        : false;
      if (bottomRightCheck == currentPlayer && check.pointBottomRight.status)
        check.pointBottomRight.point++;
      else check.pointBottomRight.status = false;

      let bottomLeftCheck = connect2D[rowID - index]
        ? connect2D[rowID - index][colID - index]
        : false;
      if (bottomLeftCheck == currentPlayer && check.pointBottomLeft.status)
        check.pointBottomLeft.point++;
      else check.pointBottomLeft.status = false;
    }

    this.countPoints(check, currentPlayer);
  }

  // Count the point of the last move. And announce the winner if it's a win
  countPoints(check, currentPlayer) {
    // 3 points to your vicotry.. combining the 4 possible direction X, Y and 2 diagonals
    if (
      check.pointRight.point + check.pointLeft.point >= 3 ||
      check.pointBottom.point >= 3 ||
      check.pointTopRight.point + check.pointBottomLeft.point >= 3 ||
      check.pointTopLeft.point + check.pointBottomRight.point >= 3
    ) {
      // Game stops if any player won
      this.gameStatus = false;

      // Alert the win and show reset button in x seconds
      Swal.fire({ title: `Player ${currentPlayer} Won`, showConfirmButton: false, showCloseButton: true, icon: 'success' })
      .then( result =>  setTimeout( () =>  $("#reset-btn").toggle(true) , 2000))
    }
  }

  undo() {
    // Get and remove the last move from log.. do nothing if it's empty
    let lastMove = this.gameLog.pop()
    if(!lastMove) return

    // Undo the last changes.. Box coloring and revert the 2D array
    this.currentPlayer = (lastMove.playedBy == 1) ? 2 : 1;
    $(`#box-${lastMove.rowID}-${lastMove.colID}`).removeClass("red green");
    this.connect2D[lastMove.rowID][lastMove.colID] = 0
    
    this.changeTurn()

    // Set status back to true and hide reset btn, incase undo was clicked after finishing up the game
    this.gameStatus = true;
    $("#reset-btn").toggle(false)
  }

  // Function to reset the game
  resetGame() {
    // Remove all colors, clear the 2D array and the history logs
    $(".box").removeClass("red green");
    this.connect2D = this.createBlankArray2D( this.x, this.y);
    this.gameStatus = true;
    this.gameLog = [] 
    
    $("#reset-btn").toggle(false)
  }
}

// window.connectFour = ConnectFour;

let connectFour = new ConnectFour();
connectFour.init();
