// ========== Task 3: Server Sync and Conflict Resolution ==========

// Simulate syncing with a mock server
async function syncWithServer() {
  const status = document.getElementById("syncStatus");
  status.textContent = "🔄 Syncing with server...";

  try {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    const serverData = await response.json();

    // Simulate server sending new quotes
    const serverQuotes = serverData.slice(0, 3).map(post => ({
      text: post.title,
      category: "Server"
    }));

    // Conflict resolution: server data overrides local duplicates
    const localQuotes = loadQuotes();
    const combined = [...serverQuotes, ...localQuotes];
    const uniqueQuotes = Array.from(
      new Map(combined.map(q => [q.text, q])).values()
    );

    localStorage.setItem("quotes", JSON.stringify(uniqueQuotes));
    quotes = uniqueQuotes;

    populateCategories();
    showRandomQuote();

    status.textContent = "✅ Sync complete! Quotes updated.";
  } catch (error) {
    status.textContent = "❌ Sync failed. Try again.";
    console.error("Sync error:", error);
  }
}

// Automatically sync every 20 seconds
setInterval(syncWithServer, 20000);

// Add event listener for manual sync
document.getElementById("syncNow").addEventListener("click", syncWithServer);
