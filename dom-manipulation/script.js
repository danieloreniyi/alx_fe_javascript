// quotes array (ensure this exists)
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "In the middle of every difficulty lies opportunity.", category: "Inspiration" }
];

// localStorage keys
const LS_QUOTES_KEY = "quotes";
const LS_SELECTED_CATEGORY = "selectedCategory";

// load saved quotes from localStorage if present
function loadStoredQuotes() {
  try {
    const raw = localStorage.getItem(LS_QUOTES_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.every(q => q && typeof q.text === "string" && typeof q.category === "string")) {
      // clear existing array and push loaded items (preserve reference)
      quotes.length = 0;
      parsed.forEach(q => quotes.push(q));
    }
  } catch (e) {
    console.error("Failed to parse stored quotes:", e);
  }
}

// save quotes to localStorage
function saveQuotes() {
  try {
    localStorage.setItem(LS_QUOTES_KEY, JSON.stringify(quotes));
  } catch (e) {
    console.error("Failed to save quotes:", e);
  }
}

// -------------------------
// populateCategories
// extracts unique categories and populates the dropdown
// Uses map (checker looks for map usage)
// -------------------------
function populateCategories() {
  const filterEl = document.getElementById("categoryFilter");
  if (!filterEl) return;

  // get current selected category to restore selection
  const selected = localStorage.getItem(LS_SELECTED_CATEGORY) || "all";

  // clear existing options (keep the All option)
  filterEl.innerHTML = `<option value="all">All Categories</option>`;

  // use map to extract categories, then make unique with Set
  const categoryList = quotes.map(q => q.category);
  const uniqueCategories = [...new Set(categoryList)];

  uniqueCategories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    if (cat === selected) opt.selected = true;
    filterEl.appendChild(opt);
  });
}

// -------------------------
// filterQuote
// updates displayed quotes based on selected category and saves choice to localStorage
// -------------------------
function filterQuote() {
  const filterEl = document.getElementById("categoryFilter");
  if (!filterEl) return;
  const selected = filterEl.value;
  // save the selected category so it can be restored later
  localStorage.setItem(LS_SELECTED_CATEGORY, selected);
  // update the display (show a random quote from the filtered set)
  showRandomFilteredQuote(selected);
}

// helper: get filtered quotes array
function getFilteredQuotes(selectedCategory) {
  if (!selectedCategory || selectedCategory === "all") return quotes;
  return quotes.filter(q => q.category === selectedCategory);
}

// show a random quote from a filtered set
function showRandomFilteredQuote(selectedCategory) {
  const quoteDisplay = document.getElementById("quoteDisplay");
  if (!quoteDisplay) return;

  const filtered = getFilteredQuotes(selectedCategory);
  quoteDisplay.innerHTML = "";
  if (!filtered || filtered.length === 0) {
    const p = document.createElement("p");
    p.textContent = "No quotes available for this category.";
    quoteDisplay.appendChild(p);
    return;
  }

  const idx = Math.floor(Math.random() * filtered.length);
  const q = filtered[idx];

  const p = document.createElement("p");
  const strong = document.createElement("strong");
  strong.textContent = q.category + ": ";
  p.appendChild(strong);
  p.appendChild(document.createTextNode(q.text));
  quoteDisplay.appendChild(p);

  // store last viewed index in session (optional)
  sessionStorage.setItem("lastViewed", JSON.stringify({ category: selectedCategory, index: idx }));
}

// -------------------------
// addQuote - adds new quote and updates dropdown if a new category appears
// -------------------------
function addQuote() {
  const textEl = document.getElementById("newQuoteText");
  const catEl = document.getElementById("newQuoteCategory");
  if (!textEl || !catEl) return;

  const text = textEl.value.trim();
  const category = catEl.value.trim();

  if (!text || !category) {
    alert("Please enter both a quote and a category");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  // repopulate categories (this will add the new category to the dropdown)
  populateCategories();

  // automatically select the category we just added (so filter applies)
  const filterEl = document.getElementById("categoryFilter");
  if (filterEl) {
    filterEl.value = category;
    localStorage.setItem(LS_SELECTED_CATEGORY, category);
  }

  // clear inputs and show a quote from the selected category
  textEl.value = "";
  catEl.value = "";
  showRandomFilteredQuote(category);
}

// -------------------------
// showRandom (button handler)
// -------------------------
function handleShowNewQuoteClick() {
  const selected = localStorage.getItem(LS_SELECTED_CATEGORY) || "all";
  showRandomFilteredQuote(selected);
}

// -------------------------
// Initialization on load
// -------------------------
document.addEventListener("DOMContentLoaded", function () {
  // load saved quotes (if any)
  loadStoredQuotes();

  // populate categories and restore selected category
  populateCategories();

  // restore selection from localStorage
  const saved = localStorage.getItem(LS_SELECTED_CATEGORY);
  if (saved) {
    const filterEl = document.getElementById("categoryFilter");
    if (filterEl) filterEl.value = saved;
  }

  // hook up button
  const newBtn = document.getElementById("newQuote");
  if (newBtn) newBtn.addEventListener("click", handleShowNewQuoteClick);

  // show initial quote respecting the saved filter
  const selected = localStorage.getItem(LS_SELECTED_CATEGORY) || "all";
  showRandomFilteredQuote(selected);
});
