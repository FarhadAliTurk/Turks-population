// script.js

import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";

// --- DATA ---
const regionData = {
  punjab: {
    name: "Punjab",
    population: 125000,
    color: "#EF4444",
    position: [2, 0, 0],
    scale: 1.2,
    description: "The most populous province, with a significant Turks community in its urban centers.",
    divisions: [
      { name: "Lahore", population: 45000, growth: 3.2 },
      { name: "Faisalabad", population: 25000, growth: 2.8 },
      { name: "Rawalpindi", population: 18000, growth: 2.5 },
      { name: "Multan", population: 15000, growth: 2.3 },
      { name: "Gujranwala", population: 12000, growth: 2.7 },
      { name: "Sargodha", population: 6000, growth: 2.1 },
      { name: "Bahawalpur", population: 4000, growth: 1.9 },
    ],
  },
  sindh: {
    name: "Sindh",
    population: 85000,
    color: "#3B82F6",
    position: [-1, 0, -1],
    scale: 1.1,
    description: "Home to a diverse population, including a notable Turks presence in Karachi and other major cities.",
    divisions: [
      { name: "Karachi", population: 55000, growth: 3.5 },
      { name: "Hyderabad", population: 12000, growth: 2.4 },
      { name: "Sukkur", population: 8000, growth: 2.1 },
      { name: "Mirpur Khas", population: 6000, growth: 1.9 },
      { name: "Larkana", population: 4000, growth: 1.7 },
    ],
  },
  khyber: {
    name: "Khyber Pakhtunkhwa",
    population: 45000,
    color: "#10B981",
    position: [-2, 0, 1],
    scale: 0.9,
    description: "A province with deep historical and cultural ties to Central Asia, reflected in its Turks population.",
    divisions: [
      { name: "Peshawar", population: 18000, growth: 2.6 },
      { name: "Mardan", population: 9000, growth: 2.3 },
      { name: "Malakand", population: 7000, growth: 2.1 },
      { name: "Hazara", population: 6000, growth: 1.9 },
      { name: "Kohat", population: 3000, growth: 1.7 },
      { name: "Bannu", population: 2000, growth: 1.5 },
    ],
  },
  balochistan: {
    name: "Balochistan",
    population: 15000,
    color: "#F59E0B",
    position: [-3, 0, -2],
    scale: 1.3,
    description: "The largest province by area, with Turks communities scattered throughout its vast landscape.",
    divisions: [
      { name: "Quetta", population: 8000, growth: 2.4 },
      { name: "Kalat", population: 3000, growth: 1.8 },
      { name: "Makran", population: 2000, growth: 1.6 },
      { name: "Sibi", population: 1000, growth: 1.4 },
      { name: "Zhob", population: 1000, growth: 1.3 },
    ],
  },
  islamabad: {
    name: "Islamabad",
    population: 35000,
    color: "#8B5CF6",
    position: [0, 0.5, 0],
    scale: 0.3,
    description: "The capital city, attracting a diverse mix of people, including a growing Turks community.",
    divisions: [
      { name: "Islamabad Capital Territory", population: 35000, growth: 3.8 },
    ],
  },
  gilgit: {
    name: "Gilgit-Baltistan",
    population: 8000,
    color: "#EC4899",
    position: [1, 0, 2],
    scale: 0.8,
    description: "A region known for its stunning natural beauty and a small but significant Turks population.",
    divisions: [
      { name: "Gilgit", population: 4000, growth: 2.2 },
      { name: "Baltistan", population: 3000, growth: 2.0 },
      { name: "Diamer", population: 1000, growth: 1.6 },
    ],
  },
  ajk: {
    name: "Azad Kashmir",
    population: 5000,
    color: "#06B6D4",
    position: [1.5, 0, 1],
    scale: 0.6,
    description: "A region with a rich cultural heritage and a small, close-knit Turks community.",
    divisions: [
      { name: "Muzaffarabad", population: 2500, growth: 2.1 },
      { name: "Mirpur", population: 1500, growth: 1.9 },
      { name: "Poonch", population: 1000, growth: 1.7 },
    ],
  },
};

