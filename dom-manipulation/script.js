// Array of quotes (each with text and category)
const quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Success is not in what you have, but who you are.", category: "Inspiration" },
  { text: "Do what you can with all you have, wherever you are.", category: "Wisdom" },
];

// Function to display a random quote using createElement and appendChild
function showRandomQuote() {
  const quoteDisplay = document.getElementById("quoteDisplay");
  quoteDisplay.innerHTML = ""; // Clear previous quote

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const quote = quotes[randomIndex];

  const quoteParagraph = document.createElement("p");
  const categoryStrong = document.createElement("strong");

  categoryStrong.textContent = quote.category + ": ";
  quoteParagraph.appendChild(categoryStrong);
  quoteParagraph.appendChild(document.createTextNode(quote.text));

  quoteDisplay.appendChild(quoteParagraph);
}

// Function to create the "Add Quote" form dynamically using DOM methods
function createAddQuoteForm() {
  const section = document.getElementById("addQuoteSection");

  const textInput = document.createElement("input");
  textInput.id = "newQuoteText";
  textInput.type = "text";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.id = "newQuoteCategory";
  categoryInput.type = "text";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.id = "addQuoteButton";
  addButton.textContent = "Add Quote";

  // Add event listener for button
  addButton.addEventListener("click", addQuote);

  // Append all elements
  section.appendChild(textInput);
  section.appendChild(categoryInput);
  section.appendChild(addButton);
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
