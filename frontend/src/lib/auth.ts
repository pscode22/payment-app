// 🟩 Fake auth helper
export function isLoggedIn() {
  // You’d check token / context here.
  // For demo, read from localStorage.
  return Boolean(localStorage.getItem("loggedIn"));
}

export function login() {
  localStorage.setItem("loggedIn", "true");
}

export function logout() {
  localStorage.removeItem("loggedIn");
}
