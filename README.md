# Women Safety - Emergency SOS Application 

## Project Overview
A progressive web application (PWA) designed to enhance women's safety through immediate emergency response and incident reporting capabilities. This project combines real-time location tracking, audio recording, and emergency services integration to provide a comprehensive safety solution.

 # Team Techvanguard Presents

#### 1. Emergency SOS System
- **One-Touch Emergency Activation**: Large, accessible SOS button for immediate emergency response
- **Automatic Location Tracking**: Real-time GPS location monitoring and sharing
- **Audio Recording**: Automatic environment audio recording during emergencies
- **Direct Emergency Services**: Instant connection to emergency number (1090)

#### 2. Smart Status Monitoring
- **Location Status**: Real-time location tracking and sharing
- **Audio Status**: Active audio recording monitoring
- **Call Status**: Emergency call connection status

#### 3. Incident Reporting System
- **Multiple Report Types**:
  - Text-based complaints
  - Audio-based reporting
  - Vehicle-related incidents
- **Detailed Incident Categories**: Comprehensive selection of incident types
- **Evidence Attachment**: Support for adding photos and recordings

### Technical Features
- **Progressive Web App (PWA)**: Install and use as a native app
- **Offline Functionality**: Works without internet connection
- **Real-time Updates**: Live status monitoring and updates
- **Responsive Design**: Works on all devices and screen sizes
- **Secure Data Handling**: Protected user information and incident data

### Technologies Used
- HTML5, CSS3, JavaScript
- Service Workers for offline functionality
- Geolocation API
- MediaRecorder API
- WebSocket for real-time communication
- Font Awesome for UI elements

### Local Development Setup
After the "Installation" section and before "Privacy & Security", let's add:

Here’s the formatted section ready for direct pasting into your README file:  

```
## Local Development Setup  

### 1. Clone the Repository  
```bash
git clone https://github.com/RAVI-RAJPUT-UMATH/Women_Safety.git
cd Women_Safety
```

### 2. Setup Local Server  
You can use any local server to run the application:  

- **Python**:  
  ```bash
  python -m http.server 8000
  ```  
- **Node.js** (Install http-server globally first):  
  ```bash
  npm install -g http-server  
  http-server
  ```  
- **VS Code**: Use the `"Live Server"` extension for easy hosting.  

### 3. Access the Application  
Once the server is running, open your browser and navigate to:  

- **Python Server**: [http://localhost:8000](http://localhost:8000)  
- **http-server (Node.js)**: [http://localhost:8080](http://localhost:8080)  
- **Live Server (VS Code)**: [http://localhost:5500](http://localhost:5500)  

### 4. Enable Required Permissions  
To ensure the application functions properly, allow the following permissions when prompted:  

- **Location Access**: Required for real-time tracking.  
- **Microphone Access**: Needed for audio recording features.  
- **Notifications**: Enables emergency alerts.  

### 5. Testing the Features  
After setup, test the key functionalities:  

- ✅ Verify the **SOS button** functionality.  
- ✅ Ensure **location tracking** is working.  
- ✅ Test **audio recording** capabilities.  
- ✅ Try submitting a **test complaint**.  

---

## Project Structure  

| File | Description |
|------|-------------|
| `index.html` | Main application interface |
| `app.js` | Core application logic |
| `styles.css` | Application styling |
| `density-visualization.js` | Location visualization |
| `service-worker.js` | Offline functionality |
| `manifest.json` | PWA configuration |

---

### **Browser Requirements**  
Make sure you are using a modern browser that supports:  

- 🌍 **Geolocation API** (For location tracking)  
- 🎤 **MediaRecorder API** (For audio recording)  
- 🔄 **Service Workers** (For offline support)  
- 🔔 **Notifications API** (For emergency alerts)  
  

### Privacy & Security
- Location data is only shared during active emergencies
- Audio recording requires explicit user permission
- All data is encrypted and securely transmitted
- No personal information is stored without consent

### Impact & Innovation
- **Immediate Response**: Reduces emergency response time
- **Evidence Collection**: Automatic documentation of incidents
- **Accessibility**: Works on any device with a browser
- **Offline Support**: Functions in areas with poor connectivity

### Target Users
- Women in urban and rural areas
- College students and working professionals
- Late-night commuters
- Anyone concerned about personal safety

### Future Enhancements
- Integration with local police stations
- Community alert system
- AI-powered threat detection
- Multi-language support
- Emergency contact network

### Emergency Contacts
- Women Helpline: 1090
- Police Emergency: 100
- Ambulance: 108

## Team Information
- Project developed for Women Safety 
- Team committed to creating technology for social impact
- Focus on practical, accessible solutions for real-world problems

---
*This project was created with the goal of making our communities safer for women through innovative technology solutions.*
