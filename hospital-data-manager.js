// Hospital Data Management System
// This script manages all patient data across the hospital management system

class HospitalDataManager {
  constructor() {
    this.storageKeys = {
      patientData: "patientMedicalData",
      appointments: "appointments",
      healthRecords: "healthRecords",
      labResults: "labResults",
      visitHistory: "visitHistory",
      prescriptions: "prescriptions",
    }
    this.init()
  }

  init() {
    // Initialize empty data structures if they don't exist
    this.initializeStorage()

    // Set up event listeners for cross-page communication
    this.setupStorageListener()

    console.log("Hospital Data Manager initialized")
  }

  initializeStorage() {
    // Initialize patient data if not exists
    if (!localStorage.getItem(this.storageKeys.patientData)) {
      localStorage.setItem(this.storageKeys.patientData, JSON.stringify({}))
    }

    // Initialize appointments array if not exists
    if (!localStorage.getItem(this.storageKeys.appointments)) {
      localStorage.setItem(this.storageKeys.appointments, JSON.stringify([]))
    }

    // Initialize health records if not exists
    if (!localStorage.getItem(this.storageKeys.healthRecords)) {
      localStorage.setItem(
        this.storageKeys.healthRecords,
        JSON.stringify({
          labResults: [],
          visitHistory: [],
          prescriptions: [],
        }),
      )
    }
  }

  setupStorageListener() {
    // Listen for storage changes across tabs/pages
    window.addEventListener("storage", (e) => {
      if (Object.values(this.storageKeys).includes(e.key)) {
        this.handleDataUpdate(e.key, e.newValue)
      }
    })
  }

  handleDataUpdate(key, newValue) {
    // Handle real-time updates when data changes
    console.log(`Data updated for key: ${key}`)

    // Trigger page-specific updates based on current page
    const currentPage = this.getCurrentPage()

    switch (currentPage) {
      case "dashboard":
        this.updateDashboard()
        break
      case "appointments":
        this.updateAppointmentsPage()
        break
      case "healthrecords":
        this.updateHealthRecordsPage()
        break
    }
  }

  getCurrentPage() {
    const path = window.location.pathname
    if (path.includes("dash.html") || path.endsWith("/")) return "dashboard"
    if (path.includes("appointments.html")) return "appointments"
    if (path.includes("healthrecords.html")) return "healthrecords"
    if (path.includes("settings.html")) return "settings"
    return "unknown"
  }

  // Patient Data Methods
  getPatientData() {
    try {
      const data = localStorage.getItem(this.storageKeys.patientData)
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error("Error getting patient data:", error)
      return {}
    }
  }

  setPatientData(data) {
    try {
      localStorage.setItem(this.storageKeys.patientData, JSON.stringify(data))
      return true
    } catch (error) {
      console.error("Error setting patient data:", error)
      return false
    }
  }

  isPatientRegistered() {
    const patientData = this.getPatientData()
    return patientData && patientData.firstName && patientData.lastName
  }

  // Appointments Methods
  getAppointments() {
    try {
      const data = localStorage.getItem(this.storageKeys.appointments)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error getting appointments:", error)
      return []
    }
  }

  addAppointment(appointment) {
    try {
      const appointments = this.getAppointments()
      appointment.id = this.generateId()
      appointment.createdAt = new Date().toISOString()
      appointments.push(appointment)
      localStorage.setItem(this.storageKeys.appointments, JSON.stringify(appointments))
      return appointment.id
    } catch (error) {
      console.error("Error adding appointment:", error)
      return null
    }
  }

  getUpcomingAppointments() {
    const appointments = this.getAppointments()
    const now = new Date()

    return appointments
      .filter((apt) => {
        const aptDate = new Date(apt.appointmentDate)
        return aptDate >= now && apt.status !== "cancelled"
      })
      .sort((a, b) => new Date(a.appointmentDate) - new Date(b.appointmentDate))
  }

