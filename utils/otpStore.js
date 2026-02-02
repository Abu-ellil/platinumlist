// Shared OTP store for the application
// In production, this should be replaced with Redis or a database
const otpStore = new Map();

export default otpStore; 