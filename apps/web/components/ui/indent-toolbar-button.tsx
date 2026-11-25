'use client';

import * as React from 'react';

import { useIndentButton, useOutdentButton } from '@platejs/indent/react';
import { ListIndentIncrease as IndentIcon, ListIndentDecrease as OutdentIcon } from 'honestui/icons';

import { ToolbarButton } from './toolbar';

export function IndentToolbarButton(
  props: React.ComponentProps<typeof ToolbarButton>
) {
  const { props: buttonProps } = useIndentButton();

  return (
    <ToolbarButton {...props} {...buttonProps} tooltip="Indent">
      <IndentIcon />
    </ToolbarButton>
  );
}

export function OutdentToolbarButton(
  props: React.ComponentProps<typeof ToolbarButton>
) {
  const { props: buttonProps } = useOutdentButton();

  return (
    <ToolbarButton {...props} {...buttonProps} tooltip="Outdent">
      <OutdentIcon />
    </ToolbarButton>
  );
}
