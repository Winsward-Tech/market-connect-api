import crypto from 'crypto';

// Generate a 6-digit OTP
export const generateOTP = () => {
  return crypto.randomInt(100000, 999999).toString();
};

// Set OTP expiration time (5 minutes from now)
export const getOTPExpiration = () => {
  return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
};

// Validate OTP
export const validateOTP = (storedOTP, storedExpiration, providedOTP) => {
  if (!storedOTP || !storedExpiration) {
    return false;
  }

  // Check if OTP has expired
  if (new Date() > new Date(storedExpiration)) {
    return false;
  }

  // Compare OTPs
  return storedOTP === providedOTP;
};

// Format phone number to Ghana format if not already
export const formatPhoneNumber = (phone) => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  
  // If number starts with 0, replace with 233
  if (cleaned.startsWith('0')) {
    return '233' + cleaned.substring(1);
  }
  
  // If number doesn't start with 233, add it
  if (!cleaned.startsWith('233')) {
    return '233' + cleaned;
  }
  
  return cleaned;
}; 