import {
  validateUsername,
  validateEmail,
  validatePassword,
} from "./fieldValidator";

export const signInFormValidator = (data) => {
  const email = data.get("email");
  const password = data.get("password");

  if (!email || !password) {
    return { error: "Please fill in all the required fields" };
  }

  if (!validateEmail(email)) {
    return { error: "Email is not valid" };
  }

  return true;
};

export const signUpFormValidator = (data) => {
  const username = data.get("username");
  const email = data.get("email");
  const password = data.get("password");
  const confirmPassword = data.get("confirmPassword");

  if (!username || !email || !password || !confirmPassword) {
    return { error: "Please fill in all the required fields" };
  }

  const usernameError = validateUsername(username);
  if (usernameError) {
    return { error: usernameError };
  }

  if (!validateEmail(email)) {
    return { error: "Email is not valid" };
  }

  const passwordError = validatePassword(password);
  if (passwordError) {
    return { error: passwordError };
  }

  if (password !== confirmPassword) {
    return { error: "Confirm password is not correct" };
  }

  return true;
};
