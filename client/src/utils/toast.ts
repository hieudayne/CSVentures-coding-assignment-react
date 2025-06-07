export function toast(message: string, duration = 2500) {
  const el = document.createElement("div");
  el.textContent = message;
  el.className =
    "fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded shadow z-50 animate-fadeInOut";
  document.body.appendChild(el);
  setTimeout(() => el.remove(), duration);
}
