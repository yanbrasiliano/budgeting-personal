//Classes
class Expense {
  constructor(year, month, day, type, description, value) {
    this.year = year;
    this.month = month;
    this.day = day;
    this.type = type;
    this.description = description;
    this.value = value;
  }

  dataValidate() {
    for (let i in this) {
      if (this[i] == undefined || this[i] == "" || this[i] == null) {
        return false;
      }
    }
    return true;
  }
}

class Database {
  constructor() {
    let id = localStorage.getItem("id");

    if (id === null) {
      localStorage.setItem("id", 0);
    }
  }
  getNewId() {
    let nextId = localStorage.getItem("id");
    return parseInt(nextId) + 1;
  }
  save(expense) {
    let id = this.getNewId();
    localStorage.setItem(id, JSON.stringify(expense));
    localStorage.setItem("id", id);
  }

  listExpenses() {
    let id = localStorage.getItem("id");
    let expenses = [];
    for (let i = 1; i <= id; i++) {
      let expense = JSON.parse(localStorage.getItem(i));
      if (expense === null) {
        continue;
      }
      expense.id = i;
      expenses.push(expense);
    }

    return expenses;
  }

  searchExpenses(expense) {
    let expensesFilters = [];
    expensesFilters = this.listExpenses();

    if (expense.year != "") {
      expensesFilters = expensesFilters.filter((e) => e.year == expense.year);
    }

    if (expense.month != "") {
      expensesFilters = expensesFilters.filter((e) => e.month == expense.month);
    }

    if (expense.day != "") {
      expensesFilters = expensesFilters.filter((e) => e.day == expense.day);
    }

    if (expense.type != "") {
      expensesFilters = expensesFilters.filter((e) => e.type == expense.type);
    }

    if (expense.description != "") {
      expensesFilters = expensesFilters.filter(
        (e) => e.description == expense.description
      );
    }

    if (expense.value != "") {
      expensesFilters = expensesFilters.filter((e) => e.value == expense.value);
    }

    return expensesFilters;
  }

  remove(id) {
    localStorage.removeItem(id);
  }
}
//Variables Initials.
let db = new Database();

//Functions

function register() {
  let year = document.getElementById("ano");
  let month = document.getElementById("mes");
  let day = document.getElementById("dia");
  let type = document.getElementById("tipo");
  let description = document.getElementById("descricao");
  let value = document.getElementById("valor");

  let expense = new Expense(
    year.value,
    month.value,
    day.value,
    type.value,
    description.value,
    value.value
  );

  expense.dataValidate() ? db.save(expense) & accept() & cleanUp() : error();
}

function cleanUp() {
  document.getElementById("ano").value = "";
  document.getElementById("mes").value = "";
  document.getElementById("dia").value = "";
  document.getElementById("tipo").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("valor").value = "";
}
function error() {
  $("#registerModal").modal("show");
  document.getElementById("modal-title").innerHTML = "Data saving error.";
  document.getElementById("modal-title-div").className =
    "modal-header text-danger";

  document.getElementById("modal-content").innerHTML =
    "There are required fields that have not been filled in.";

  document.getElementById("btn").innerHTML = "Return";
  document.getElementById("btn").className = "btn btn-danger";
}

function accept() {
  $("#registerModal").modal("show");
  document.getElementById("modal-title").innerHTML =
    "Register insert successfully!";
  document.getElementById("modal-title-div").className =
    "modal-header text-success";

  document.getElementById("modal-content").innerHTML =
    "Expenses successfully registered!";

  document.getElementById("btn").innerHTML = "Return";
  document.getElementById("btn").className = "btn btn-success";
}
function save(expense) {
  localStorage.setItem(expense, JSON.stringify(expense));
}

function loadExpenses(expenses = Array(), filters = false) {

  if (expenses.length == 0 && filters == false) {
    expenses = db.listExpenses();
  }

  let listExpenses = document.getElementById("expensesList");
  listExpenses.innerHTML = "";
  let total = 0;

  expenses.forEach(function (item) {
    total += Number(item.value);
		value = "R$" + total;
    let line = listExpenses.insertRow();
    line.insertCell(0).innerHTML = `${item.day}/${item.month}/${item.year}`;

    switch (item.type) {
      case "1":
        item.type = "Food";
        break;
      case "2":
        item.type = "Education";
        break;
      case "3":
        item.type = "Recreation";
        break;
      case "4":
        item.type = "Health";
        break;
      case "5":
        item.type = "Transportation";
        break;
    }
    line.insertCell(1).innerHTML = item.type;
    line.insertCell(2).innerHTML = item.description;
    line.insertCell(3).innerHTML = item.value;

    let btn = document.createElement("button");
    btn.className = "btn btn-danger";
    btn.innerHTML = '<i class="fa fa-times"></i>';
    btn.id = item.id;
    btn.onclick = () => {
      db.remove(btn.id);
      window.location.reload();
    };
    line.insertCell(4).append(btn);
  });
  document.getElementById("total").innerHTML = `Total: ${value}`;
}

function searchExpenses() {
  let year = document.getElementById("ano");
  let month = document.getElementById("mes");
  let day = document.getElementById("dia");
  let type = document.getElementById("tipo");
  let description = document.getElementById("descricao");
  let value = document.getElementById("valor");

  let expense = new Expense(
    year.value,
    month.value,
    day.value,
    type.value,
    description.value,
    value.value
  );
  let expenses = db.searchExpenses(expense);
  this.loadExpenses(expenses, true);
}
