<script setup>
import { ref, onMounted } from 'vue'
import { buildApiUrl, ENDPOINTS } from '../config/api.js'

const entries = ref([])
const isLoading = ref(true)
const showEntries = ref(false)

const fetchEntries = async () => {
  try {
    const token = localStorage.getItem('authToken')
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    
    if (!token || !user._id) {
      console.error('No authentication token or user ID found')
      return
    }

    const response = await fetch(buildApiUrl(ENDPOINTS.entries.userEntries(user._id)), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    
    if (response.ok) {
      const data = await response.json()
      entries.value = data.data || data // Handle different response formats
    } else if (response.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      window.location.reload()
    }
  } catch (error) {
    console.error('Error fetching entries:', error)
  } finally {
    isLoading.value = false
  }
}

const toggleEntries = () => {
  showEntries.value = !showEntries.value
  if (showEntries.value && entries.value.length === 0) {
    fetchEntries()
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

onMounted(() => {
  fetchEntries()
  
  // Listen for new entries
  window.addEventListener('entry-added', () => {
    if (showEntries.value) {
      fetchEntries()
    }
  })
})
</script>

<template>
  <div class="entry-list-container">
    <button class="toggle-btn" @click="toggleEntries">
      <span v-if="!showEntries">🌟 Xem những tâm sự đã gửi</span>
      <span v-else>🌙 Ẩn tâm sự</span>
    </button>
    
    <div v-if="showEntries" class="entries-container">
      <div v-if="isLoading" class="loading">
        <p>Đang tải những vì sao... ✨</p>
      </div>
      
      <div v-else-if="entries.length === 0" class="no-entries">
        <p>Chưa có tâm sự nào được gửi lên những vì sao 🌌</p>
      </div>
      
      <div v-else class="entries-list">
        <h3 class="entries-title">💫 Những tâm sự của cậu</h3>
        <div 
          v-for="entry in entries" 
          :key="entry._id" 
          class="entry-item"
        >
          <div class="entry-content">{{ entry.content }}</div>
          <div class="entry-date">{{ formatDate(entry.createdAt) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.entry-list-container {
  margin-top: 30px;
}

.toggle-btn {
  background: linear-gradient(45deg, #9c27b0, #e91e63);
  border: none;
  border-radius: 25px;
  color: white;
  cursor: pointer;
  font-size: 1em;
  padding: 12px 30px;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(156, 39, 176, 0.3);
  display: block;
  margin: 0 auto;
}

.toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(156, 39, 176, 0.4);
}

.entries-container {
  margin-top: 20px;
  animation: slideDown 0.5s ease-out;
}

.loading, .no-entries {
  text-align: center;
  padding: 30px;
  color: #6a1b9a;
  font-size: 1.1em;
}

.entries-title {
  text-align: center;
  color: #6a1b9a;
  font-size: 1.3em;
  margin-bottom: 20px;
}

.entries-list {
  max-height: 400px;
  overflow-y: auto;
  background: #f3e5f5;
  border-radius: 20px;
  padding: 20px;
}

.entry-item {
  background: white;
  border-radius: 15px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #ba68c8;
}

.entry-content {
  color: #4a148c;
  font-size: 1em;
  line-height: 1.5;
  margin-bottom: 8px;
}

.entry-date {
  color: #9c27b0;
  font-size: 0.85em;
  text-align: right;
  font-style: italic;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Scrollbar styling */
/* .entries-list::-webkit-scrollbar {
  width: 8px;
}

.entries-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.entries-list::-webkit-scrollbar-thumb {
  background: #ba68c8;
  border-radius: 4px;
}

.entries-list::-webkit-scrollbar-thumb:hover {
  background: #9c27b0;
} */
</style>
