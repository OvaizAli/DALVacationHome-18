export const encryptCipherText = (cipherText, shift) => {
  let encryptedText = ""
  for (let i = 0; i < cipherText.length; i++) {
    let char = cipherText[i];
    if (char === " ") {
      continue;
    }
    if (char === char.toUpperCase()) {
      let shiftedChar = String.fromCharCode((char.charCodeAt(0) + shift - 65) % 26 + 65);
      encryptedText += shiftedChar;
    }
    else {
      let shiftedChar = String.fromCharCode((char.charCodeAt(0) + shift - 97) % 26 + 97);
      encryptedText += shiftedChar;
    }
  }
  return encryptedText;
}

export const formatSecurityQA = (secondFactorAuthData) => {
  return secondFactorAuthData.q1 + "::" + secondFactorAuthData.a1 + "::" + secondFactorAuthData.q2 + "::" + secondFactorAuthData.a2 + "::" + secondFactorAuthData.q3 + "::" + secondFactorAuthData.a3;
}

export const setUser = (user) => {
  console.log(user)
  sessionStorage.setItem("user", JSON.stringify(user));
}

export const getUser = () => {
  return JSON.parse(sessionStorage.getItem("user"));
}