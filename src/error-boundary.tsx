import { Component } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Props = { [key: string]: any }
type State = { hasError: boolean }

/**
 * In case of an error that breaks the app, we
 * show a feedback to the user instead of errors.
 * We can put any fallback screen and/or error logging
 * service here.
 * Doesn't work if `ReactRouter` is used, which catches
 * errors itself
 */
class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch() {
    this.setState({ hasError: true })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div>
          <h1>Something went wrong</h1>
        </div>
      )
    }

    return this.props.children
  }
}

export { ErrorBoundary }
