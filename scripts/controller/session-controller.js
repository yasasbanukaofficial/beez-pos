export const sessionController = {
  saveSessionItem(key, val) {
    sessionStorage.setItem(key, val);
  },
  getSessionItem(key) {
    return sessionStorage.getItem(key);
  },
  removeSessionItem(key) {
    sessionStorage.removeItem(key);
  },
};
