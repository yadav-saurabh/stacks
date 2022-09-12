import { resolve } from 'pathe'
import { createApp } from 'vue'
import { defineConfig } from 'vite'
import { defineConfig as defineTestConfig } from 'vitest/config'
import { componentsBuildOptions, webComponentsBuildOptions } from '../build'
import { Stacks, atomicCssEngine, autoImports, components, envPrefix, i18n, inspect, uiEngine } from './stacks'

export { resolve, Stacks, uiEngine, autoImports, atomicCssEngine, components, inspect, createApp, defineConfig, defineTestConfig, envPrefix, i18n, componentsBuildOptions, webComponentsBuildOptions }
