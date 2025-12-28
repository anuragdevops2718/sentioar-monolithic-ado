import "@testing-library/jest-dom";

Object.defineProperty(globalThis, "import", {
  value: {
    meta: {
      env: {
        VITE_GET_API_BASE_URL: "http://localhost:5000",
        VITE_ADD_API_BASE_URL: "http://localhost:5000"
      }
    }
  }
});
