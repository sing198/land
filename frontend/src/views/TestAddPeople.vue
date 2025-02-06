<template>
  <div>
    <form @submit.prevent="submitCitizen">
      <div class="form-group">
        <label for="prefix">Prefix</label>
        <input
          id="prefix"
          v-model="formPeopleData.prefix"
          @input="validateField('prefix')"          
          class="form-control"
          :class="{ 'is-invalid': errors.prefix }"
        />
        <span v-if="errors.prefix" class="text-danger">{{ errors.prefix }}</span>
      </div>

      <div class="form-group">
        <label for="firstName">First Name</label>
        <input
          id="firstName"
          v-model="formPeopleData.firstName"
          @input="validateField('firstName')"
          class="form-control"
          :class="{ 'is-invalid': errors.firstName }"
        />
        <span v-if="errors.firstName" class="text-danger">{{ errors.firstName }}</span>
      </div>

      <div class="form-group">
        <label for="lastName">Last Name</label>
        <input
          id="lastName"
          v-model="formPeopleData.lastName"
          @input="validateField('lastName')"
          class="form-control"
          :class="{ 'is-invalid': errors.lastName }"
        />
        <span v-if="errors.lastName" class="text-danger">{{ errors.lastName }}</span>
      </div>

      <div class="form-group">
        <label for="birthDate">Birth Date</label>
        <input
          id="birthDate"
          type="date"
          v-model="formPeopleData.birthDate"
          @input="validateField('birthDate')"
          class="form-control"
          :class="{ 'is-invalid': errors.birthDate }"
        />
        <span v-if="errors.birthDate" class="text-danger">{{ errors.birthDate }}</span>
      </div>

      <div class="form-group">
        <label for="phone">Phone</label>
        <input
          id="phone"
          v-model="formPeopleData.phone"
          @input="validateField('phone')"
          class="form-control"
          :class="{ 'is-invalid': errors.phone }"
        />
        <span v-if="errors.phone" class="text-danger">{{ errors.phone }}</span>
      </div>

      <div class="form-group">
        <label for="citizenId">Citizen ID</label>
        <input
          id="citizenId"
          v-model="formPeopleData.citizenId"
          @input="validateField('citizenId')"
          class="form-control"
          :class="{ 'is-invalid': errors.citizenId }"
        />
        <span v-if="errors.citizenId" class="text-danger">{{ errors.citizenId }}</span>
      </div>

      <!-- Add more fields here as needed -->

      <button type="submit" :disabled="isSubmitting" class="btn btn-primary">
        Submit
      </button>
    </form>
  </div>
</template>

<script>
import * as yup from "yup";
import { getPeopleModel } from '@/model/peopleModel';
import { CitizenValidSchema } from "@/model/peopleModel";

export default {
  data() {
    return {
      formPeopleData: { ...getPeopleModel }, // Initialize form data
      errors: {}, // Store validation errors
      isSubmitting: false, // Disable the button during submission
    };
  },
  methods: {
    // Validation schema
    getValidationSchema() {
      return yup.object().shape({...CitizenValidSchema});
    },

    // Validate a single field
    async validateField(field) {
      try {
        const schema = this.getValidationSchema();
        await schema.validateAt(field, this.formPeopleData);
        this.errors[field] = ""; // Clear error if valid
      } catch (err) {
        this.errors[field] = err.message; // Set error message
      }
    },

    // Validate the whole form
    async validateForm() {
      try {
        const schema = this.getValidationSchema();
        await schema.validate(this.formPeopleData, { abortEarly: false });
        this.errors = {}; // Clear all errors
        return true;
      } catch (err) {
        this.errors = err.inner.reduce((acc, curr) => {
          acc[curr.path] = curr.message;
          return acc;
        }, {});
        return false;
      }
    },

    // Submit the form
    async submitCitizen() {
      const isValid = await this.validateForm();
      if (!isValid) return;

      console.log("Form submitted:", this.formPeopleData);
      try {
        this.isSubmitting = true;
        const response = await axios.post("http://localhost:3000/people", this.formPeopleData);
        console.log("Response:", response.data);
        alert("Form submitted successfully!");
      } catch (error) {
        console.error("Error:", error);
        alert("Submission failed!");
      } finally {
        this.isSubmitting = false;
      }
    },
  },
};
</script>

<style>
.is-invalid {
  border-color: red;
}
.text-danger { 
  font-size: 0.875rem;
}
</style>
