"use client";

import { nanoid } from "nanoid";

import React, { useCallback, useMemo, useState } from "react";
import { Info } from "./Info";
import { Participants } from "./Participants";
import { Toolbar } from "./Toolbar";
import {
    useHistory,
    useCanUndo,
    useCanRedo,
    useMutation,
    useStorage,
    useOthersMapped,
} from "@/liveblocks.config";
import {
    Camera,
    CanvasMode,
    CanvasState,
    Color,
    LayerType,
    Point,
    Side,
    XYWH,
} from "@/types/canvas";
import { CursorPresence } from "./CursorPresence";
import {
    connectionIdToColor,
    findIntersectionLayerWithRectangle,
    penPointsToPathLayer,
    pointerEventToCanvasPoint,
    resizeBounds,
} from "@/lib/utils";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./LayerPreview";
import { SelectionBox } from "./SelectionBox";
import { SelectionTools } from "./SelectionTools";

const MAX_LAYERS = 100;

interface CanvasProps {
    boardId: string;
}

const Canvas = ({ boardId }: CanvasProps) => {
    const layerIds = useStorage((root) => root.layerIds);

    const [CanvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None,
    });
    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
    const [lastUsedColor, setLastUsedColor] = useState<Color>({
        r: 255,
        g: 0,
        b: 0,
    });

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    const insertLayer = useMutation(
        (
            { storage, setMyPresence },
            layerType:
                | LayerType.Rectangle
                | LayerType.Ellipse
                | LayerType.Text
                | LayerType.Note,
            position: Point
        ) => {
            const liveLayers = storage.get("layers");

            if (liveLayers.size >= MAX_LAYERS) {
                return;
            }

            const liveLayerIds = storage.get("layerIds");
            const layerId = nanoid();
            const layer = new LiveObject({
                type: layerType,
                x: position.x,
                y: position.y,
                height: 100,
                width: 100,
                fill: lastUsedColor,
            });

            liveLayerIds.push(layerId);
            liveLayers.set(layerId, layer);

            setMyPresence({ selection: [layerId] }, { addToHistory: true });
            setCanvasState({ mode: CanvasMode.None });
        },
        [lastUsedColor]
    );

    const translateSelectedLayers = useMutation(
        ({ storage, self }, point: Point) => {
            if (CanvasState.mode !== CanvasMode.Translating) {
                return;
            }

            const offset = {
                x: point.x - CanvasState.current.x,
                y: point.y - CanvasState.current.y,
            };
            const LiveLayers = storage.get("layers");

            for (const id of self.presence.selection) {
                const layer = LiveLayers.get(id);

                if (layer) {
                    layer.update({
                        x: layer.get("x") + offset.x,
                        y: layer.get("y") + offset.y,
                    });
                }
            }
            setCanvasState({ mode: CanvasMode.Translating, current: point });
        },
        [CanvasState]
    );

    // Unselect Function
    const unselecLayers = useMutation(({ self, setMyPresence }) => {
        if (self.presence.selection.length > 0) {
            setMyPresence({ selection: [] }, { addToHistory: true });
        }
    }, []);
    // Update Selection
    const updatedSelectionNet = useMutation(
        ({ storage, setMyPresence }, current: Point, origin: Point) => {
            const layers = storage.get("layers").toImmutable();
            setCanvasState({
                mode: CanvasMode.SelectionNet,
                origin,
                current,
            });

            const ids = findIntersectionLayerWithRectangle(
                layerIds,
                layers,
                origin,
                current
            );
            setMyPresence({ selection: ids });
        },
        [layerIds]
    );
    // Multi Selection
    const startMultiSelection = useCallback((current: Point, origin: Point) => {
        const SELECTION_NET_THRESHOLD = 5;
        if (
            Math.abs(origin.x - current.x) + Math.abs(origin.y - current.y) >
            SELECTION_NET_THRESHOLD
        ) {
            setCanvasState({
                mode: CanvasMode.SelectionNet,
                origin,
                current,
            });
        }
    }, []);

    // Drawing Function
    const startDrawing = useMutation(
        ({ setMyPresence }, point: Point, pressure: number) => {
            setMyPresence({
                pencilDraft: [[point.x, point.y, pressure]],
                penColor: lastUsedColor,
            });
        },
        [lastUsedColor]
    );

    // continueDrawing Function
    const continueDrawing = useMutation(
        ({ self, setMyPresence }, point: Point, e: React.PointerEvent) => {
            const { pencilDraft } = self.presence;

            if (
                CanvasState.mode !== CanvasMode.Pencil ||
                e.button !== 1 ||
                pencilDraft == null
            ) {
                return;
            }

            setMyPresence({
                cursor: point,
                pencilDraft:
                    pencilDraft.length === 1 &&
                    pencilDraft[0][0] === point.x &&
                    pencilDraft[0][1] === point.y
                        ? pencilDraft
                        : [...pencilDraft, [point.x, point.y, e.pressure]],
            });
        },
        [CanvasState.mode]
    );

    const InsertPath = useMutation(
        ({ storage, self, setMyPresence }) => {
            const liveLayers = storage.get("layers");
            const { pencilDraft } = self.presence;

            if (
                pencilDraft == null ||
                pencilDraft.length < 2 ||
                liveLayers.size >= MAX_LAYERS
            ) {
                setMyPresence({ pencilDraft: null });
                return;
            }

            const id = nanoid();
            liveLayers.set(
                id,
                new LiveObject(penPointsToPathLayer(pencilDraft, lastUsedColor))
            );

            const liveLayerIds = storage.get("layerIds");
            liveLayerIds.push(id);

            setMyPresence({ pencilDraft: null });
            setCanvasState({ mode: CanvasMode.Pencil });
        },
        [lastUsedColor]
    );

    const resizeSelectedLayer = useMutation(
        ({ storage, self }, point: Point) => {
            if (CanvasState.mode !== CanvasMode.Resizing) {
                return;
            }

            const bounds = resizeBounds(
                CanvasState.initialBounce,
                CanvasState.corner,
                point
            );
            const liveLayers = storage.get("layers");
            const layer = liveLayers.get(self.presence.selection[0]);

            if (layer) {
                layer.update(bounds);
            }
        },
        [CanvasState]
    );

    const onResizeHandlePointerDown = useCallback(
        (corner: Side, initialBounce: XYWH) => {
            history.pause();
            setCanvasState({
                mode: CanvasMode.Resizing,
                initialBounce,
                corner,
            });
        },
        [history]
    );

    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY,
        }));
    }, []);

    const onPointerMove = useMutation(
        ({ setMyPresence }, e: React.PointerEvent) => {
            e.preventDefault();

            const current = pointerEventToCanvasPoint(e, camera);

            if (CanvasState.mode === CanvasMode.Pressing) {
                startMultiSelection(current, CanvasState.origin);
            } else if (CanvasState.mode === CanvasMode.SelectionNet) {
                updatedSelectionNet(current, CanvasState.origin);
            } else if (CanvasState.mode === CanvasMode.Translating) {
                translateSelectedLayers(current);
            } else if (CanvasState.mode === CanvasMode.Resizing) {
                resizeSelectedLayer(current);
            } else if (CanvasState.mode === CanvasMode.Pencil) {
                continueDrawing(current, e);
            }

            setMyPresence({ cursor: current });
        },
        [
            camera,
            CanvasState,
            resizeSelectedLayer,
            translateSelectedLayers,
            continueDrawing,
            startMultiSelection,
            updatedSelectionNet,
        ]
    );

    const onPointerLeave = useMutation(
        ({ setMyPresence }, e: React.PointerEvent) => {
            setMyPresence({ cursor: null });
        },
        []
    );

    const onPointerDown = useCallback(
        (e: React.PointerEvent) => {
            const point = pointerEventToCanvasPoint(e, camera);

            if (CanvasState.mode === CanvasMode.Inserting) {
                return;
            }

            // TODO: Add case for Drawing
            if (CanvasState.mode === CanvasMode.Pencil) {
                startDrawing(point, e.pressure);
                return;
            }

            setCanvasState({
                origin: point,
                mode: CanvasMode.Pressing,
            });
        },
        [camera, CanvasState.mode, setCanvasState, startDrawing]
    );

    const onPointerUp = useMutation(
        ({}, e) => {
            const point = pointerEventToCanvasPoint(e, camera);

            if (
                CanvasState.mode === CanvasMode.None ||
                CanvasState.mode === CanvasMode.Pressing
            ) {
                unselecLayers();
                setCanvasState({ mode: CanvasMode.None });
            } else if (CanvasState.mode === CanvasMode.Pencil) {
                InsertPath();
            } else if (CanvasState.mode === CanvasMode.Inserting) {
                insertLayer(CanvasState.LayerType, point);
            } else {
                setCanvasState({ mode: CanvasMode.None });
            }

            history.resume();
        },
        [
            setCanvasState,
            camera,
            CanvasState,
            history,
            insertLayer,
            unselecLayers,
            InsertPath,
        ]
    );

    const selections = useOthersMapped((other) => other.presence.selection);

    const onLayerPointerDown = useMutation(
        ({ self, setMyPresence }, e: React.PointerEvent, layerId: string) => {
            if (
                CanvasState.mode === CanvasMode.Pencil ||
                CanvasState.mode === CanvasMode.Inserting
            ) {
                return;
            }

            history.pause();
            e.stopPropagation();

            const point = pointerEventToCanvasPoint(e, camera);

            if (!self.presence.selection.includes(layerId)) {
                setMyPresence({ selection: [layerId] }, { addToHistory: true });
            }

            setCanvasState({ mode: CanvasMode.Translating, current: point });
        },
        [camera, history, setCanvasState, CanvasState.mode]
    );

    const layerIdsToColorSelection = useMemo(() => {
        const layerIdsToColorSelection: Record<string, string> = {};

        for (const user of selections) {
            const [connectionId, selection] = user;

            for (const layerId of selection) {
                layerIdsToColorSelection[layerId] =
                    connectionIdToColor(connectionId);
            }
        }
        return layerIdsToColorSelection;
    }, [selections]);

    return (
        <main className="h-full w-full relative bg-neutral-100 dark:bg-slate-900 touch-none text-black">
            <Info boardId={boardId} />
            <Participants />
            <Toolbar
                canvasState={CanvasState}
                setCanvasState={setCanvasState}
                undo={history.undo}
                redo={history.redo}
                canUndo={canUndo}
                canRedo={canRedo}
            />
            <SelectionTools
                camera={camera}
                setLastUsedColor={setLastUsedColor}
            />

            <svg
                className="h-[100vh] w-[100vw]"
                onWheel={onWheel}
                onPointerMove={onPointerMove}
                onPointerLeave={onPointerLeave}
                onPointerUp={onPointerUp}
                onPointerDown={onPointerDown}
            >
                <g
                    style={{
                        transform: `translate(${camera.x}px, ${camera.y}px)`,
                    }}
                >
                    {layerIds.map((layerId) => (
                        <LayerPreview
                            key={layerId}
                            id={layerId}
                            onLayerPointerDown={onLayerPointerDown}
                            selectionColor={layerIdsToColorSelection[layerId]}
                        />
                    ))}
                    <SelectionBox
                        onResizeHandlePointerDown={onResizeHandlePointerDown}
                    />
                    {CanvasState.mode === CanvasMode.SelectionNet &&
                        CanvasState.current != null && (
                            <rect
                                className="fill-blue-500/5 stroke-blue-500 stroke-1"
                                x={Math.min(
                                    CanvasState.origin.x,
                                    CanvasState.current?.x
                                )}
                                y={Math.min(
                                    CanvasState.origin.y,
                                    CanvasState.current?.y
                                )}
                                width={Math.abs(
                                    CanvasState.origin.x - CanvasState.current.x
                                )}
                                height={Math.abs(
                                    CanvasState.origin.y - CanvasState.current.y
                                )}
                            />
                        )}
                    <CursorPresence />
                </g>
            </svg>
        </main>
    );
};

export default Canvas;
