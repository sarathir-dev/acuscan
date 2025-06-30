import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

// Supabase configuration
const supabaseUrl = CONFIG.SUPABASE_URL;
const supabaseKey = CONFIG.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Gemini API configuration (you'll need to replace with your actual API key)
const GEMINI_API_KEY = CONFIG.GEMINI_API_KEY; // Replace with your actual API key
const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_GENERATE_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;
const GEMINI_UPLOAD_ENDPOINT = `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${GEMINI_API_KEY}`;

// Chat state
let currentChatId = null;
let currentUser = null;
let isTyping = false;

// DOM elements
const chatMessages = document.getElementById("chatMessages");
const messageInput = document.getElementById("messageInput");
const sendBtn = document.getElementById("sendBtn");
const uploadBtn = document.getElementById("uploadBtn");
const fileInput = document.getElementById("fileInput");
const newChatBtn = document.getElementById("newChatBtn");
const chatHistory = document.getElementById("chatHistory");
const chatSidebar = document.getElementById("chatSidebar");
const sidebarToggle = document.getElementById("sidebarToggle");
const logoutBtn = document.getElementById("logoutBtn");
const userEmail = document.getElementById("userEmail");
const loadingOverlay = document.getElementById("loadingOverlay");

// Initialize the chat application
async function initChat() {
  try {
    // Check authentication
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    if (error || !user) {
      window.location.href = "login.html";
      return;
    }

    currentUser = user;
    userEmail.textContent = user.email;

    // Set welcome message timestamp
    const welcomeTimestamp = document.getElementById("welcomeTimestamp");
    if (welcomeTimestamp) {
      welcomeTimestamp.textContent = new Date().toLocaleTimeString();
    }

    // Load chat history
    await loadChatHistory();

    // Set up event listeners
    setupEventListeners();

    // Load the most recent chat if it exists, otherwise create a new chat
    const { data: chats, error: chatsError } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    if (chatsError) throw chatsError;

    if (chats && chats.length > 0) {
      // Load the most recent chat
      await loadChat(chats[0].id);
    } else {
      // No chats exist, create a new one
      await createNewChat();
    }
  } catch (error) {
    console.error("Error initializing chat:", error);
    showError("Failed to initialize chat. Please refresh the page.");
  }
}

// Set up event listeners
function setupEventListeners() {
  // Send message
  sendBtn.addEventListener("click", sendMessage);
  messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Input validation
  messageInput.addEventListener("input", () => {
    sendBtn.disabled = !messageInput.value.trim();
  });

  // File upload
  uploadBtn.addEventListener("click", () => fileInput.click());
  fileInput.addEventListener("change", handleFileUpload);

  // New chat
  newChatBtn.addEventListener("click", createNewChat);

  // Sidebar toggle (mobile)
  sidebarToggle.addEventListener("click", toggleSidebar);

  // Logout
  logoutBtn.addEventListener("click", handleLogout);

  // Close sidebar when clicking outside (mobile)
  document.addEventListener("click", (e) => {
    if (window.innerWidth <= 768) {
      if (
        !chatSidebar.contains(e.target) &&
        !sidebarToggle.contains(e.target)
      ) {
        chatSidebar.classList.remove("active");
      }
    }
  });
}

// Toggle sidebar on mobile
function toggleSidebar() {
  chatSidebar.classList.toggle("active");
}

// Handle logout
async function handleLogout() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    window.location.href = "index.html";
  } catch (error) {
    console.error("Error logging out:", error);
    showError("Failed to logout. Please try again.");
  }
}

// Create a new chat session
async function createNewChat() {
  try {
    const { data, error } = await supabase
      .from("chats")
      .insert([
        {
          user_id: currentUser.id,
          title: "New Chat",
          created_at: new Date().toISOString(),
        },
      ])
      .select()
      .single();

    if (error) throw error;

    currentChatId = data.id;

    // Clear messages and show welcome
    chatMessages.innerHTML = `
            <div class="message bot-message">
                <div class="message-content">
                    <h3>Welcome to MedAI Chat! 👋</h3>
                    <p>I'm here to help you with medical-related queries. You can ask me about:</p>
                    <ul>
                        <li>Medical image analysis and interpretation</li>
                        <li>Health symptoms and conditions</li>
                        <li>Medical terminology explanations</li>
                        <li>General health advice</li>
                    </ul>
                    <p>Start by typing your question below or upload a medical image for analysis.</p>
                </div>
                <div class="message-timestamp">${new Date().toLocaleTimeString()}</div>
            </div>
        `;

    // Reload chat history
    await loadChatHistory();
  } catch (error) {
    console.error("Error creating new chat:", error);
    showError("Failed to create new chat. Please try again.");
  }
}

