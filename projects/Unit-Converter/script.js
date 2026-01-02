const typeSelect = document.getElementById("type");
const inputValue = document.getElementById("inputValue");
const fromUnit = document.getElementById("fromUnit");
const toUnit = document.getElementById("toUnit");
const result = document.getElementById("result");

const units = {
    length: {
        meter: 1,
        kilometer: 1000,
        centimeter: 0.01,
        millimeter: 0.001,
        mile: 1609.34,
        yard: 0.9144,
        foot: 0.3048,
        inch: 0.0254
    },
    weight: {
        gram: 1,
        kilogram: 1000,
        pound: 453.592,
        ounce: 28.3495
    },
    temperature: ["celsius", "fahrenheit", "kelvin"]
};

function populateUnits() {
    fromUnit.innerHTML = "";
    toUnit.innerHTML = "";

    const type = typeSelect.value;

    if (type === "temperature") {
        units.temperature.forEach(unit => {
            fromUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
            toUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
        });
    } else {
        Object.keys(units[type]).forEach(unit => {
            fromUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
            toUnit.innerHTML += `<option value="${unit}">${unit}</option>`;
        });
    }

    convert();
}

function convert() {
    const value = parseFloat(inputValue.value);
    if (isNaN(value)) {
        result.textContent = "Result";
        return;
    }

    const type = typeSelect.value;
    const from = fromUnit.value;
    const to = toUnit.value;

    let output;

    if (type === "temperature") {
        output = convertTemperature(value, from, to);
    } else {
        const baseValue = value * units[type][from];
        output = baseValue / units[type][to];
    }

    result.textContent = `${value} ${from} = ${output.toFixed(4)} ${to}`;
}

function convertTemperature(value, from, to) {
    let celsius;

    if (from === "celsius") celsius = value;
    if (from === "fahrenheit") celsius = (value - 32) * 5 / 9;
    if (from === "kelvin") celsius = value - 273.15;

    if (to === "celsius") return celsius;
    if (to === "fahrenheit") return (celsius * 9 / 5) + 32;
    if (to === "kelvin") return celsius + 273.15;
}

typeSelect.addEventListener("change", populateUnits);
inputValue.addEventListener("input", convert);
fromUnit.addEventListener("change", convert);
toUnit.addEventListener("change", convert);

populateUnits();
