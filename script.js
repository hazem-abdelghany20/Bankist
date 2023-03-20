//hardcoding the accounts details for simplicity

var account1 = {
  owner: "Hazem Abdelghany",
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    "2019-11-18T21:31:17.178Z",
    "2019-12-23T07:42:02.383Z",
    "2020-01-28T09:15:04.904Z",
    "2020-04-01T10:17:24.185Z",
    "2020-05-08T14:11:59.604Z",
    "2020-05-27T17:01:17.194Z",
    "2020-07-11T23:36:17.929Z",
    "2020-07-12T10:51:36.790Z",
  ],
  currency: "EUR",
  locale: "pt-PT", // de-DE
};
console.log("hey hazem");
const account2 = {
  owner: "Abdelghany Elgammal",
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    "2019-11-01T13:15:33.035Z",
    "2019-11-30T09:48:16.867Z",
    "2019-12-25T06:04:23.907Z",
    "2020-01-25T14:18:46.235Z",
    "2020-02-05T16:33:06.386Z",
    "2020-04-10T14:43:26.374Z",
    "2020-06-25T18:49:59.371Z",
    "2020-07-26T12:01:20.894Z",
  ],
  currency: "USD",
  locale: "en-US",
};
var myName = "Hazem";
const accounts = [account1, account2];

// Elements
const labelWelcome = document.querySelector(".login");
const labelDate = document.querySelector(".balance__date");
const labelBalance = document.querySelector(".balance__value");
const labelSumIn = document.querySelector(".summary__value--in");
const labelSumOut = document.querySelector(".summary__value--out");
const labelSumInterest = document.querySelector(".summary__value--interest");
const labelTimer = document.querySelector(".timer");
const containerApp = document.querySelector(".app");
const containerMovements = document.querySelector(".movements");

const btnLogin = document.querySelector(".login__btn");
const btnTransfer = document.querySelector(".form__btn--transfer");
const btnLoan = document.querySelector(".form__btn--loan");
const btnClose = document.querySelector(".form__btn--close");
const btnSort = document.querySelector(".btn--sort");

const inputLoginUsername = document.querySelector(".login__input--user");
const inputLoginPin = document.querySelector(".login__input--pin");
const inputTransferTo = document.querySelector(".form__input--to");
const inputTransferAmount = document.querySelector(".form__input--amount");
const inputLoanAmount = document.querySelector(".form__input--loan-amount");
const inputCloseUsername = document.querySelector(".form__input--user");
const inputClosePin = document.querySelector(".form__input--pin");
const main = document.querySelector(".app");

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ["USD", "United States dollar"],
  ["EUR", "Euro"],
  ["GBP", "Pound sterling"],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
const money = function (mov, locale, currency) {
  let mon = new Intl.NumberFormat(locale, {
    style: "currency",
    currency: `${currency}`,
  }).format(mov);
  return mon;
};
const displayMovements = function (acc) {
  containerMovements.innerHTML = "";
  //get the movements of the acc and foreach record get the data and i to retrieve the date of it
  acc.movements.forEach(function (mov, i) {
    const thatDate = new Date(acc.movementsDates[i]);
    const now = new Date();
    const options = {
      year: "numeric",
      month: "numeric",
      day: "numeric",
    };

    let dateNow = new Intl.DateTimeFormat(acc.locale, options).format(thatDate);
    //getn the type of the movement and then put it in an html code to insert it into the website
    const type = mov >= 0 ? "deposit" : "withdrawal";
    let html = `<div class="movements_row">
  <div class="movements__type movements__type--${type}">${i + 1} ${type}</div>
  <div class="movements__date">${dateNow}</div>
  <div class="movements__value">${money(mov, acc.locale, acc.currency)}</div>
  </div>`;
    containerMovements.insertAdjacentHTML("afterbegin", html);
  });
};
// the user name is created by having the initials of the user lower cased
const user = "Hazem Abdelghany";
const createUsername = function (accs) {
  accs.forEach(function (acc) {
    acc.username = acc.owner
      .toLowerCase()
      .split(" ")
      .map((name) => name[0])
      .join("");
  });
};

createUsername(accounts);

