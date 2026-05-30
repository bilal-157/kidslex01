console.log("Extension Started");

// ===== GENERATE & SHOW ID ON INSTALL =====
chrome.runtime.onInstalled.addListener((details) => {

    const uniqueId = "EXT-" + Math.random().toString(36).substring(2, 10).toUpperCase();

    chrome.storage.local.set({ extensionId: uniqueId }, function() {
      chrome.tabs.create({ url: chrome.runtime.getURL("welcome.html") });
    });

});
// ===== HISTORY =====
chrome.history.onVisited.addListener(async (result) => {
  const stored = await chrome.storage.local.get(["extensionId", "parentEmail"]);

  await fetch("http://localhost:3000/api/history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      extensionId: stored.extensionId,
      parentEmail: stored.parentEmail,
      url: result.url,
      title: result.title,
      time: new Date(result.lastVisitTime).toLocaleString(),
      rawTime: result.lastVisitTime,
    }),
  });
});

// ===== LOCATION =====
chrome.runtime.onMessage.addListener(async (message) => {
  if (message.type === "LOCATION") {
    const stored = await chrome.storage.local.get(["extensionId", "parentEmail"]);

    await fetch("http://localhost:3000/api/location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        extensionId: stored.extensionId,
        parentEmail: stored.parentEmail,
        latitude: message.data.latitude,
        longitude: message.data.longitude,
        time: new Date().toLocaleString(),
      }),
    });
  }
});