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
    <KBarProvider actions={actions}>
      <KBarPortal>
        <KBarPositioner className="z-40 bg-black bg-opacity-80 backdrop-blur-sm">
          <KBarAnimator className="w-full max-w-xl rounded-md bg-codGray-500 bg-opacity-80 backdrop-blur-xl">
            <KBarSearch className="w-full h-12 p-5 bg-transparent rounded-md outline-none" />
            <Results />
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </KBarProvider>
  );
}
