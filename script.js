const companiesURL = 'https://recruitment.hal.skygate.io/companies';
const incomesURL = 'https://recruitment.hal.skygate.io/incomes/';
const incomesURLs = makeIncomesURLs();
const table = document.querySelector('.table');
const tbody = document.querySelector('.tbody');
const idHeader = document.querySelector('.id-header');
const nameHeader = document.querySelector('.name-header');
const cityHeader = document.querySelector('.city-header');
const totalHeader = document.querySelector('.total-header');
const averageHeader = document.querySelector('.average-header');
const monthHeader = document.querySelector('.month-header');
const search = document.querySelector('.search');
const spinner = document.querySelector('.spinner');
let newRow;
let newCell;
let currentCompany;
let companiesData;
let incomesData;

function makeIncomesURLs() {
  let arr = [];
  for (let i = 1; i < 301; i++) {
    arr.push(incomesURL + [i]);
  }
  return arr;
}

fetch(companiesURL)
  .then(response => response.json())
  .then((data) => {
    companiesData = data;
    companiesData = companiesData.sort(compareObjectsId);
  })
  .then(() => {
    Promise.all(incomesURLs.map(url =>
        fetch(url)
        .then(response => response.json())
      ))
      .then(data => {
        incomesData = data;
        incomesData.forEach((item, i) => {
          item.incomes.sort(compareObjectsDate);
        });

        companiesData.forEach((item, index) => {
          //adding incomes property to each company
          if (incomesData[index].id === item.id) {
            item.incomes = incomesData[index].incomes;
          }
          calculateIncomes(item);
          addTableRow(currentCompany);
        });
        table.style = 'visibility: visible';
        search.style = 'visibility: visible';
        spinner.style.display = 'none';
      });
  });

function calculateIncomes(company) {
  let totalIncome = 0;
  let averageIncome = 0;
  let lastMonthIncome = 0;
  let lastDate = new Date(company.incomes[49].date);
  let lastMonth = {
    year: lastDate.getFullYear(),
    month: lastDate.getMonth(),
  }
  //loop through incomes property of each company
  for (let i = 0; i < company.incomes.length; i++) {
    totalIncome += parseFloat(company.incomes[i].value);
    let lastCurrentDate = new Date(company.incomes[i].date);
    let lastCurrentMonth = {
      year: lastCurrentDate.getFullYear(),
      month: lastCurrentDate.getMonth(),
    }
    if (lastCurrentMonth.year === lastMonth.year && lastCurrentMonth.month === lastMonth.month) {
      lastMonthIncome += parseFloat(company.incomes[i].value);
    }
  }
  averageIncome = totalIncome / company.incomes.length;

  currentCompany = {
    id: company.id,
    name: company.name,
    city: company.city,
    totalIncome: Math.floor(totalIncome),
    averageIncome: Math.floor(averageIncome),
    lastMonthIncome: Math.floor(lastMonthIncome),
  };
}

function addTableRow(company) {
  newRow = document.createElement('tr');
  for (let key in company) {
    newCell = document.createElement('td');
    newCell.innerHTML = company[key];
    newRow.appendChild(newCell)
  }
  tbody.appendChild(newRow);
}

function compareObjectsId(a, b) {
  return a.id - b.id;
}

function compareObjectsDate(a, b) {
  if (a.date < b.date) {
    return -1;
  }
}

function sortTable(n) {
  let rows, switching, i, x, y, shouldSwitch, direction, switchCounter = 0;
  switching = true;
  direction = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];

      if (direction == "asc") {
        if (Number(x.innerHTML) > Number(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      } else if (direction == "desc") {
        if (Number(x.innerHTML) < Number(y.innerHTML)) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchCounter++;
    } else {
      if (switchCounter == 0 && direction == "asc") {
        direction = "desc";
        switching = true;
      }
    }
  }
}

function sortTableByString(n) {
  let rows, switching, i, x, y, shouldSwitch, direction, switchCounter = 0;
  switching = true;
  direction = "asc";
  while (switching) {
    switching = false;
    rows = table.rows;
    for (i = 1; i < (rows.length - 1); i++) {
      shouldSwitch = false;
      x = rows[i].getElementsByTagName("TD")[n];
      y = rows[i + 1].getElementsByTagName("TD")[n];

      if (direction == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      } else if (direction == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchCounter++;
    } else {
      if (switchCounter == 0 && direction == "asc") {
        direction = "desc";
        switching = true;
      }
    }
  }
}

function searchData() {
  let input, filter, tr, td, txtValue, cell;
  input = document.getElementById("search-input");
  filter = input.value.toUpperCase();
  tr = table.getElementsByTagName("tr");

  for (let i = 1; i < tr.length; i++) {
    tr[i].style.display = "none";
    td = tr[i].getElementsByTagName("td");
    for (let j = 0; j < td.length; j++) {
      cell = tr[i].getElementsByTagName("td")[j];
      if (cell) {
        txtValue = cell.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
          tr[i].style.display = "";
        }
      }
    }
  }
}

idHeader.addEventListener('click', () => sortTable(0));
nameHeader.addEventListener('click', () => sortTableByString(1));
cityHeader.addEventListener('click', () => sortTableByString(2));
totalHeader.addEventListener('click', () => sortTable(3));
averageHeader.addEventListener('click', () => sortTable(4));
monthHeader.addEventListener('click', () => sortTable(5));
