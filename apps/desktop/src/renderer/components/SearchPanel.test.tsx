import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { SearchPanel } from './SearchPanel'

describe('SearchPanel', () => {
  it('renders time bounds and query fields', () => {
    render(<SearchPanel />)
    expect(screen.getByLabelText(/start_time/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/end_time/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/^query$/i)).toBeInTheDocument()
  })

  it('updates query text', async () => {
    const user = userEvent.setup()
    render(<SearchPanel />)
    const input = screen.getByRole('textbox', { name: /^query$/i })
    await user.type(input, 'hello')
    expect(input).toHaveValue('hello')
  })
})
