const x = 7;
const y = 7;
let connect2D = blankArray2D(x, y);
let gameStatus = true;

let player = 1;

function initConnectFour() {
  connect2D.map((e, i) => createBox(e, i));
}

// program to create a two dimensional array

function blankArray2D(a, b) {
  let arr = [];

  // creating two dimensional array
  for (let i = 0; i < a; i++) {
    arr[i] = [];
    for (let j = 0; j < b; j++) arr[i].push(0);
  }

  return arr;
}

function createBox(col, rowID) {
  $("#game-div .game-canvas").prepend(`
      
        <div class="row justify-content-center">
          ${col
            .map(
              (e, colID) =>
                `<div class="box" id="box-${rowID}-${colID}" onclick="chooseBox(${rowID},${colID})" ></div>`
            )
            .join("")}
        </div>
      
      `);
}

function chooseBox(rowID, colID) {
  if (!gameStatus) return;

  if (!checkFeasible(rowID, colID)) return;

  let boxEl = $(`#box-${rowID}-${colID}`);
  let color = player == 1 ? "green" : "red";
  connect2D[rowID][colID] = player;
  boxEl.addClass(color);

  checkResult(rowID, colID, player);
  player = player == 1 ? 2 : 1;
}

function checkFeasible(rowID, colID) {
  if (connect2D[rowID][colID] !== 0) return false;

  if (rowID == 0) return true;

  if (connect2D[rowID - 1][colID] === 0) return false;
  else return true;
}

function checkResult(rowID, colID, currentPlayer) {
  console.log(`Player --> ${currentPlayer}, Row --> ${rowID}, Col --> ${colID}`);

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

  countPoints(check, currentPlayer);

}

function countPoints(check, currentPlayer) {
  if (
    check.pointRight.point + check.pointLeft.point >= 3 ||
    check.pointBottom.point >= 3 ||
    check.pointTopRight.point + check.pointBottomLeft.point >= 3 ||
    check.pointTopLeft.point + check.pointBottomRight.point >= 3 ||
    check.pointRight.point + check.pointLeft.point >= 3
  ) {
    gameStatus = false;
    swal.fire(`Player ${currentPlayer} Won`, "", "success");
  }
}


function resetGame() {
    $(".box").removeClass("red green");
    connect2D = blankArray2D(x, y);
}

$(document).ready( e => initConnectFour(connect2D) )
