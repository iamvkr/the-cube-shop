// GET RANDOM MIN - MAX INCLUSIVE:
export const getRandom = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
// Helper function to calculate upgrade cost and duration
export const calculateUpgradeCost = (incrementPercent: number) => {
  return Math.round(incrementPercent * incrementPercent * 5);
};

export const calculateUpgradeDuration = (incrementPercent: number) => {
  return incrementPercent * 2; // seconds
};

// VALIDATOR:
/**
 * Validates user input for a signup/LOGIN form.
 *
 * @param email - The user's email address.
 * @param password - The user's chosen password.
 * @param name - (Optional) The user's name.
 * @returns An object containing a boolean result and a message.
 */
export const validate = (
  email: string,
  password: string,
  name?: string
): { result: boolean; message: string } => {
  // --- Name Validation (if provided) ---
  // Checks if the name parameter was passed and isn't just empty spaces.
  if (name !== undefined) {
    if (!name || name.trim() === "") {
      return { result: false, message: "Name cannot be empty." };
    }
  }

  // --- Email Validation ---
  // A standard regex to check for a valid email format.
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || email.trim() === "") {
    return { result: false, message: "Email is required." };
  }
  if (!emailRegex.test(email)) {
    return { result: false, message: "Please enter a valid email address." };
  }

  // --- Password Validation ---
  if (!password) {
    return { result: false, message: "Password is required." };
  }
  // 1. Check for minimum length
  if (password.length < 8) {
    return {
      result: false,
      message: "Password must be at least 8 characters long.",
    };
  }
  // UNCOMMENT IF NEED MORE CHECKS
  // // 2. Check for at least one uppercase letter
  // if (!/[A-Z]/.test(password)) {
  //   return { result: false, message: "Password must contain at least one uppercase letter." };
  // }
  // // 3. Check for at least one lowercase letter
  // if (!/[a-z]/.test(password)) {
  //   return { result: false, message: "Password must contain at least one lowercase letter." };
  // }
  // // 4. Check for at least one number
  // if (!/[0-9]/.test(password)) {
  //   return { result: false, message: "Password must contain at least one number." };
  // }
  // // 5. Check for at least one special character
  // if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
  //   return { result: false, message: "Password must contain at least one special character." };
  // }

  // --- Success ---
  // If all the above checks pass, the validation is successful.
  return { result: true, message: "Validation successful" };
};
