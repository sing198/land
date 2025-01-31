<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
    <div class="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-slate-100">
      <!-- Modal Header -->
      <div class="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
        <div>
          <h3 class="text-base font-bold text-slate-800 flex items-center">
            <span class="w-2 h-4 bg-emerald-600 rounded-full mr-2"></span>
            เลือกพิกัดจากแผนที่ (Map Coordinate Picker)
          </h3>
          <p class="text-xs text-slate-500 mt-0.5">คลิกบนแผนที่หรือลากหมุดเพื่อระบุตำแหน่งพิกัดแปลงที่ดิน</p>
        </div>
        <button
          @click="$emit('close')"
          class="text-slate-400 hover:text-slate-700 p-2 rounded-xl hover:bg-slate-100 transition"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Map Container -->
      <div class="relative w-full h-[480px] bg-slate-100">
        <div ref="pickerMapContainer" class="w-full h-full"></div>

        <!-- Layer Switcher & Reset Controls -->
        <div class="absolute top-4 right-4 z-[1000] flex flex-col space-y-2">
          <div class="bg-white/90 backdrop-blur-md p-1 rounded-xl shadow-md border border-slate-200 flex space-x-1">
            <button
              @click="setBaseLayer('osm')"
              type="button"
              :class="[
                'px-3 py-1.5 text-xs font-semibold rounded-lg transition',
                currentLayer === 'osm' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              ]"
            >
              แผนที่ถนน
            </button>
            <button
              @click="setBaseLayer('satellite')"
              type="button"
              :class="[
                'px-3 py-1.5 text-xs font-semibold rounded-lg transition',
                currentLayer === 'satellite' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              ]"
            >
              ดาวเทียม
            </button>
          </div>

          <button
            @click="resetView"
            type="button"
            title="รีเซ็ตมุมมองไปยังศูนย์กลาง ส.ป.ก."
            class="self-end p-2.5 bg-white/90 backdrop-blur-md text-slate-700 hover:text-emerald-600 rounded-xl shadow-md border border-slate-200 transition"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </button>
        </div>

        <!-- Coordinates Bar Overlay -->
        <div class="absolute bottom-4 left-4 right-4 z-[1000] bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div class="text-sm">
            <span class="text-slate-500 font-medium">พิกัดที่เลือก: </span>
            <span v-if="selectedCoords" class="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              {{ selectedCoords[0].toFixed(6) }}, {{ selectedCoords[1].toFixed(6) }}
            </span>
            <span v-else class="text-slate-400 italic">ยังไม่ได้เลือกจุดพิกัด (คลิกบนแผนที่เพื่อเลือก)</span>
          </div>

          <div class="flex space-x-2 w-full sm:w-auto">
            <button
              @click="$emit('close')"
              type="button"
              class="flex-1 sm:flex-none px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-100 rounded-xl transition font-medium"
            >
              ยกเลิก
            </button>
            <button
              @click="confirmCoordinates"
              :disabled="!selectedCoords"
              type="button"
              class="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 transition"
            >
              ใช้พิกัดนี้
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import L from 'leaflet';

const props = defineProps({
  isOpen: Boolean,
  initialLat: Number,
  initialLng: Number,
});

const emit = defineEmits(['close', 'select']);

const pickerMapContainer = ref(null);
let pickerMap = null;
let pickerMarker = null;
let tileLayer = null;

const currentLayer = ref('osm');
const selectedCoords = ref(null);

// Default Center for Krung Ching ALRO area
const DEFAULT_CENTER = [8.654019, 99.851781];
const DEFAULT_ZOOM = 14;

// Custom Marker Icon
const defaultPinIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

watch(() => props.isOpen, async (val) => {
  if (val) {
    await nextTick();
    initPickerMap();

    // Fix Leaflet container size after modal animation / DOM render
    setTimeout(() => {
      if (pickerMap) {
        pickerMap.invalidateSize();
      }
    }, 150);

    setTimeout(() => {
      if (pickerMap) {
        pickerMap.invalidateSize();
      }
    }, 400);
  } else {
    if (pickerMap) {
      pickerMap.remove();
      pickerMap = null;
      pickerMarker = null;
    }
  }
});

const initPickerMap = () => {
  if (!pickerMapContainer.value) return;

  const hasInitial = props.initialLat && props.initialLng;
  const center = hasInitial ? [Number(props.initialLat), Number(props.initialLng)] : DEFAULT_CENTER;
  const zoom = hasInitial ? 15 : DEFAULT_ZOOM;

  // Initialize Map
  pickerMap = L.map(pickerMapContainer.value, {
    center,
    zoom,
    zoomControl: true,
    minZoom: 6,
    maxZoom: 19
  });

  // Base Map Layer
  setBaseLayer('osm');

  // If initial coords provided, place marker
  if (hasInitial) {
    selectedCoords.value = [Number(props.initialLat), Number(props.initialLng)];
    placeMarker(selectedCoords.value);
  } else {
    selectedCoords.value = null;
  }

  // Click on Map to set/move marker
  pickerMap.on('click', (e) => {
    const { lat, lng } = e.latlng;
    selectedCoords.value = [lat, lng];
    placeMarker([lat, lng]);
  });
};

const placeMarker = (latlng) => {
  if (pickerMarker) {
    pickerMarker.setLatLng(latlng);
  } else {
    pickerMarker = L.marker(latlng, {
      icon: defaultPinIcon,
      draggable: true
    }).addTo(pickerMap);

    pickerMarker.on('dragend', (e) => {
      const pos = e.target.getLatLng();
      selectedCoords.value = [pos.lat, pos.lng];
    });
  }
};

const setBaseLayer = (type) => {
  currentLayer.value = type;
  if (tileLayer && pickerMap) {
    pickerMap.removeLayer(tileLayer);
  }

  if (type === 'satellite') {
    tileLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
      maxZoom: 19
    });
  } else {
    tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    });
  }

  if (pickerMap) {
    tileLayer.addTo(pickerMap);
  }
};

const resetView = () => {
  if (pickerMap) {
    const center = selectedCoords.value || DEFAULT_CENTER;
    pickerMap.setView(center, 15);
  }
};

const confirmCoordinates = () => {
  if (selectedCoords.value) {
    emit('select', {
      lat: Number(selectedCoords.value[0].toFixed(6)),
      lng: Number(selectedCoords.value[1].toFixed(6))
    });
    emit('close');
  }
};
</script>
