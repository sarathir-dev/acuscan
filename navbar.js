// Function to load navbar and highlight active link
function loadNavbar() {
  // Get current page filename
  const currentPage = window.location.pathname.split("/").pop() || "index.html";

  // Navbar HTML with placeholder for active class
  const navbarHTML = `
      <header class="navbar">
        <div class="logo">
          <span>OrganInsight</span>
        </div>
        <nav class="nav-links">
          <a href="index.html" class="nav-link ${
            currentPage === "index.html" ? "active" : ""
          }">Home</a>
          <a href="upload.html" class="nav-link ${
            currentPage === "upload.html" ? "active" : ""
          }">Upload</a>
          <a href="results.html" class="nav-link ${
            currentPage === "results.html" ? "active" : ""
          }">Results</a>
          <a href="about.html" class="nav-link ${
            currentPage === "about.html" ? "active" : ""
          }">About</a>
          <a href="contact.html" class="nav-link ${
            currentPage === "contact.html" ? "active" : ""
          }">Contact</a>
        </nav>
        <div class="auth-buttons">
          <button class="auth-btn signup-btn">Sign Up</button>
          <button class="auth-btn login-btn">Login</button>
        </div>
        <div class="menu-icon" id="menu-icon">
          <i class="bx bx-menu"></i>
        </div>
      </header>
  
      <!-- Mobile Nav -->
      <div class="mobile-nav" id="mobile-nav">
        <div class="close-icon" id="close-icon">
          <i class="bx bx-x"></i>
        </div>
        <div class="mobile-logo">OrganInsight</div>
        <div class="mobile-links">
          <a href="index.html" class="mobile-nav-link ${
            currentPage === "index.html" ? "active" : ""
          }">Home</a>
          <a href="upload.html" class="mobile-nav-link ${
            currentPage === "upload.html" ? "active" : ""
          }">Upload</a>
          <a href="results.html" class="mobile-nav-link ${
            currentPage === "results.html" ? "active" : ""
          }">Results</a>
          <a href="about.html" class="mobile-nav-link ${
            currentPage === "about.html" ? "active" : ""
          }">About</a>
          <a href="contact.html" class="mobile-nav-link ${
            currentPage === "contact.html" ? "active" : ""
          }">Contact</a>
        </div>
        <div class="mobile-auth-buttons">
          <button class="auth-btn signup-btn">Sign Up</button>
          <button class="auth-btn login-btn">Login</button>
        </div>
      </div>
    `;

  // Insert navbar at the beginning of body
  document.body.insertAdjacentHTML("afterbegin", navbarHTML);

  // Initialize mobile menu functionality
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");
  const mobileNav = document.getElementById("mobile-nav");

  if (menuIcon) menuIcon.onclick = () => mobileNav.classList.add("active");
  if (closeIcon) closeIcon.onclick = () => mobileNav.classList.remove("active");
}

// Load navbar when DOM is ready
document.addEventListener("DOMContentLoaded", loadNavbar);
