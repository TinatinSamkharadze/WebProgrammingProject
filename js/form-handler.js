document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();

            if (!name || !email || !message) {
                alert('Please fill in all fields');
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert('Please enter a valid email address');
                return;
            }

            const formData = {
                name: name,
                email: email,
                message: message,
                timestamp: new Date().toLocaleString(),
                id: Date.now()
            };

            let submissions = JSON.parse(localStorage.getItem('bakerySubmissions')) || [];
            submissions.push(formData);
            localStorage.setItem('bakerySubmissions', JSON.stringify(submissions));

            console.log('✅ Message submitted:', formData);

            contactForm.style.display = 'none';
            successMessage.style.display = 'block';

            contactForm.reset();

            setTimeout(function () {
                contactForm.style.display = 'block';
                successMessage.style.display = 'none';
            }, 3000);
        });
    }
});

