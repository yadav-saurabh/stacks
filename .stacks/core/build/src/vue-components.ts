import { defineConfig } from 'vite'
import type { ViteConfig } from '@stacksjs/types'
import { buildEntriesPath, componentsPath, frameworkPath, projectPath } from '@stacksjs/paths'
import type { BuildOptions as ViteBuildOptions } from 'vite'
import { library } from '../../../config'
import { alias } from '../../../alias'
import { atomicCssEngine, autoImports, components, inspect, preview, uiEngine } from '.'

export const vueComponentsConfig: ViteConfig = {
  root: componentsPath(),
  envDir: projectPath(),
  envPrefix: 'APP_',

  server: {
    port: 3333,
    open: true,
  },

  resolve: {
    dedupe: ['vue'],
    alias,
  },

  optimizeDeps: {
    exclude: ['vue'],
  },

  plugins: [
    preview(),
    uiEngine(),
    atomicCssEngine(),
    autoImports(),
    components(),
    inspect(),
  ],

  build: vueComponentsBuildOptions(),
}

export function vueComponentsBuildOptions(): ViteBuildOptions {
  return {
    outDir: frameworkPath('vue-components/dist'),
    emptyOutDir: true,
    lib: {
      entry: buildEntriesPath('vue-components.ts'),
      name: library.vueComponents.name,
      formats: ['cjs', 'es'],
      fileName: (format: string) => {
        if (format === 'es')
          return 'index.mjs'

        if (format === 'cjs')
          return 'index.cjs'

        return 'index.?.js'
      },
    },

    rollupOptions: {
      external: ['vue'],
      output: {
        globals: {
          vue: 'Vue',
        },
      },
    },
  }
}

export default defineConfig(({ command }) => {
  if (command === 'serve')
    return vueComponentsConfig

  // command === 'build'
  return vueComponentsConfig
})