// Load chat history from Supabase
async function loadChatHistory() {
  try {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("user_id", currentUser.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    chatHistory.innerHTML = "";

    data.forEach((chat) => {
      const chatItem = document.createElement("div");
      chatItem.className = `chat-history-item ${
        chat.id === currentChatId ? "active" : ""
      }`;
      chatItem.innerHTML = `
                <div class="chat-info">
                    <h4 class="chat-title">${chat.title}</h4>
                    <span class="chat-date">${formatDate(
                      chat.created_at
                    )}</span>
                </div>
                <button class="delete-chat" data-chat-id="${
                  chat.id
                }" title="Delete chat">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <polyline points="3,6 5,6 21,6"></polyline>
                        <path d="M19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"></path>
                    </svg>
                </button>
            `;

      // Add click handler
      chatItem.addEventListener("click", (e) => {
        if (!e.target.closest(".delete-chat")) {
          loadChat(chat.id);
        }
      });

      // Add delete handler
      const deleteBtn = chatItem.querySelector(".delete-chat");
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        deleteChat(chat.id);
      });

      chatHistory.appendChild(chatItem);
    });
  } catch (error) {
    console.error("Error loading chat history:", error);
  }
}

// Load a specific chat
async function loadChat(chatId) {
  try {
    currentChatId = chatId;

    // Update active state in sidebar
    document.querySelectorAll(".chat-history-item").forEach((item) => {
      item.classList.remove("active");
    });
    document
      .querySelector(`[data-chat-id="${chatId}"]`)
      ?.parentElement.classList.add("active");

    // Load messages
    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: true });

    if (error) throw error;

    // Display messages
    chatMessages.innerHTML = "";
    data.forEach((message) => {
      addMessageToUI(
        message.content,
        message.role,
        message.created_at,
        message.image_url || null
      );
    });

    // Update chat title
    const { data: chatData } = await supabase
      .from("chats")
      .select("title")
      .eq("id", chatId)
      .single();

    if (chatData) {
      const chatItem = document.querySelector(
        `[data-chat-id="${chatId}"]`
      )?.parentElement;
      if (chatItem) {
        chatItem.querySelector(".chat-title").textContent = chatData.title;
      }
    }
  } catch (error) {
    console.error("Error loading chat:", error);
    showError("Failed to load chat. Please try again.");
  }
}

// Delete a chat
async function deleteChat(chatId) {
  if (!confirm("Are you sure you want to delete this chat?")) return;

  try {
    // Delete messages first
    const { error: messagesError } = await supabase
      .from("messages")
      .delete()
      .eq("chat_id", chatId);

    if (messagesError) throw messagesError;

    // Delete chat
    const { error: chatError } = await supabase
      .from("chats")
      .delete()
      .eq("id", chatId);

    if (chatError) throw chatError;

    // If this was the current chat, create a new one
    if (chatId === currentChatId) {
      await createNewChat();
    } else {
      // Reload chat history
      await loadChatHistory();
    }
  } catch (error) {
    console.error("Error deleting chat:", error);
    showError("Failed to delete chat. Please try again.");
  }
}

// Send message
async function sendMessage() {
  const message = messageInput.value.trim();
  if (!message || isTyping) return;

  try {
    // Add user message to UI
    addMessageToUI(message, "user");
    messageInput.value = "";
    sendBtn.disabled = true;

    // Show typing indicator
    showTypingIndicator();

    // Save user message to database
    await saveMessage(message, "user");

    // Get AI response
    const aiResponse = await getAIResponse(message);

    // Hide typing indicator
    hideTypingIndicator();

    // Add AI response to UI
    addMessageToUI(aiResponse, "assistant");

    // Save AI response to database
    await saveMessage(aiResponse, "assistant");

    // Update chat title if it's still "New Chat"
    await updateChatTitle(message);
  } catch (error) {
    console.error("Error sending message:", error);
    hideTypingIndicator();
    showError("Failed to send message. Please try again.");
  }
}