  // Health Records Methods
  getHealthRecords() {
    try {
      const data = localStorage.getItem(this.storageKeys.healthRecords)
      return data ? JSON.parse(data) : { labResults: [], visitHistory: [], prescriptions: [] }
    } catch (error) {
      console.error("Error getting health records:", error)
      return { labResults: [], visitHistory: [], prescriptions: [] }
    }
  }

  addLabResult(labResult) {
    try {
      const healthRecords = this.getHealthRecords()
      labResult.id = this.generateId()
      labResult.createdAt = new Date().toISOString()
      healthRecords.labResults.push(labResult)
      localStorage.setItem(this.storageKeys.healthRecords, JSON.stringify(healthRecords))
      return labResult.id
    } catch (error) {
      console.error("Error adding lab result:", error)
      return null
    }
  }

  addVisitRecord(visit) {
    try {
      const healthRecords = this.getHealthRecords()
      visit.id = this.generateId()
      visit.createdAt = new Date().toISOString()
      healthRecords.visitHistory.push(visit)
      localStorage.setItem(this.storageKeys.healthRecords, JSON.stringify(healthRecords))
      return visit.id
    } catch (error) {
      console.error("Error adding visit record:", error)
      return null
    }
  }

  addPrescription(prescription) {
    try {
      const healthRecords = this.getHealthRecords()
      prescription.id = this.generateId()
      prescription.createdAt = new Date().toISOString()
      healthRecords.prescriptions.push(prescription)
      localStorage.setItem(this.storageKeys.healthRecords, JSON.stringify(healthRecords))
      return prescription.id
    } catch (error) {
      console.error("Error adding prescription:", error)
      return null
    }
  }

  // Dashboard Methods
  updateDashboard() {
    if (this.getCurrentPage() !== "dashboard") return

    const patientData = this.getPatientData()
    const appointments = this.getUpcomingAppointments()
    const healthRecords = this.getHealthRecords()

    // Update user info in navbar
    this.updateNavbarUserInfo(patientData)

    // Update dashboard cards
    this.updateDashboardCards(appointments, healthRecords)

    // Update recent activity
    this.updateRecentActivity(appointments, healthRecords)

    // Update upcoming appointments section
    this.updateUpcomingAppointmentsSection(appointments)
  }

  updateNavbarUserInfo(patientData) {
    const userAvatar = document.getElementById("userAvatar")
    const userName = document.getElementById("userName")

    if (patientData.firstName) {
      if (userAvatar) userAvatar.textContent = patientData.firstName.charAt(0).toUpperCase()
      if (userName) userName.textContent = patientData.firstName

      // Update welcome message
      const welcomeHeader = document.querySelector(".dashboard-header h1")
      if (welcomeHeader) {
        welcomeHeader.textContent = `Welcome, ${patientData.firstName}!`
      }
    } else {
      // Default values for new users
      if (userAvatar) userAvatar.textContent = "U"
      if (userName) userName.textContent = "User"

      const welcomeHeader = document.querySelector(".dashboard-header h1")
      if (welcomeHeader) {
        welcomeHeader.textContent = "Welcome!"
      }
    }
  }

  updateDashboardCards(appointments, healthRecords) {
    // Update appointments card
    const appointmentCard = document.querySelector(".card .card-value")
    if (appointmentCard) {
      appointmentCard.textContent = appointments.length
    }

    // Update prescriptions card
    const prescriptionCards = document.querySelectorAll(".card .card-value")
    if (prescriptionCards.length > 1) {
      const activePrescriptions = healthRecords.prescriptions.filter((p) => p.status === "active").length
      prescriptionCards[1].textContent = activePrescriptions
    }
  }

