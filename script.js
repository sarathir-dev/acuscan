// Load navbar
fetch("navbar.html")
  .then((response) => response.text())
  .then((data) => {
    document.getElementById("navbar-container").innerHTML = data;

    // Highlight active link after loading navbar
    highlightActiveLink();

    // Initialize mobile menu functionality
    initMobileMenu();
  });

function highlightActiveLink() {
  // Get current page filename
  const currentPage = location.pathname.split("/").pop() || "index.html";

  // Highlight desktop nav link
  document.querySelectorAll(".nav-link").forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });

  // Highlight mobile nav link
  document.querySelectorAll(".mobile-nav-link").forEach((link) => {
    const linkPage = link.getAttribute("href").split("/").pop();
    if (linkPage === currentPage) {
      link.classList.add("active");
    }
  });
}

function initMobileMenu() {
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");
  const mobileNav = document.getElementById("mobile-nav");

  if (menuIcon) menuIcon.onclick = () => mobileNav.classList.add("active");
  if (closeIcon) closeIcon.onclick = () => mobileNav.classList.remove("active");
}
