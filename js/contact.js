// Preview only: no network requests or submission.
const previewForm = document.getElementById("contactForm");
previewForm.addEventListener("submit", event => { event.preventDefault(); event.stopImmediatePropagation(); });
function closeModal() { document.getElementById("thanksModal").classList.remove("active"); }
