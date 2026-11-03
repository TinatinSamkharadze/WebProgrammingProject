(function (root) {
    const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    function isValidEmail(email) {
        return typeof email === 'string' && EMAIL_REGEX.test(email.trim());
    }

    function validateContactForm(data) {
        const name = String((data && data.name) || '').trim();
        const email = String((data && data.email) || '').trim();
        const message = String((data && data.message) || '').trim();

        if (!name || !email || !message) {
            return { valid: false, error: 'Please fill in all fields' };
        }
        if (!isValidEmail(email)) {
            return { valid: false, error: 'Please enter a valid email address' };
        }
        return { valid: true, error: null, values: { name, email, message } };
    }

    const api = { isValidEmail, validateContactForm };

    if (typeof module !== 'undefined' && module.exports) {
        module.exports = api;
    } else {
        root.BakeryValidation = api;
    }
})(typeof window !== 'undefined' ? window : globalThis);
