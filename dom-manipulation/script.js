// Array of quotes (each with text and category)
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not in what you have, but who you are.", category: "Inspiration" },
  { text: "Do what you can with all you have, wherever you are.", category: "Wisdom" },
];

// Function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];
  quoteDisplay.innerHTML = `
    <p><strong>${quote.category}</strong>: ${quote.text}</p>
  `;
}

// Function to create the "Add Quote" form dynamically
function createAddQuoteForm() {
  const section = document.getElementById("addQuoteSection");
  section.innerHTML = `
    <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
    <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
    <button id="addQuoteButton">Add Quote</button>
  `;

  // Attach event listener to add quote button
  document
    .getElementById("addQuoteButton")
    .addEventListener("click", addQuote);
}

// Function to add a new quote
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    quotes.push({ text, category });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    alert("New quote added successfully!");
    showRandomQuote();
  } else {
    alert("Please fill in both fields before adding a quote.");
  }
}

// Event listener for showing a new quote
document
  .getElementById("newQuote")
  .addEventListener("click", showRandomQuote);

// Initialize the app
showRandomQuote();
createAddQuoteForm();
