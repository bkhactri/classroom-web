export const validateUsername = (username) => {
  let error;
  if (/\s/.test(username)) {
    error = "Username should not include blank space";
  }

  return error;
};

export const validateEmail = (email) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
};

export const validatePassword = (password) => {
  let error;
  if (password.length < 6) {
    return (error = "Minimum length of password is 6");
  }
  if (password.length > 16) {
    return (error = "Maximum length of password is 16");
  }
  if (!password.match(/[a-z]+/)) {
    return (error = "Password should include at least 1 lowercase letter");
  }
  if (!password.match(/[A-Z]+/)) {
    return (error = "Password should include at least 1 uppercase letter");
  }
  if (!password.match(/[0-9]+/)) {
    return (error = "Password should include at least 1 number");
  }
  if (!password.match(/[$@#&!]+/)) {
    return (error = "Password should include at least 1 special character");
  }
  return error;
};
