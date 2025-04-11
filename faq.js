// This is a standalone script you can add to your HTML file
document.addEventListener('DOMContentLoaded', function() {
    const faqButtons = document.querySelectorAll('.faq-question');
    
    faqButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Toggle active class on the button
        this.classList.toggle('active');
        
        // Get the answer div
        const answer = this.nextElementSibling;
        
        // Toggle display
        if (answer.style.maxHeight) {
          answer.style.maxHeight = null;
        } else {
          answer.style.maxHeight = answer.scrollHeight + "px";
        }
      });
    });
  });