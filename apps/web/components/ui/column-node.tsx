'use client';

import * as React from 'react';

import type { TColumnElement } from 'platejs';
import type { PlateElementProps } from 'platejs/react';

import { useDraggable, useDropLine } from '@platejs/dnd';
import { setColumns } from '@platejs/layout';
import { ResizableProvider } from '@platejs/resizable';
import { BlockSelectionPlugin } from '@platejs/selection/react';
import { useComposedRef } from '@udecode/cn';
import { Columns2, Columns3, GalleryHorizontal, GripHorizontal, PanelLeft, PanelRight } from 'honestui/icons';
import { PathApi } from 'platejs';
import {
  PlateElement,
  useEditorRef,
  useEditorSelector,
  useElement,
  useFocusedLast,
  usePluginOption,
  useReadOnly,
  useRemoveNodeButton,
  useSelected,
  withHOC,
} from 'platejs/react';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverAnchor,
  PopoverContent,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Trash2 as Trash2Icon } from '@/components/ui/animated-icons';
import { cn } from '@/lib/utils';

export const ColumnElement = withHOC(
  ResizableProvider,
  function ColumnElement(props: PlateElementProps<TColumnElement>) {
    const { width } = props.element;
    const readOnly = useReadOnly();
    const isSelectionAreaVisible = usePluginOption(
      BlockSelectionPlugin,
      'isSelectionAreaVisible'
    );

    const { isDragging, previewRef, handleRef } = useDraggable({
      element: props.element,
      orientation: 'horizontal',
      type: 'column',
      canDropNode: ({ dragEntry, dropEntry }) =>
        PathApi.equals(
          PathApi.parent(dragEntry[1]),
          PathApi.parent(dropEntry[1])
        ),
    });

    return (
      <div className="group/column relative" style={{ width: width ?? '100%' }}>
        {!readOnly && !isSelectionAreaVisible && (
          <div
            ref={handleRef}
            className={cn(
              '-translate-x-1/2 -translate-y-1/2 absolute top-2 left-1/2 z-50',
              'pointer-events-auto flex items-center',
              'opacity-0 transition-opacity group-hover/column:opacity-100'
            )}
          >
            <ColumnDragHandle />
          </div>
        )}

        <PlateElement
          {...props}
          ref={useComposedRef(props.ref, previewRef)}
          className="h-full px-2 pt-2 group-first/column:pl-0 group-last/column:pr-0"
        >
          <div
            className={cn(
              'relative h-full border border-transparent p-1.5',
              !readOnly && 'rounded-lg border-border border-dashed',
              isDragging && 'opacity-50'
            )}
          >
            {props.children}

            {!readOnly && !isSelectionAreaVisible && <DropLine />}
          </div>
        </PlateElement>
      </div>
    );
  }
);

const ColumnDragHandle = React.memo(function ColumnDragHandle() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" className="!px-1 h-5">
            <GripHorizontal
              className="text-muted-foreground"
              onClick={(event) => {
                event.stopPropagation();
                event.preventDefault();
              }}
            />
          </Button>
        </TooltipTrigger>

        <TooltipContent>Drag to move column</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
});

function DropLine() {
  const { dropLine } = useDropLine({ orientation: 'horizontal' });

  if (!dropLine) return null;

  return (
    <div
      className={cn(
        'slate-dropLine',
        'absolute bg-brand/50',
        dropLine === 'left' &&
          'group-first/column:-left-1 inset-y-0 left-[-10.5px] w-1',
        dropLine === 'right' &&
          'group-last/column:-right-1 inset-y-0 right-[-11px] w-1'
      )}
    />
  );
}

export function ColumnGroupElement(props: PlateElementProps) {
  return (
    <PlateElement className="mb-2" {...props}>
      <ColumnFloatingToolbar>
        <div className="flex size-full rounded">{props.children}</div>
      </ColumnFloatingToolbar>
    </PlateElement>
  );
}

function ColumnFloatingToolbar({ children }: React.PropsWithChildren) {
  const editor = useEditorRef();
  const readOnly = useReadOnly();
  const element = useElement<TColumnElement>();
  const { props: buttonProps } = useRemoveNodeButton({ element });
  const selected = useSelected();
  const isCollapsed = useEditorSelector(
    (editor) => editor.api.isCollapsed(),
    []
  );
  const isFocusedLast = useFocusedLast();

  const open = isFocusedLast && !readOnly && selected && isCollapsed;

  const onColumnChange = (widths: string[]) => {
    setColumns(editor, {
      at: element,
      widths,
    });
  };

  return (
    <Popover open={open} modal={false}>
      <PopoverAnchor>{children}</PopoverAnchor>
      <PopoverContent
        className="w-auto p-1"
        onOpenAutoFocus={(e) => e.preventDefault()}
        align="center"
        side="top"
        sideOffset={10}
      >
        <div className="box-content flex h-8 items-center">
          <Button
            variant="ghost"
            className="size-8"
            aria-label="Two equal columns"
            onClick={() => onColumnChange(['50%', '50%'])}
          >
            <Columns2 aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            className="size-8"
            aria-label="Three equal columns"
            onClick={() => onColumnChange(['33%', '33%', '33%'])}
          >
            <Columns3 aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            className="size-8"
            aria-label="Narrow right column"
            onClick={() => onColumnChange(['70%', '30%'])}
          >
            <PanelRight aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            className="size-8"
            aria-label="Narrow left column"
            onClick={() => onColumnChange(['30%', '70%'])}
          >
            <PanelLeft aria-hidden="true" />
          </Button>
          <Button
            variant="ghost"
            className="size-8"
            aria-label="Wide center column"
            onClick={() => onColumnChange(['25%', '50%', '25%'])}
          >
            <GalleryHorizontal aria-hidden="true" />
          </Button>

          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button variant="ghost" className="size-8" {...buttonProps}>
            <Trash2Icon animateOnHover />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
