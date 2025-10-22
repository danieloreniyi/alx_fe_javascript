// Quotes array
const quotes = [
  { text: "The future depends on what you do today.", category: "Motivation" },
  { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Inspiration" },
  { text: "Code is like humor. When you have to explain it, it’s bad.", category: "Programming" }
];

// Get DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");

// Function to display a random quote
function displayRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Update DOM
  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <em>${randomQuote.category}</em>
  `;
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText && quoteCategory) {
    quotes.push({ text: quoteText, category: quoteCategory });
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    displayRandomQuote(); // Show new quote immediately
  } else {
    alert("Please fill in both fields!");
  }
}

// Event listeners
newQuoteBtn.addEventListener("click", displayRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

// Display first quote when page loads
displayRandomQuote();
