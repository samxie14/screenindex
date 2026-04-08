import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders the home shell', () => {
    render(<App />)
    expect(screen.getByRole('button', { name: /^home$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /an ai for your desktop/i })).toBeInTheDocument()
  })
})
