document.addEventListener("DOMContentLoaded", () => {
    const quoteList = document.getElementById("quote-list");
    const newQuoteForm = document.getElementById("new-quote-form");
  
    // Load quotes on page load
    loadQuotes();
  
    // Function to load quotes
    function loadQuotes() {
      fetch("http://localhost:3000/quotes?_embed=likes")
        .then(response => response.json())
        .then(quotes => renderQuotes(quotes))
        .catch(error => console.error("Error loading quotes:", error));
    }
  
    // Function to render quotes in list
    function renderQuotes(quotes) {
      quoteList.innerHTML = ""; // Clear previous content
      quotes.forEach(quote => {
        const li = document.createElement("li");
        li.className = "quote-card";
        li.innerHTML = `
          <blockquote class="blockquote">
            <p class="mb-0">${quote.quote}</p>
            <footer class="blockquote-footer">${quote.author}</footer>
            <br>
            <button class="btn-success like-btn">Likes: <span>${quote.likes.length}</span></button>
            <button class="btn-danger delete-btn">Delete</button>
          </blockquote>
        `;
        const likeButton = li.querySelector(".like-btn");
        const deleteButton = li.querySelector(".delete-btn");
        likeButton.addEventListener("click", () => likeQuote(quote));
        deleteButton.addEventListener("click", () => deleteQuote(quote));
        quoteList.appendChild(li);
      });
    }
  
    // Function to handle form submission
    newQuoteForm.addEventListener("submit", event => {
      event.preventDefault();
      const quoteInput = document.getElementById("quote");
      const authorInput = document.getElementById("author");
      const quote = quoteInput.value;
      const author = authorInput.value;
      if (quote && author) {
        addQuote({ quote, author });
        quoteInput.value = "";
        authorInput.value = "";
      } else {
        alert("Please enter both quote and author");
      }
    });
  
    // Function to add new quote
    function addQuote(newQuote) {
      fetch("http://localhost:3000/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify(newQuote)
      })
      .then(response => response.json())
      .then(() => loadQuotes())
      .catch(error => console.error("Error adding quote:", error));
    }
  
    // Function to delete quote
    function deleteQuote(quote) {
      fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: "DELETE"
      })
      .then(() => loadQuotes())
      .catch(error => console.error("Error deleting quote:", error));
    }
  
    // Function to like/unlike quote
    function likeQuote(quote) {
      const userId = 1; // Replace with actual user ID
      const userLiked = quote.likes.some(user => user.id === userId);
      const updatedLikes = userLiked ? quote.likes.filter(user => user.id !== userId) : [...quote.likes, { id: userId }];
      fetch(`http://localhost:3000/quotes/${quote.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        },
        body: JSON.stringify({ likes: updatedLikes })
      })
      .then(() => loadQuotes())
      .catch(error => console.error("Error updating likes:", error));
    }
  });
  