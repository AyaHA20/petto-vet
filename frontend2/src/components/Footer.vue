<template>
  <footer class="footer">
    <div class="footer-container">
      
      <!-- Quick Links -->
      <div class="footer-section">
        <h3>Quick Links</h3>
        <ul>
          <li><a href="/homepage">Homepage</a></li>
          <li><a href="/patientlist">Patient List</a></li>
          <li><a href="/addpatient">Add Patient</a></li>
          <li><a href="/bookappointment">Book Appointment</a></li>
        </ul>
      </div>

      <!-- Get in Touch -->
      <div class="footer-section">
        <h3>Get in touch</h3>
        <ul>
          <li>
            <img src="@/assets/footer-icons/email-icon.png" alt="Email">
            <span>contact@pettovet.com</span>
          </li>
          <li>
            <img src="@/assets/footer-icons/fb-icon.png" alt="Facebook"> 
            <span>PettoVet Community</span>
          </li>
          <li>
            <img src="@/assets/footer-icons/ig-icon.png" alt="Instagram"> 
            <span>PettoVet Paws</span>
          </li>
          <li>
            <img src="@/assets/footer-icons/linkedin-icon.png" alt="LinkedIn"> 
            <span>PettoVet Professionals</span>
          </li>
        </ul>
      </div>

      <!-- Footer Image -->
      <div class="footer-image">
        <img src="@/assets/footer-icons/dog-footer.gif" alt="PettoVet Logo">
      </div>

    </div>

    <!-- Copyright -->
    <div class="footer-bottom">
      © 2025 PettoVet. All rights reserved
    </div>
  </footer>
</template>

<style scoped>
/* Footer Styling */
.footer {
  background-image: url('@/assets/footer-icons/bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  padding: 30px 15px;
  color: black;
  width: 100%;
}

/* Main Container */
.footer-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1100px;
  margin: 0 auto;
  gap: 20px;
}

/* Footer Sections */
.footer-section {
  flex: 1;
  min-width: 220px;
}

.footer-section h3 {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.footer-section ul {
  list-style: none;
  padding: 0;
}

.footer-section ul li {
  margin: 8px 0;
  display: flex;
  align-items: center;
}

.footer-section ul li img {
  width: 20px;
  height: 20px;
  margin-right: 10px;
}

.footer-section ul li a {
  text-decoration: none;
  color: black;
  font-size: 14px;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: gray;
}

/* Footer Image */
.footer-image img {
  width: 100px;
  max-width: 100%;
}

/* Footer Bottom */
.footer-bottom {
  text-align:left;
  margin-left: 100px;
  font-size: 16px;
  color: #555;
  margin-top: 20px;
  padding-top: 10px;
  border-top: 1px solid rgba(0, 0, 0, 0.2);
}

/* Responsive Design */
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer-section ul li {
    justify-content: center;
  }

  .footer-image {
    text-align: center;
    margin-top: 10px;
  }
}
</style>
