<template>
  <div class="booking-container">
    <div class="coming-soon-card">
      <div class="header">
        <h1>📅 Book Appointment</h1>
        <p class="subtitle">Feature Coming Soon</p>
      </div>
      
      <div class="content">
        <div class="feature-description">
          <h2>Planned Functionality</h2>
          <p>We're currently developing an enhanced booking system to provide seamless appointment scheduling for your pets.</p>
          
          <div class="feature-list">
            <div class="feature-item">
              <span class="icon">✓</span>
              <span>Online calendar with real-time availability</span>
            </div>
            <div class="feature-item">
              <span class="icon">✓</span>
              <span>Automated reminders via email/SMS</span>
            </div>
            <div class="feature-item">
              <span class="icon">✓</span>
              <span>Service type selection (vaccination, check-up, etc.)</span>
            </div>
            <div class="feature-item">
              <span class="icon">✓</span>
              <span>Integration with patient records</span>
            </div>
          </div>
        </div>

        <div class="temporary-solution">
          <h3>Need to book an appointment now?</h3>
          <p>Please contact our clinic directly:</p>
          <div class="contact-info">
            <p>📞 Phone: <a href="tel:+1234567890">+123 121 1234</a></p>
            <p>✉ Email: <a href="mailto:appointments@petclinic.com">contact@pettovet.com</a></p>
          </div>
        </div>

        <div class="progress-notice">
          <div class="progress-bar">
            <div class="progress" style="width: 30%"></div>
          </div>
          <p>Development in progress - Estimated completion: Q3 2024</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BookAppointment',
  metaInfo() {
    return {
      title: 'Book Appointment - Coming Soon',
      meta: [
        { name: 'description', content: 'Our enhanced appointment booking system is coming soon. Contact us directly for immediate scheduling needs.' }
      ]
    }
  }
}
</script>

<style scoped>
.booking-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.coming-soon-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  overflow: hidden;
  padding: 2rem;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.header h1 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.subtitle {
  color: #7f8c8d;
  font-size: 1.1rem;
}

.content {
  display: grid;
  gap: 2rem;
}

.feature-description {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.feature-description h2 {
  color: #529597;
  margin-bottom: 1rem;
}

.feature-list {
  display: grid;
  gap: 0.8rem;
  margin-top: 1.5rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.icon {
  color: #4CAF50;
  font-weight: bold;
}

.temporary-solution {
  background: #e3f2fd;
  padding: 1.5rem;
  border-radius: 8px;
  border-left: 4px solid #2196F3;
}

.temporary-solution h3 {
  color: #0d47a1;
  margin-bottom: 0.8rem;
}

.contact-info {
  margin-top: 1rem;
}

.contact-info a {
  color: #2196F3;
  text-decoration: none;
}

.contact-info a:hover {
  text-decoration: underline;
}

.progress-notice {
  margin-top: 1.5rem;
  text-align: center;
}

.progress-bar {
  height: 8px;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 1rem;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #529597;
  border-radius: 4px;
  transition: width 0.4s ease;
}

@media (max-width: 600px) {
  .coming-soon-card {
    padding: 1.5rem;
  }
  
  .header h1 {
    font-size: 1.5rem;
  }
}
</style>