  updateRecentActivity(appointments, healthRecords) {
    const activityList = document.querySelector(".activity-list")
    if (!activityList) return

    // Clear existing activities
    activityList.innerHTML = ""

    // Combine and sort recent activities
    const recentActivities = []

    // Add recent appointments
    appointments.slice(0, 2).forEach((apt) => {
      recentActivities.push({
        type: "appointment",
        title: "Appointment Confirmed",
        description: `${apt.doctor} - ${apt.serviceType}`,
        date: apt.createdAt,
        icon: "check",
      })
    })

    // Add recent lab results
    healthRecords.labResults.slice(-2).forEach((lab) => {
      recentActivities.push({
        type: "lab",
        title: "New Lab Results Added",
        description: lab.testName || "Lab Test Results",
        date: lab.createdAt,
        icon: "plus",
      })
    })

    // Sort by date (most recent first)
    recentActivities.sort((a, b) => new Date(b.date) - new Date(a.date))

    // Display activities or show empty state
    if (recentActivities.length === 0) {
      activityList.innerHTML = `
                <li class="activity-item">
                    <div class="activity-icon">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
                            <path d="M12 6v6l4 2" stroke="currentColor" stroke-width="2"/>
                        </svg>
                    </div>
                    <div class="activity-details">
                        <h4 class="activity-title">No Recent Activity</h4>
                        <div class="activity-meta">
                            <span>Complete your registration to see activity</span>
                            <span>-</span>
                        </div>
                    </div>
                </li>
            `
    } else {
      recentActivities.slice(0, 3).forEach((activity) => {
        const activityItem = document.createElement("li")
        activityItem.className = "activity-item"
        activityItem.innerHTML = `
                    <div class="activity-icon">
                        ${this.getActivityIcon(activity.icon)}
                    </div>
                    <div class="activity-details">
                        <h4 class="activity-title">${activity.title}</h4>
                        <div class="activity-meta">
                            <span>${activity.description}</span>
                            <span>${this.formatDate(activity.date)}</span>
                        </div>
                    </div>
                `
        activityList.appendChild(activityItem)
      })
    }
  }

  updateUpcomingAppointmentsSection(appointments) {
    const appointmentList = document.querySelector(".appointment-list")
    if (!appointmentList) return

    // Clear existing appointments
    appointmentList.innerHTML = ""

    if (appointments.length === 0) {
      appointmentList.innerHTML = `
                <li class="appointment-item">
                    <div class="appointment-date">
                        <div class="appointment-day">--</div>
                        <div class="appointment-month">---</div>
                    </div>
                    <div class="appointment-details">
                        <h4 class="appointment-title">No Upcoming Appointments</h4>
                        <div class="appointment-doctor">Schedule your first appointment</div>
                        <div class="appointment-time">-</div>
                    </div>
                    <div class="appointment-actions">
                        <a href="appointments.html" class="appointment-btn reschedule-btn">Schedule Now</a>
                    </div>
                </li>
            `
    } else {
      appointments.slice(0, 3).forEach((apt) => {
        const aptDate = new Date(apt.appointmentDate)
        const appointmentItem = document.createElement("li")
        appointmentItem.className = "appointment-item"
        appointmentItem.innerHTML = `
                    <div class="appointment-date">
                        <div class="appointment-day">${aptDate.getDate().toString().padStart(2, "0")}</div>
                        <div class="appointment-month">${aptDate.toLocaleDateString("en-US", { month: "short" })}</div>
                    </div>
                    <div class="appointment-details">
                        <h4 class="appointment-title">${this.formatServiceType(apt.serviceType)}</h4>
                        <div class="appointment-doctor">${apt.doctor}</div>
                        <div class="appointment-time">${apt.appointmentTime}</div>
                    </div>
                    <div class="appointment-actions">
                        <button class="appointment-btn reschedule-btn" onclick="rescheduleAppointment('${apt.id}')">Reschedule</button>
                        <button class="appointment-btn cancel-btn" onclick="cancelAppointment('${apt.id}')">Cancel</button>
                    </div>
                `
        appointmentList.appendChild(appointmentItem)
      })
    }
  }

  // Appointments Page Methods
  updateAppointmentsPage() {
    if (this.getCurrentPage() !== "appointments") return

    const patientData = this.getPatientData()

    // Update navbar user info
    this.updateNavbarUserInfo(patientData)

    // Pre-fill form if patient data exists
    if (this.isPatientRegistered()) {
      this.prefillAppointmentForm(patientData)
    }
  }

