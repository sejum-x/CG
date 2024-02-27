import React, { useState } from 'react';
import ColorPicker from "./colorPicker.tsx";
import './style/inputPointsForm.css'

interface Point {
    x: number;
    y: number;
}

interface InputFormProps {
    onAddLine: (line: { A: Point, B: Point, innerColor: string, fillColor: string }) => void;
}

const InputForm: React.FC<InputFormProps> = ({ onAddLine }) => {
    const [pointA, setPointA] = useState<Point>({ x: NaN, y: NaN });
    const [pointB, setPointB] = useState<Point>({ x: NaN, y: NaN });
    const [fillColor, setFillColor] = useState<string>('');
    const [error, setError] = useState<string>('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isNaN(pointA.x) || isNaN(pointA.y) || isNaN(pointB.x) || isNaN(pointB.y)) {
            setError('Please enter valid coordinates for points A and B.');
            return;
        }

        const randomInnerColor = `rgb(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)})`;
        onAddLine({ A: pointA, B: pointB, innerColor: randomInnerColor, fillColor });
        setPointA({ x: NaN, y: NaN });
        setPointB({ x: NaN, y: NaN });
        setFillColor('');
        setError('');
    };

    const handleColorChange = (color: string) => {
        setFillColor(color);
    };

    const handleInputChange = (setter: React.Dispatch<React.SetStateAction<Point>>, key: keyof Point) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.trim(); // Remove leading/trailing spaces
        let newValue: number | undefined;
        if (value === '') {
            newValue = undefined;
        } else {
            newValue = Number(value);
        }
        setter(prevState => ({
            ...prevState,
            [key]: newValue
        }));
    };

    return (
        <form className="inputForm" onSubmit={handleSubmit}>
            <div className="inputGroup">
                <label>
                    A x:
                    <input type="number" className="inputField" value={isNaN(pointA.x) ? '' : pointA.x.toString()}
                           onChange={handleInputChange(setPointA, 'x')}/>
                </label>
                <label>
                    A y:
                    <input type="number" className="inputField" value={isNaN(pointA.y) ? '' : pointA.y.toString()}
                           onChange={handleInputChange(setPointA, 'y')}/>
                </label>
            </div>
            <div className="inputGroup">
                <label>
                    B x:
                    <input type="number" className="inputField" value={isNaN(pointB.x) ? '' : pointB.x.toString()}
                           onChange={handleInputChange(setPointB, 'x')}/>
                </label>
                <label>
                    B y:
                    <input type="number" className="inputField" value={isNaN(pointB.y) ? '' : pointB.y.toString()}
                           onChange={handleInputChange(setPointB, 'y')}/>
                </label>
            </div>
            {error && <div className="error">{error}</div>}
            <div className="inputGroup">
                Inner Color:
                <ColorPicker onChange={handleColorChange}/>
                <button type="submit" className='submiteBT'>Add Line</button>
            </div>
        </form>
    );
};
export default InputForm;
