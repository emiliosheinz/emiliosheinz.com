"use client";

import { Component, type ReactNode } from "react";

type InteractiveRubiksCubeErrorBoundaryProps = {
  children: ReactNode;
};

type InteractiveRubiksCubeErrorBoundaryState = {
  hasError: boolean;
};

export class InteractiveRubiksCubeErrorBoundary extends Component<
  InteractiveRubiksCubeErrorBoundaryProps,
  InteractiveRubiksCubeErrorBoundaryState
> {
  constructor(props: InteractiveRubiksCubeErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): InteractiveRubiksCubeErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    console.error("Interactive cube error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}
