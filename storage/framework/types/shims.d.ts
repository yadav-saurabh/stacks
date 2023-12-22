/* eslint-disable */

declare interface Window {
  // extend the window
}

// via `vite-plugin-vue-markdown`, markdown
// files can be treated as Vue components
declare module '*.md' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module '*.stx' {
  import type { DefineComponent } from 'vue'

  const component: DefineComponent<{}, {}, any>
  export default component
}
