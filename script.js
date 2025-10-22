// quotes array with text and category properties
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you’re busy making other plans.", category: "Life" },
  { text: "Success is not in what you have, but who you are.", category: "Success" }
];

// function to display a random quote
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p><strong>Category:</strong> ${randomQuote.category}</p>
    <p>"${randomQuote.text}"</p>
  `;
}

// function to add a new quote
function addQuote() {
  const newText = document.getElementById("newQuoteText").value.trim();
  const newCategory = document.getElementById("newQuoteCategory").value.trim();

  if (newText && newCategory) {
    const newQuote = { text: newText, category: newCategory };
    quotes.push(newQuote);
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
    showRandomQuote(); // update display with the new quote
  } else {
    alert("Please enter both quote text and category.");
  }
}

// event listener for the Show New Quote button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);

// display a random quote when the page loads
showRandomQuote();
