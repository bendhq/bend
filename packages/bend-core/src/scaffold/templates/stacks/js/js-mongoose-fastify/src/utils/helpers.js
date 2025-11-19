// Utility functions
export const delay = (ms)=> {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const generateId = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};
