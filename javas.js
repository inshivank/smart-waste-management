// Function to toggle OTP container visibility
function toggleOTP() {
    if (!otpSent) {
      sendOTP(); // Simulate OTP sending or implement your OTP sending logic.
      otpSent = true;
      document.getElementById('otp-container').style.display = 'block';
      document.getElementById('otp').required = true;
      document.getElementById('verify-button').style.display = 'inline-block';
      document.getElementById('get-otp-button').style.display = 'none';
    } else {
      alert('OTP has already been sent.');
    }
  }
  
  // Function to verify OTP
  function verifyOTP() {
    const otpEntered = document.getElementById('otp').value;
    if (otpSent && otpEntered.length === 6) {
      alert('OTP verification successful. You can now login.');
      document.getElementById('login-button').style.display = 'inline-block';
      document.getElementById('verify-button').style.display = 'none'; // Hide Verify OTP button
    } else {
      alert('Invalid OTP. Please enter a 6-digit OTP.');
    }
  }
  

  // Define the initMap function
function initMap() {
    // Check if geolocation is available in the user's browser
    if ("geolocation" in navigator) {
        // Create a new map centered at the user's location
        const map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 0, lng: 0 }, // Default center
            zoom: 14, // Zoom level
        });

        // Get the user's geolocation and set the map center
        navigator.geolocation.getCurrentPosition(function (position) {
            const userLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            map.setCenter(userLocation);

            // Add a marker at the user's location
            new google.maps.Marker({
                position: userLocation,
                map: map,
                title: 'Your Location',
            });
        });
    } else {
        // Geolocation is not available in the user's browser
        alert("Geolocation is not available in your browser.");
    }
}












const CONFIGURATION = {
    "locations": [
        // Add your location data here
    ],
    "mapOptions": {
        // Map options
    },
    "mapsApiKey": "YOUR_API_KEY_HERE", // Replace with your API key
    "capabilities": {
        // Capabilities configuration
    }
};

function initMap() {
    new LocatorPlus(CONFIGURATION);
}

function initMap() {
    const map = new google.maps.Map(document.getElementById('gmp-map'), CONFIGURATION.mapOptions);
    const locations = CONFIGURATION.locations;

    // Create an array to store marker objects
    const markers = [];

    // Loop through the locations and add markers to the map
    for (let i = 0; i < locations.length; i++) {
        const location = locations[i];
        const marker = new google.maps.Marker({
            position: location.coords,
            map: map,
            title: location.title,
        });

        // Add a click event listener to each marker
        marker.addListener('click', function () {
            // Get the latitude and longitude of the clicked marker
            const latLng = marker.getPosition();

            // Use the Geocoding API to reverse geocode the coordinates
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ location: latLng }, function (results, status) {
                if (status === 'OK' && results[0]) {
                    // Get the formatted address from the results
                    const address = results[0].formatted_address;

                    // Display the address in an alert or any other way you prefer
                    alert(`Clicked Location: ${address}`);
                } else {
                    alert('Unable to retrieve location details');
                }
            });
        });

        // Store the marker in the markers array
        markers.push(marker);
    }

    // ...
}




























