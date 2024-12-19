"use client";

import { colorToCss } from "@/lib/utils";
import { Color } from "@/types/canvas";

interface ColorPickerProps {
    onChangeColor: (color: Color) => void;
}

export const ColorPicker = ({ onChangeColor }: ColorPickerProps) => {
    return (
        <div className="flex flex-wrap gap-2 items-center max-w-[164px] pr-2 mr-2 border-r border-neutral-200 dark:border-neutral-500">
            <ColorButton
                onClick={onChangeColor}
                color={{
                    r: 242,
                    g: 80,
                    b: 34,
                }}
            />
            <ColorButton
                onClick={onChangeColor}
                color={{
                    r: 255,
                    g: 249,
                    b: 177,
                }}
            />
            <ColorButton
                onClick={onChangeColor}
                color={{
                    r: 255,
                    g: 185,
                    b: 0,
                }}
            />
            <ColorButton
                onClick={onChangeColor}
                color={{
                    r: 127,
                    g: 186,
                    b: 0,
                }}
            />
            <ColorButton
                onClick={onChangeColor}
                color={{
                    r: 0,
                    g: 164,
                    b: 239,
                }}
            />
            <ColorButton
                onClick={onChangeColor}
                color={{
                    r: 155,
                    g: 105,
                    b: 245,
                }}
            />
            <ColorButton
                onClick={onChangeColor}
                color={{
                    r: 252,
                    g: 142,
                    b: 42,
                }}
            />
            <ColorButton
                onClick={onChangeColor}
                color={{
                    r: 0,
                    g: 0,
                    b: 0,
                }}
            />
            <ColorButton
                onClick={onChangeColor}
                color={{
                    r: 255,
                    g: 255,
                    b: 255,
                }}
            />
        </div>
    );
};

interface ColorButtonProps {
    onClick: (color: Color) => void;
    color: Color;
}

const ColorButton = ({ color, onClick }: ColorButtonProps) => {
    return (
        <button
            className="w-8 h-8 items-center flex justify-center hover:opacity-75 transition"
            onClick={() => onClick(color)}
        >
            <div
                className="h-8 w-8 rounded-md border border-neutral-300 dark:border-neutral-500"
                style={{
                    background: colorToCss(color),
                }}
            />
        </button>
    );
};
