import { useState, useRef, useEffect } from "react";
import { HexColorPicker } from "react-colorful";
import "../../styles/colorPopocer.css";

interface ColorPickerPopoverProps {
    initialColor?: string;
    onColorChange?: (color: string) => void;
}

export default function ColorPickerPopover({
    initialColor = "#3498db",
    onColorChange,
}: ColorPickerPopoverProps) {
    const [color, setColor] = useState(initialColor);
    const [inputValue, setInputValue] = useState(initialColor.replace("#", ""));
    const [showPicker, setShowPicker] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleColorChange = (newColor: string) => {
        setColor(newColor);
        setInputValue(newColor.replace("#", ""));
        onColorChange?.(newColor);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim().replace(/^#/, "");

        if (/^[0-9a-fA-F]{0,6}$/.test(value)) {
            setInputValue(value);
            if (value.length === 6) {
                const hexColor = `#${value.toLowerCase()}`;
                setColor(hexColor);
                onColorChange?.(hexColor);
            }
        }
    };

    // 외부 클릭 시 닫기
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setShowPicker(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="color-picker-container" ref={containerRef}>
            <div
                className="color-circle"
                style={{ backgroundColor: color }}
                onClick={() => setShowPicker(prev => !prev)}
            />
            {showPicker && (
                <div className="color-popover">
                    <HexColorPicker color={color} onChange={handleColorChange} />
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="hex (ex: ffffff)"
                        maxLength={6}
                        style={{
                            width: "100%",
                            marginTop: "8px",
                            padding: "4px",
                            fontSize: "14px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            textAlign: "center",
                            textTransform: "lowercase"
                        }}
                    />
                </div>
            )}
        </div>
    );
}
