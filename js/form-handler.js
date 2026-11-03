document.addEventListener('DOMContentLoaded', function () {
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const result = window.BakeryValidation.validateContactForm({
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                message: document.getElementById('message').value
            });

            if (!result.valid) {
                alert(result.error);
                return;
            }

            const { name, email, message } = result.values;

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

