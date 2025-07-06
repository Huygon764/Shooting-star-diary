<script setup>
import { ref, onMounted } from 'vue'
import EntryList from './components/EntryList.vue'
import LoginForm from './components/LoginForm.vue'
import { buildApiUrl, ENDPOINTS } from './config/api.js'

const diaryInput = ref('')
const isLoading = ref(false)
const isLoggedIn = ref(false)
const user = ref(null)
const authToken = ref('')

// Check authentication on mount
onMounted(() => {
  checkAuthStatus()
  
  // Add sparkle effect on focus
  setTimeout(() => {
    const textareaEl = document.getElementById('diary-input')
    if (textareaEl) {
      textareaEl.addEventListener('focus', createSparkles)
    }
  }, 100)
})

const checkAuthStatus = () => {
  const token = localStorage.getItem('authToken')
  const userData = localStorage.getItem('user')
  
  if (token && userData) {
    try {
      authToken.value = token
      user.value = JSON.parse(userData)
      isLoggedIn.value = true
    } catch (error) {
      console.error('Error parsing user data:', error)
      logout()
    }
  }
}

const handleLoginSuccess = (loginData) => {
  user.value = loginData.user
  authToken.value = loginData.token
  isLoggedIn.value = true
}

const logout = () => {
  localStorage.removeItem('authToken')
  localStorage.removeItem('user')
  isLoggedIn.value = false
  user.value = null
  authToken.value = ''
}

