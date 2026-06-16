import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMPs9fwLa3lCY6AnxnYo-1GXXeCMCVllA",
  authDomain: "portfolio-aagash.firebaseapp.com",
  projectId: "portfolio-aagash",
  storageBucket: "portfolio-aagash.firebasestorage.app",
  messagingSenderId: "65859568127",
  appId: "1:65859568127:web:1c367f8cdcf416314ea7ca",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const contactMessagesRef = collection(db, "contactMessages");

document.addEventListener("DOMContentLoaded", () => {
  // --- Custom Cursor ---
  const cursorDot = document.querySelector("[data-cursor-dot]");
  const cursorOutline = document.querySelector("[data-cursor-outline]");

  window.addEventListener("mousemove", (e) => {
    const posX = e.clientX;
    const posY = e.clientY;

    if (!cursorDot || !cursorOutline) return;

    cursorDot.style.left = `${posX}px`;
    cursorDot.style.top = `${posY}px`;

    cursorOutline.animate(
      {
        left: `${posX}px`,
        top: `${posY}px`,
      },
      { duration: 500, fill: "forwards" }
    );
  });

  const interactiveItems = document.querySelectorAll(
    "a, button, .skill-tag, .project-card, .stat-item, .floating-badge"
  );

  interactiveItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      if (cursorOutline) cursorOutline.classList.add("cursor-hover");
    });

    item.addEventListener("mouseleave", () => {
      if (cursorOutline) cursorOutline.classList.remove("cursor-hover");
    });

    item.addEventListener("click", (e) => {
      const rect = item.getBoundingClientRect();
      const ripple = document.createElement("span");

      ripple.className = "click-ripple";
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;

      if (getComputedStyle(item).position === "static") {
        item.style.position = "relative";
      }

      item.appendChild(ripple);
      item.classList.remove("click-glow");
      void item.offsetWidth;
      item.classList.add("click-glow");

      ripple.addEventListener("animationend", () => ripple.remove());

      if (item.classList.contains("skill-tag")) {
        const parentCard = item.closest(".skill-category");
        if (parentCard) {
          parentCard.classList.remove("click-glow");
          void parentCard.offsetWidth;
          parentCard.classList.add("click-glow");
        }
      }

      if (item.classList.contains("floating-badge")) {
        item.classList.remove("pulse-pop");
        void item.offsetWidth;
        item.classList.add("pulse-pop");
      }
    });
  });

  const greetingText = document.getElementById("greeting-text");
  const hour = new Date().getHours();
  let greeting;

  if (hour < 12) greeting = "Good Morning, I'm";
  else if (hour < 18) greeting = "Good Afternoon, I'm";
  else greeting = "Good Evening, I'm";

  if (greetingText) greetingText.textContent = greeting;

  // --- Scroll Animations (Intersection Observer) ---
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target); // Only animate once
      }
    });
  }, observerOptions);

  const hiddenElements = document.querySelectorAll(".fade-in-up, .fade-in");
  hiddenElements.forEach((el) => observer.observe(el));

  // --- Mobile Menu Toggle ---
  const hamburger = document.querySelector(".hamburger");
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".nav-link");

  if (hamburger && navbar) {
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navbar.classList.toggle("active");
    });
  }

  // Close menu when a link is clicked
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (hamburger && navbar) {
        hamburger.classList.remove("active");
        navbar.classList.remove("active");
      }
    });
  });

  // --- Smooth Scroll for Anchor Links ---
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition =
          elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    });
  });

  const contactForm = document.querySelector(".contact-form");

  if (contactForm) {
    const formStatus = contactForm.querySelector(".form-status");

    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = document.getElementById("name")?.value.trim() || "Visitor";
      const email = document.getElementById("email")?.value.trim() || "Not provided";
      const message = document.getElementById("message")?.value.trim() || "";
      const submitButton = contactForm.querySelector('button[type="submit"]');
      const originalText = submitButton?.innerHTML;

      contactForm.classList.remove("sent");
      void contactForm.offsetWidth;

      try {
        if (formStatus) {
          formStatus.textContent = "Sending your message...";
          formStatus.className = "form-status";
        }

        if (submitButton) {
          submitButton.disabled = true;
          submitButton.innerHTML =
            'Sending <i class="fa-solid fa-spinner fa-spin"></i>';
        }

        await addDoc(contactMessagesRef, {
          name,
          email,
          message,
          recipientEmail: "aagashhari5@gmail.com",
          createdAt: serverTimestamp(),
        });
        contactForm.classList.add("sent");
        contactForm.reset();

        if (formStatus) {
          formStatus.textContent = "Message sent successfully.";
          formStatus.className = "form-status success";
        }

        if (submitButton) {
          submitButton.innerHTML = 'Sent <i class="fa-solid fa-check"></i>';
          setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
          }, 1600);
        }
      } catch (error) {
        console.error("Contact form submit failed:", error);
        const subject = encodeURIComponent(`Portfolio message from ${name}`);
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );

        if (formStatus) {
          formStatus.textContent =
            "Firebase is unavailable. Opening your email app instead.";
          formStatus.className = "form-status";
        }

        if (submitButton) {
          submitButton.innerHTML = 'Opening Email <i class="fa-solid fa-envelope"></i>';
          submitButton.disabled = false;
          setTimeout(() => {
            submitButton.innerHTML = originalText;
          }, 2200);
        }

        window.location.href = `mailto:aagashhari5@gmail.com?subject=${subject}&body=${body}`;
      }
    });
  }
});
