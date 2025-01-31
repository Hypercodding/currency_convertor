const BASE_URL = "https://v6.exchangerate-api.com/v6/2a926347c944a711f109160a/latest/USD";
const dropdowns = document.querySelectorAll(".dropdown select");
const resultDiv = document.getElementById("result");
const form = document.getElementById("converter-form");
const amountInput = document.getElementById("amount");

const countryList = {
    AED: "AE", AFN: "AF", XCD: "AG", ALL: "AL", AMD: "AM", ANG: "AN",
    AOA: "AO", AQD: "AQ", ARS: "AR", AUD: "AU", AZN: "AZ", BAM: "BA",
    BBD: "BB", BDT: "BD", XOF: "BE", BGN: "BG", BHD: "BH", BIF: "BI",
    BMD: "BM", BND: "BN", BOB: "BO", BRL: "BR", BSD: "BS", NOK: "BV",
    BWP: "BW", BYR: "BY", BZD: "BZ", CAD: "CA", CDF: "CD", XAF: "CF",
    CHF: "CH", CLP: "CL", CNY: "CN", COP: "CO", CRC: "CR", CUP: "CU",
    CVE: "CV", CYP: "CY", CZK: "CZ", DJF: "DJ", DKK: "DK", DOP: "DO",
    DZD: "DZ", ECS: "EC", EEK: "EE", EGP: "EG", ETB: "ET", EUR: "FR",
    FJD: "FJ", FKP: "FK", GBP: "GB", GEL: "GE", GGP: "GG", GHS: "GH",
    GIP: "GI", GMD: "GM", GNF: "GN", GTQ: "GT", GYD: "GY", HKD: "HK",
    HNL: "HN", HRK: "HR", HTG: "HT", HUF: "HU", IDR: "ID", ILS: "IL",
    INR: "IN", IQD: "IQ", IRR: "IR", ISK: "IS", JMD: "JM", JOD: "JO",
    JPY: "JP", KES: "KE", KGS: "KG", KHR: "KH", KMF: "KM", KPW: "KP",
    KRW: "KR", KWD: "KW", KYD: "KY", KZT: "KZ", LAK: "LA", LBP: "LB",
    LKR: "LK", LRD: "LR", LSL: "LS", LTL: "LT", LVL: "LV", LYD: "LY",
    MAD: "MA", MDL: "MD", MGA: "MG", MKD: "MK", MMK: "MM", MNT: "MN",
    MOP: "MO", MRO: "MR", MTL: "MT", MUR: "MU", MVR: "MV", MWK: "MW",
    MXN: "MX", MYR: "MY", MZN: "MZ", NAD: "NA", XPF: "NC", NGN: "NG",
    NIO: "NI", NPR: "NP", NZD: "NZ", OMR: "OM", PAB: "PA", PEN: "PE",
    PGK: "PG", PHP: "PH", PKR: "PK", PLN: "PL", PYG: "PY", QAR: "QA",
    RON: "RO", RSD: "RS", RUB: "RU", RWF: "RW", SAR: "SA", SBD: "SB",
    SCR: "SC", SDG: "SD", SEK: "SE", SGD: "SG", SKK: "SK", SLL: "SL",
    SOS: "SO", SRD: "SR", STD: "ST", SVC: "SV", SYP: "SY", SZL: "SZ",
    THB: "TH", TJS: "TJ", TMT: "TM", TND: "TN", TOP: "TO", TRY: "TR",
    TTD: "TT", TWD: "TW", TZS: "TZ", UAH: "UA", UGX: "UG", USD: "US",
    UYU: "UY", UZS: "UZ", VEF: "VE", VND: "VN", VUV: "VU", YER: "YE",
    ZAR: "ZA", ZMK: "ZM", ZWD: "ZW",
};

// let arr = []

const fetchExchangeRates = async () => {
    try {
        const response = await fetch(BASE_URL);
        const data = await response.json();
        return data.conversion_rates;
    } catch (error) {
        console.error('Error fetching exchange rates:', error);
    }
};

const populateDropdowns = () => {
    for (let select of dropdowns) {
        for (let code in countryList) {
            let newOption = document.createElement("option");
            newOption.innerText = code;
            newOption.value = code;
            if (select.name === "from" && code === "PKR") {
                newOption.selected = "selected";
            } else if (select.name === "to" && code === "USD") {
                newOption.selected = "selected";
            }
            select.append(newOption);
        }
        select.addEventListener("change", (evt) => {
            updateFlag(evt.target);
        });
    }
};

const updateFlag = (element) => {
    let countryCode = countryList[element.value];
    let image = element.parentElement.querySelector("img");
    image.src = `https://flagsapi.com/${countryCode}/shiny/64.png`;
};

const convertCurrency = async (amount, fromCurrency, toCurrency, rates) => {
    if (!rates) return;
    const fromRate = rates[fromCurrency];
    const toRate = rates[toCurrency];
    const convertedAmount = (amount / fromRate) * toRate;
    return convertedAmount;
};


const exch = document.querySelector("i")
exch.addEventListener("click", () => {
    const fromSelect = dropdowns[0];
    const toSelect = dropdowns[1];

    // Swap the selected values
    const tempValue = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = tempValue;

    // Update flags after swap
    updateFlag(fromSelect);
    updateFlag(toSelect);

    // Trigger conversion after swap
    form.dispatchEvent(new Event("submit"));
});
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const amount = parseFloat(amountInput.value);
    const fromCurrency = dropdowns[0].value;
    const toCurrency = dropdowns[1].value;
    const rates = await fetchExchangeRates();
    const convertedAmount = await convertCurrency(amount, fromCurrency, toCurrency, rates);
    resultDiv.innerText = `${amount} ${fromCurrency} = ${convertedAmount.toFixed(2)} ${toCurrency}`;
});

fetchExchangeRates().then(rates => {
    populateDropdowns();
    // exchange()
    console.log('Exchange Rates:', rates);
});
