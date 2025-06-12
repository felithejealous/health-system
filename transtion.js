 window.addEventListener('DOMContentLoaded', () => {
    const title = document.querySelector('.title');
    if (title) {
      // Delay a bit for a smoother effect
      setTimeout(() => {
        title.classList.add('show');
      }, 300);
    }
  });