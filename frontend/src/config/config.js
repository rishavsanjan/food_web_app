const config = {
  development: {
    apiUrl: "http://localhost:3000",
  },
  production: {
    apiUrl: "https://food-web-app-0f5h.onrender.com",
  },
};

// Get environment from .env file or fallback to development
const env = import.meta.env.VITE_REACT_APP_ENV || "development";

export default config[env];
