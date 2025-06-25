document.addEventListener('DOMContentLoaded', function() {
    const lengthSlider = document.getElementById('pass-length');
    const lengthValue = document.getElementById('length-value');
    const generateBtn = document.getElementById('generate-btn');
    const copyBtn = document.getElementById('copy-btn');
    const passwordResult = document.getElementById('password-result');
    const strengthMeter = document.getElementById('strength-meter');
    
    // Atualiza o valor do slider
    lengthSlider.addEventListener('input', function() {
        lengthValue.textContent = this.value;
    });
    
    // Gera senha
    generateBtn.addEventListener('click', generatePassword);
    
    // Copia senha
    copyBtn.addEventListener('click', function() {
        passwordResult.select();
        document.execCommand('copy');
        alert('Senha copiada para a área de transferência!');
    });
    
    // Gera a senha inicial
    generatePassword();
    
    function generatePassword() {
        const length = parseInt(lengthSlider.value);
        const includeUpper = document.getElementById('uppercase').checked;
        const includeLower = document.getElementById('lowercase').checked;
        const includeNumbers = document.getElementById('numbers').checked;
        const includeSymbols = document.getElementById('symbols').checked;
        
        let charset = '';
        if (includeLower) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (includeUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (includeNumbers) charset += '0123456789';
        if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
        
        if (!charset) {
            alert('Selecione pelo menos um tipo de caractere');
            return;
        }
        
        let password = '';
        const values = new Uint32Array(length);
        window.crypto.getRandomValues(values);
        
        for (let i = 0; i < length; i++) {
            password += charset[values[i] % charset.length];
        }
        
        passwordResult.value = password;
        updateStrengthMeter(password);
    }
    
    function updateStrengthMeter(password) {
        if (!password) {
            strengthMeter.innerHTML = '';
            return;
        }
        
        // Calcula a força (simplificado)
        let strength = 0;
        const length = password.length;
        const hasUpper = /[A-Z]/.test(password);
        const hasLower = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSymbol = /[^A-Za-z0-9]/.test(password);
        
        // Pontua por comprimento
        strength += Math.min(length * 4, 40);
        
        // Pontua por variedade de caracteres
        const charTypes = [hasUpper, hasLower, hasNumber, hasSymbol].filter(Boolean).length;
        strength += (charTypes - 1) * 10;
        
        const percentage = Math.min(strength, 100);
        const color = percentage < 30 ? '#e74c3c' : 
                     percentage < 50 ? '#f39c12' : 
                     percentage < 70 ? '#f1c40f' : 
                     percentage < 90 ? '#2ecc71' : '#27ae60';
        
        strengthMeter.innerHTML = `<div class="meter-bar" style="width: ${percentage}%; background-color: ${color}"></div>`;
    }
});
