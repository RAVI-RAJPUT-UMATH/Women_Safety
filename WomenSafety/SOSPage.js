import React, { useState, useEffect } from 'react';
import { FaExclamationTriangle, FaMapMarkerAlt, FaHistory } from 'react-icons/fa';

const SOSPage = () => {
  const [watchId, setWatchId] = useState(null);
  const [tracking, setTracking] = useState(false);
  const [location, setLocation] = useState(null);
  const [callStatus, setCallStatus] = useState('');
  const [locationHistory, setLocationHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [locationUpdateStatus, setLocationUpdateStatus] = useState('');

  // Fetch location history periodically
  useEffect(() => {
    let interval;
    if (tracking) {
      interval = setInterval(async () => {
        try {
          const response = await fetch('/api/location-updates');
          const updates = await response.json();
          setLocationHistory(updates);
        } catch (error) {
          console.error('Failed to fetch location history:', error);
        }
      }, 5000); // Update every 5 seconds
    }
    return () => clearInterval(interval);
  }, [tracking]);

  const sendLocationUpdate = async (locationData) => {
    try {
      const response = await fetch('/api/location-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...locationData,
          timestamp: new Date().toISOString()
        }),
      });

      const data = await response.json();
      if (data.success) {
        setLocationUpdateStatus('Location shared successfully ');
        setTimeout(() => setLocationUpdateStatus(''), 3000);
      }
    } catch (error) {
      console.error('Failed to send location update:', error);
      setLocationUpdateStatus('Failed to share location ');
    }
  };

  const makeEmergencyCall = async (locationData) => {
    try {
      const response = await fetch('/api/emergency-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          location: locationData
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setCallStatus('Emergency call initiated');
      } else {
        setCallStatus('Failed to initiate call - falling back to direct dialing');
        window.location.href = 'tel:1090';
      }
    } catch (error) {
      console.error('Failed to make emergency call:', error);
      setCallStatus('Failed to initiate call - falling back to direct dialing');
      window.location.href = 'tel:1090';
    }
  };

  const shareLocation = async (position) => {
    const { latitude, longitude } = position.coords;
    const locationData = { latitude, longitude };
    
    try {
      setLocation(locationData);
      await sendLocationUpdate(locationData);
      await makeEmergencyCall(locationData);
    } catch (error) {
      console.error('Failed to share location:', error);
      setLocationUpdateStatus('Error sharing location ');
    }
  };

  const startLocationTracking = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser');
      return;
    }

    const id = navigator.geolocation.watchPosition(
      shareLocation,
      (error) => {
        console.error('Location error:', error);
        setLocationUpdateStatus('Location error: ' + error.message);
        makeEmergencyCall(null);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000
      }
    );

    setWatchId(id);
    setTracking(true);

    // Stop tracking after 10 minutes
    setTimeout(() => {
      stopLocationTracking();
    }, 10 * 60 * 1000);
  };

  const stopLocationTracking = async () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setWatchId(null);
      setTracking(false);
      setLocationUpdateStatus('Location tracking stopped');
      
      // Clear location history
      try {
        await fetch('/api/clear-locations', { method: 'POST' });
      } catch (error) {
        console.error('Failed to clear location history:', error);
      }
    }
  };

  const handleSOSClick = async () => {
    setCallStatus('Initiating emergency response...');
    setLocationUpdateStatus('Starting location tracking...');
    startLocationTracking();
  };

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopLocationTracking();
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
      <button
        onClick={handleSOSClick}
        className="bg-red-600 text-white rounded-full w-40 h-40 flex flex-col items-center justify-center shadow-lg hover:bg-red-700 transition-colors mb-8"
        disabled={tracking}
      >
        <FaExclamationTriangle className="text-4xl mb-2" />
        <span className="text-2xl font-bold">SOS</span>
      </button>

      {/* Status Section */}
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">Status Updates</h3>
        {callStatus && (
          <div className="text-gray-800 mb-2">
            <p className="font-semibold">Call Status:</p>
            <p>{callStatus}</p>
          </div>
        )}
        {locationUpdateStatus && (
          <div className="text-gray-800 mb-2">
            <p className="font-semibold">Location Status:</p>
            <p>{locationUpdateStatus}</p>
          </div>
        )}
        {location && (
          <div className="text-gray-800 mb-2">
            <p className="font-semibold">Current Location:</p>
            <p>Latitude: {location.latitude.toFixed(6)}</p>
            <p>Longitude: {location.longitude.toFixed(6)}</p>
            <a 
              href={`https://www.google.com/maps?q=${location.latitude},${location.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 flex items-center mt-1"
            >
              <FaMapMarkerAlt className="mr-1" /> View on Map
            </a>
          </div>
        )}
      </div>

      {/* Location History Section */}
      {locationHistory.length > 0 && (
        <div className="w-full max-w-md">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="flex items-center justify-center w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-2 px-4 rounded-lg mb-2"
          >
            <FaHistory className="mr-2" />
            {showHistory ? 'Hide Location History' : 'Show Location History'}
          </button>
          
          {showHistory && (
            <div className="bg-white rounded-lg shadow-md p-4 max-h-60 overflow-y-auto">
              <h4 className="font-semibold mb-2">Location Updates</h4>
              {locationHistory.map((update, index) => (
                <div key={index} className="text-sm mb-2 pb-2 border-b border-gray-200">
                  <p className="text-gray-600">{update.formattedTime}</p>
                  <p className="text-gray-800">
                    Lat: {update.latitude.toFixed(6)}, Long: {update.longitude.toFixed(6)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <p className="text-center text-gray-600 max-w-md mt-4">
        {tracking 
          ? 'Emergency services have been notified and are tracking your location. Stay calm and remain in a safe place.'
          : 'Press the SOS button in case of emergency. This will immediately alert nearby authorities and share your location.'}
      </p>
    </div>
  );
};

export default SOSPage;