const saveEntry = async () => {
  if (diaryInput.value.trim() === '') {
    showMessage('Cậu chưa viết gì nè... 🥺', 'info')
    return
  }

  isLoading.value = true

  try {
    const response = await fetch(buildApiUrl(ENDPOINTS.entries.create), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken.value}`
      },
      body: JSON.stringify({
        content: diaryInput.value.trim(),
        userId: user.value._id
      })
    })

    if (response.ok) {
      diaryInput.value = ''
      showMessage('Tâm sự của cậu đã được gửi lên những vì sao rồi nè! ✨🌟', 'success')
      createShootingStar()
      
      // Refresh the entry list if it's visible
      const entryListComponent = document.querySelector('.entry-list-container')
      if (entryListComponent) {
        // Emit custom event to refresh entries
        window.dispatchEvent(new CustomEvent('entry-added'))
      }
    } else {
      const errorData = await response.json()
      if (response.status === 401) {
        logout()
        showMessage('Phiên đăng nhập hết hạn, đăng nhập lại nhé! 🔐', 'error')
      } else {
        showMessage(errorData.message || 'Có lỗi xảy ra, thử lại nhé! 😔', 'error')
      }
    }
  } catch (error) {
    console.error('Error saving entry:', error)
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      showMessage('Không thể kết nối tới server. Hãy kiểm tra server có đang chạy không? 🔧', 'error')
    } else {
      showMessage('Có lỗi xảy ra, thử lại nhé! 😔', 'error')
    }
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
    left: 45%;
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

const createShootingStar = () => {
  const star = document.createElement('div')
  star.className = 'special-shooting-star'
  star.style.cssText = `
    position: fixed;
    top: ${Math.random() * 50}%;
    right: -100px;
    width: 150px;
    height: 3px;
    background: linear-gradient(to right, transparent, #ffb6c1, transparent);
    animation: shooting 2s ease-out;
    z-index: 999;
  `
  
  document.body.appendChild(star)
  
  setTimeout(() => {
    star.remove()
  }, 2000)
}

const createSparkles = () => {
  for (let i = 0; i < 5; i++) {
    setTimeout(() => {
      const sparkle = document.createElement('span')
      sparkle.innerHTML = '✨'
      sparkle.style.cssText = `
        position: fixed;
        font-size: 1.5em;
        pointer-events: none;
        animation: sparkle 1s ease-out forwards;
        z-index: 1000;
        left: ${Math.random() * window.innerWidth}px;
        top: ${Math.random() * window.innerHeight}px;
      `
      
      document.body.appendChild(sparkle)
      
      setTimeout(() => sparkle.remove(), 1000)
    }, i * 100)
  }
}
</script>

<template>
  <!-- Login Form (shown when not logged in) -->
  <LoginForm 
    v-if="!isLoggedIn" 
    @login-success="handleLoginSuccess"
  />
  
  <!-- Main App (shown when logged in) -->
  <div v-else>
    <div class="stars"></div>
    <div class="twinkling"></div>
    
    <div class="container">
      <div class="header">
        <h1 class="title">✨ Vườn Sao Băng ✨</h1>
        <div class="shooting-star"></div>
      </div>
      
      <div class="welcome-message">
        <p>✨ Hiii công chúa của tớ ❤️👸</p>
        <p>Chào mừng cậu tới <span class="highlight">Vườn Sao Bănggg 🌠</span></p>
        <p>— nơi dành riêng cho trái tim bé nhỏ của cậu 💖💭</p>
      </div>
    
    <div class="main-content">
      <div class="intro-text">
        <p>Đây là nơi mà mỗi khi thấy buồn 😢, thấy mệt 🥺,</p>
        <p>hay đơn giản là có điều gì muốn chia sẻ...</p>
        <p>Thì cậu có thể ghé vào đây viết vài dòng nèee ✍️🌙</p>
      </div>
      
      <div class="diary-section">
        <textarea 
          id="diary-input" 
          v-model="diaryInput"
          placeholder="Viết tâm sự của cậu ở đây nha... 💭✨"
          @focus="createSparkles"
        ></textarea>
        <button 
          class="save-btn" 
          @click="saveEntry"
          :disabled="isLoading"
        >
          <span class="btn-text">
            {{ isLoading ? 'Đang gửi... ⏳' : 'Gửi lên những vì sao 🌟' }}
          </span>
        </button>
      </div>
      
      <div class="comfort-message">
        <p>Dù chỉ là nỗi buồn lướt qua thuiiii,</p>
        <p>thì nhớ là sẽ luôn có ai đó lắng nghe cậu nèee 👂🩵💫</p>
        <br>
        <p>Cho nên là hông cần phải gồng mình lên đâu nha 🥹💪</p>
        <p>Cũng hông cần phải nói điều gì nếu chưa sẵn sàng đâu nè 🤫🫶</p>
      </div>
      
      <div class="quote-box">
        <p class="quote">🌷 "Trong khu vườn này, mọi cảm xúc của công chúa đều được yêu thương." ❤️💞🌈✨</p>
      </div>
      
      <!-- Entry List Component -->
      <!-- <EntryList /> -->
    </div>
    
    <div class="floating-hearts">
      <div class="heart">💖</div>
      <div class="heart">💫</div>
      <div class="heart">🌟</div>
    </div>
  </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Animated starry background */
.stars, .twinkling {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  display: block;
}

.stars {
  background: transparent url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxjaXJjbGUgY3g9IjEwIiBjeT0iMTAiIHI9IjEiIGZpbGw9IndoaXRlIi8+CiAgICA8Y2lyY2xlIGN4PSI0MCIgY3k9IjI1IiByPSIxIiBmaWxsPSJ3aGl0ZSIvPgogICAgPGNpcmNsZSBjeD0iNjAiIGN5PSI1MCIgcj0iMSIgZmlsbD0id2hpdGUiLz4KICAgIDxjaXJjbGUgY3g9IjgwIiBjeT0iODAiIHI9IjEiIGZpbGw9IndoaXRlIi8+CiAgICA8Y2lyY2xlIGN4PSIyMCIgY3k9IjcwIiByPSIxIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4=') repeat;
  z-index: 0;
}

.twinkling {
  background: transparent url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICAgIDxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjIiIGZpbGw9IndoaXRlIiBvcGFjaXR5PSIwLjUiPgogICAgICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9Im9wYWNpdHkiIGR1cj0iM3MiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiB2YWx1ZXM9IjA7MTswIi8+CiAgICA8L2NpcmNsZT4KPC9zdmc+') repeat;
  z-index: 1;
  animation: move-twink-back 200s linear infinite;
}

@keyframes move-twink-back {
  from {background-position: 0 0;}
  to {background-position: -10000px 5000px;}
}

/* Shooting star animation */
.shooting-star {
  position: absolute;
  top: 20px;
  right: -100px;
  width: 100px;
  height: 2px;
  background: linear-gradient(to right, transparent, #fff, transparent);
  animation: shooting 3s ease-in-out infinite;
}

@keyframes shooting {
  0% {
    transform: translateX(0) translateY(0);
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% {
    transform: translateX(-500px) translateY(100px);
    opacity: 0;
  }
}

.container {
  position: relative;
  z-index: 2;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  text-align: center;
  margin-bottom: 30px;
  position: relative;
}

.title {
  color: #fff;
  font-size: 3em;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.5);
}

/* User info styles */
.user-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  padding: 15px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 15px;
  backdrop-filter: blur(10px);
}

.welcome-user {
  color: #ffb6c1;
  font-size: 1.1em;
  font-weight: 500;
}

.logout-btn {
  background: linear-gradient(45deg, #e91e63, #f06292);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9em;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(233, 30, 99, 0.4);
}

.welcome-message {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 30px;
  text-align: center;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}

.welcome-message p {
  color: #fff;
  font-size: 1.2em;
  margin: 10px 0;
  line-height: 1.6;
}

.highlight {
  color: #ffb6c1;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(255, 182, 193, 0.8);
}

.main-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 30px;
  padding: 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.intro-text {
  text-align: center;
  margin-bottom: 30px;
}

.intro-text p {
  color: #4a148c;
  font-size: 1.1em;
  margin: 8px 0;
}

.diary-section {
  margin: 30px 0;
}

#diary-input {
  width: 100%;
  min-height: 200px;
  padding: 20px;
  border: 3px solid #e1bee7;
  border-radius: 20px;
  font-size: 1.1em;
  font-family: inherit;
  resize: vertical;
  background: #fce4ec;
  color: #4a148c;
  transition: all 0.3s ease;
}

#diary-input:focus {
  outline: none;
  border-color: #ba68c8;
  box-shadow: 0 0 20px rgba(186, 104, 200, 0.3);
  background: #fff;
}

.save-btn {
  display: block;
  margin: 20px auto;
  padding: 15px 40px;
  background: linear-gradient(45deg, #e91e63, #ba68c8);
  border: none;
  border-radius: 30px;
  color: white;
  font-size: 1.1em;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(233, 30, 99, 0.4);
}

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(233, 30, 99, 0.6);
}

.save-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.comfort-message {
  text-align: center;
  margin: 40px 0;
  padding: 20px;
  background: #f3e5f5;
  border-radius: 20px;
}

.comfort-message p {
  color: #6a1b9a;
  font-size: 1.05em;
  margin: 5px 0;
}

.quote-box {
  background: linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%);
  border-radius: 20px;
  padding: 25px;
  margin-top: 30px;
  text-align: center;
  border: 2px solid #f48fb1;
}

.quote {
  color: #ad1457;
  font-size: 1.2em;
  font-style: italic;
  font-weight: bold;
}

/* Floating hearts animation */
.floating-hearts {
  position: fixed;
  bottom: 20px;
  right: 20px;
}

.heart {
  position: absolute;
  font-size: 2em;
  animation: float 6s ease-in-out infinite;
}

.heart:nth-child(1) {
  animation-delay: 0s;
  right: 10px;
}

.heart:nth-child(2) {
  animation-delay: 2s;
  right: 50px;
}

.heart:nth-child(3) {
  animation-delay: 4s;
  right: 90px;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(10deg);
  }
}

/* Responsive design */
@media (max-width: 600px) {
  .title {
    font-size: 2em;
  }
  
  .welcome-message p,
  .intro-text p {
    font-size: 1em;
  }
  
  .main-content {
    padding: 20px;
  }
}
</style>

<style>
/* Global styles for animations */
body {
  font-family: 'Arial', sans-serif;
  background: linear-gradient(to bottom, #0a0e27 0%, #1a237e 50%, #311b92 100%);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
  margin: 0;
  padding: 0;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, 0);
  }
}

@keyframes slideUp {
  from {
    opacity: 1;
    transform: translate(-50%, 0);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -20px);
  }
}

@keyframes sparkle {
  0% {
    opacity: 0;
    transform: scale(0) rotate(0deg);
  }
  50% {
    opacity: 1;
    transform: scale(1) rotate(180deg);
  }
  100% {
    opacity: 0;
    transform: scale(0) rotate(360deg);
  }
}
</style>