//this method is to calculate the balance by adding (reducing) the movements array
const calculateBalance = function (acc) {
  labelBalance.textContent = ``;
  acc.balance = acc.movements.reduce((acc, val) => acc + val, 0);
  labelBalance.textContent = `${money(acc.balance, acc.locale, acc.currency)} `;
  const now = new Date();
  const options = {
    hour: "numeric",
    minute: "numeric",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  let dateNow = new Intl.DateTimeFormat(`en-US`, options).format(now);
  labelDate.textContent = dateNow;
};

const calculateIn = function (acc) {
  labelSumIn.textContent = ``;
  const balance = acc.movements
    .filter((value) => value > 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumIn.textContent = `${balance.toFixed(2)} €`;
};

const calculateOut = function (acc) {
  labelSumOut.textContent = ``;
  const balance = acc.movements
    .filter((value) => value < 0)
    .reduce((acc, val) => acc + val, 0);
  labelSumOut.textContent = `${-balance.toFixed(2)} €`;
};

const calculateInterest = function (acc) {
  labelSumInterest.textContent = ``;
  const balance = acc.movements
    .filter((value) => value > 0)
    .map((value) => value * (acc.interestRate / 100))
    .reduce((acc, value) => acc + value);
  labelSumInterest.textContent = `${balance.toFixed(2)} €`;
};
const calcDisplaySummary = function (acc) {
  calculateIn(acc);
  calculateOut(acc);
  calculateInterest(acc);
};
let timer;
// sets the 5 minutes timer
setTimer = function () {
  let time = 300;

  const tick = function () {
    let min = String(Math.trunc(time / 60)).padStart(2, 0);
    let sec = String(time % 60).padStart(2, 0);
    labelTimer.textContent = `${min}:${sec}`;
    if (time === 0) {
      clearInterval(timer);
      const logout = function () {
        labelWelcome.textContent = "Log in to start";
        containerApp.classList.add("hidden");
      };
      logout();
    }

    time--;
  };
  tick();
  const timer = setInterval(tick, 1000);
  return timer;
};
const calcDate = function () {
  const now = new Date();
  const options = {
    hour: "numeric",
    minute: "numeric",
    year: "numeric",
    month: "numeric",
    day: "numeric",
  };
  let dateNow = new Intl.DateTimeFormat(`en-US`, options).format(now);
  console.log(dateNow);
  labelDate.textContent = dateNow;
};
const calcAll = function (acc) {
  if (timer) {
    clearInterval(timer);
  }
  calculateBalance(acc);
  displayMovements(acc);
  calcDisplaySummary(acc);
  timer = setTimer();
};

const transferMoney = function () {
  const transfer = Number(inputTransferAmount.value);
  const transferTo = inputTransferTo.value;
  const transferAcc = accounts.find((acc) => acc.username === transferTo);
  console.log(transfer);
  if (
    transfer > 0 &&
    transfer <= currentAcc.balance &&
    transferAcc &&
    transferAcc?.username !== currentAcc.username
  ) {
    currentAcc.movements.push(-transfer);
    transferAcc.movements.push(transfer);
    transferAcc.movementsDates.push(new Date());
    currentAcc.movementsDates.push(new Date());
    calcAll(currentAcc);
  }
};

let currentAcc;
btnLogin.addEventListener("click", function (e) {
  //e.preventDefault

  let login = inputLoginUsername.value;
  let pass = inputLoginPin.value;
  currentAcc = accounts.find((acc) => acc.username === login);
  if (pass == currentAcc?.pin) {
    labelWelcome.textContent = `Welcome back ${currentAcc.owner}`;
    inputLoginUsername.value = inputLoginPin.value = "";
    inputLoginPin.blur();
    containerApp.classList.remove("hidden");
    containerApp.classList.add("animate");
    calcAll(currentAcc);
  }
  // if (account1.username === login && account1.pin == pass) {
  //   calcAll(account1.movements);
  //   currentAcc = 1;
  // }
  // if (account2.username == inputLoginUsername.value && account2.pin == pass) {
  //   calcAll(account2.movements);

  //   currentAcc = 2;
  // }
  // if (account3.username == inputLoginUsername.value && account3.pin == pass) {
  //   calcAll(account3.movements);

  //   currentAcc = 3;
  // }
  // if (account4.username == inputLoginUsername.value && account4.pin == pass) {
  //   calcAll(account4.movements);

  //   currentAcc = 4;
  // }
});
btnTransfer.addEventListener("click", transferMoney);

btnLoan.addEventListener("click", function (e) {
  e.preventDefault();
  console.log(
    Number(inputLoanAmount.value) * 0.1,
    currentAcc.movements.some(
      (value) => value >= Number(inputLoanAmount.value) * 0.1
    )
  );
  if (
    currentAcc.movements.some(
      (value) => value >= Number(inputLoanAmount.value) * 0.1
    )
  ) {
    currentAcc.movements.push(Number(inputLoanAmount.value));
    inputLoanAmount.value = "";
    calcAll(currentAcc);
  }
});

btnClose.addEventListener("click", function (e) {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAcc.username &&
    Number(inputClosePin.value) === currentAcc.pin
  ) {
    const index = accounts.findIndex(
      (acc) => acc.username === currentAcc.username
    );
    console.log(index);
    // .indexOf(23)

    // Delete account
    accounts.splice(index, 1);
    console.log("hi");
    // Hide UI
    containerApp.classList.add("hidden");
  }

  inputCloseUsername.value = inputClosePin.value = "";
});
var myName;
