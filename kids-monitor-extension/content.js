navigator.geolocation.getCurrentPosition((pos) => {
  chrome.runtime.sendMessage({
    type: "LOCATION",
    data: {
      latitude: pos.coords.latitude,
      longitude: pos.coords.longitude,
    },
  });
});