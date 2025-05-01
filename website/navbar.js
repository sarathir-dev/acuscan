document.addEventListener("DOMContentLoaded", function () {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const closeMenuBtn = document.querySelector(".close-menu-btn");
  const mobileMenuOverlay = document.querySelector(".mobile-menu-overlay");
  const body = document.body;

  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(
    ".nav-links a, .mobile-nav-links a"
  );

  navLinks.forEach((link) => {
    const href = link.getAttribute("href");
    if (currentPath.endsWith(href)) {
      link.classList.add("active");
    }
  });

  function toggleMobileMenu() {
    mobileMenuOverlay.classList.toggle("active");
    body.style.overflow = mobileMenuOverlay.classList.contains("active")
      ? "hidden"
      : "";
  }

  mobileMenuBtn?.addEventListener("click", toggleMobileMenu);
  closeMenuBtn?.addEventListener("click", toggleMobileMenu);

  const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a");
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      toggleMobileMenu();
    });
  });

  mobileMenuOverlay?.addEventListener("click", (e) => {
    if (e.target === mobileMenuOverlay) {
      toggleMobileMenu();
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && mobileMenuOverlay?.classList.contains("active")) {
      toggleMobileMenu();
    }
  });
});
