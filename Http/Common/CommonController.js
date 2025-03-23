const axios = require('axios');

class CommonController {

    async ValidateSession(sessionToken) {
        try {
            const url = 'http://localhost:3000/session/validate';
            const response = await axios.post(url, { sessionToken });
            if (response.status === 200) {
                return {
                    success: true,
                    message: response.data?.message || 'Token is valid.',
                };
            } else {
                return {
                    success: false,
                    error: response.data?.error || 'Invalid token.',
                };
            }
        } catch (error) {
            if (error.response) {
                return {
                    success: false,
                    error: error.response.data?.error || 'Error validating token.',
                    statusCode: error.response.status,
                };
            }
            return {
                success: false,
                error: error.message || 'Unexpected error validating token.',
            };
        }
    }

    async RequestToken(sessionToken, actionCode) {
        const url = 'http://localhost:3000/action';
        try {
            const response = await axios.post(url, { sessionToken, actionCode });
            if (response.status === 200) {
                return { success: true, data: response.data };
            }
            return { success: false, error: 'Error: ' + response.status };
        } catch (error) {
            if (error.response) {
                return { success: false, statusCode: error.response.status, error: error.response.data?.error };
            }
            return { success: false, error: error.message };
        }
    }

    async FindUser(sessionToken, actionToken) {
        try {
            const url = 'http://localhost:3000/findUser';
            const response = await axios.post(url, { sessionToken, actionToken });
            if (response.status === 200) {
                const { u_dni } = response.data;
                return { success: true, dni: u_dni };
            }
            return { success: false, error: 'Error: ' + response.status };
        } catch (error) {
            if (error.response) {
                return {
                    success: false,
                    statusCode: error.response.status,
                    error: error.response.data?.error
                };
            }
            return { success: false, error: error.message };
        }
    }

    async ValidateActionToken(sessionToken, actionToken, actionCode) {
        try {
            const url = 'http://localhost:3000/action/validate';
            const response = await axios.post(url, { sessionToken, actionToken, actionCode });
            if (response.status === 200) {
                return { success: true, message: response.data.message };
            }
            return { success: false, error: 'Error: ' + response.status };
        } catch (error) {
            if (error.response) {
                return { success: false, statusCode: error.response.status, error: error.response.data?.error };
            }
            return { success: false, error: error.message };
        }
    }

}

module.exports = CommonController;
