import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabaseUrl = "https://eikcywmpzosuycutwifa.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpa2N5d21wem9zdXljdXR3aWZhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU0NzE5NzYsImV4cCI6MjA2MTA0Nzk3Nn0.NMl4NHnwRmUmr1axKWAWne7_4S-mEA6pC_Vq0hf6bGg";
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkAuth() {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  return { user, error };
}

async function handleLogin(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

async function handleSignup(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { data, error };
}

async function handleLogout() {
  const { error } = await supabase.auth.signOut();
  return { error };
}

async function requireAuth() {
  const { user } = await checkAuth();
  if (!user) {
    window.location.href = "login.html";
  }
  return user;
}

async function redirectIfAuthenticated() {
  const { user } = await checkAuth();
  if (user) {
    window.location.href = "chat.html";
  }
}

function updateUserEmail(email) {
  const userEmailElement = document.getElementById("userEmail");
  if (userEmailElement) {
    userEmailElement.textContent = email;
  }
}

document.addEventListener("DOMContentLoaded", async () => {
  if (window.location.pathname.includes("chat.html")) {
    const user = await requireAuth();
    if (user) {
      updateUserEmail(user.email);
    }
  }

  if (
    window.location.pathname.includes("login.html") ||
    window.location.pathname.includes("signup.html")
  ) {
    await redirectIfAuthenticated();
  }

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      const { error } = await handleLogin(email, password);
      if (error) {
        alert(error.message);
      } else {
        window.location.href = "chat.html";
      }
    });
  }

  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (password !== confirmPassword) {
        alert("Passwords do not match");
        return;
      }

      const { error } = await handleSignup(email, password);
      if (error) {
        alert(error.message);
      } else {
        window.location.href = "chat.html";
      }
    });
  }

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      const { error } = await handleLogout();
      if (error) {
        alert(error.message);
      } else {
        window.location.href = "login.html";
      }
    });
  }
});
