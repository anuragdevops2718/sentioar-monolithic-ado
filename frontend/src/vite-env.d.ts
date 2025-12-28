/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GET_API_BASE_URL: string;
  readonly VITE_ADD_API_BASE_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
