// Smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Form validation for newsletter
document.querySelector('#newsletter-form').addEventListener('submit', function (e) {
  const email = document.querySelector('#email');
  if (!email.value.includes('@')) {
    e.preventDefault();
    alert('Please enter a valid email address.');
  }
});