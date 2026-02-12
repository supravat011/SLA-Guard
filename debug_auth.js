// Debug script to check localStorage and authentication
console.log('=== Authentication Debug ===');
console.log('Auth Token:', localStorage.getItem('auth_token'));
console.log('User Data:', localStorage.getItem('user'));

const userData = localStorage.getItem('user');
if (userData) {
    try {
        const user = JSON.parse(userData);
        console.log('Parsed User:', user);
        console.log('User Role:', user.role);
    } catch (e) {
        console.error('Error parsing user data:', e);
    }
} else {
    console.warn('No user data found in localStorage - you may not be logged in!');
}
