"use client"

import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
} from "kbar";
import { CommandBarResults } from "./command-bar-results";
import { useCommandBarActions } from "./user-command-bar-actions";

type CommandBarProps = {
  children: React.ReactNode;
};

export function CommandBar(props: CommandBarProps) {
  const { children } = props;

  const actions = useCommandBarActions();

  return (
    <KBarProvider
      actions={actions}
      options={{ disableScrollbarManagement: true }}
    >
      <KBarPortal>
        <KBarPositioner className="z-40 bg-background/80 backdrop-blur-xs">
          <KBarAnimator className="w-full max-w-xl rounded-md overflow-hidden bg-background/80 backdrop-blur-xl shadow-md">
            <KBarSearch className="w-full h-12 p-5 bg-transparent rounded-md outline-hidden" />
            <CommandBarResults />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}
