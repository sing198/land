<template>
    <div class="container">
        <div class="login-container box">
            <h2 class="title is-3 has-text-centered">Login</h2>
            <form @submit.prevent="handleLogin">
                <div class="field">
                    <label class="label" for="username">Username</label>
                    <div class="control">
                        <input class="input" type="text" id="username" v-model="username" placeholder="Enter username"
                            required />
                    </div>
                    <p v-if="usernameError" class="help is-danger">{{ usernameError }}</p>
                </div>

                <div class="field">
                    <label class="label" for="password">Password</label>
                    <div class="control">
                        <input class="input" type="password" id="password" v-model="password"
                            placeholder="Enter password" required />
                    </div>
                    <p v-if="passwordError" class="help is-danger">{{ passwordError }}</p>
                </div>

                <div class="field">
                    <div class="control">
                        <button class="button is-primary is-fullwidth">Login</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { useUserStore } from '@/stores/useUserStore';

export default {
    data() {
        return {
            username: '',
            password: '',
            usernameError: '',
            passwordError: ''
        };
    },
    computed: {
        // ใช้ computed เพื่อเข้าถึง userRole ใน userStore state
        userRole() {
            return this.userStore.userRole;
        },
        isUser() {
            return this.userStore.isUser;
        }
    },
    methods: {
        validateForm() {
            this.usernameError = this.username ? '' : 'Username is required';
            this.passwordError = this.password ? '' : 'Password is required';
            return !this.usernameError && !this.passwordError;
        },
        async handleLogin() {
            if (this.validateForm()) {
                console.log('username:', this.username)
                console.log('password:', this.password)
                // Add API call for login here if needed
            }
            this.userStore = useUserStore();
            const payload = { username: this.username, password: this.password };
            try {
                const response = await axios.post('http://localhost:3000/login', payload, { withCredentials: true });
                console.log("res:", response)
                console.log("role:", response.data.role)
                this.userStore.setUserRole(response.data.role); // กำหนดค่า userRole เป็น "Admin"
                console.log("state:", this.userStore.userRole)
                alert('Logged in successfully!');
            } catch (error) {
                console.error('Failed to fetch role', error);
                useUserStore.userRole = null;
                alert('Logged is failed!');
            }
        }
    }
};
</script>

<style scoped>
.login-container {
    max-width: 400px;
    margin: 2rem auto;
    padding: 2rem;
}
</style>