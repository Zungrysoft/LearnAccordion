import Checkbox from '../components/Checkbox.js';
import InputList from '../components/InputList.js';
import InputColor from '../components/InputColor.js';
import InputNameWithRandomizer from '../components/InputNameWithRandomizer';

let colorModes = {
    "single":{
        display:"Single Color",
        numColors: 1,
    },
    "gradient":{
        display:"Gradient",
        numColors: 2,
    },
    "word_gradient":{
        display:"Gradient Words",
        numColors: 2,
    },
    "metallic":{
        display:"Sheen",
        numColors: 2,
    },
    "alternating":{
        display:"Alternating",
        numColors: 2,
    },
    "word_alternating":{
        display:"Alternating Words",
        numColors: 2,
    },
    "capitalized":{
        display:"Capitalized",
        numColors: 2,
    },
};

function DisplayPage({ data, onChange }) {
    return (
        <div>
            <h2>Name</h2>
            <div>
                <InputNameWithRandomizer
                    startValue={data.name.text}
                    itemId={data.itemId}
                    onChange={(val) => {
                        onChange({
                            ...data,
                            name: {
                                ...data.name,
                                text: val,
                            }
                        })
                    }}
                />
                <Checkbox
                    label="Bold"
                    startValue={data.name.bold}
                    onChange={(val) => {
                        onChange({
                            ...data,
                            name: {
                                ...data.name,
                                bold: val,
                            }
                        })
                    }}
                />
                <Checkbox
                    label="Italic"
                    startValue={data.name.italic}
                    onChange={(val) => {
                        onChange({
                            ...data,
                            name: {
                                ...data.name,
                                italic: val,
                            }
                        })
                    }}
                />
                <InputList
                    label="Color Mode"
                    startValue={data.name.colorMode}
                    data={colorModes}
                    onChange={(val) => {
                        onChange({
                            ...data,
                            name: {
                                ...data.name,
                                colorMode: val,
                            }
                        })
                    }}
                />
                {colorModes[data.name.colorMode].numColors >= 1 ?
                    <InputColor
                        label="Color"
                        startValue={data.name.color}
                        onChange={(val) => {
                            onChange({
                                ...data,
                                name: {
                                    ...data.name,
                                    color: val,
                                }
                            })
                        }}
                    />
                : <div/>}
                {colorModes[data.name.colorMode].numColors >= 2 ?
                    <InputColor
                        label="Alt Color"
                        startValue={data.name.color2}
                        onChange={(val) => {
                            onChange({
                                ...data,
                                name: {
                                    ...data.name,
                                    color2: val,
                                }
                            })
                        }}
                    />
                : <div/>}
            </div>
            <h2>Lore</h2>
            <p className="label">Upsides: </p>
            <textarea
                className="input-box-lore"
                type="text"
                value={data.lore.upsides}
                onChange={(e) => {
                    onChange({
                        ...data,
                        lore: {
                            ...data.lore,
                            upsides: e.target.value,
                        }
                    })
                }}
            />
            <p className="label">Downsides: </p>
            <textarea
                className="input-box-lore"
                type="text"
                value={data.lore.downsides}
                onChange={(e) => {
                    onChange({
                        ...data,
                        lore: {
                            ...data.lore,
                            downsides: e.target.value,
                        }
                    })
                }}
            />
            <p className="label">Lore: </p>
            <textarea
                className="input-box-lore"
                type="text"
                value={data.lore.lore}
                onChange={(e) => {
                    onChange({
                        ...data,
                        lore: {
                            ...data.lore,
                            lore: e.target.value,
                        }
                    })
                }}
            />
            <h2>Model</h2>
            <div>
                <InputColor
                    label="Leather Color"
                    startValue={data.model.color}
                    onChange={(val) => {
                        onChange({
                            ...data,
                            model: {
                                ...data.model,
                                color: val,
                                colorEnabled: true,
                            }
                        })
                    }}
                />
                <Checkbox
                    label="Enabled"
                    startValue={data.model.colorEnabled}
                    onChange={(val) => {
                        onChange({
                            ...data,
                            model: {
                                ...data.model,
                                colorEnabled: val,
                            }
                        })
                    }}
                />
            </div>
        </div>
    );
}

export default DisplayPage;
