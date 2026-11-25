"use client";

import { ControlButton, Controls, useReactFlow, useStore, useStoreApi, type ReactFlowState } from "@xyflow/react";
import { Lock, LockOpen, Maximize, Minus, Plus } from "honestui/icons";

const isInteractive = (state: ReactFlowState) =>
  state.nodesDraggable || state.nodesConnectable || state.elementsSelectable;

export function FlowControls({ className }: { className?: string }) {
  const store = useStoreApi();
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const interactive = useStore(isInteractive);
  const atMinZoom = useStore((state) => state.transform[2] <= state.minZoom);
  const atMaxZoom = useStore((state) => state.transform[2] >= state.maxZoom);
  const labels = useStore((state) => state.ariaLabelConfig);
  const InteractionIcon = interactive ? LockOpen : Lock;

  function toggleInteractivity() {
    const enabled = !isInteractive(store.getState());
    store.setState({
      nodesDraggable: enabled,
      nodesConnectable: enabled,
      elementsSelectable: enabled,
    });
  }

  return (
    <Controls className={className} showZoom={false} showFitView={false} showInteractive={false}>
      <ControlButton
        className="react-flow__controls-zoomin"
        title={labels["controls.zoomIn.ariaLabel"]}
        aria-label={labels["controls.zoomIn.ariaLabel"]}
        disabled={atMaxZoom}
        onClick={() => void zoomIn()}
      >
        <Plus aria-hidden="true" className="fill-none!" strokeWidth={2} />
      </ControlButton>
      <ControlButton
        className="react-flow__controls-zoomout"
        title={labels["controls.zoomOut.ariaLabel"]}
        aria-label={labels["controls.zoomOut.ariaLabel"]}
        disabled={atMinZoom}
        onClick={() => void zoomOut()}
      >
        <Minus aria-hidden="true" className="fill-none!" strokeWidth={2} />
      </ControlButton>
      <ControlButton
        className="react-flow__controls-fitview"
        title={labels["controls.fitView.ariaLabel"]}
        aria-label={labels["controls.fitView.ariaLabel"]}
        onClick={() => void fitView()}
      >
        <Maximize aria-hidden="true" className="fill-none!" strokeWidth={2} />
      </ControlButton>
      <ControlButton
        className="react-flow__controls-interactive"
        title={labels["controls.interactive.ariaLabel"]}
        aria-label={labels["controls.interactive.ariaLabel"]}
        aria-pressed={interactive}
        onClick={toggleInteractivity}
      >
        <InteractionIcon aria-hidden="true" className="fill-none!" strokeWidth={2} />
      </ControlButton>
    </Controls>
  );
}
