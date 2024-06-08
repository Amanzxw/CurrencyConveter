
const BASE_URL = 'https://v6.exchangerate-api.com/v6/0fa44b23191a766cbcba9039/latest';

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

fetch('https://v6.exchangerate-api.com/v6/0fa44b23191a766cbcba9039/latest/USD')
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error('Error:', error));

// Populate dropdowns with currency options
const fetchCurrencies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/USD`);
    const data = await response.json();
    const currencies = Object.keys(data.conversion_rates);
    populateDropdowns(currencies);
  } catch (error) {
    console.error('Error:', error);
  }
};

const populateDropdowns = (currencies) => {
  for (let select of dropdowns) {
    for (let currCode of currencies) {
      let newOption = document.createElement("option");
      newOption.innerText = currCode;
      newOption.value = currCode;
      if (select.name === "from" && currCode === "USD") {
        newOption.selected = "selected";
      } else if (select.name === "to" && currCode === "INR") {
        newOption.selected = "selected";
      }
      select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
      updateFlag(evt.target);
    });
  }
};

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  const URL = `${BASE_URL}/${fromCurr.value}`;
  let response = await fetch(URL);
  let data = await response.json();
  let rate = data.conversion_rates[toCurr.value];

  let finalAmount = amtVal * rate;
  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  fetchCurrencies();
  updateExchangeRate();
});
