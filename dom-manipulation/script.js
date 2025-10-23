// ====== Initial Quotes ======
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Don’t let yesterday take up too much of today.", category: "Inspiration" },
  { text: "It’s not whether you get knocked down, it’s whether you get up.", category: "Perseverance" }
];

// ====== Display Random Quote ======
function displayRandomQuote() {
  const displayArea = document.getElementById("quoteDisplay");
  if (quotes.length === 0) {
    displayArea.innerHTML = "<p>No quotes available.</p>";
    return;
  }
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
  displayArea.innerHTML = `
    <p>${randomQuote.text}</p>
    <p><em>Category: ${randomQuote.category}</em></p>
  `;

  // Store last viewed quote (Session Storage)
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// ====== Save Quotes to Local Storage ======
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ====== Add New Quote ======
function addQuote() {
  const textInput = document.getElementById("quoteText");
  const categoryInput = document.getElementById("quoteCategory");
  const text = textInput.value.trim();
  const category = categoryInput.value.trim();

  if (!text || !category) {
    alert("Please provide both quote text and category.");
    return;
  }

  quotes.push({ text, category });
  saveQuotes();
  populateCategories();
  displayRandomQuote();

  textInput.value = "";
  categoryInput.value = "";
}

// ====== Export Quotes to JSON File ======
document.getElementById("exportBtn").addEventListener("click", () => {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
});

// ====== Import Quotes from JSON File ======
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const importedQuotes = JSON.parse(e.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert("Quotes imported successfully!");
  };
  fileReader.readAsText(event.target.files[0]);
}

// ====== Populate Categories Dropdown ======
function populateCategories() {
  const categorySelect = document.getElementById("categoryFilter");
  if (!categorySelect) return;

  // Extract unique categories using map
  const categories = [...new Set(quotes.map(q => q.category))];

  // Clear and repopulate dropdown
  categorySelect.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  // Restore saved filter (if any)
  const savedCategory = localStorage.getItem("selectedCategory");
  if (savedCategory) {
    categorySelect.value = savedCategory;
    filterQuotes();
  }
}

// ====== Filter Quotes by Selected Category ======
function filterQuotes() {
  const categorySelect = document.getElementById("categoryFilter");
  const selectedCategory = categorySelect.value;
  localStorage.setItem("selectedCategory", selectedCategory);

  const displayArea = document.getElementById("quoteDisplay");
  const filteredQuotes = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length > 0) {
    const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    displayArea.innerHTML = `
      <p>${randomQuote.text}</p>
      <p><em>Category: ${randomQuote.category}</em></p>
    `;
  } else {
    displayArea.innerHTML = "<p>No quotes available for this category.</p>";
  }
}

// ====== Event Listeners ======
document.getElementById("newQuoteBtn").addEventListener("click", displayRandomQuote);
document.getElementById("addQuoteBtn").addEventListener("click", addQuote);

// ====== On Page Load ======
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();

  // Restore last viewed quote from sessionStorage
  const lastQuote = sessionStorage.getItem("lastQuote");
  if (lastQuote) {
    const quote = JSON.parse(lastQuote);
    const displayArea = document.getElementById("quoteDisplay");
    displayArea.innerHTML = `
      <p>${quote.text}</p>
      <p><em>Category: ${quote.category}</em></p>
    `;
  }
});
