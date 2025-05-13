import { useState } from "react";
import { HexColorPicker } from "react-colorful";

export default function ColorPicker() {
    const [color, setColor] = useState("#ffffff");
    const [inputValue, setInputValue] = useState("ffffff");

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim().replace(/^#/, "");

        if (/^[0-9a-fA-F]{0,6}$/.test(value)) {
            setInputValue(value);

            if (value.length === 6) {
                setColor(`#${value.toLowerCase()}`);
            }
        }
    };

    const handleColorChange = (newColor: string) => {
        setColor(newColor);
        setInputValue(newColor.replace("#", ""));
    };

    return (
        <div style={{ width: "220px", margin: "0 auto" }}>
            <HexColorPicker color={color} onChange={handleColorChange} />
            <div style={{ marginTop: "12px" }}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="ex: ffffff"
                    maxLength={6}
                    style={{
                        width: "35%",
                        padding: "4px",
                        fontSize: "14px",
                        border: "1px solid #ccc",
                        borderRadius: "4px",
                        textAlign: "center",
                        textTransform: "lowercase"
                    }}
                />
            </div>
        </div>
    )
}