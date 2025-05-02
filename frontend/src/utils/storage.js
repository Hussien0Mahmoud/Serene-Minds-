export const storage = {
  setUser: (user) => {
    try {
      localStorage.setItem('user', JSON.stringify(user));
    } catch (err) {
      console.error('Error saving to localStorage', err);
    }
  },

  getUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch (err) {
      console.error('Error reading from localStorage', err);
      return null;
    }
  },

  removeUser: () => {
    try {
      localStorage.removeItem('user');
    } catch (err) {
      console.error('Error removing from localStorage', err);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (err) {
      console.error('Error clearing localStorage', err);
    }
  }
};