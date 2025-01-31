<template>
  <div class="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden shadow-sm border border-slate-200">
    <!-- Map Canvas -->
    <div ref="mapContainer" class="w-full h-full min-h-[500px] z-0"></div>

    <!-- Map Layer Controls & Quick Actions Overlay -->
    <div class="absolute top-4 right-4 z-10 flex flex-col space-y-2">
      <!-- Layer Switcher -->
      <div class="bg-white/90 backdrop-blur-md p-1.5 rounded-xl shadow-md border border-slate-200 flex space-x-1">
        <button
          @click="setBaseLayer('osm')"
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-lg transition',
            currentLayer === 'osm' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          ]"
        >
          แผนที่ถนน
        </button>
        <button
          @click="setBaseLayer('satellite')"
          :class="[
            'px-3 py-1.5 text-xs font-semibold rounded-lg transition',
            currentLayer === 'satellite' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
          ]"
        >
          ดาวเทียม
        </button>
      </div>

      <!-- Center Reset Button -->
      <button
        @click="resetView"
        title="รีเซ็ตมุมมองแผนที่"
        class="self-end p-2.5 bg-white/90 backdrop-blur-md text-slate-700 hover:text-emerald-600 rounded-xl shadow-md border border-slate-200 transition"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </button>
    </div>

    <!-- Info Overlay Hint -->
    <div class="absolute bottom-4 left-4 z-10 bg-slate-900/80 backdrop-blur-md text-white px-3.5 py-2 rounded-xl text-xs font-medium shadow-md flex items-center space-x-2">
      <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
      <span>คลิกขวาบนแผนที่เพื่อดู/คัดลอกพิกัด Lat, Lng</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import L from 'leaflet';
import Swal from 'sweetalert2';

const props = defineProps({
  lands: {
    type: Array,
    default: () => []
  },
  initialCenter: {
    type: Array,
    default: () => [8.641007, 99.853378] // Nakhon Si Thammarat ALRO area
  },
  initialZoom: {
    type: Number,
    default: 14
  }
});

const router = useRouter();
const mapContainer = ref(null);
let map = null;
let osmLayer = null;
let satelliteLayer = null;
let polygonGroup = null;

const currentLayer = ref('osm');

const setBaseLayer = (layerName) => {
  if (!map) return;
  if (layerName === 'osm') {
    map.removeLayer(satelliteLayer);
    map.addLayer(osmLayer);
    currentLayer.value = 'osm';
  } else {
    map.removeLayer(osmLayer);
    map.addLayer(satelliteLayer);
    currentLayer.value = 'satellite';
  }
};

const resetView = () => {
  if (map) {
    map.setView(props.initialCenter, props.initialZoom);
  }
};

const initMap = () => {
  if (!mapContainer.value) return;

  // 1. Initialize Leaflet Map
  map = L.map(mapContainer.value, {
    zoomControl: false,
  }).setView(props.initialCenter, props.initialZoom);

  // Add Zoom Control to Bottom-Right
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // 2. Base Tile Layers
  osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  }).addTo(map);

  satelliteLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
    maxZoom: 19,
  });

  // 3. Layer Group for Polygons
  polygonGroup = L.layerGroup().addTo(map);

  // 4. Right click event to copy coordinates
  map.on('contextmenu', (e) => {
    const { lat, lng } = e.latlng;
    const latFixed = lat.toFixed(6);
    const lngFixed = lng.toFixed(6);

    const popupContent = document.createElement('div');
    popupContent.className = 'p-4 text-center';
    popupContent.innerHTML = `
      <div class="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">พิกัดภูมิศาสตร์</div>
      <div class="font-mono text-sm font-semibold text-slate-800 mb-3">${latFixed}, ${lngFixed}</div>
      <button id="copy-coord-btn" class="w-full px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg transition shadow-xs">
        คัดลอกพิกัด (Copy)
      </button>
    `;

    const popup = L.popup()
      .setLatLng(e.latlng)
      .setContent(popupContent)
      .openOn(map);

    setTimeout(() => {
      const btn = document.getElementById('copy-coord-btn');
      if (btn) {
        btn.onclick = () => {
          navigator.clipboard.writeText(`${latFixed}, ${lngFixed}`).then(() => {
            Swal.fire({
              toast: true,
              position: 'top-end',
              icon: 'success',
              title: 'คัดลอกพิกัดสำเร็จ',
              showConfirmButton: false,
              timer: 2000
            });
            map.closePopup();
          });
        };
      }
    }, 50);
  });

  renderPolygons();
};

const renderPolygons = () => {
  if (!map || !polygonGroup) return;
  polygonGroup.clearLayers();

  if (!props.lands || props.lands.length === 0) return;

  props.lands.forEach((land) => {
    let coords = null;

    if (land.coordinates_polygon) {
      try {
        coords = typeof land.coordinates_polygon === 'string'
          ? JSON.parse(land.coordinates_polygon)
          : land.coordinates_polygon;
      } catch (e) {
        console.error('Error parsing polygon coordinates for land:', land.id_land);
      }
    }

    // Color based on land use
    let fillColor = '#10b981'; // Green
    if (land.land_use_type === 'สวนผลไม้') fillColor = '#f59e0b';
    if (land.land_use_type === 'ปศุสัตว์') fillColor = '#0284c7';

    if (coords && Array.isArray(coords) && coords.length >= 3) {
      const polygon = L.polygon(coords, {
        color: fillColor,
        fillColor: fillColor,
        fillOpacity: 0.45,
        weight: 2.5,
      });

      // Bind Custom Rich Popup
      const popupHtml = `
        <div class="p-4 min-w-[220px]">
          <div class="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
            <span class="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">แปลงเลขที่ ${land.tf_number}</span>
            <span class="text-xs text-slate-500 font-medium">ซอย ${land.current_soi}</span>
          </div>
          <div class="space-y-1.5 text-xs text-slate-600 mb-3">
            <p><strong class="text-slate-700">ระวาง ส.ป.ก.:</strong> ${land.spk_area || '-'}</p>
            <p><strong class="text-slate-700">ผู้ถือสิทธิ์:</strong> ${land.owner_name || '-'}</p>
            <p><strong class="text-slate-700">การใช้ประโยชน์:</strong> ${land.land_use_type || '-'}</p>
            <p><strong class="text-slate-700">เนื้อที่:</strong> ${land.total_rai ? Number(land.total_rai).toFixed(2) + ' ไร่' : '-'}</p>
          </div>
          <a href="/lands/${land.id_land}" class="block text-center w-full py-1.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg transition">
            ดูรายละเอียดแปลง
          </a>
        </div>
      `;

      polygon.bindPopup(popupHtml);
      polygonGroup.addLayer(polygon);
    } else if (land.lat && land.lng) {
      // Fallback to Marker if only point coordinate is available
      const marker = L.marker([land.lat, land.lng]);
      marker.bindPopup(`
        <div class="p-3">
          <div class="font-bold text-sm text-slate-800">แปลงเลขที่ ${land.tf_number}</div>
          <div class="text-xs text-slate-500">${land.owner_name || ''}</div>
          <a href="/lands/${land.id_land}" class="mt-2 block text-center text-xs text-emerald-600 font-semibold hover:underline">
            ดูรายละเอียด
          </a>
        </div>
      `);
      polygonGroup.addLayer(marker);
    }
  });
};

onMounted(() => {
  initMap();
});

onUnmounted(() => {
  if (map) {
    map.remove();
    map = null;
  }
});
</script>
