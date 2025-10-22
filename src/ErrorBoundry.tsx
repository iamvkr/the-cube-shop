import React , { type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
    children?: ReactNode;
  }
  
  interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
  }

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state;
  constructor(props : { children?: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error : Error) {
    // Update state so next render shows fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error : Error, errorInfo : ErrorInfo) {
    // Log the error to an error reporting service
    console.error('Caught by Error Boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Render any fallback UI
      return <h2>Something went wrong.</h2>;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
