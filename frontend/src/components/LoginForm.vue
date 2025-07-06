<script setup>
import { ref } from 'vue'
import { buildApiUrl, ENDPOINTS } from '../config/api.js'

const emit = defineEmits(['login-success'])

const password = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const handleLogin = async () => {
  if (!password.value.trim()) {
    errorMessage.value = 'Nhập mật khẩu đi nào! 🥺'
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await fetch(buildApiUrl(ENDPOINTS.auth.login), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Bae',
        password: password.value
      })
    })

    const data = await response.json()

    if (response.ok) {
      // Store token in localStorage
      localStorage.setItem('authToken', data.data.token)
      localStorage.setItem('user', JSON.stringify(data.data.user))
      
      // Emit success event
      emit('login-success', data.data)
      
      // Show success message
      showMessage('Chào mừng công chúa trở lại! 👸✨', 'success')
    } else {
      errorMessage.value = data.message || 'Mật khẩu không đúng rồi! 😢'
    }
  } catch (error) {
    console.error('Login error:', error)
    errorMessage.value = 'Không thể kết nối tới server! 🔧'
  }

  isLoading.value = false
}

const showMessage = (text, type) => {
  const message = document.createElement('div')
  message.className = 'message ' + type
  message.innerHTML = `<p>${text}</p>`
  
  message.style.cssText = `
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: rgba(255, 255, 255, 0.95);
    padding: 20px 40px;
    border-radius: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 1000;
    animation: slideDown 0.5s ease-out;
    color: #6a1b9a;
    font-size: 1.1em;
    text-align: center;
  `
  
  document.body.appendChild(message)
  
  setTimeout(() => {
    message.style.animation = 'slideUp 0.5s ease-out'
    setTimeout(() => {
      message.remove()
    }, 500)
  }, 3000)
}
</script>

<template>
  <div class="login-overlay">
    <div class="login-container">
      <div class="login-header">
        <h2>✨ Chào công chúa ✨</h2>
        <p>Nhập mật khẩu để vào Vườn Sao Băng nha! 🌟</p>
      </div>
      
      <div class="login-form">
        <div class="input-group">
          <input
            type="password"
            v-model="password"
            placeholder="Mật khẩu của công chúa... 🔐"
            @keyup.enter="handleLogin"
            :disabled="isLoading"
            class="password-input"
          />
        </div>
        
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>
        
        <button 
          @click="handleLogin"
          :disabled="isLoading"
          class="login-btn"
        >
          {{ isLoading ? 'Đang kiểm tra... ⏳' : 'Vào vườn sao 🌟' }}
        </button>
      </div>
      
      <div class="login-footer">
        <p>💖 Chỉ có công chúa mới biết mật khẩu này thôi nha! 💖</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.login-container {
  background: rgba(255, 255, 255, 0.95);
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  max-width: 400px;
  width: 90%;
  text-align: center;
  backdrop-filter: blur(10px);
}

.login-header h2 {
  color: #6a1b9a;
  margin-bottom: 10px;
  font-size: 2em;
}

.login-header p {
  color: #8e24aa;
  margin-bottom: 30px;
  font-size: 1.1em;
}

.input-group {
  margin-bottom: 20px;
}

.password-input {
  padding: 15px 20px;
  border: 2px solid #e1bee7;
  border-radius: 25px;
  font-size: 1.1em;
  text-align: center;
  background: rgba(255, 255, 255, 0.9);
  color: #6a1b9a;
  transition: all 0.3s ease;
}

.password-input:focus {
  outline: none;
  border-color: #ab47bc;
  box-shadow: 0 0 20px rgba(171, 71, 188, 0.3);
  transform: scale(1.02);
}

.password-input::placeholder {
  color: #ba68c8;
}

.error-message {
  color: #e91e63;
  margin-bottom: 15px;
  font-size: 0.9em;
  padding: 10px;
  background: rgba(233, 30, 99, 0.1);
  border-radius: 10px;
}

.login-btn {
  width: 100%;
  padding: 15px 30px;
  background: linear-gradient(45deg, #8e24aa, #ab47bc);
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 20px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(142, 36, 170, 0.4);
}

.login-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.login-footer p {
  color: #9c27b0;
  font-size: 0.9em;
  font-style: italic;
}

/* Animation keyframes */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
  to {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
}
</style>
