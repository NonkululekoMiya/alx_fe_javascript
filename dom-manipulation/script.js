// Initial quotes array, loaded from local storage if available
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Life" },
    { text: "To handle yourself, use your head; to handle others, use your heart.", category: "Wisdom" }
  ];
  
  // Function to save quotes to local storage
  function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
  }

  // Function to load quotes from local storage
function loadQuotes() {
  const savedQuotes = JSON.parse(localStorage.getItem('quotes'));
  if (savedQuotes) {
    quotes = savedQuotes;
  }
}

// Function to populate category dropdown
function populateCategories() {
  const categories = [...new Set(quotes.map(quote => quote.category))];
  const categoryFilter = document.getElementById('categoryFilter');
  const categorySelect = document.getElementById('categorySelect');
  
  categoryFilter.innerHTML = '<option value="All">All Categories</option>';
  categorySelect.innerHTML = '<option value="All">All</option>';
  
  categories.forEach(category => {
    const optionFilter = document.createElement('option');
    optionFilter.value = category;
    optionFilter.textContent = category;
    categoryFilter.appendChild(optionFilter);

    const optionSelect = document.createElement('option');
    optionSelect.value = category;
    optionSelect.textContent = category;
    categorySelect.appendChild(optionSelect);
  });
}
  
 // Function to show a random quote
function showRandomQuote() {
  const selectedCategory = document.getElementById('categorySelect').value;
  const filteredQuotes = selectedCategory === "All" ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  if (filteredQuotes.length === 0) {
    alert('No quotes available for the selected category.');
    return;
  }
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = `<p>${quote.text}</p><p><em>Category: ${quote.category}</em></p>`;
    // Save last viewed quote to session storage
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
  }  
  
  // Function to add a new quote
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    if (newQuoteText && newQuoteCategory) {
      quotes.push({ text: newQuoteText, category: newQuoteCategory });
      document.getElementById('newQuoteText').value = '';
      document.getElementById('newQuoteCategory').value = '';
      saveQuotes();
      alert('Quote added successfully!');
    } else {
      alert('Please enter both quote text and category.');
    }
  }
  
  // Initial setup
loadQuotes();
populateCategories();
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
showRandomQuote();

  // Function to export quotes to JSON
  function exportToJsonFile() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
  
  // Function to import quotes from JSON file
  function importFromJsonFile(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(event) {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      alert('Quotes imported successfully!');
    };
    fileReader.readAsText(event.target.files[0]);
  }
  
  // Event listener for showing a new quote
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  // Initial call to display a quote, loading last viewed quote if available
  const lastViewedQuote = JSON.parse(sessionStorage.getItem('lastViewedQuote'));
  if (lastViewedQuote) {
    document.getElementById('quoteDisplay').innerHTML = `<p>${lastViewedQuote.text}</p><p><em>Category: ${lastViewedQuote.category}</em></p>`;
  } else {
    showRandomQuote();
  }

// Function to filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  const filteredQuotes = selectedCategory === "All" ? quotes : quotes.filter(quote => quote.category === selectedCategory);
  const quoteDisplay = document.getElementById('quoteDisplay');
  quoteDisplay.innerHTML = '';
  filteredQuotes.forEach(quote => {
    const quoteElement = document.createElement('div');
    quoteElement.innerHTML = `<p>${quote.text}</p><p><em>Category: ${quote.category}</em></p>`;
    quoteDisplay.appendChild(quoteElement);
  });
  // Save last selected category to local storage
  localStorage.setItem('selectedCategory', selectedCategory);
}

// Restore last selected category filter
const selectedCategory = localStorage.getItem('selectedCategory');
if (selectedCategory) {
  document.getElementById('categoryFilter').value = selectedCategory;
  filterQuotes();
}

// Simulate server URL using JSONPlaceholder
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();
    resolveConflicts(serverQuotes);
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
  }
}

// Function to resolve conflicts between local and server data
function resolveConflicts(serverQuotes) {
  let conflictResolved = false;
  const serverQuotesMap = new Map(serverQuotes.map(q => [q.id, q]));

  quotes.forEach((quote, index) => {
    if (serverQuotesMap.has(quote.id)) {
      quotes[index] = serverQuotesMap.get(quote.id);
      conflictResolved = true;
    }
  });
  if (conflictResolved) {
    saveQuotes();
    notifyUser('Conflicts resolved with server data.');
  }
}

// Function to notify user of updates
function notifyUser(message) {
  const notification = document.getElementById('notification');
  notification.textContent = message;
  setTimeout(() => {
    notification.textContent = '';
  }, 5000);
}

// Initial setup
loadQuotes();
populateCategories();
document.getElementById('newQuote').addEventListener('click', showRandomQuote);
fetchQuotesFromServer();
setInterval(fetchQuotesFromServer, 60000); // Periodically fetch quotes every 60 seconds
