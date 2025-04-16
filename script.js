document.addEventListener("DOMContentLoaded", function () {
  const menuIcon = document.getElementById("menu-icon");
  const closeIcon = document.getElementById("close-icon");
  const mobileNav = document.getElementById("mobile-nav");

  menuIcon.onclick = () => {
    mobileNav.classList.add("active");
  };

  closeIcon.onclick = () => {
    mobileNav.classList.remove("active");
  };
});
