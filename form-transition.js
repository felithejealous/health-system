// form-transition.js

let currentStep = 1;
const totalSteps = 4;
const formIds = ["personalInfoForm", "detailsForm", "companionForm", "emergencyContactForm"];

function showForm(step) {
  formIds.forEach((id, index) => {
    const form = document.getElementById(id);
    if (step - 1 === index) {
      form.style.display = "block";
      form.style.opacity = 1;
      form.style.transform = "translateX(0)";
    } else {
      form.style.display = "none";
      form.style.opacity = 0;
      form.style.transform = "translateX(100%)";
    }
  });
  updateProgress(step);
}

function nextForm(step) {
  const currentForm = document.getElementById(formIds[step - 1]);
  const nextForm = document.getElementById(formIds[step]);

  if (!nextForm) return;

  currentForm.style.transition = "opacity 0.4s ease-out, transform 0.4s ease-out";
  nextForm.style.transition = "opacity 0.4s ease-in, transform 0.4s ease-in";

  currentForm.style.opacity = 0;
  currentForm.style.transform = "translateX(-100%)";

  setTimeout(() => {
    currentForm.style.display = "none";
    nextForm.style.display = "block";
    nextForm.style.opacity = 1;
    nextForm.style.transform = "translateX(0)";
  }, 400);

  currentStep = step + 1;
  updateProgress(currentStep);
}

function prevForm(step) {
  const currentForm = document.getElementById(formIds[step - 1]);
  const prevForm = document.getElementById(formIds[step - 2]);

  if (!prevForm) return;

  currentForm.style.transition = "opacity 0.4s ease-out, transform 0.4s ease-out";
  prevForm.style.transition = "opacity 0.4s ease-in, transform 0.4s ease-in";

  currentForm.style.opacity = 0;
  currentForm.style.transform = "translateX(100%)";

  setTimeout(() => {
    currentForm.style.display = "none";
    prevForm.style.display = "block";
    prevForm.style.opacity = 1;
    prevForm.style.transform = "translateX(0)";
  }, 400);

  currentStep = step - 1;
  updateProgress(currentStep);
}

function submitForm() {
  formIds.forEach(id => document.getElementById(id).style.display = "none");
  document.getElementById("thankYouMessage").style.display = "block";
}

function resetForm() {
  document.getElementById("thankYouMessage").style.display = "none";
  currentStep = 1;
  showForm(currentStep);
}

function updateProgress(step) {
  const progressPercentage = (step / totalSteps) * 100;
  document.getElementById("progressFill").style.width = `${progressPercentage}%`;

  for (let i = 1; i <= totalSteps; i++) {
    const stepElement = document.getElementById(`step${i}`);
    if (i < step) {
      stepElement.classList.remove("active");
      stepElement.classList.add("completed");
    } else if (i === step) {
      stepElement.classList.add("active");
      stepElement.classList.remove("completed");
    } else {
      stepElement.classList.remove("active", "completed");
    }
  }
}

window.addEventListener("DOMContentLoaded", () => {
  formIds.forEach((id, index) => {
    const form = document.getElementById(id);
    form.style.transition = "opacity 0.4s ease, transform 0.4s ease";
    form.style.transform = index === 0 ? "translateX(0)" : "translateX(100%)";
    form.style.opacity = index === 0 ? 1 : 0;
    form.style.display = index === 0 ? "block" : "none";
  });
  document.getElementById("thankYouMessage").style.display = "none";
  updateProgress(currentStep);
});
