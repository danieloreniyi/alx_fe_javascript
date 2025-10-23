// ========== Task 3: Server Sync and Conflict Resolution ==========

// Fetch quotes from mock API (simulate server-side)
async function fetchQuotesFromServer() {
  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const data = await response.json();

    // Simulate server sending quotes as { text, category }
    const serverQuotes = data.slice(0, 3).map(post => ({
      text: post.title,
      category: "Server"
    }));

    return serverQuotes;
  } catch (error) {
    console.error("Error fetching from server:", error);
    return [];
  }
}

// Sync quotes between local storage and server data
async function syncQuotes() {
  const status = document.getElementById("syncStatus");
  status.textContent = "🔄 Syncing with server...";

  const serverQuotes = await fetchQuotesFromServer();
  const localQuotes = loadQuotes();

  // Conflict resolution: server data overrides local duplicates
  const combined = [...serverQuotes, ...localQuotes];
  const uniqueQuotes = Array.from(new Map(combined.map(q => [q.text, q])).values());

  localStorage.setItem("quotes", JSON.stringify(uniqueQuotes));
  quotes = uniqueQuotes;

  populateCategories();
  showRandomQuote();

  status.textContent = "✅ Sync complete! Quotes updated.";
}

// Optional: Simulate posting new quotes to server (mock)
async function postQuoteToServer(quote) {
  try {
    await fetch("https://jsonplaceholder.typicode.com/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quote)
    });
    console.log("Quote posted to server:", quote);
  } catch (error) {
    console.error("Failed to post to server:", error);
  }
}

// Periodically sync every 30 seconds
setInterval(syncQuotes, 30000);

// Manual sync trigger
document.getElementById("syncNow").addEventListener("click", syncQuotes);
