"use client";

import {
  KBarProvider,
  KBarPortal,
  KBarPositioner,
  KBarAnimator,
  KBarSearch,
} from "kbar";

import { useActions } from "./use-actions.hook";
import { Results } from "./results.component";

type CommandBarProps = {
  children: React.ReactNode;
};

export function CommandBar(props: CommandBarProps) {
  const { children } = props;

  const actions = useActions();

  return (
    <KBarProvider
      actions={actions}
      options={{ disableScrollbarManagement: true }}
    >
      <KBarPortal>
        <KBarPositioner className="z-40 bg-background/80 backdrop-blur-xs">
          <KBarAnimator className="w-full max-w-xl rounded-md overflow-hidden bg-background/80 backdrop-blur-xl shadow-md">
            <KBarSearch className="w-full h-12 p-5 bg-transparent rounded-md outline-hidden" />
            <Results />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}
