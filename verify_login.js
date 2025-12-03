const axios = require('axios');

async function verifyLogin() {
    try {
        const response = await axios.post('http://localhost:300/api/v1/register', {
            user_email: 'bashar@gmail.com',
            user_password: 'Bashar77',
            phone: '1234567890',
            user_name: 'Bashar Al-himyary'
        });
        console.log('Login successful:', response.data);
    } catch (error) {
        console.error('Login failed:', error.response ? error.response.data : error.message);
    }
}

verifyLogin();