  prefillAppointmentForm(patientData) {
    // Pre-fill personal information if available
    const fields = {
      firstName: patientData.firstName,
      middleName: patientData.middleName,
      lastName: patientData.lastName,
      address: patientData.address,
      mobileNumber: patientData.mobileNumber,
      birthday: patientData.birthday,
      gender: patientData.gender,
      email: patientData.email,
      emergencyContactName: patientData.emergencyContactName,
      emergencyContactNumber: patientData.emergencyContactNumber,
    }

    Object.entries(fields).forEach(([fieldId, value]) => {
      const field = document.getElementById(fieldId)
      if (field && value) {
        field.value = value
      }
    })
  }

  // Health Records Page Methods
  updateHealthRecordsPage() {
    if (this.getCurrentPage() !== "healthrecords") return

    const patientData = this.getPatientData()
    const healthRecords = this.getHealthRecords()

    // Update navbar user info
    this.updateNavbarUserInfo(patientData)

    // Update medical summary
    this.updateMedicalSummary(patientData)

    // Update vaccination table
    this.updateVaccinationTable(patientData)

    // Update lab results, visit history, etc.
    this.updateHealthRecordsTables(healthRecords)
  }

  updateMedicalSummary(patientData) {
    if (!this.isPatientRegistered()) {
      // Show empty state for unregistered users
      this.showEmptyMedicalSummary()
      return
    }

    // Update with actual patient data
    const updates = {
      bloodTypeValue: patientData.bloodType || "Not specified",
      allergiesValue: this.getAllergiesText(patientData),
      chronicConditionsValue: this.getConditionsText(patientData),
      currentMedicationsValue: this.getMedicationsText(patientData),
      pastSurgeriesValue: this.getSurgeriesText(patientData),
      immunizationsValue: this.getImmunizationsText(patientData),
    }

    Object.entries(updates).forEach(([elementId, value]) => {
      const element = document.getElementById(elementId)
      if (element) {
        element.textContent = value
      }
    })
  }

  showEmptyMedicalSummary() {
    const emptyValues = {
      bloodTypeValue: "Not available",
      allergiesValue: "Not available",
      chronicConditionsValue: "Not available",
      currentMedicationsValue: "Not available",
      pastSurgeriesValue: "Not available",
      familyHistoryValue: "Not available",
      immunizationsValue: "Not available",
    }

    Object.entries(emptyValues).forEach(([elementId, value]) => {
      const element = document.getElementById(elementId)
      if (element) {
        element.textContent = value
      }
    })
  }

  updateVaccinationTable(patientData) {
    if (!this.isPatientRegistered()) {
      this.showEmptyVaccinationTable()
      return
    }

    const updates = {
      vaccinationPatientId: patientData.patientIdNo || "Not specified",
      vaccinationVaccineName: patientData.vaccineName || "Not specified",
      vaccinationVaccineType: patientData.vaccineType || "Not specified",
      vaccinationVaccineDate: patientData.vaccineDate
        ? new Date(patientData.vaccineDate).toLocaleDateString()
        : "Not specified",
      vaccinationNextDose: patientData.nextDose || "Not specified",
      vaccinationAdministeredBy: patientData.administeredBy || "Not specified",
      vaccinationRemarks: patientData.vaccineRemarks || "Not specified",
    }

    Object.entries(updates).forEach(([elementId, value]) => {
      const element = document.getElementById(elementId)
      if (element) {
        element.textContent = value
      }
    })
  }

  showEmptyVaccinationTable() {
    const emptyValues = {
      vaccinationPatientId: "Not available",
      vaccinationVaccineName: "Not available",
      vaccinationVaccineType: "Not available",
      vaccinationVaccineDate: "Not available",
      vaccinationNextDose: "Not available",
      vaccinationAdministeredBy: "Not available",
      vaccinationRemarks: "Not available",
    }

    Object.entries(emptyValues).forEach(([elementId, value]) => {
      const element = document.getElementById(elementId)
      if (element) {
        element.textContent = value
      }
    })
  }

