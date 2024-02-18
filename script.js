const spreadSheetContainer = document.querySelector("#spreadsheet-container");
const exportBtn = document.querySelector("#export-btn");
const ROWS = 10;
const COLS = 10;
const spreadsheet = [];
const alphabets = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

// cell 클래스 정의
class Cell {
  constructor(
    isHeader,
    disabled,
    data,
    row,
    column,
    rowName,
    columnName,
    active = false
  ) {
    this.isHeader = isHeader;
    this.disabled = disabled;
    this.data = data;
    this.row = row;
    this.column = column;
    this.rowName = rowName;
    this.columnName = columnName;
    this.active = active;
  }
}

exportBtn.onclick = function (e) {
  let csv = "";
  for (let i = 0; i < spreadsheet.length; i++) {
    if (i === 0) continue;
    csv +=
      spreadsheet[i]
        .filter((item) => !item.isHeader)
        .map((item) => item.data)
        .join(",") + "\r\n";
  }

  const csvObj = new Blob([csv]);
  const csvUrl = URL.createObjectURL(csvObj);
  console.log("csvUrl", csvUrl);

  const a = document.createElement("a");
  a.href = csvUrl;
  a.download = "spreadsheet name.csv";
  a.click();
};

// 시트 초기화 선언
initSpreadsheet();

// 시트 초기화
function initSpreadsheet() {
  for (let i = 0; i < ROWS; i++) {
    const spreadsheetRow = [];
    for (let j = 0; j < COLS; j++) {
      // 컬럼에 숫자 넣기
      let cellData = "";
      let isHeader = false;
      let disabled = false;

      // 모든 row 첫 번째 컬럼에 숫자 넣기
      if (j === 0) {
        cellData = i;
        isHeader = true;
        disabled = true;
      }

      // 모든 column 첫 번째 row에 영문 넣기
      if (i === 0) {
        cellData = alphabets[j - 1];
        isHeader = true;
        disabled = true;
      }

      // 첫 번째 row의 컬럼은 "";
      // cellData가 undefined면 "";
      if (!cellData) {
        cellData = "";
      }

      const rowName = i;
      const columnName = alphabets[j - 1];

      const cell = new Cell(
        isHeader,
        disabled,
        cellData,
        i,
        j,
        rowName,
        columnName,
        false
      );
      spreadsheetRow.push(cell); // [0-1, 0-2, 0-3, ...]
    }
    spreadsheet.push(spreadsheetRow);
  }
  drawSheet();
}

// cell element 생성
function createCellEl(cell) {
  const cellEl = document.createElement("input");
  cellEl.className = "cell";
  cellEl.id = "cell_" + cell.row + cell.column;
  cellEl.value = cell.data;
  cellEl.disabled = cell.disabled;

  if (cell.isHeader) {
    cellEl.classList.add("header");
  }

  cellEl.onclick = () => handleCellClick(cell);
  cellEl.onchange = (e) => handleOnChange(e.target.value, cell);

  return cellEl;
}

function handleCellClick(cell) {
  clearHeaderActiveStates();
  const columnHeader = spreadsheet[0][cell.column];
  const rowHeader = spreadsheet[cell.row][0];

  const columnHeaderEl = getElFromRowCol(columnHeader.row, columnHeader.column);
  const rowHeaderEl = getElFromRowCol(rowHeader.row, rowHeader.column);

  columnHeaderEl.classList.add("active");
  rowHeaderEl.classList.add("active");

  document.querySelector("#cell-status").innerHTML =
    cell.columnName + " " + cell.rowName;
}

function handleOnChange(data, cell) {
  cell.data = data;
}

// 하이라트 시킨 element 초기화
function clearHeaderActiveStates() {
  const headers = document.querySelectorAll(".header");

  headers.forEach((header) => {
    header.classList.remove("active");
  });
}

// 하이라이트 시킬 element를 들고온다.
function getElFromRowCol(row, col) {
  return document.querySelector("#cell_" + row + col);
}

// spreadsheet 랜더링
function drawSheet() {
  for (let i = 0; i < spreadsheet.length; i++) {
    const rowContainerEl = document.createElement("div");
    rowContainerEl.className = "cell-row";

    for (let j = 0; j < spreadsheet[i].length; j++) {
      const cell = spreadsheet[i][j];
      rowContainerEl.append(createCellEl(cell));
    }
    spreadSheetContainer.append(rowContainerEl);
  }
}
