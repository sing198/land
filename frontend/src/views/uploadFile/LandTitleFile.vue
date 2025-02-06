<template>
    <div>
        <div class="container">
            <h3 class="my-3 is-size-3">ภาพที่อยู่อาศัย</h3>
            <!-- Display selected files dynamically -->
            <div class="file-box has-background-success mt-5 p-3 is-rounded">
                <div v-if="fileNames.length">
                    <ul>
                        <li v-for="(file, index) in fileNames" :key="index">
                            <!-- Display preview for images -->
                            <img v-if="isImage(file.type)" :src="file.preview" :alt="file.name" class="thumbnail" />

                            <!-- Display PDF icon for PDF files -->
                            <!-- <img v-else-if="isPDF(file.type)" src="@/assets/pdf_logo.png" alt="PDF" class="pdf-icon" /> -->

                            <!-- Remove button for each file -->
                            <button class="delete is-small" @click="removeFile(index)"></button>

                            <!-- Display the file name -->
                            {{ file.name }}
                        </li>
                    </ul>
                </div>
            </div>

            <!-- File input for uploading files -->
            <div class="file is-danger my-2 has-name is-boxed has-background-warning ">
                <label class="file-label">
                    <!-- Add @change handler to call handleFileUpload method -->
                    <input ref="fileInput" class="file-input" type="file" multiple name="resume"
                        @change="handleFileUpload" />
                    <span class="file-cta">
                        <span class="file-icon">
                            <i class="fas fa-cloud-upload-alt"></i>
                        </span>
                        <span class="file-label"> Danger file… </span>
                    </span>
                    <!-- Display the selected file name(s) -->
                    <span class="file-name">{{ fileNames.length > 0 ? fileNames.map(file => file.name).join(', ') :
                        'Nofiles selected' }}</span>
                </label>
            </div>

            <div>
                <h1>All Uploaded Images</h1>
                <div v-if="loading">Loading images...</div>
                <div v-if="error" class="error">{{ error }}</div>
                <div v-if="images.length > 0" class="image-gallery">
                    <div v-for="image in images" :key="image.filename" class="image-item">
                        <img :src="image.url" :alt="image.filename" :title="image.filename" />
                    </div>
                </div>
                <div v-else>No images found.</div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            fileNames: [], // Store the uploaded file objects
            files: [],
            images: [],    // Store images
            loading: false,  // Loading state
            error: '',     // Error message
        };
    },
    async mounted() {
        this.fetchImages();
        try {
            const response = await axios.get("http://localhost:3000/land/upload_lives");
            console.log(response.data.images[0])
            this.fileNames = response.data.images[0]
        } catch (error) {

        }
    },
    methods: {
        async fetchImages() {
            this.loading = true;
            try {
                // Replace with your backend URL
                const response = await axios.get('http://localhost:3000/land/upload_lives');
                console.log('response.data.images:',response.data.images)
                this.images = response.data.images;
            } catch (err) {
                this.error = 'Error fetching images from the server.';
                console.error(err);
            } finally {
                this.loading = false;
            }
        },
        async handleFileUpload(event) {
            const files = event.target.files; // ถ้าใช้ input[type="file"]
            // Map the selected files to the fileNames array and generate preview URLs
            this.fileNames = Array.from(files).map((file) => ({
                name: file.name,
                type: file.type,
                preview: URL.createObjectURL(file) // Create a preview URL for the image or file
            }));

            this.files = Array.from(files).map((file) => ({
                name: file.name,
            }));

            const formData = new FormData();

            // เพิ่มไฟล์เข้าไปใน FormData
            for (let i = 0; i < files.length; i++) {
                formData.append('resume', files[i]); // 'resume' คือชื่อฟิลด์ที่คุณใช้ใน backend
            }

            try {
                // Make the POST request using axios
                const response = await axios.post('http://localhost:3000/land/upload_live', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data', // บอกว่าเป็นการส่งไฟล์
                    }
                });

                // Handle the response on success
                console.log('Response data:', response.data);

            } catch (error) {
                // Handle errors here
                console.error('Error occurred:', error);

                if (error.response) {
                    // The request was made, and the server responded with a status code
                    // that falls out of the range of 2xx
                    console.error('Response error:', error.response.data);
                    console.error('Status code:', error.response.status);
                } else if (error.request) {
                    // The request was made but no response was received
                    console.error('No response received:', error.request);
                } else {
                    // Something happened in setting up the request that triggered an error
                    console.error('Request error:', error.message);
                }
            }
        },
        handleSubmit() {
            // Handle the file upload submission logic here
            console.log('Files submitted:', this.fileNames);
        },
        isImage(type) {
            return type.startsWith('image/'); // Check if the file type is an image
        },
        isPDF(type) {
            return type === 'application/pdf'; // Check if the file type is PDF
        },
        removeFile(index) {
            this.fileNames.splice(index, 1); // Remove the file from the list
            this.updateFileInput(); // Clear the file input if all files are removed
        },
        updateFileInput() {
            const input = this.$refs.fileInput;
            if (this.fileNames.length === 0) {
                input.value = ''; // Clear the file input value when no files are selected
            }
        }
    }
};
</script>

<style scoped>
.file-box {
    min-height: 100px;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 1px 4px, rgb(51, 51, 51) 0px 0px 0px 3px;
}

.thumbnail {
    max-width: 100px;
    margin-right: 10px;
}

.pdf-icon {
    width: 30px;
    margin-right: 10px;
}

/* test */
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
</style>