  // Utility Methods
  getAllergiesText(patientData) {
    if (patientData.hasAllergies === "Yes" && patientData.allergySpecification) {
      return patientData.allergySpecification
    }
    return "None reported"
  }

  getConditionsText(patientData) {
    if (patientData.medicalConditions && patientData.medicalConditions.length > 0) {
      let conditions = patientData.medicalConditions.join(", ")
      if (patientData.medicalConditions.includes("Other") && patientData.otherConditionDetails) {
        conditions += `, ${patientData.otherConditionDetails}`
      }
      return conditions
    }
    return "None reported"
  }

  getMedicationsText(patientData) {
    if (patientData.hasMedications === "Yes" && patientData.medications && patientData.medications.length > 0) {
      const medicationsList = patientData.medications
        .filter((med) => med.name || med.dosage || med.reason)
        .map((med) => {
          let medText = med.name || "Unknown medication"
          if (med.dosage) medText += ` ${med.dosage}`
          if (med.reason) medText += ` (${med.reason})`
          return medText
        })
      return medicationsList.length > 0 ? medicationsList.join(", ") : "None reported"
    }
    return "None reported"
  }

  getSurgeriesText(patientData) {
    if (patientData.hasSurgeries === "Yes" && patientData.surgerySpecification) {
      return patientData.surgerySpecification
    }
    return "None reported"
  }

  getImmunizationsText(patientData) {
    if (patientData.vaccineName && patientData.vaccineType) {
      let immunizations = `${patientData.vaccineType}`
      if (patientData.vaccineDate) {
        const date = new Date(patientData.vaccineDate)
        immunizations += ` (${date.getFullYear()})`
      }
      return immunizations
    }
    return "None reported"
  }

  formatServiceType(serviceType) {
    return serviceType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
  }

  formatDate(dateString) {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return "Today"
    if (diffDays === 1) return "Yesterday"
    if (diffDays < 7) return `${diffDays} days ago`
    return date.toLocaleDateString()
  }

  getActivityIcon(iconType) {
    const icons = {
      check: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
      plus: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12H15M12 9V15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
      cancel: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M16 8L8 16M8 8L16 16M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>`,
    }
    return icons[iconType] || icons.check
  }

  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Public API Methods
  clearAllData() {
    Object.values(this.storageKeys).forEach((key) => {
      localStorage.removeItem(key)
    })
    this.initializeStorage()
    console.log("All hospital data cleared")
  }

  exportData() {
    const data = {}
    Object.entries(this.storageKeys).forEach(([name, key]) => {
      data[name] = JSON.parse(localStorage.getItem(key) || "{}")
    })
    return data
  }

  importData(data) {
    Object.entries(data).forEach(([name, value]) => {
      const key = this.storageKeys[name]
      if (key) {
        localStorage.setItem(key, JSON.stringify(value))
      }
    })
    console.log("Hospital data imported")
  }
}

// Global functions for appointment management
window.rescheduleAppointment = (appointmentId) => {
  alert(`Reschedule appointment ${appointmentId} - This would open a reschedule dialog`)
}

window.cancelAppointment = (appointmentId) => {
  if (confirm("Are you sure you want to cancel this appointment?")) {
    const dataManager = window.hospitalDataManager
    const appointments = dataManager.getAppointments()
    const updatedAppointments = appointments.map((apt) =>
      apt.id === appointmentId ? { ...apt, status: "cancelled" } : apt,
    )
    localStorage.setItem("appointments", JSON.stringify(updatedAppointments))
    dataManager.updateDashboard()
    alert("Appointment cancelled successfully")
  }
}

// Initialize the data manager when the script loads
window.hospitalDataManager = new HospitalDataManager()

console.log("Hospital Data Management System loaded successfully")
