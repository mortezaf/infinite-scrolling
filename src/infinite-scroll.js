let pageNum = 1;
let isLoading = false;
const container = document.querySelector(".container");
const loadingContainer = document.querySelector(".loading-container");
const resultContainer = document.querySelector(".result-container");
const deviceInfo = document.querySelector(".device-info");

// Threshold for triggering new data fetching during infinite scrolling
let fetchDataThreshold = 0.7;

// Function to classify device screen size based on width and height
function classifyDeviceScreen() {
  const screenWidth = screen.width;
  const screenHeight = screen.height;

  if (screenWidth >= 1024) {
    fetchDataThreshold = 0.5; // More aggressive fetching for large screens
    console.log("Large Screen Device");
    deviceInfo.textContent = "Large Screen Device";
  } else if (screenWidth >= 768) {
    fetchDataThreshold = 0.6; // Moderate fetching for tablets
    console.log("Tablet Screen Device");
    deviceInfo.textContent = "Tablet Screen Device";
  } else {
    fetchDataThreshold = 0.7; // Conservative fetching for small screens
    console.log("Small Screen Device");
    deviceInfo.textContent = "Small Screen Device";
  }
}

classifyDeviceScreen();

function fetchData(isFirstLoad = false) {
    if (isLoading) return;
    isLoading = true;

    // Check if it's the initial load and adjust parameters accordingly
    if (isFirstLoad) {
        pageNum = 1; // Reset page number for initial data
    }

    loadingContainer.innerHTML = "Loading ...";
    simulateApiData(pageNum)
        .then((data) => {
            // Process the simulated data
            data.forEach((item) => {
                const resultDiv = document.createElement("div");
                resultDiv.textContent = item.title;
                resultDiv.classList.add("search-data");
                resultContainer.appendChild(resultDiv);

                // Create Intersection Observer for each post
                const observer = new IntersectionObserver((entries) => {
                    const entry = entries[0];
                    const visibilityRatio = entry.intersectionRatio;
                    console.log(`Post ${item.title} visibility: ${visibilityRatio}`);

                    // Load additional content for the post (example based on visibility)
                    if (visibilityRatio >= fetchDataThreshold) {
                        pageNum++;
                        // Load additional content for this post
                    }
                });
                observer.observe(resultDiv);
            });
            // Increment page number after successful data fetch
            pageNum++;
        })
        .catch((error) => {
            // Handle API error (simulated here)
            console.error("Error fetching data:", error);
            loadingContainer.innerHTML = "Error loading data";
        })
        .finally(() => {
            // Always executed after success or error
            isLoading = false;
            loadingContainer.innerHTML = "";
        })
        .catch((err) => {
            isLoading = false;
            loadingContainer.innerHTML = "";
        });
}

function simulateApiData(pageNum, pageSize = 10) {
    // Simulated delay (adjust as needed)
    const delay = Math.random() * 1000; // Simulate delay between 0 and 1 second

    // Simulated data generation (replace with your actual data structure)
    const data = [];
    for (let i = (pageNum - 1) * pageSize; i < pageNum * pageSize; i++) {
        data.push({
            id: i + 1,
            title: `Simulated Title ${i + 1}`,
            // Add other properties as needed for your data structure
        });
    }

    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (Math.random() < 0.1) { // Simulate occasional error (10% chance)
                reject(new Error("Simulated API error"));
            } else {
                resolve(data);
            }
        }, delay);
    });
}

// Dynamic Threshold Adjustment based on Scrolling Speed (Basic Example)
let lastScrollTime = 0;
let scrollSpeed = 0;

container.addEventListener("scroll", () => {
  const currentTime = Date.now();
  scrollSpeed = Math.abs(container.scrollTop - (container.scrollTop || container.pageYOffset)) / (currentTime - lastScrollTime);
  lastScrollTime = currentTime;

  // Adjust fetchDataThreshold based on scrollSpeed for dynamic content loading
  if (scrollSpeed > 100) { // Adjust threshold for faster scrolling
    fetchDataThreshold = 0.6;
  } else {
    fetchDataThreshold = 0.7; // Restore default threshold for slower scrolling
  }

  // Example of using the adjusted threshold for fetching data or adjusting view options:
  if (container.scrollTop + container.clientHeight >= container.scrollHeight - fetchDataThreshold * container.clientHeight) {
    fetchData(); // Trigger data fetching for infinite scrolling
  }
});

window.addEventListener("DOMContentLoaded", () => fetchData(true)); // Pass true for initial load