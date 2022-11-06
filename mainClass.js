class ConnectFour {
  constructor(elemID, x, y, playerOne, playerTwo) {
    // Note
    console.log("This game need jquery-3.6.0 and bootstrap v5.2 to work");

    this.x = x || 7;
    this.y = y || 7;
    this.connect2D = this.createBlankArray2D(this.x, this.y);

    this.gameStatus = true;
    this.currentPlayer = 1;

    this.gameRoot = $(elemID).length ? $(elemID) : $("body");
  }

  init() {
    let initHTML = `
    <div id="game-div" class="d-flex justify-content-center align-items-center">
      <div id="game-canvas"> </div>
    </div>`;

    this.gameRoot.prepend(initHTML);
    this.connect2D.map((cols, rowID) => this.createBox(cols, rowID));
    this.setControls();

  }

  createBlankArray2D(a, b) {
    let newArray = [];

    // creating two dimensional array
    for (let i = 0; i < a; i++) {
      newArray[i] = [];
      for (let j = 0; j < b; j++) newArray[i].push(0);
    }
    return newArray;
  }

  createBox(cols, rowID) {
    $("#game-canvas").prepend(`
        <div class="row justify-content-center">
          ${cols.map( (e, colID) =>
                `<div class="box" id="box-${rowID}-${colID}"></div>`
            ).join('')}
        </div>
      `);
  }

  setControls() {
    $(".box").click((e) => {
      let boxEl = $(e.target);
      let [className, rowID, colID] = boxEl.attr("id").split("-");

      this.manageControl(boxEl, rowID, colID);
    });
  }

  manageControl(boxEl, rowID, colID) {
    if (!this.gameStatus) return false;
    
    if (this.connect2D[rowID][colID] !== 0) return false;

    if (rowID != 0 && this.connect2D[rowID - 1][colID] == 0)  return false;

    let color = this.currentPlayer == 1 ? "green" : "red";
    this.connect2D[rowID][colID] = this.currentPlayer;
    boxEl.addClass(color);

    this.checkResult(rowID, colID, this.currentPlayer);
    this.currentPlayer = this.currentPlayer == 1 ? 2 : 1;
  }

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

    for (let index = 1; index < 4; index++) {
      const rightCheck = connect2D[rowID]
        ? connect2D[rowID][colID + index]
        : false;
      if (rightCheck == currentPlayer && check.pointRight.status)
        check.pointRight.point++;
      else check.pointRight.status = false;

      const leftCheck = connect2D[rowID]
        ? connect2D[rowID][colID - index]
        : false;
      if (leftCheck == currentPlayer && check.pointLeft.status)
        check.pointLeft.point++;
      else check.pointLeft.status = false;

      const bottomCheck = connect2D[rowID - index]
        ? connect2D[rowID - index][colID]
        : false;
      if (bottomCheck == currentPlayer && check.pointBottom.status)
        check.pointBottom.point++;
      else check.pointBottom.status = false;

      // Diagonals

      const topRightCheck = connect2D[rowID + index]
        ? connect2D[rowID + index][colID + index]
        : false;
      if (topRightCheck == currentPlayer && check.pointTopRight.status)
        check.pointTopRight.point++;
      else check.pointTopRight.status = false;

      const topLeftCheck = connect2D[rowID + index]
        ? connect2D[rowID + index][colID - index]
        : false;
      if (topLeftCheck == currentPlayer && check.pointTopLeft.status)
        check.pointTopLeft.point++;
      else check.pointTopLeft.status = false;

      const bottomRightCheck = connect2D[rowID - index]
        ? connect2D[rowID - index][colID + index]
        : false;
      if (bottomRightCheck == currentPlayer && check.pointBottomRight.status)
        check.pointBottomRight.point++;
      else check.pointBottomRight.status = false;

      const bottomLeftCheck = connect2D[rowID - index]
        ? connect2D[rowID - index][colID - index]
        : false;
      if (bottomLeftCheck == currentPlayer && check.pointBottomLeft.status)
        check.pointBottomLeft.point++;
      else check.pointBottomLeft.status = false;
    }

    this.countPoints(check, currentPlayer);
  }

  countPoints(check, currentPlayer) {
    if (
      check.pointRight.point + check.pointLeft.point >= 3 ||
      check.pointBottom.point >= 3 ||
      check.pointTopRight.point + check.pointBottomLeft.point >= 3 ||
      check.pointTopLeft.point + check.pointBottomRight.point >= 3 ||
      check.pointRight.point + check.pointLeft.point >= 3
    ) {
      this.gameStatus = false;
      swal.fire(`Player ${currentPlayer} Won`, "", "success");
    }
  }

  resetGame() {
    $(".box").removeClass("red green");
    this.connect2D = blankArray2D(x, y);
  }
}

// window.connectFour = ConnectFour;

let connectFour = new ConnectFour();
connectFour.init();
