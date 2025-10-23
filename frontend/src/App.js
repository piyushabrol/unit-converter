import React, { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "http://localhost:5000/api";

// Number system conversion options
const numberSystems = [
  { value: "binToDec", label: "Binary → Decimal", placeholder: "Enter Binary Number" },
  { value: "decToBin", label: "Decimal → Binary", placeholder: "Enter Decimal Number" },
  { value: "octToDec", label: "Octal → Decimal", placeholder: "Enter Octal Number" },
  { value: "decToOct", label: "Decimal → Octal", placeholder: "Enter Decimal Number" },
  { value: "hexToDec", label: "Hexadecimal → Decimal", placeholder: "Enter Hexadecimal Number" },
  { value: "decToHex", label: "Decimal → Hexadecimal", placeholder: "Enter Decimal Number" },
  { value: "binToHex", label: "Binary → Hexadecimal", placeholder: "Enter Binary Number" },
  { value: "hexToBin", label: "Hexadecimal → Binary", placeholder: "Enter Hexadecimal Number" }
];

// Distance/length options
const distanceUnits = [
  { value: "mToKm", label: "Meters → Kilometers", placeholder: "Enter Meters" },
  { value: "kmToM", label: "Kilometers → Meters", placeholder: "Enter Kilometers" },
  { value: "cmToM", label: "Centimeters → Meters", placeholder: "Enter Centimeters" },
  { value: "mToCm", label: "Meters → Centimeters", placeholder: "Enter Meters" },
  { value: "mmToM", label: "Millimeters → Meters", placeholder: "Enter Millimeters" },
  { value: "mToMm", label: "Meters → Millimeters", placeholder: "Enter Meters" },
  { value: "mileToKm", label: "Miles → Kilometers", placeholder: "Enter Miles" },
  { value: "kmToMile", label: "Kilometers → Miles", placeholder: "Enter Kilometers" },
  { value: "yardToM", label: "Yards → Meters", placeholder: "Enter Yards" },
  { value: "mToYard", label: "Meters → Yards", placeholder: "Enter Meters" },
  { value: "feetToM", label: "Feet → Meters", placeholder: "Enter Feet" },
  { value: "mToFeet", label: "Meters → Feet", placeholder: "Enter Meters" },
  { value: "inchToCm", label: "Inches → Centimeters", placeholder: "Enter Inches" },
  { value: "cmToInch", label: "Centimeters → Inches", placeholder: "Enter Centimeters" }
];

const conversions = {
  numberSystems: {
    binToDec: v => parseInt(v, 2).toString(),
    decToBin: v => parseInt(v, 10).toString(2),
    octToDec: v => parseInt(v, 8).toString(),
    decToOct: v => parseInt(v, 10).toString(8),
    hexToDec: v => parseInt(v, 16).toString(),
    decToHex: v => parseInt(v, 10).toString(16).toUpperCase(),
    binToHex: v => parseInt(v, 2).toString(16).toUpperCase(),
    hexToBin: v => parseInt(v, 16).toString(2)
  },
  distance: {
    mToKm: v => (parseFloat(v)/1000).toString(),
    kmToM: v => (parseFloat(v)*1000).toString(),
    cmToM: v => (parseFloat(v)/100).toString(),
    mToCm: v => (parseFloat(v)*100).toString(),
    mmToM: v => (parseFloat(v)/1000).toString(),
    mToMm: v => (parseFloat(v)*1000).toString(),
    mileToKm: v => (parseFloat(v)*1.60934).toString(),
    kmToMile: v => (parseFloat(v)/1.60934).toString(),
    yardToM: v => (parseFloat(v)*0.9144).toString(),
    mToYard: v => (parseFloat(v)/0.9144).toString(),
    feetToM: v => (parseFloat(v)*0.3048).toString(),
    mToFeet: v => (parseFloat(v)/0.3048).toString(),
    inchToCm: v => (parseFloat(v)*2.54).toString(),
    cmToInch: v => (parseFloat(v)/2.54).toString()
  }
};

const inputFilters = {
  binToDec: /^[0-1]*$/,
  decToBin: /^[0-9]*$/,
  octToDec: /^[0-7]*$/,
  decToOct: /^[0-9]*$/,
  hexToDec: /^[0-9a-fA-F]*$/,
  decToHex: /^[0-9]*$/,
  binToHex: /^[0-1]*$/,
  hexToBin: /^[0-9a-fA-F]*$/,
  mToKm: /^[0-9]*\.?[0-9]*$/,
  kmToM: /^[0-9]*\.?[0-9]*$/,
  cmToM: /^[0-9]*\.?[0-9]*$/,
  mToCm: /^[0-9]*\.?[0-9]*$/,
  mmToM: /^[0-9]*\.?[0-9]*$/,
  mToMm: /^[0-9]*\.?[0-9]*$/,
  mileToKm: /^[0-9]*\.?[0-9]*$/,
  kmToMile: /^[0-9]*\.?[0-9]*$/,
  yardToM: /^[0-9]*\.?[0-9]*$/,
  mToYard: /^[0-9]*\.?[0-9]*$/,
  feetToM: /^[0-9]*\.?[0-9]*$/,
  mToFeet: /^[0-9]*\.?[0-9]*$/,
  inchToCm: /^[0-9]*\.?[0-9]*$/,
  cmToInch: /^[0-9]*\.?[0-9]*$/
};

function App() {
  const [category, setCategory] = useState("numberSystems");
  const [type, setType] = useState("binToDec");
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const currentOptions = category === "numberSystems" ? numberSystems : distanceUnits;
  const currentPlaceholder = currentOptions.find(c => c.value === type)?.placeholder || "";

  useEffect(() => {
    axios.get(`${BASE_URL}/history`).then(res => setHistory(res.data));
  }, []);

  const handleConvert = async () => {
    if (!inputValue) return;
    const resValue = conversions[category][type](inputValue);
    setResult(resValue);

    const newEntry = {
      category,
      fromType: type,
      toType: type,
      fromValue: inputValue,
      result: resValue,
      steps: []
    };

    await axios.post(`${BASE_URL}/history`, newEntry);
    const updatedHistory = await axios.get(`${BASE_URL}/history`);
    setHistory(updatedHistory.data);
  };

  const handleInputChange = e => {
    const value = e.target.value;
    if (inputFilters[type].test(value)) setInputValue(value);
  };

  const deleteHistory = async id => {
    await axios.delete(`${BASE_URL}/history/${id}`);
    setHistory(history.filter(h => h._id !== id));
  };

  const deleteAllHistory = async () => {
    await axios.delete(`${BASE_URL}/history`);
    setHistory([]);
  };

  return (
    <div className="app">
      <h1>Unit Converter</h1>

      <div className="form-group">
        <label>Category</label>
        <select value={category} onChange={e => {
          setCategory(e.target.value);
          const firstValue = (e.target.value === "numberSystems" ? numberSystems[0] : distanceUnits[0]).value;
          setType(firstValue);
          setInputValue("");
          setResult("");
        }}>
          <option value="numberSystems">Number Systems</option>
          <option value="distance">Distance / Length</option>
        </select>
      </div>

      <div className="form-group">
        <label>Conversion Type</label>
        <select value={type} onChange={e => { setType(e.target.value); setInputValue(""); setResult(""); }}>
          {currentOptions.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
        </select>
      </div>

      <div className="form-group">
        <label>Input Value</label>
        <input type="text" value={inputValue} placeholder={currentPlaceholder} onChange={handleInputChange} />
      </div>

      <button className="convert-btn" onClick={handleConvert}>Convert</button>

      {result && <div className="result">Result: {result}</div>}

      <div className="history-section">
        <button className="show-history-btn" onClick={() => setShowHistory(!showHistory)}>
          {showHistory ? "Hide History" : "Show History"} ({history.length})
        </button>

        {showHistory && (
          <div className="history">
            <button className="delete-all-btn" onClick={deleteAllHistory}>Delete All</button>
            {history.map(h => (
              <div key={h._id} className="history-item">
                {h.fromValue} → {h.result} ({h.category === "numberSystems" ? "Number System" : "Distance / Length"})
                <button className="delete-btn" onClick={() => deleteHistory(h._id)}>X</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
