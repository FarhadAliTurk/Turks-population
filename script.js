document.addEventListener('DOMContentLoaded', () => {
    const paths = document.querySelectorAll('path.land');
    const regionNameEl = document.getElementById('region-name');
    const populationEl = document.getElementById('population-count');
    const descEl = document.getElementById('region-desc');

    // Initial State: Show Total
    updatePanel("TOTAL");

    paths.forEach(path => {
        path.addEventListener('click', function() {
            // Remove active class from all
            paths.forEach(p => p.classList.remove('active'));
            
            // Add active class to clicked
            this.classList.add('active');
            
            // Update Data
            const regionId = this.getAttribute('id');
            updatePanel(regionId);
        });
    });

    // Click outside map to reset to total
    document.addEventListener('click', (e) => {
        if (!e.target.closest('svg') && !e.target.closest('#info-panel')) {
            paths.forEach(p => p.classList.remove('active'));
            updatePanel("TOTAL");
        }
    });

    function updatePanel(id) {
        const data = populationData[id] || { name: "Unknown Region", population: 0, description: "No data available." };
        
        // Animate numbers
        animateValue(populationEl, parseInt(populationEl.textContent.replace(/,/g, '')) || 0, data.population, 1000);
        
        regionNameEl.textContent = data.name;
        descEl.textContent = data.description;
    }

    function animateValue(obj, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            obj.innerHTML = value.toLocaleString();
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // PDF Download Logic
    // PDF Download Logic - Google Drive Link
    document.getElementById('download-pdf-btn').addEventListener('click', () => {
        // REPLACE THE URL BELOW WITH YOUR ACTUAL GOOGLE DRIVE PDF LINK
        const googleDriveLink = "https://drive.google.com/file/d/YOUR_FILE_ID/view?usp=sharing";
        window.open(googleDriveLink, '_blank');
    });
});
