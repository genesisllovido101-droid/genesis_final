const greeting = document.getElementById("greeting");
const userInput = document.getElementById("userInput");
const yearSelect = document.getElementById("yearSelect");
const message = document.getElementById("message");
const clickButton = document.getElementById("clickButton");
const doubleButton = document.getElementById("doubleButton");
const profileLogo = document.getElementById("profileLogo");

// Logo grows when the cursor enters, and returns to normal when it leaves.
profileLogo.addEventListener("mouseenter", () => {
  profileLogo.classList.add("is-hovered");
});

profileLogo.addEventListener("mouseleave", () => {
  profileLogo.classList.remove("is-hovered");
});

// Also support keyboard focus for accessibility.
profileLogo.setAttribute("tabindex", "0");
profileLogo.addEventListener("focus", () => {
  profileLogo.classList.add("is-hovered");
});
profileLogo.addEventListener("blur", () => {
  profileLogo.classList.remove("is-hovered");
});

clickButton.addEventListener("click", () => {
  const typedText = userInput.value.trim();
  const year = yearSelect.value;

  greeting.textContent = typedText ? `Hello, ${typedText}!` : "Hello! I'm Genesis";
  message.textContent = `You're in ${year}. Welcome back!`;
});

doubleButton.addEventListener("dblclick", () => {
  greeting.textContent = "You double-clicked!";
  message.textContent = "Nice! You clicked twice.";
});

doubleButton.addEventListener("click", () => {
  message.textContent = "Double-click this button to trigger its special action.";
});

userInput.addEventListener("input", () => {
  const typedText = userInput.value.trim();
  message.textContent = typedText
    ? `Hi, ${typedText}! Click a button to continue.`
    : "Welcome Back!";
});

yearSelect.addEventListener("change", () => {
  message.textContent = `Selected: ${yearSelect.value}`;
});
