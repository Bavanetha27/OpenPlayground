document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('passwordForm');
    const passwordInput = document.getElementById('password');
    const lengthSlider = document.getElementById('length');
    const lengthValue = document.getElementById('lengthValue');
    const copyBtn = document.getElementById('copyBtn');

    // Update length display when slider changes
    lengthSlider.addEventListener('input', (e) => {
        lengthValue.textContent = e.target.value;
    });

    // Generate password on form submit
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const length = parseInt(lengthSlider.value);
        const includeUpper = document.getElementById('includeUpper').checked;
        const includeLower = document.getElementById('includeLower').checked;
        const includeDigits = document.getElementById('includeDigits').checked;
        const includeSpecial = document.getElementById('includeSpecial').checked;

        // Generate password
        const password = generatePassword(length, includeUpper, includeLower, includeDigits, includeSpecial);
        
        if (password) {
            passwordInput.value = password;
        } else {
            passwordInput.value = 'Error: Please select at least one character type';
        }
    });

    // Copy to clipboard
    copyBtn.addEventListener('click', () => {
        if (passwordInput.value && !passwordInput.value.startsWith('Error:')) {
            passwordInput.select();
            navigator.clipboard.writeText(passwordInput.value).then(() => {
                copyBtn.textContent = '✅';
                setTimeout(() => copyBtn.textContent = '📋', 2000);
            }).catch(() => {
                // Fallback for older browsers
                document.execCommand('copy');
                copyBtn.textContent = '✅';
                setTimeout(() => copyBtn.textContent = '📋', 2000);
            });
        }
    });

    // Password generation function
    function generatePassword(length, includeUpper, includeLower, includeDigits, includeSpecial) {
        const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const lowercase = 'abcdefghijklmnopqrstuvwxyz';
        const digits = '0123456789';
        const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';

        let charset = '';
        let password = '';

        // Build character set based on selections
        if (includeUpper) charset += uppercase;
        if (includeLower) charset += lowercase;
        if (includeDigits) charset += digits;
        if (includeSpecial) charset += special;

        // Return null if no character type selected
        if (charset === '') return null;

        // Generate password using cryptographically secure random values
        const array = new Uint32Array(length);
        window.crypto.getRandomValues(array);

        for (let i = 0; i < length; i++) {
            password += charset[array[i] % charset.length];
        }

        return password;
    }
});
