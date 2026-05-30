// Get and show the ID
chrome.storage.local.get("extensionId", function(data) {
  document.getElementById("extId").innerText = data.extensionId || "Not found";
});

// Save email
document.getElementById("saveBtn").addEventListener("click", function() {
  const email = document.getElementById("emailInput").value.trim();
  if (!email) {
    alert("Please enter a valid email!");
    return;
  }
  chrome.storage.local.set({ parentEmail: email }, function() {
    document.getElementById("successMsg").style.display = "block";
    setTimeout(() => window.close(), 1500);
  });
});