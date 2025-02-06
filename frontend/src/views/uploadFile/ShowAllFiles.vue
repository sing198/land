<template>
  <div>
    <h1>All Uploaded Images</h1>
    <div v-if="loading">Loading images...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <!-- <div v-if="images.length > 0" class="image-gallery">
      <div v-for="image in images" :key="image.filename" class="image-item">
        <img :src="image.url" :alt="image.filename" :title="image.filename" />
      </div>
    </div>
    <div v-else>No images found.</div> -->

    <div>
      <h1>Show kira images</h1>
      <!-- <img src="http://localhost:3000/uploads/lives/kira_original.jpg" alt="My Image">
          -->
      <!-- ใช้ v-for เพื่อวนลูปแสดงภาพ -->
      <div v-for="(image, index) in images" :key="index" class="image-gallery" >
        <img :src="image.url" :alt="'Image ' + (index + 1)"/>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      images: [],    // Store images
      loading: false,  // Loading state
      error: '',     // Error message
    };
  },
  mounted() {
    this.fetchImages();
  },
  methods: {
    async fetchImages() {
      this.loading = true;
      try {
        // Replace with your backend URL
        const response = await axios.get('http://localhost:3000/land/upload_lives');
        console.log("img:", response.data.images[0].url) 
        let n_new = response.data.images
        this.images = n_new
        // this.images = response.data.images;
        console.log('images:', this.images)
        // console.log("img:", response.data.images)
        // console.log("img:", response.data.images[0].url) 
      } catch (err) {
        this.error = 'Error fetching images from the server.';
        console.error(err);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.image-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 16px;
}

.image-item {
  text-align: center;
}

img {
  width: 100%;
  height: auto;
  border-radius: 8px;
}

.error {
  color: red;
}

.image-container {
  margin-bottom: 20px;
  text-align: center;
}

img.image {
  width: 300px; /* กำหนดความกว้างสูงสุด */
  height: 300px; /* กำหนดความสูงสูงสุด */
  object-fit: cover; /* ครอบภาพให้พอดีกับขนาด */
}
</style>