// Save message to database (extended to support image and metadata)
async function saveMessage(
  content,
  role,
  imageDataUrl = null,
  scanDetails = null
) {
  try {
    const messageData = {
      chat_id: currentChatId,
      content: content,
      role: role,
      created_at: new Date().toISOString(),
    };
    if (imageDataUrl) {
      messageData.image_url = imageDataUrl; // Store as base64 or URL
    }
    if (scanDetails) {
      messageData.scan_details = JSON.stringify(scanDetails);
    }
    const { error } = await supabase.from("messages").insert([messageData]);
    if (error) throw error;
  } catch (error) {
    console.error("Error saving message:", error);
  }
}

// Get AI response from Gemini API
async function getAIResponse(message) {
  try {
    const response = await fetch(
      `${GEMINI_GENERATE_ENDPOINT}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `You are a helpful medical AI assistant. Provide clear, accurate, and helpful responses to medical queries. Always remind users to consult healthcare professionals for serious medical concerns. Here's the user's question: ${message}`,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error("Invalid response format from Gemini API");
    }
  } catch (error) {
    console.error("Error getting AI response:", error);
    return "I'm sorry, I'm having trouble processing your request right now. Please try again later or contact support if the issue persists.";
  }
}

// Update addMessageToUI to show image if present
function addMessageToUI(content, role, timestamp = null, imageDataUrl = null) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${role}-message`;

  const timestampStr = timestamp
    ? new Date(timestamp).toLocaleTimeString()
    : new Date().toLocaleTimeString();

  let imageHtml = "";
  if (imageDataUrl) {
    imageHtml = `<div class="chat-image-attachment"><img src="${imageDataUrl}" alt="Attached image" class="image-preview"></div>`;
  }

  messageDiv.innerHTML = `
    <div class="message-content">${imageHtml}${DOMPurify.sanitize(
    marked.parse(content)
  )}</div>
    <div class="message-timestamp">${timestampStr}</div>
  `;

  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
  isTyping = true;
  const typingDiv = document.createElement("div");
  typingDiv.className = "typing-indicator";
  typingDiv.id = "typingIndicator";
  typingDiv.innerHTML = `
        <span>AI is typing</span>
        <div class="typing-dots">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
  chatMessages.appendChild(typingDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Hide typing indicator
function hideTypingIndicator() {
  isTyping = false;
  const typingIndicator = document.getElementById("typingIndicator");
  if (typingIndicator) {
    typingIndicator.remove();
  }
}

// Handle file upload
function handleFileUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith("image/")) {
    showError("Please select an image file.");
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    showError("File size must be less than 5MB.");
    return;
  }

  // Create preview
  const reader = new FileReader();
  reader.onload = function (e) {
    const message = `I've uploaded an image for analysis. Please help me understand what you see in this medical image.`;

    // Add user message with image
    addMessageToUI(
      `${message}<br><img src="${e.target.result}" alt="Uploaded image" class="image-preview">`,
      "user"
    );

    // Save message and get AI response
    handleImageAnalysis(file, e.target.result);
  };
  reader.readAsDataURL(file);

  // Clear file input
  event.target.value = "";
}

// When handling file upload, save image and scan details
async function handleImageAnalysis(file, imageDataUrl) {
  try {
    showTypingIndicator();

    // Prompt user for scan details (simulate a form or use a modal if you have one)
    const scanType = prompt("Enter scan type (e.g. X-ray, MRI, CT):");
    const bodyPart = prompt("Enter body part (e.g. Chest, Knee):");
    const reason = prompt("Enter reason for scan:");
    const age = prompt("Enter patient age:");
    const sex = prompt("Enter patient sex (M/F):");
    const medicalHistory = prompt("Enter relevant medical history:");

    if (!scanType || !bodyPart || !reason || !age || !sex || !medicalHistory) {
      hideTypingIndicator();
      showError("All scan details are required for image analysis.");
      return;
    }

    const scanDetails = {
      scanType,
      bodyPart,
      reason,
      age,
      sex,
      medicalHistory,
    };

    // Save user message with image and scan details
    await saveMessage(
      `Image uploaded for analysis`,
      "user",
      imageDataUrl,
      scanDetails
    );

    // 1. Upload image to Gemini
    const fileUri = await uploadImageToGemini(file);
    if (!fileUri) {
      hideTypingIndicator();
      showError("Image upload failed.");
      return;
    }

    // 2. Build prompt with metadata
    const metaPrompt = `\nType of scan: ${scanType}\nBody part: ${bodyPart}\nReason: ${reason}\nAge: ${age}\nSex: ${sex}\nMedical history: ${medicalHistory}\n\nPlease analyze the scan.`;

    // 3. Send to Gemini
    const parts = [
      { file_data: { mime_type: file.type, file_uri: fileUri } },
      { text: metaPrompt },
    ];

    const response = await fetch(
      `${GEMINI_GENERATE_ENDPOINT}?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts }] }),
      }
    );
    const data = await response.json();
    hideTypingIndicator();
    if (response.ok && data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      const aiResponse = data.candidates[0].content.parts[0].text;
      addMessageToUI(aiResponse, "assistant");
      await saveMessage(aiResponse, "assistant");
    } else {
      showError(data?.error?.message || "No AI response.");
    }
  } catch (error) {
    console.error("Error analyzing image:", error);
    hideTypingIndicator();
    showError("Failed to analyze image. Please try again.");
  }
}

// Upload image to Gemini
async function uploadImageToGemini(file) {
  const metadata = {
    file: { display_name: file.name },
  };

  const initRes = await fetch(GEMINI_UPLOAD_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Upload-Protocol": "resumable",
      "X-Goog-Upload-Command": "start",
      "X-Goog-Upload-Header-Content-Length": file.size.toString(),
      "X-Goog-Upload-Header-Content-Type": file.type,
    },
    body: JSON.stringify(metadata),
  });

  const uploadUrl = initRes.headers.get("X-Goog-Upload-URL");
  if (!uploadUrl) return null;

  const uploadRes = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      "X-Goog-Upload-Command": "upload, finalize",
      "X-Goog-Upload-Offset": "0",
      "Content-Length": file.size.toString(),
    },
    body: file,
  });

  const fileInfo = await uploadRes.json();
  return fileInfo.file?.uri || null;
}

// Update chat title
async function updateChatTitle(firstMessage) {
  try {
    const { data } = await supabase
      .from("chats")
      .select("title")
      .eq("id", currentChatId)
      .single();

    if (data && data.title === "New Chat") {
      const title =
        firstMessage.length > 50
          ? firstMessage.substring(0, 50) + "..."
          : firstMessage;

      const { error } = await supabase
        .from("chats")
        .update({ title: title })
        .eq("id", currentChatId);

      if (!error) {
        await loadChatHistory();
      }
    }
  } catch (error) {
    console.error("Error updating chat title:", error);
  }
}

// Show error message
function showError(message) {
  const errorDiv = document.createElement("div");
  errorDiv.className = "message bot-message error-message";
  errorDiv.innerHTML = `
        <div class="message-content">
            <strong>Error:</strong> ${message}
        </div>
        <div class="message-timestamp">${new Date().toLocaleTimeString()}</div>
    `;
  chatMessages.appendChild(errorDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Format date for display
function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInHours = (now - date) / (1000 * 60 * 60);

  if (diffInHours < 24) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  } else if (diffInHours < 168) {
    // 7 days
    return date.toLocaleDateString([], { weekday: "short" });
  } else {
    return date.toLocaleDateString([], { month: "short", day: "numeric" });
  }
}

// Show loading overlay
function showLoading() {
  loadingOverlay.style.display = "flex";
}

// Hide loading overlay
function hideLoading() {
  loadingOverlay.style.display = "none";
}

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", initChat);
