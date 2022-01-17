export const validateUsername = (username) => {
  let error;
  if (/\s/.test(username)) {
    error = "error.usernameBlank";
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
    return (error = "error.minPassword");
  }
  if (password.length > 16) {
    return (error = "error.maxPassWord");
  }
  if (!password.match(/[a-z]+/)) {
    return (error = "error.lowercaseMiss");
  }
  if (!password.match(/[A-Z]+/)) {
    return (error = "error.uppercaseMiss");
  }
  if (!password.match(/[0-9]+/)) {
    return (error = "error.numberMiss");
  }
  if (!password.match(/[$@#&!]+/)) {
    return (error = "error.specialKeyMiss");
  }
  return error;
};
