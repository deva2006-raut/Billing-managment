// Authentication System
class Auth {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.checkLoggedIn();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const authForm = document.getElementById('auth-form');
        const switchToSignup = document.getElementById('switch-to-signup');
        const forgotPasswordLink = document.getElementById('forgot-password-link');
        const logoutBtn = document.getElementById('logout-btn');
        const headerLogout = document.getElementById('header-logout');

        authForm.addEventListener('submit', (e) => this.handleAuthSubmit(e));
        switchToSignup.addEventListener('click', (e) => this.toggleAuthMode(e));
        forgotPasswordLink.addEventListener('click', (e) => this.handleForgotPassword(e));
        logoutBtn.addEventListener('click', (e) => this.logout());
        headerLogout.addEventListener('click', (e) => this.logout());
    }

    checkLoggedIn() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            this.currentUser = JSON.parse(user);
            this.showApp();
            this.sendLoginAlert();
        } else {
            this.showAuth();
        }
    }

    handleAuthSubmit(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        const isSignup = document.getElementById('auth-title').textContent === 'Sign Up';

        if (isSignup) {
            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }
            this.signup(email, password);
        } else {
            this.login(email, password);
        }
    }

    signup(email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');

        // Check if user already exists
        if (users.find(u => u.email === email)) {
            alert('User already exists!');
            return;
        }

        const user = {
            email,
            password: this.hashPassword(password),
            createdAt: new Date().toISOString()
        };

        users.push(user);
        localStorage.setItem('users', JSON.stringify(users));

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));

        this.showApp();
        alert('Account created successfully!');
    }

    login(email, password) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);

        if (!user || user.password !== this.hashPassword(password)) {
            alert('Invalid email or password!');
            return;
        }

        this.currentUser = user;
        localStorage.setItem('currentUser', JSON.stringify(user));

        this.showApp();
        this.sendLoginAlert();
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        this.showAuth();
        document.getElementById('auth-form').reset();
    }

    toggleAuthMode(e) {
        e.preventDefault();
        const title = document.getElementById('auth-title');
        const confirmGroup = document.getElementById('confirm-password-group');
        const button = document.querySelector('#auth-form button');

        if (title.textContent === 'Login') {
            title.textContent = 'Sign Up';
            confirmGroup.style.display = 'block';
            button.textContent = 'Sign Up';
        } else {
            title.textContent = 'Login';
            confirmGroup.style.display = 'none';
            button.textContent = 'Login';
        }
    }

    handleForgotPassword(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        if (!email) {
            alert('Please enter your email address first.');
            return;
        }

        // In a real app, this would send an email
        alert(`Password reset link sent to ${email}. (This is a demo - check console for mock email)`);
        console.log(`Mock Email to ${email}:`);
        console.log('Subject: Password Reset');
        console.log('Body: Click here to reset your password: https://example.com/reset');
    }

    sendLoginAlert() {
        const now = new Date();
        const alertMessage = `
Subject: Successful Login Alert

Your account was successfully accessed.

Login Details:
- Email: ${this.currentUser.email}
- Date & Time: ${now.toLocaleString()}
- IP Address: ${this.getMockIP()}

Security Notice:
If this was not you, please contact support immediately.
        `;

        console.log('Mock Email Alert:', alertMessage);
        alert('Login successful! Check console for email alert.');
    }

    getMockIP() {
        return '192.168.1.100'; // Mock IP for demo
    }

    hashPassword(password) {
        // Simple hash for demo - NOT secure for production
        let hash = 5381;
        for (let i = 0; i < password.length; i++) {
            const char = password.charCodeAt(i);
            hash = ((hash << 5) + hash) + char; // djb2 hash
        }
        return hash.toString();
    }

    showAuth() {
        document.getElementById('auth-container').style.display = 'flex';
        document.getElementById('app-container').style.display = 'none';
    }

    showApp() {
        document.getElementById('auth-container').style.display = 'none';
        document.getElementById('app-container').style.display = 'flex';

        // Update header with user email
        document.getElementById('user-email').textContent = this.currentUser.email;
        document.getElementById('profile-email').textContent = this.currentUser.email;
        document.getElementById('profile-created').textContent = new Date(this.currentUser.createdAt).toLocaleDateString();

        // Initialize app after showing
        if (window.app) {
            window.app.updateDashboard();
        }
    }
}

// Initialize auth when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.auth = new Auth();
});
