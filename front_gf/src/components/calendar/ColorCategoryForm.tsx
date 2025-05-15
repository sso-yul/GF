import { useState } from "react";
import ColorPickerPopover from "../global/ColorPickerPopover";
import { saveScheduleColor } from "../../api/api.calendar";
import IconButton from "../button/IconButton";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";

type Props = {
    onSave: () => void;
    onCancel: () => void;
};

function hexToRgba(hex: string, alpha: number): string {
    const sanitized = hex.replace("#", "");
    if (sanitized.length !== 6) return `rgba(0,0,0,${alpha})`;

    const r = parseInt(sanitized.slice(0, 2), 16);
    const g = parseInt(sanitized.slice(2, 4), 16);
    const b = parseInt(sanitized.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

export default function ColorCategoryForm({ onSave }: Props) {
    const [name, setName] = useState("");
    const [color, setColor] = useState("#111111");

    const handleColorChange = (newColor: string) => {
        setColor(newColor);
    };

    const handleSubmit = async () => {
        if (!name.trim()) {
            alert("이름을 입력하세요.");
            return;
        }

        try {
            await saveScheduleColor(name, color);
            onSave();
            alert("저장에 성공했습니다.");
        } catch (error) {
            alert("저장에 실패했습니다.");
        }
    };

    const backgroundColor = hexToRgba(color, 0.1);
    const textColor = color;

    return (
        <>
            <div style={{ width: "240px", margin: "0 auto", padding: "16px" }}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="ex: 업무, 개인"
                    style={{
                        width: "100%",
                        padding: "8px",
                        marginBottom: "12px",
                        fontSize: "14px",
                        fontWeight: "bold",
                        border: "none",
                        borderBottom: "1px solid black",
                        backgroundColor: backgroundColor,
                        color: textColor,
                    }}
                />

                <div style={{ display: "flex", alignItems: "center", marginBottom: "12px" }}>
                    <label style={{ marginRight: "8px" }}>색상 선택:</label>
                    <ColorPickerPopover
                        initialColor={color}
                        onColorChange={handleColorChange}
                    />
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                    <IconButton icon={faFloppyDisk} onClick={handleSubmit} />
                </div>
            </div>
        </>
    );
}
