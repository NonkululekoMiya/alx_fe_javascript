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
  
  // Function to show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
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
  
  