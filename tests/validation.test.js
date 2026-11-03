const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { isValidEmail, validateContactForm } = require('../js/validation.js');

describe('isValidEmail', () => {
    test('accepts a well-formed email', () => {
        assert.equal(isValidEmail('tiko@example.com'), true);
    });

    test('rejects emails without @ or domain', () => {
        assert.equal(isValidEmail('tiko.example.com'), false);
        assert.equal(isValidEmail('tiko@example'), false);
        assert.equal(isValidEmail('tiko @example.com'), false);
    });

    test('rejects non-string values', () => {
        assert.equal(isValidEmail(undefined), false);
        assert.equal(isValidEmail(null), false);
    });
});

describe('validateContactForm', () => {
    test('returns trimmed values for valid input', () => {
        const result = validateContactForm({
            name: '  Tiko ',
            email: ' tiko@example.com ',
            message: ' I love your croissants! '
        });
        assert.deepEqual(result, {
            valid: true,
            error: null,
            values: { name: 'Tiko', email: 'tiko@example.com', message: 'I love your croissants!' }
        });
    });

    test('fails when any field is empty or whitespace', () => {
        const result = validateContactForm({ name: 'Tiko', email: 'tiko@example.com', message: '   ' });
        assert.equal(result.valid, false);
        assert.equal(result.error, 'Please fill in all fields');
    });

    test('fails on missing input object', () => {
        assert.equal(validateContactForm(undefined).valid, false);
    });

    test('fails on invalid email', () => {
        const result = validateContactForm({ name: 'Tiko', email: 'not-an-email', message: 'Hi' });
        assert.equal(result.valid, false);
        assert.equal(result.error, 'Please enter a valid email address');
    });
});
