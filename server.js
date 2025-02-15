const express = require('express');
const twilio = require('twilio');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const app = express();

// Import config
const twilioConfig = require('./config.js');

// Store location updates in memory
let locationUpdates = [];

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// Twilio client
const twilioClient = twilio(twilioConfig.accountSid, twilioConfig.authToken);

// Serve the main application
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Location tracking endpoint
app.post('/api/location-update', (req, res) => {
    const { latitude, longitude, timestamp } = req.body;
    
    // Create location update object
    const locationUpdate = {
        latitude,
        longitude,
        timestamp,
        formattedTime: new Date(timestamp).toLocaleString()
    };

    // Store update in memory
    locationUpdates.push(locationUpdate);
    
    // Keep only last 100 updates
    if (locationUpdates.length > 100) {
        locationUpdates = locationUpdates.slice(-100);
    }

    // Log to file
    const logEntry = `${locationUpdate.formattedTime}: Lat: ${latitude}, Long: ${longitude}\n`;
    fs.appendFile('location_log.txt', logEntry, (err) => {
        if (err) console.error('Error logging location:', err);
    });

    console.log('Location update received:', locationUpdate);
    res.json({ success: true, message: 'Location update received' });
});

// Get location updates endpoint
app.get('/api/location-updates', (req, res) => {
    res.json(locationUpdates);
});

// Clear location updates
app.post('/api/clear-locations', (req, res) => {
    locationUpdates = [];
    res.json({ success: true, message: 'Location updates cleared' });
});

// Generate Twilio access token
app.post('/api/twilio-token', (req, res) => {
    try {
        const capability = new twilio.jwt.ClientCapability({
            accountSid: twilioConfig.accountSid,
            authToken: twilioConfig.authToken
        });

        // Allow making outgoing calls
        capability.addScope(
            new twilio.jwt.ClientCapability.OutgoingClientScope({
                applicationSid: twilioConfig.twimlAppSid
            })
        );

        const token = capability.toJwt();
        res.json({ token });
    } catch (error) {
        console.error('Error generating token:', error);
        res.status(500).json({ error: 'Failed to generate token' });
    }
});

// Test Twilio connection
app.get('/api/test-twilio', async (req, res) => {
    try {
        // Test the Twilio client
        const account = await twilioClient.api.accounts(twilioConfig.accountSid).fetch();
        
        // Try to fetch the phone number details
        const phoneNumber = await twilioClient.incomingPhoneNumbers
            .list({phoneNumber: twilioConfig.twilioNumber})
            .then(numbers => numbers[0]);

        res.json({
            status: 'success',
            account: {
                sid: account.sid,
                status: account.status,
                type: account.type
            },
            phoneNumber: phoneNumber ? {
                phoneNumber: phoneNumber.phoneNumber,
                capabilities: phoneNumber.capabilities
            } : null
        });
    } catch (error) {
        console.error('Twilio test failed:', error);
        res.status(500).json({
            status: 'error',
            message: error.message,
            code: error.code
        });
    }
});

// Handle emergency calls
app.post('/api/emergency-call', async (req, res) => {
    try {
        const { location } = req.body;
        
        // Create TwiML for the call
        const twiml = new twilio.twiml.VoiceResponse();
        twiml.say('Emergency alert! A user needs immediate assistance.');
        if (location) {
            twiml.say(`Location coordinates: ${location.latitude}, ${location.longitude}`);
        }

        console.log('Initiating emergency call from:', twilioConfig.twilioNumber, 'to:', twilioConfig.phoneNumber);

        // Make the call
        const call = await twilioClient.calls.create({
            twiml: twiml.toString(),
            to: twilioConfig.phoneNumber,    // Emergency number
            from: twilioConfig.twilioNumber, // Your Twilio number
            statusCallback: '/api/call-status', // Add status callback
            statusCallbackEvent: ['initiated', 'ringing', 'answered', 'completed'],
            statusCallbackMethod: 'POST'
        });
        
        console.log('Call initiated with SID:', call.sid);
        
        res.json({ 
            success: true, 
            callSid: call.sid,
            message: 'Emergency call initiated',
            status: call.status
        });
    } catch (error) {
        console.error('Error making emergency call:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Failed to initiate emergency call',
            details: error.message,
            code: error.code
        });
    }
});

// Add call status webhook
app.post('/api/call-status', (req, res) => {
    const callStatus = {
        sid: req.body.CallSid,
        status: req.body.CallStatus,
        timestamp: new Date().toISOString()
    };
    
    console.log('Call status update:', callStatus);
    res.sendStatus(200);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Twilio client initialized with account: ${twilioConfig.accountSid}`);
});