const populationData = Object.values(regionData);
const totalPopulation = populationData.reduce((sum, region) => sum + region.population, 0);

// --- UI UPDATE FUNCTIONS ---

let detailsContainer, regionTab, divisionTab, regionDetailsContent, divisionDetailsContent;
let selectedRegion = null;

function initializeUIElements() {
  detailsContainer = document.getElementById("details-container");
  regionTab = document.getElementById("region-tab");
  divisionTab = document.getElementById("division-tab");
  regionDetailsContent = document.getElementById("region-details-content");
  divisionDetailsContent = document.getElementById("division-details-content");
  
  if (!detailsContainer || !regionTab || !divisionTab || !regionDetailsContent || !divisionDetailsContent) {
    console.error('Required UI elements not found');
    return false;
  }
  return true;
}

// Create region cards dynamically
function createRegionCards() {
  const container = document.getElementById('region-cards-container');
  if (!container) return;
  
  container.innerHTML = '';
  
  Object.values(regionData).forEach(region => {
    const percentage = ((region.population / totalPopulation) * 100).toFixed(1);
    const card = document.createElement('div');
    card.className = 'region-card bg-white rounded-xl shadow-lg p-3 sm:p-4 border-l-4 touch-optimized';
    card.style.borderLeftColor = region.color;
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `View details for ${region.name} with ${region.population.toLocaleString()} people`);
    
    card.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <h3 class="font-bold text-base sm:text-lg">${region.name}</h3>
          <p class="text-gray-600 text-xs sm:text-sm">${region.population.toLocaleString()} people</p>
        </div>
        <span class="bg-opacity-20 text-xs font-medium px-2 py-0.5 rounded" style="background-color: ${region.color}20; color: ${region.color}">
          ${percentage}%
        </span>
      </div>
      <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
        <div class="h-2 rounded-full" style="width: ${percentage}%; background-color: ${region.color}"></div>
      </div>
    `;
    
    // Click event
    card.addEventListener('click', () => {
      selectRegion(region);
    });
    
    // Keyboard event
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectRegion(region);
      }
    });
    
    container.appendChild(card);
  });
}

function selectRegion(region) {
  selectedRegion = region;
  updateRegionDetails(region);
  
  // Highlight the corresponding 3D object if available
  if (window.regionObjects) {
    window.regionObjects.forEach(mesh => {
      if (mesh.userData.name === region.name) {
        mesh.material.emissive.set(region.color);
        mesh.material.emissiveIntensity = 0.5;
      } else {
        mesh.material.emissiveIntensity = 0;
      }
    });
  }
  
  // Update tab accessibility
  divisionTab.removeAttribute('disabled');
  divisionTab.setAttribute('aria-disabled', 'false');
}

// Tab switching functionality
function setupTabSwitching() {
  if (!regionTab || !divisionTab) return;
  
  // Keyboard navigation for tabs
  const handleTabKeydown = (e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const tabs = [regionTab, divisionTab];
      const currentIndex = tabs.indexOf(e.target);
      let nextIndex;
      
      if (e.key === 'ArrowLeft') {
        nextIndex = currentIndex > 0 ? currentIndex - 1 : tabs.length - 1;
      } else {
        nextIndex = currentIndex < tabs.length - 1 ? currentIndex + 1 : 0;
      }
      
      tabs[nextIndex].click();
      tabs[nextIndex].focus();
    }
  };
  
  regionTab.addEventListener("click", () => {
    switchToTab('region');
  });
  
  divisionTab.addEventListener("click", () => {
    if (!selectedRegion) {
      alert("Please select a region first to view division data.");
      regionTab.focus();
      return;
    }
    switchToTab('division');
  });
  
  regionTab.addEventListener('keydown', handleTabKeydown);
  divisionTab.addEventListener('keydown', handleTabKeydown);
}

function switchToTab(tabName) {
  const isRegionTab = tabName === 'region';
  
  regionTab.classList.toggle("active", isRegionTab);
  divisionTab.classList.toggle("active", !isRegionTab);
  regionTab.setAttribute("aria-selected", isRegionTab.toString());
  divisionTab.setAttribute("aria-selected", (!isRegionTab).toString());
  regionDetailsContent.classList.toggle("hidden", !isRegionTab);
  divisionDetailsContent.classList.toggle("hidden", isRegionTab);
  
  if (isRegionTab) {
    regionTab.focus();
  } else {
    divisionTab.focus();
  }
}

function updateRegionDetails(region) {
  if (!regionDetailsContent) return;
  
  if (!region) {
    regionDetailsContent.innerHTML = `
      <h2 class="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
        <i class="fas fa-info-circle text-brand-teal mr-2 sm:mr-3" aria-hidden="true"></i>
        Region Details
      </h2>
      <div class="flex flex-col justify-center items-center h-40 sm:h-48 text-center">
        <div class="bg-brand-teal/10 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
          <i class="fas fa-map-marker-alt text-brand-teal text-xl sm:text-2xl" aria-hidden="true"></i>
        </div>
        <h3 class="text-lg sm:text-xl font-semibold mb-2">Select a Region</h3>
        <p class="text-gray-600 text-sm max-w-xs">Click or tap on any region in the 3D map or region cards to view detailed population information and statistics.</p>
      </div>
    `;

    if (divisionDetailsContent) {
      divisionDetailsContent.innerHTML = `
        <h2 class="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
          <i class="fas fa-map text-brand-teal mr-2 sm:mr-3" aria-hidden="true"></i>
          Division Details
        </h2>
        <div class="flex flex-col justify-center items-center h-40 sm:h-48 text-center">
          <div class="bg-brand-teal/10 p-3 sm:p-4 rounded-full mb-3 sm:mb-4">
            <i class="fas fa-map-pin text-brand-teal text-xl sm:text-2xl" aria-hidden="true"></i>
          </div>
          <h3 class="text-lg sm:text-xl font-semibold mb-2">Select a Region First</h3>
          <p class="text-gray-600 text-sm max-w-xs">Click or tap on a region in the 3D map or region cards to view its division-wise population data.</p>
        </div>
      `;
    }
    
    // Disable division tab when no region is selected
    divisionTab.setAttribute('disabled', 'true');
    divisionTab.setAttribute('aria-disabled', 'true');
    return;
  }

  const percentage = ((region.population / totalPopulation) * 100).toFixed(1);

  regionDetailsContent.innerHTML = `
    <h2 class="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
      <i class="fas fa-info-circle text-brand-teal mr-2 sm:mr-3" aria-hidden="true"></i>
      Region Details
    </h2>
    <div class="space-y-4 sm:space-y-6">
      <div class="flex items-center justify-between">
        <h3 class="text-xl sm:text-2xl md:text-3xl font-bold" style="color: ${region.color};">${region.name}</h3>
        <span class="bg-gray-100 text-gray-800 text-xs sm:text-sm font-medium px-2 sm:px-3 py-1 rounded-full">${percentage}% of total</span>
      </div>
      
      <p class="text-gray-700 text-sm sm:text-base">${region.description}</p>
      
      <div class="bg-white rounded-xl p-3 sm:p-4 shadow-inner">
        <div class="flex items-center justify-between mb-2">
          <span class="font-medium text-sm sm:text-base">Turks Population</span>
          <span class="font-bold text-base sm:text-lg">${region.population.toLocaleString()}</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2 sm:h-3">
          <div class="h-2 sm:h-3 rounded-full" style="width: ${percentage}%; background-color: ${region.color};"></div>
        </div>
      </div>
      
      <div class="grid grid-cols-2 gap-3 sm:gap-4">
        <div class="bg-white rounded-lg p-2 sm:p-3 text-center shadow-sm">
          <div class="text-gray-600 text-xs sm:text-sm">Growth Rate</div>
          <div class="font-bold text-base sm:text-lg">2.8%</div>
        </div>
        <div class="bg-white rounded-lg p-2 sm:p-3 text-center shadow-sm">
          <div class="text-gray-600 text-xs sm:text-sm">Urban Ratio</div>
          <div class="font-bold text-base sm:text-lg">78%</div>
        </div>
      </div>
      
      <div class="bg-gray-50 rounded-lg p-3 sm:p-4">
        <h4 class="font-semibold mb-2 flex items-center text-sm sm:text-base">
          <i class="fas fa-city text-gray-500 mr-2" aria-hidden="true"></i>
          Primary Settlements
        </h4>
        <ul class="text-xs sm:text-sm text-gray-700 space-y-1">
          <li class="flex items-center">
            <i class="fas fa-circle text-xs mr-2" style="color: ${region.color};" aria-hidden="true"></i>
            Urban centers and trade corridors
          </li>
          <li class="flex items-center">
            <i class="fas fa-circle text-xs mr-2" style="color: ${region.color};" aria-hidden="true"></i>
            Educational and economic hubs
          </li>
          <li class="flex items-center">
            <i class="fas fa-circle text-xs mr-2" style="color: ${region.color};" aria-hidden="true"></i>
            Historical settlement areas
          </li>
        </ul>
      </div>
    </div>
  `;

  // Update division details
  updateDivisionDetails(region);
}

function updateDivisionDetails(region) {
  if (!divisionDetailsContent || !region || !region.divisions) return;

  let divisionsHTML = `
    <h2 class="text-lg sm:text-xl md:text-2xl font-bold mb-4 sm:mb-6 flex items-center">
      <i class="fas fa-map text-brand-teal mr-2 sm:mr-3" aria-hidden="true"></i>
      ${region.name} - Division Data
    </h2>
    <div class="space-y-3 sm:space-y-4">
      <div class="flex justify-between items-center mb-2">
        <h3 class="text-base sm:text-lg font-semibold">Division-wise Population Distribution</h3>
        <span class="text-xs sm:text-sm text-gray-600">Total: ${region.population.toLocaleString()}</span>
      </div>
      <div class="division-list space-y-2 sm:space-y-3 max-h-[300px] overflow-y-auto">
  `;

  region.divisions.forEach((division) => {
    const divisionPercentage = ((division.population / region.population) * 100).toFixed(1);
    divisionsHTML += `
      <div class="bg-white rounded-lg p-2 sm:p-3 shadow-sm">
        <div class="flex justify-between items-center mb-2">
          <h4 class="font-medium text-sm sm:text-base">${division.name}</h4>
          <span class="text-xs sm:text-sm font-semibold">${division.population.toLocaleString()}</span>
        </div>
        <div class="flex justify-between items-center text-xs text-gray-600 mb-1">
          <span>${divisionPercentage}% of ${region.name}</span>
          <span>Growth: ${division.growth}%</span>
        </div>
        <div class="w-full bg-gray-200 rounded-full h-2">
          <div class="h-2 rounded-full" style="width: ${divisionPercentage}%; background-color: ${region.color};"></div>
        </div>
      </div>
    `;
  });

  divisionsHTML += `
      </div>
      <div class="mt-3 sm:mt-4 text-center text-xs sm:text-sm text-gray-600">
        <p>Data based on 2023 census projections and demographic modeling</p>
      </div>
    </div>
  `;

  divisionDetailsContent.innerHTML = divisionsHTML;
}

function renderStats() {
  const totalPopulationEl = document.getElementById("total-population");
  const totalPopulationHeaderEl = document.getElementById("total-population-header");
  const heroTotalEl = document.getElementById("hero-total");
  
  if (totalPopulationEl) totalPopulationEl.textContent = totalPopulation.toLocaleString();
  if (totalPopulationHeaderEl) totalPopulationHeaderEl.textContent = totalPopulation.toLocaleString();
  if (heroTotalEl) heroTotalEl.textContent = totalPopulation.toLocaleString();

  const chartCanvas = document.getElementById("population-chart");
  if (!chartCanvas) {
    console.warn('Population chart canvas not found');
    return;
  }
  
  // Show loading state
  const chartLoading = document.getElementById('chart-loading');
  if (chartLoading) chartLoading.classList.remove('hidden');
  
  // Wait for Chart.js to be fully loaded
  if (typeof Chart === 'undefined') {
    console.warn('Chart.js not loaded yet');
    setTimeout(renderStats, 100);
    return;
  }
  
  const ctx = chartCanvas.getContext("2d");
  try {
    const chart = new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: populationData.map((d) => d.name),
        datasets: [
          {
            data: populationData.map((d) => d.population),
            backgroundColor: populationData.map((d) => d.color),
            borderWidth: 2,
            borderColor: "#fff",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              padding: 15,
              usePointStyle: true,
              font: { size: window.innerWidth < 640 ? 10 : 11 },
              color: '#1d3557'
            },
          },
          tooltip: {
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            titleColor: "#1d3557",
            bodyColor: "#1d3557",
            borderColor: "#ccc",
            borderWidth: 1,
            borderRadius: 8,
            padding: 10,
            callbacks: {
              label: function (context) {
                const label = context.label || "";
                const value = context.raw;
                const percentage = ((value / totalPopulation) * 100).toFixed(1);
                return `${label}: ${value.toLocaleString()} (${percentage}%)`;
              },
            },
          },
        },
        cutout: "60%",
        animation: {
          onComplete: () => {
            if (chartLoading) chartLoading.classList.add('hidden');
          }
        }
      },
    });
    
    // Store chart instance for cleanup
    window.populationChart = chart;
    
  } catch (error) {
    console.error('Error creating chart:', error);
    if (chartLoading) chartLoading.classList.add('hidden');
  }
}

// --- 3D MAP LOGIC ---
let scene, camera, renderer, controls, clock, raycaster, mouse;
let regionObjects = [];
let hoveredRegion = null;
let isInitialized = false;

function init3DMap() {
  const container = document.getElementById("map-container");
  if (!container) {
    console.error('Map container not found');
    return;
  }

  // Hide loading overlay after a brief delay
  setTimeout(() => {
    const loadingOverlay = document.getElementById('loading-overlay');
    if (loadingOverlay) {
      loadingOverlay.style.opacity = '0';
      setTimeout(() => loadingOverlay.style.display = 'none', 300);
    }
  }, 1000);

  try {
    // Check WebGL support
    if (!isWebGLAvailable()) {
      showMapError();
      return;
    }

    scene = new THREE.Scene();
    scene.background = new THREE.Color("#1d3557");
    scene.fog = new THREE.Fog("#1d3557", 10, 30);

    clock = new THREE.Clock();
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();

    const aspectRatio = container.clientWidth / container.clientHeight;
    camera = new THREE.PerspectiveCamera(50, aspectRatio, 0.1, 1000);
    camera.position.set(0, 10, 12);

    renderer = new THREE.WebGLRenderer({ 
      antialias: true, 
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
    container.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    const spotLight = new THREE.SpotLight(0xffffff, 1.5, 0, 0.3, 1);
    spotLight.position.set(-10, 10, -10);
    scene.add(spotLight);

    // Controls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.minDistance = 6;
    controls.maxDistance = 25;
    controls.maxPolarAngle = Math.PI / 2 - 0.1;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Geometry - reuse for performance
    const shape = new THREE.Shape();
    shape.moveTo(0.5, 0.5);
    shape.lineTo(0.5, -0.5);
    shape.lineTo(-0.5, -0.5);
    shape.lineTo(-0.5, 0.5);
    shape.closePath();

    const extrudeSettings = {
      depth: 0.2,
      bevelEnabled: true,
      bevelThickness: 0.05,
      bevelSize: 0.05,
      bevelSegments: 2,
    };
    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    const fontLoader = new FontLoader();
    fontLoader.load(
      "https://cdn.jsdelivr.net/npm/three@0.165.0/examples/fonts/helvetiker_regular.typeface.json",
      (font) => {
        createRegionsWithFont(font, geometry);
      },
      undefined,
      (error) => {
        console.error('Error loading font:', error);
        // Fallback: create regions without text
        createRegionsWithoutText(geometry);
      }
    );

    // Add a base plane
    const planeGeometry = new THREE.PlaneGeometry(20, 20);
    const planeMaterial = new THREE.MeshStandardMaterial({
      color: 0x2d3748,
      roughness: 0.8,
      metalness: 0.2,
    });
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.rotation.x = -Math.PI / 2;
    plane.position.y = -1;
    plane.receiveShadow = true;
    scene.add(plane);

    // Event Listeners
    window.addEventListener("resize", onWindowResize);
    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("click", onClick);

    // Touch events for mobile - without preventDefault to allow scrolling
    container.addEventListener("touchstart", onTouchStart, { passive: false });
    container.addEventListener("touchmove", onTouchMove, { passive: false });
    container.addEventListener("touchend", onTouchEnd);

    // Keyboard navigation
    container.addEventListener('keydown', onKeyDown);
    container.setAttribute('tabindex', '0');
    container.setAttribute('role', 'application');

    animate();
  } catch (error) {
    console.error('Error initializing 3D map:', error);
    showMapError();
  }
}

function createRegionsWithFont(font, geometry) {
  Object.values(regionData).forEach((data) => {
    const material = new THREE.MeshStandardMaterial({
      color: data.color,
      emissive: data.color,
      emissiveIntensity: 0,
      roughness: 0.3,
      metalness: 0.5,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.fromArray(data.position);
    mesh.scale.set(data.scale, data.scale, data.scale);
    mesh.userData = { ...data, name: data.name };
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    regionObjects.push(mesh);

    // Text Label - adjust size based on screen
    const textSize = window.innerWidth < 768 ? 0.15 : 0.25;
    const textGeo = new TextGeometry(data.name, {
      font: font,
      size: textSize,
      height: 0.02,
    });
    textGeo.center();
    const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const textMesh = new THREE.Mesh(textGeo, textMat);
    textMesh.position.set(
      data.position[0],
      data.position[1] + data.scale * 0.6 + 0.2,
      data.position[2]
    );
    scene.add(textMesh);
    mesh.userData.textMesh = textMesh;
  });
  
  window.regionObjects = regionObjects;
  isInitialized = true;
}

function createRegionsWithoutText(geometry) {
  Object.values(regionData).forEach((data) => {
    const material = new THREE.MeshStandardMaterial({
      color: data.color,
      emissive: data.color,
      emissiveIntensity: 0,
      roughness: 0.3,
      metalness: 0.5,
    });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.fromArray(data.position);
    mesh.scale.set(data.scale, data.scale, data.scale);
    mesh.userData = { ...data, name: data.name };
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    scene.add(mesh);
    regionObjects.push(mesh);
  });
  window.regionObjects = regionObjects;
  isInitialized = true;
}

function isWebGLAvailable() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && 
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

function showMapError() {
  const container = document.getElementById("map-container");
  const errorElement = document.getElementById("map-error");
  const loadingOverlay = document.getElementById('loading-overlay');
  
  if (loadingOverlay) {
    loadingOverlay.style.display = 'none';
  }
  
  if (errorElement) {
    errorElement.classList.remove('hidden');
    
    // Add retry functionality
    const retryButton = document.getElementById('retry-map');
    if (retryButton) {
      retryButton.addEventListener('click', () => {
        errorElement.classList.add('hidden');
        init3DMap();
      });
    }
  } else if (container) {
    container.innerHTML = `
      <div class="error-state h-full flex flex-col items-center justify-center">
        <i class="fas fa-exclamation-triangle text-4xl text-red-500 mb-4" aria-hidden="true"></i>
        <p class="text-center text-gray-700 px-4">Unable to load 3D map.<br>Please check your browser support for WebGL.</p>
        <button id="retry-map" class="mt-4 px-4 py-2 bg-brand-teal text-white rounded-lg hover:bg-brand-dark transition-colors">
          Retry Loading Map
        </button>
      </div>
    `;
    
    // Add retry functionality
    setTimeout(() => {
      const retryButton = document.getElementById('retry-map');
      if (retryButton) {
        retryButton.addEventListener('click', () => {
          container.innerHTML = '';
          init3DMap();
        });
      }
    }, 100);
  }
}

function onWindowResize() {
  const container = document.getElementById("map-container");
  if (!container || !camera || !renderer) return;
  
  const width = container.clientWidth;
  const height = container.clientHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  
  // Adjust controls based on screen size
  if (width < 768) {
    controls.minDistance = 8;
    controls.maxDistance = 20;
  } else {
    controls.minDistance = 6;
    controls.maxDistance = 25;
  }
  
  controls.update();
}

function onMouseMove(event) {
  if (!isInitialized) return;
  
  const container = document.getElementById("map-container");
  if (!container) return;
  
  const rect = container.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

  updateHoverEffects();
}

function updateHoverEffects() {
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(regionObjects);

  if (intersects.length > 0) {
    if (hoveredRegion !== intersects[0].object) {
      if (hoveredRegion && hoveredRegion !== selectedRegion) {
        hoveredRegion.material.emissiveIntensity = 0;
      }
      hoveredRegion = intersects[0].object;
      if (hoveredRegion !== selectedRegion) {
        hoveredRegion.material.emissiveIntensity = 0.2;
      }
    }
  } else {
    if (hoveredRegion && hoveredRegion !== selectedRegion) {
      hoveredRegion.material.emissiveIntensity = 0;
    }
    hoveredRegion = null;
  }
}

function onClick(event) {
  if (!isInitialized) return;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(regionObjects);

  if (intersects.length > 0) {
    if (selectedRegion) {
      selectedRegion.material.emissiveIntensity = 0;
    }
    selectedRegion = intersects[0].object;
    selectedRegion.material.emissiveIntensity = 0.5;
    updateRegionDetails(selectedRegion.userData);
  }
}

// Touch event handlers for mobile
function onTouchStart(event) {
  if (!isInitialized) return;
  
  const touch = event.touches[0];
  const container = document.getElementById("map-container");
  if (!container) return;
  
  const rect = container.getBoundingClientRect();
  mouse.x = ((touch.clientX - rect.left) / container.clientWidth) * 2 - 1;
  mouse.y = -((touch.clientY - rect.top) / container.clientHeight) * 2 + 1;

  // Only prevent default if we're actually interacting with a region
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(regionObjects);
  
  if (intersects.length > 0) {
    event.preventDefault();
    updateHoverEffects();
  }
}

function onTouchMove(event) {
  if (!isInitialized) return;
  
  const touch = event.touches[0];
  const container = document.getElementById("map-container");
  if (!container) return;
  
  const rect = container.getBoundingClientRect();
  mouse.x = ((touch.clientX - rect.left) / container.clientWidth) * 2 - 1;
  mouse.y = -((touch.clientY - rect.top) / container.clientHeight) * 2 + 1;

  // Only prevent default if we're actually interacting with a region
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(regionObjects);
  
  if (intersects.length > 0) {
    event.preventDefault();
  }
}

function onTouchEnd(event) {
  if (!isInitialized) return;
  
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(regionObjects);

  if (intersects.length > 0) {
    event.preventDefault();
    if (selectedRegion) {
      selectedRegion.material.emissiveIntensity = 0;
    }
    selectedRegion = intersects[0].object;
    selectedRegion.material.emissiveIntensity = 0.5;
    updateRegionDetails(selectedRegion.userData);
  }
}

// Keyboard navigation
function onKeyDown(event) {
  if (!isInitialized) return;
  
  const container = document.getElementById("map-container");
  if (!container) return;
  
  // Arrow key navigation between regions
  if (event.key.startsWith('Arrow')) {
    event.preventDefault();
    
    if (regionObjects.length === 0) return;
    
    let currentIndex = 0;
    if (selectedRegion) {
      currentIndex = regionObjects.findIndex(obj => obj === selectedRegion);
    }
    
    let newIndex;
    switch (event.key) {
      case 'ArrowRight':
        newIndex = (currentIndex + 1) % regionObjects.length;
        break;
      case 'ArrowLeft':
        newIndex = (currentIndex - 1 + regionObjects.length) % regionObjects.length;
        break;
      case 'ArrowUp':
      case 'ArrowDown':
        // For vertical navigation, you might want a different logic
        newIndex = (currentIndex + 2) % regionObjects.length;
        break;
      default:
        return;
    }
    
    if (selectedRegion) {
      selectedRegion.material.emissiveIntensity = 0;
    }
    selectedRegion = regionObjects[newIndex];
    selectedRegion.material.emissiveIntensity = 0.5;
    updateRegionDetails(selectedRegion.userData);
    
    // Focus the corresponding region card
    const regionCards = document.querySelectorAll('.region-card');
    if (regionCards[newIndex]) {
      regionCards[newIndex].focus();
    }
  }
  
  // Enter or Space to select
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    if (hoveredRegion) {
      onClick(event);
    }
  }
}

function animate() {
  if (!isInitialized) {
    requestAnimationFrame(animate);
    return;
  }
  
  requestAnimationFrame(animate);
  const elapsedTime = clock.getElapsedTime();

  regionObjects.forEach((mesh) => {
    mesh.rotation.y += 0.005;
    mesh.position.y = mesh.userData.position[1] + Math.sin(elapsedTime + mesh.userData.position[0]) * 0.1;
    if (mesh.userData.textMesh) {
      mesh.userData.textMesh.quaternion.copy(camera.quaternion);
    }

    if (mesh === selectedRegion) {
      mesh.material.emissiveIntensity = 0.5 + Math.sin(elapsedTime * 4) * 0.25;
    }
  });

  controls.update();
  renderer.render(scene, camera);
}

// --- RESPONSIVE FEATURES ---

function initResponsiveFeatures() {
  setupViewportHandling();
  enhanceTouchInteractions();
}

function setupViewportHandling() {
  let resizeTimeout;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      onWindowResize();
      updateUIForViewport();
    }, 250);
  });
}

function updateUIForViewport() {
  const width = window.innerWidth;
  const detailsContainer = document.getElementById('details-container');
  
  if (width < 768 && detailsContainer) {
    detailsContainer.classList.add('mobile-optimized');
  } else {
    detailsContainer?.classList.remove('mobile-optimized');
  }
}

function enhanceTouchInteractions() {
  // Add touch-friendly class to interactive elements
  const interactiveElements = document.querySelectorAll('button, .tab-button, .region-card');
  interactiveElements.forEach(element => {
    element.classList.add('touch-optimized');
  });
}

// Cleanup function
function cleanup() {
  // Remove event listeners
  window.removeEventListener('resize', onWindowResize);
  window.removeEventListener('beforeunload', cleanup);
  window.removeEventListener('visibilitychange', handleVisibilityChange);
  
  const container = document.getElementById("map-container");
  if (container) {
    container.removeEventListener("mousemove", onMouseMove);
    container.removeEventListener("click", onClick);
    container.removeEventListener("touchstart", onTouchStart);
    container.removeEventListener("touchmove", onTouchMove);
    container.removeEventListener("touchend", onTouchEnd);
    container.removeEventListener('keydown', onKeyDown);
  }
  
  // Clean up Three.js resources
  if (scene) {
    scene.traverse((object) => {
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    });
  }
  
  if (renderer) {
    renderer.dispose();
  }
  
  // Clean up Chart.js
  if (window.populationChart) {
    window.populationChart.destroy();
  }
}

function handleVisibilityChange() {
  if (!document.hidden && isInitialized) {
    // Page became visible again, refresh the 3D scene
    setTimeout(() => {
      onWindowResize();
    }, 100);
  }
}

// --- INITIALIZATION ---
document.addEventListener("DOMContentLoaded", () => {
  // Initialize UI first
  if (initializeUIElements()) {
    createRegionCards();
    setupTabSwitching();
    updateRegionDetails(null);
  }
  
  // Initialize stats and 3D map
  setTimeout(() => {
    renderStats();
    init3DMap();
    initResponsiveFeatures();
    updateUIForViewport();
  }, 100);
  
  // Add visibility change listener
  document.addEventListener('visibilitychange', handleVisibilityChange);
});

// Handle page load and visibility changes
window.addEventListener('load', () => {
  // Re-initialize map if it's not working properly
  setTimeout(() => {
    onWindowResize();
  }, 500);
});

// Cleanup on page unload
window.addEventListener('beforeunload', cleanup);

// Error boundary for unhandled errors
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  // You could send this to an analytics service
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});