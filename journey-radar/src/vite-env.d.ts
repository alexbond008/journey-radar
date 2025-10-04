/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_MAP_TILE_URL: string;
  readonly VITE_DEFAULT_CENTER_LAT: string;
  readonly VITE_DEFAULT_CENTER_LON: string;
  readonly VITE_DEFAULT_ZOOM: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

