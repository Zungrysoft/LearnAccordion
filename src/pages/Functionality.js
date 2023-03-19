import './Functionality.css';
import React,{useState} from 'react';
import Condition from '../components/Condition.js';
import InputList from '../components/InputList.js';

import slotData from '../data/slot_tags.json';

function FunctionalityPage({ data, onChange, version }) {
    return (
        <div>
            <div className="entry">
                <p className="label">Item Id: </p>
                <input
                    className="input-box-long"
                    type="text"
                    value={data.itemId}
                    onChange={(e) => {
                        onChange({
                            ...data,
                            itemId: e.target.value,
                        })
                    }}
                />
                <input
                    className="input-checkbox"
                    type="checkbox"
                    checked={data.includeGive}
                    onChange={(e) => {
                        onChange({
                            ...data,
                            includeGive: e.target.checked,
                        })
                    }}
                />
            </div>
            <InputList
                label="Activator Type"
                data={slotData}
                startValue={data.slot}
                version={version}
                onChange={(val) => {
                    onChange({
                        ...data,
                        slot: val,
                    })
                }}
            />
            <Condition
                type={1}
                structure={data.structure}
                depth={0}
                context={slotData[data.slot].context}
                version={version}
                onChange={(val) => {
                    onChange({
                        ...data,
                        structure: val,
                    })
                }}
            />
        </div>
    );
}

export default FunctionalityPage;
