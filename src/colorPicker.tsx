import { Sketch } from '@uiw/react-color';
import { useState, useRef, useEffect } from "react";
import './style/colorPicker.css'

interface ColorPickerProps {
    onChange: (color: string) => void;
}

function ColorPicker({ onChange }: ColorPickerProps) {
    const [hex, setHex] = useState("#fff");
    const [isVisible, setIsVisible] = useState(false);
    const buttonRef = useRef<HTMLDivElement>(null);
    const pickerRef = useRef<HTMLDivElement>(null);

    const handleChange = (color: { hex: string }) => {
        setHex(color.hex);
        onChange(color.hex);
    };

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setIsVisible(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getButtonPosition = () => {
        if (buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            return {
                top: rect.top + window.scrollY + 20,
                left: rect.left + window.scrollX - 60,
            };
        }
        return { top: 0, left: 0 };
    };

    const buttonPosition = getButtonPosition();

    return (
        <div className="colorViewer">
            <div
                ref={buttonRef}
                onClick={() => setIsVisible(!isVisible)}
                style={{ backgroundColor: hex, color: 'white', padding: '10px 15px', borderRadius: '5px', border: 'none', cursor: 'pointer', width: '50px' }}
            ></div>
            {isVisible && (
                <div ref={pickerRef} className="sketchContainer" style={{ top: buttonPosition.top, left: buttonPosition.left }}>
                    <Sketch
                        color={hex}
                        onChange={handleChange}
                    />
                </div>
            )}
        </div>
    );
}

export default ColorPicker;
