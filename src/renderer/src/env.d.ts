/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_L2D_PATH: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
