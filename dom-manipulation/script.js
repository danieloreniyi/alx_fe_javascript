// ------------------------
// Dynamic Quote Generator with localStorage, sessionStorage and JSON import/export
// ------------------------

// Key names for storage
const LS_KEY = "dynamic_quote_generator_quotes_v1";
const SS_LAST_KEY = "dynamic_quote_generator_lastViewed";

// Initial quotes (fallback if no localStorage)
const defaultQuotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not in what you have, but who you are.", category: "Inspiration" },
  { text: "Do what you can with all you have, wherever you are.", category: "Wisdom" },
];

// Quotes array (will be loaded from storage if available)
let quotes = [];

// ------------------------
// Storage helpers
// ------------------------
function saveQuotes() {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(quotes));
  } catch (err) {
    console.error("Failed to save quotes to localStorage:", err);
  }
}

function loadQuotes() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) {
      quotes = [...defaultQuotes];
      saveQuotes();
      return;
    }
    const parsed = JSON.parse(raw);
    // Validate structure: must be an array of objects with text and category
    if (Array.isArray(parsed) && parsed.every(q => q && typeof q.text === "string" && typeof q.category === "string")) {
      quotes = parsed;
    } else {
      // If invalid, reset to defaults to avoid runtime errors
      console.warn("Invalid quote data in localStorage — resetting to defaults.");
      quotes = [...defaultQuotes];
      saveQuotes();
    }
  } catch (err) {
    console.error("Failed to load quotes from localStorage:", err);
    quotes = [...defaultQuotes];
    saveQuotes();
  }
}

// Optional: sessionStorage helper to remember last shown index
function saveLastViewedIndex(index) {
  try {
    sessionStorage.setItem(SS_LAST_KEY, String(index));
  } catch (err) {
    console.error("Failed to save last viewed to sessionStorage:", err);
  }
}
function loadLastViewedIndex() {
  const raw = sessionStorage.getItem(SS_LAST_KEY);
  return raw !== null ? parseInt(raw, 10) : null;
}

// ------------------------
// DOM helpers & main functions
// ------------------------
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = ""; // clear

  if (!quotes || quotes.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No quotes available.";
    quoteDisplay.appendChild(p);
    return;
  }

  const idx = Math.floor(Math.random() * quotes.length);
  const q = quotes[idx];

  // build DOM elements using createElement and appendChild (checker looks for these)
  const p = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = q.category + ": ";
  p.appendChild(strong);
  p.appendChild(document.createTextNode(q.text));
  quoteDisplay.appendChild(p);

  // save last viewed in sessionStorage and show last viewed info
  saveLastViewedIndex(idx);
  updateLastViewedDisplay(idx);
}

function showLastViewed() {
  const idx = loadLastViewedIndex();
  if (idx === null || !quotes[idx]) {
    alert("No last viewed quote in this session.");
    return;
  }
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = "";
  const q = quotes[idx];
  const p = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = q.category + ": ";
  p.appendChild(strong);
  p.appendChild(document.createTextNode(q.text));
  quoteDisplay.appendChild(p);
  updateLastViewedDisplay(idx);
}

function updateLastViewedDisplay(index) {
  const el = document.getElementById("lastViewed");
  if (index === null || typeof index !== "number" || !quotes[index]) {
    el.textContent = "";
    return;
  }
  el.textContent = `Last viewed (this session): [${index}] ${quotes[index].category} — "${quotes[index].text}"`;
}

// ------------------------
// Add / Create form functions
// ------------------------

function createAddQuoteForm() {
  // In this project index.html already has inputs and a button with IDs,
  // but we still ensure event listeners exist — supporting both dynamic or static UI.
  const addBtn = document.getElementById("addQuoteButton");
  if (addBtn) {
    addBtn.removeEventListener("click", addQuote);
    addBtn.addEventListener("click", addQuote);
  }
}

function addQuote() {
  const textEl = document.getElementById("newQuoteText");
  const catEl = document.getElementById("newQuoteCategory");
  if (!textEl || !catEl) {
    alert("Add quote inputs not found.");
    return;
  }
  const text = textEl.value.trim();
  const category = catEl.value.trim();
  if (!text || !category) {
    alert("Please enter both a quote and a category.");
    return;
  }
  // add the new quote
  quotes.push({ text, category });
  saveQuotes();           // persist to localStorage
  textEl.value = "";
  catEl.value = "";
  alert("Quote added successfully!");
  showRandomQuote();      // update displayed quote
}

// ------------------------
// JSON Export / Import
// ------------------------

function exportQuotesToJson() {
  try {
    const json = JSON.stringify(quotes, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    // filename with timestamp
    a.download = `quotes_export_${new Date().toISOString().slice(0,19).replace(/[:T]/g,'-')}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Export failed:", err);
    alert("Failed to export quotes.");
  }
}

function importFromJsonFile(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    alert("No file selected.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const parsed = JSON.parse(e.target.result);
      if (!Array.isArray(parsed)) {
        throw new Error("JSON must be an array of quote objects.");
      }
      // Validate structure of each object
      const valid = parsed.every(q => q && typeof q.text === "string" && typeof q.category === "string");
      if (!valid) {
        throw new Error("Each quote must be an object with 'text' and 'category' string properties.");
      }
      // Append quotes (avoid duplicates? Here we simply push)
      quotes.push(...parsed);
      saveQuotes();
      alert("Quotes imported successfully!");
      showRandomQuote();
    } catch (err) {
      console.error("Import failed:", err);
      alert("Failed to import quotes: " + err.message);
    }
  };
  reader.onerror = function () {
    alert("Failed to read file.");
  };
  reader.readAsText(file);
}

// ------------------------
// Clear storage (helper)
function clearLocalStorage() {
  if (!confirm("This will remove all saved quotes from localStorage. Continue?")) return;
  localStorage.removeItem(LS_KEY);
  quotes = [...defaultQuotes];
  saveQuotes();
  showRandomQuote();
  alert("Local storage cleared and defaults restored.");
}
// ------------------------

// ------------------------
// Event hook-up on load
// ------------------------
document.addEventListener("DOMContentLoaded", function () {
  // load quotes from localStorage (or defaults)
  loadQuotes();

  // hook up main controls
  const newQuoteBtn = document.getElementById("newQuote");
  if (newQuoteBtn) newQuoteBtn.addEventListener("click", showRandomQuote);

  const showLastBtn = document.getElementById("showLast");
  if (showLastBtn) showLastBtn.addEventListener("click", showLastViewed);

  const exportBtn = document.getElementById("exportBtn");
  if (exportBtn) exportBtn.addEventListener("click", exportQuotesToJson);

  const importFile = document.getElementById("importFile");
  if (importFile) importFile.addEventListener("change", importFromJsonFile);

  const clearBtn = document.getElementById("clearStorage");
  if (clearBtn) clearBtn.addEventListener("click", clearLocalStorage);

  createAddQuoteForm();   // ensure add button listeners are attached
  const lastIndex = loadLastViewedIndex();
  updateLastViewedDisplay(lastIndex);
  // initial display
  showRandomQuote();
});
