import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { HomeView } from './HomeView'

describe('HomeView', () => {
  it('opens the chat screen from the new chat button', async () => {
    const user = userEvent.setup()

    render(<HomeView />)
    await user.click(screen.getByRole('button', { name: /new chat/i }))

    expect(screen.getByRole('heading', { name: /chat with your desktop history/i })).toBeInTheDocument()
  })

  it('opens the chat screen from the composer send button', async () => {
    const user = userEvent.setup()

    render(<HomeView />)
    await user.click(screen.getByRole('button', { name: /^send$/i }))

    expect(screen.getByRole('heading', { name: /chat with your desktop history/i })).toBeInTheDocument()
  })

  it('toggles capture state from running to paused', async () => {
    const user = userEvent.setup()

    render(<HomeView />)
    await user.click(screen.getByRole('button', { name: /pause capture/i }))

    expect(screen.getByText(/capture is currently paused/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /start capture/i })).toBeInTheDocument()
  })
})
