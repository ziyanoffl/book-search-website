function searchBooks() {
  const bookName = document.getElementById("bookName").value;
  const apiUrl = `https://openlibrary.org/search.json?q=${bookName}`;
  const loadingSpinner = document.querySelector(".loading-spinner");

  showLoadingSpinner(loadingSpinner);

  fetch(apiUrl)
    .then(handleResponse)
    .then(displayResults)
    .catch(handleError)
    .finally(() => hideLoadingSpinner(loadingSpinner));
}

function displayResults(data) {
  const books = data.docs;
  const resultsDiv = document.getElementById("results");
  resultsDiv.innerHTML = "";

  books.slice(0, 5).forEach((book) => {
    const { title, author_name: author, cover_i: coverId } = book;
    const coverUrl = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;

    const bookElement = createBookElement(title, author, coverUrl);
    resultsDiv.appendChild(bookElement);
  });

  if (books.length > 5) {
    const paginationElement = createPaginationElement();
    resultsDiv.appendChild(paginationElement);
  }
}

function createBookElement(title, author, coverUrl) {
  const bookElement = document.createElement("div");
  bookElement.classList.add(
    "col",
    "d-flex",
    "justify-content-center",
    "align-items-center",
    "mx-auto"
  );

  const cardElement = document.createElement("div");
  cardElement.classList.add("card");

  const imageElement = document.createElement("img");
  imageElement.src = coverUrl;
  imageElement.classList.add("card-img-top");

  const cardBodyElement = document.createElement("div");
  cardBodyElement.classList.add("card-body");

  const titleElement = document.createElement("h5");
  titleElement.classList.add("card-title");
  titleElement.textContent = title;

  const authorElement = document.createElement("p");
  authorElement.classList.add("card-text");
  authorElement.textContent = `Author: ${author || "Unknown"}`;

  cardBodyElement.appendChild(titleElement);
  cardBodyElement.appendChild(authorElement);
  cardElement.appendChild(imageElement);
  cardElement.appendChild(cardBodyElement);
  bookElement.appendChild(cardElement);

  // Trigger the animation by adding the 'show' class with a slight delay
  if (!cardElement.classList.contains("show")) {
    setTimeout(() => {
      cardElement.classList.add("show");
    }, 100);
  }

  return bookElement;
}

function createPaginationElement() {
  const paginationElement = document.createElement("div");
  paginationElement.classList.add("mt-3", "text-center");

  const buttonElement = document.createElement("button");
  buttonElement.classList.add("btn", "btn-primary");
  buttonElement.textContent = "Load More";
  buttonElement.addEventListener("click", loadMoreBooks);

  paginationElement.appendChild(buttonElement);
  return paginationElement;
}

function loadMoreBooks() {
  const bookName = document.getElementById("bookName").value;
  const apiUrl = `https://openlibrary.org/search.json?q=${bookName}`;

  fetch(apiUrl)
    .then(handleResponse)
    .then((data) => {
      const start = document.getElementById("results").children.length - 1;
      const newBooks = data.docs.slice(start, start + 5);

      displayResults({ docs: newBooks });
    })
    .catch(handleError);
}

function handleResponse(response) {
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

function handleError(error) {
  console.error("Error:", error);
  const errorElement = document.createElement("div");
  errorElement.classList.add("error-message");
  errorElement.textContent = "An error occurred. Please try again later.";
  document.getElementById("results").appendChild(errorElement);
}

function showLoadingSpinner(loadingSpinner) {
  loadingSpinner.style.display = "inline-block";
}

function hideLoadingSpinner(loadingSpinner) {
  loadingSpinner.style.display = "none";
}
