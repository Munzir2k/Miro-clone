import {
    Circle,
    MousePointer2,
    Pencil,
    Redo2,
    Square,
    StickyNote,
    Type,
    Undo2,
} from "lucide-react";
import { ToolButton } from "./ToolButton";
import { CanvasMode, CanvasState, LayerType } from "@/types/canvas";

interface ToolbarProps {
    canvasState: CanvasState;
    setCanvasState: (newState: CanvasState) => void;
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

export const Toolbar = ({
    canvasState,
    setCanvasState,
    undo,
    redo,
    canUndo,
    canRedo,
}: ToolbarProps) => {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4">
            <div className="bg-white dark:bg-slate-700 dark:text-gray-200 rounded-md px-1.5 flex gap-y-1 flex-col items-center shadow-md">
                <ToolButton
                    lable="Select"
                    icon={MousePointer2}
                    onClick={() => setCanvasState({ mode: CanvasMode.None })}
                    isActive={
                        canvasState.mode === CanvasMode.None ||
                        canvasState.mode === CanvasMode.SelectionNet ||
                        canvasState.mode === CanvasMode.Translating ||
                        canvasState.mode === CanvasMode.Pressing ||
                        canvasState.mode === CanvasMode.Resizing
                    }
                />
                <ToolButton
                    lable="Text"
                    icon={Type}
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            LayerType: LayerType.Text,
                        })
                    }
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.LayerType === LayerType.Text
                    }
                />
                <ToolButton
                    lable="Sticky Note"
                    icon={StickyNote}
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            LayerType: LayerType.Note,
                        })
                    }
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.LayerType === LayerType.Note
                    }
                />
                <ToolButton
                    lable="Rectangle"
                    icon={Square}
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            LayerType: LayerType.Rectangle,
                        })
                    }
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.LayerType === LayerType.Rectangle
                    }
                />
                <ToolButton
                    lable="Ellipse"
                    icon={Circle}
                    onClick={() =>
                        setCanvasState({
                            mode: CanvasMode.Inserting,
                            LayerType: LayerType.Ellipse,
                        })
                    }
                    isActive={
                        canvasState.mode === CanvasMode.Inserting &&
                        canvasState.LayerType === LayerType.Ellipse
                    }
                />
                <ToolButton
                    lable="Pen"
                    icon={Pencil}
                    onClick={() => setCanvasState({ mode: CanvasMode.Pencil })}
                    isActive={canvasState.mode === CanvasMode.Pencil}
                />
            </div>
            <div className="bg-white dark:bg-gray-700 dark:text-gray-200 rounded-md px-1.5 flex flex-col items-center shadow-md">
                <ToolButton
                    lable="Undo"
                    icon={Undo2}
                    onClick={undo}
                    isDisable={!canUndo}
                />
                <ToolButton
                    lable="Redo"
                    icon={Redo2}
                    onClick={redo}
                    isDisable={!canRedo}
                />
            </div>
        </div>
    );
};

export const ToolbarSkeleton = () => {
    return (
        <div className="absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4 bg-white dark:bg-slate-700 h-[360px] w-[52px] shadow-md rounded-md animate-pulse duration-1000" />
    );
};
