import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Removed the secret key to prevent misuse
const supabaseUrl = CONFIG.SUPABASE_URL;
const supabaseKey = CONFIG.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Check if user is authenticated
async function checkAuth() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}

// Handle login with email and password
async function handleLogin(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Handle signup with email and password
async function handleSignup(email, password) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/login.html`,
      },
    });
    if (error) throw error;
    return { data, error: null };
  } catch (error) {
    return { data: null, error };
  }
}

// Handle logout
async function handleLogout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return { error: null };
  } catch (error) {
    return { error };
  }
}

// Check if user is authenticated for protected pages
async function requireAuth() {
  const { user, error } = await checkAuth();
  if (error || !user) {
    window.location.href = "login.html";
    return null;
  }
  return user;
}

// Update UI with user email
function updateUserEmail(email) {
  const userEmailElement = document.getElementById("userEmail");
  if (userEmailElement) {
    userEmailElement.textContent = email;
  }
}

// Initialize authentication UI and event listeners
document.addEventListener("DOMContentLoaded", async () => {
  // Handle protected pages (like chat.html)
  if (window.location.pathname.includes("chat.html")) {
    const user = await requireAuth();
    if (user) {
      updateUserEmail(user.email);
    }
  }

  // Get the current tab from URL parameters
  const urlParams = new URLSearchParams(window.location.search);
  const currentTab = urlParams.get("tab") || "login";

  // Update tab UI
  const loginTab = document.getElementById("loginTab");
  const signupTab = document.getElementById("signupTab");
  const loginForm = document.getElementById("loginForm");
  const signupForm = document.getElementById("signupForm");

  if (loginTab && signupTab && loginForm && signupForm) {
    // Show/hide forms based on current tab
    if (currentTab === "login") {
      loginTab.classList.add("active");
      signupTab.classList.remove("active");
      loginForm.style.display = "block";
      signupForm.style.display = "none";
    } else {
      loginTab.classList.remove("active");
      signupTab.classList.add("active");
      loginForm.style.display = "none";
      signupForm.style.display = "block";
    }

    // Add tab click handlers
    loginTab.addEventListener("click", () => {
      window.location.href = "login.html";
    });
    signupTab.addEventListener("click", () => {
      window.location.href = "signup.html";
    });
  }

  // Handle login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const errorElement = document.getElementById("loginError");

      try {
        const { data, error } = await handleLogin(email, password);
        if (error) throw error;

        // Successful login
        window.location.href = "chat.html";
      } catch (error) {
        if (errorElement) {
          errorElement.textContent = error.message;
          errorElement.style.display = "block";
        } else {
          alert(error.message);
        }
      }
    });
  }

  // Handle signup form submission
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
      const errorElement = document.getElementById("signupError");

      if (password !== confirmPassword) {
        if (errorElement) {
          errorElement.textContent = "Passwords do not match";
          errorElement.style.display = "block";
        } else {
          alert("Passwords do not match");
        }
        return;
      }

      try {
        const { data, error } = await handleSignup(email, password);
        if (error) throw error;

        // Show success message
        if (errorElement) {
          errorElement.textContent =
            "Please check your email to confirm your account.";
          errorElement.style.color = "green";
          errorElement.style.display = "block";
        } else {
          alert("Please check your email to confirm your account.");
        }

        // Clear form
        signupForm.reset();
      } catch (error) {
        if (errorElement) {
          errorElement.textContent = error.message;
          errorElement.style.display = "block";
        } else {
          alert(error.message);
        }
      }
    });
  }

  // Handle logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      try {
        const { error } = await handleLogout();
        if (error) throw error;
        window.location.href = "index.html";
      } catch (error) {
        alert(error.message);
      }
    });
  }
});
