// ── STATE ─────────────────────────────────────────────────
let cart = JSON.parse(localStorage.getItem("cart") || "[]");
let currentCat = "All";
let searchVal = "";
const PAGE_SIZE = 12;          // books shown initially and per "Show More"
let visibleCount = PAGE_SIZE;  // how many books currently visible
let filteredBooks = [];        // current filtered list

// ── CART HELPERS ──────────────────────────────────────────
function updateCartCount() {
  const el = document.getElementById("cart-count");
  if (el) el.innerText = cart.length;
}

function isInCart(id) {
  return cart.some(b => b.id === id);
}

function addToCart(id) {
  if (isInCart(id)) {
    alert("This book is already in your cart!");
    return;
  }
  const book = booksData.find(b => b.id === id);
  if (!book) return;
  cart.push(book);
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  const btn = document.getElementById("btn-" + id);
  if (btn) {
    btn.innerText = "✓ Added";
    btn.disabled = true;
    btn.style.background = "#27ae60";
  }
}

// ── RENDER BOOKS (respects visibleCount) ──────────────────
function displayBooks(books) {
  const container = document.getElementById("book-list");
  const btn = document.getElementById("show-more-btn");
  if (!container) return;

  if (books.length === 0) {
    container.innerHTML = "<p class='empty-msg' style='grid-column:1/-1'>No books found.</p>";
    if (btn) btn.style.display = "none";
    return;
  }

  const toShow = books.slice(0, visibleCount);

  container.innerHTML = toShow.map(b => `
    <div class="card">
      <img src="${b.image}" alt="${b.title}" loading="lazy">
      <div class="card-body">
        <h3>${b.title}</h3>
        <p>${b.author}</p>
        <p class="price">₹${b.price}</p>
        <button
          id="btn-${b.id}"
          onclick="addToCart(${b.id})"
          ${isInCart(b.id) ? 'disabled style="background:#27ae60"' : ""}>
          ${isInCart(b.id) ? "✓ Added" : "Add to Cart"}
        </button>
      </div>
    </div>
  `).join("");

  // Show/hide "Show More" button
  if (btn) {
    if (visibleCount >= books.length) {
      btn.style.display = "none";
    } else {
      btn.style.display = "inline-block";
      btn.innerText = `📖 Show More`;
    }
  }
}

// ── SHOW MORE ─────────────────────────────────────────────
function showMore() {
  visibleCount += PAGE_SIZE;
  displayBooks(filteredBooks);
}

// ── FILTERS ───────────────────────────────────────────────
function applyFilters() {
  let books = booksData;

  if (currentCat !== "All") {
    books = books.filter(b => b.category === currentCat);
  }
  if (searchVal.trim() !== "") {
    books = books.filter(b =>
      b.title.toLowerCase().includes(searchVal) ||
      b.author.toLowerCase().includes(searchVal)
    );
  }

  filteredBooks = books;
  visibleCount = PAGE_SIZE;   // reset to first page on every new filter
  displayBooks(filteredBooks);
}

function filterCat(el, cat) {
  document.querySelectorAll(".cat-btn").forEach(b => b.classList.remove("active"));
  el.classList.add("active");
  currentCat = cat;
  applyFilters();
}

// ── INIT ──────────────────────────────────────────────────
window.onload = function () {
  updateCartCount();
  filteredBooks = booksData;
  displayBooks(filteredBooks);

  document.getElementById("search").addEventListener("input", function (e) {
    searchVal = e.target.value.toLowerCase();
    applyFilters();
  });
};


