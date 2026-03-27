/// <reference types="@testing-library/jest-dom" />
import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, vi } from 'vitest'

afterEach(() => {
  cleanup()
})

const ipcRenderer = {
  send: vi.fn(),
  invoke: vi.fn(),
  on: vi.fn(() => vi.fn()),
  once: vi.fn(),
  removeListener: vi.fn(),
  removeAllListeners: vi.fn()
}

Object.defineProperty(window, 'electron', {
  configurable: true,
  value: {
    process: {
      versions: {
        electron: '0.0.0-test',
        chrome: '0.0.0-test',
        node: '0.0.0-test'
      }
    },
    ipcRenderer
  }
})
