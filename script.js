// Calculadora de Entropia
function calculateEntropy() {
    const length = parseInt(document.getElementById('length').value);
    const charsetSize = parseInt(document.getElementById('charset').value);
    
    if (isNaN(length) || length < 1) {
        alert("Por favor, insira um comprimento válido");
        return;
    }
    
    const entropy = length * Math.log2(charsetSize);
    const resultElement = document.getElementById('entropy-result');
    
    let strength;
    if (entropy < 28) strength = "Muito fraca";
    else if (entropy < 36) strength = "Fraca";
    else if (entropy < 60) strength = "Moderada";
    else if (entropy < 128) strength = "Forte";
    else strength = "Muito forte";
    
    resultElement.innerHTML = `
        <p><strong>Entropia:</strong> ${entropy.toFixed(2)} bits</p>
        <p><strong>Força:</strong> ${strength}</p>
        <p>Recomenda-se pelo menos 64 bits de entropia para senhas importantes.</p>
    `;
}

// Gerador de Senhas
function generatePassword() {
    const length = parseInt(document.getElementById('pass-length').value);
    const includeUpper = document.getElementById('uppercase').checked;
    const includeLower = document.getElementById('lowercase').checked;
    const includeNumbers = document.getElementById('numbers').checked;
    const includeSymbols = document.getElementById('symbols').checked;
    
    let charset = "";
    if (includeLower) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeUpper) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";
    
    if (charset === "") {
        alert("Selecione pelo menos um conjunto de caracteres");
        return;
    }
    
    let password = "";
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    
    for (let i = 0; i < length; i++) {
        password += charset[values[i] % charset.length];
    }
    
    document.getElementById('password-result').value = password;
    updateStrengthMeter(password);
}

function updateStrengthMeter(password) {
    const meter = document.getElementById('strength-meter');
    if (!password) {
        meter.innerHTML = "";
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
    
    let rating;
    if (strength < 30) rating = "Muito Fraca";
    else if (strength < 50) rating = "Fraca";
    else if (strength < 70) rating = "Moderada";
    else if (strength < 90) rating = "Forte";
    else rating = "Muito Forte";
    
    const percentage = Math.min(strength, 100);
    
    meter.innerHTML = `
        <div class="meter-bar" style="width: ${percentage}%; background-color: ${
            percentage < 30 ? '#e74c3c' : 
            percentage < 50 ? '#f39c12' : 
            percentage < 70 ? '#f1c40f' : 
            percentage < 90 ? '#2ecc71' : '#27ae60'
        }"></div>
        <div class="meter-text">Força: ${rating} (${Math.round(percentage)}%)</div>
    `;
}

function copyPassword() {
    const passwordField = document.getElementById('password-result');
    passwordField.select();
    document.execCommand('copy');
    alert("Senha copiada para a área de transferência!");
}

// Event Listeners
document.getElementById('pass-length').addEventListener('input', function() {
    document.getElementById('length-value').textContent = this.value;
});

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    calculateEntropy();
    generatePassword();
});
