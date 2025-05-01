const testimonials = [
  {
    name: "Sarah Chen",
    role: "Radiologist at City Hospital",
    quote:
      "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
    image: "images/testimonial-1.jpg",
  },
  {
    name: "Dr. James Wilson",
    role: "Chief of Radiology",
    quote:
      "AcuScan has revolutionized how we analyze medical images. The AI-powered insights are incredibly accurate and time-saving.",
    image: "images/testimonial-2.jpg",
  },
  {
    name: "Dr. Emily Rodriguez",
    role: "Neurologist",
    quote:
      "The platform's ability to detect subtle abnormalities has greatly improved our diagnostic accuracy. A game-changer in medical imaging.",
    image: "images/testimonial-3.jpg",
  },
];

let currentTestimonialIndex = 0;

const testimonialContainer = document.querySelector(".testimonial-carousel");
const prevButton = document.querySelector(".carousel-controls .prev");
const nextButton = document.querySelector(".carousel-controls .next");

function updateTestimonial() {
  const testimonial = testimonials[currentTestimonialIndex];
  testimonialContainer.innerHTML = `
        <div class="testimonial">
            <img src="${testimonial.image}" alt="${testimonial.name}">
            <div class="testimonial-content">
                <h3>${testimonial.name}</h3>
                <p class="role">${testimonial.role}</p>
                <p class="quote">${testimonial.quote}</p>
            </div>
        </div>
    `;
}

prevButton.addEventListener("click", () => {
  currentTestimonialIndex =
    (currentTestimonialIndex - 1 + testimonials.length) % testimonials.length;
  updateTestimonial();
});

nextButton.addEventListener("click", () => {
  currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
  updateTestimonial();
});

setInterval(() => {
  currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
  updateTestimonial();
}, 5000);

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
  } else {
    navbar.style.background = "rgba(255, 255, 255, 0.9)";
  }
});

const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navLinks = document.querySelector(".nav-links");
const navButtons = document.querySelector(".nav-buttons");

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    navButtons.classList.toggle("active");

    const menuIcon = mobileMenuBtn.querySelector("svg");
    if (navLinks.classList.contains("active")) {
      menuIcon.innerHTML = `
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      `;
    } else {
      menuIcon.innerHTML = `
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      `;
    }
  });

  document.addEventListener("click", (e) => {
    if (
      !mobileMenuBtn.contains(e.target) &&
      !navLinks.contains(e.target) &&
      !navButtons.contains(e.target)
    ) {
      navLinks.classList.remove("active");
      navButtons.classList.remove("active");

      const menuIcon = mobileMenuBtn.querySelector("svg");
      menuIcon.innerHTML = `
        <line x1="3" y1="12" x2="21" y2="12"></line>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <line x1="3" y1="18" x2="21" y2="18"></line>
      `;
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
  const closeMenuBtn = document.querySelector(".close-menu-btn");
  const mobileMenuOverlay = document.querySelector(".mobile-menu-overlay");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-links a");

  mobileMenuBtn.addEventListener("click", () => {
    mobileMenuOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  });

  closeMenuBtn.addEventListener("click", () => {
    mobileMenuOverlay.classList.remove("active");
    document.body.style.overflow = "";
  });

  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenuOverlay.classList.remove("active");
      document.body.style.overflow = "";
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 769) {
      mobileMenuOverlay.classList.remove("active");
      document.body.style.overflow = "";
    }
  });
});

updateTestimonial();
