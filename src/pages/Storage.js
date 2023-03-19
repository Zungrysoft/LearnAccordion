import './Storage.css';
import React,{useState, useEffect} from 'react';
import StoredItem from '../components/StoredItem.js';

import defaultItems from '../data/default_storage';

function StoragePage({ data, onChange }) {
    const [storage, setStorage] = useState([]);

    useEffect(() => {
        // If localstorage is empty, set it to be an empty list
        if (localStorage.getItem("savedItems") === null) {
            localStorage.setItem("savedItems", JSON.stringify(defaultItems.data));
        }
        // Pull localstorage data out
        try {
            setStorage(JSON.parse(localStorage.getItem("savedItems")));
        } catch (error) {
            // Reset data storage on malformed data
            console.error(error);
            localStorage.setItem("savedItems", JSON.stringify([]));
        }
    }, []);
    return (
        <div>
            <button
                onClick={(e) => {
                    let newStorageVal = [
                        ...storage,
                        {...data},
                    ]
                    localStorage.setItem("savedItems", JSON.stringify(newStorageVal));
                    setStorage(newStorageVal);
                }}
            >Save Current Item</button>
            
            <div>
                {storage.map((item, index) => 
                    <StoredItem
                        data={item}
                        onClick={() => {onChange(item)}}
                        onDelete={() => {
                            let newStorageVal = storage.filter(
                                x => x !== item
                            );
                            localStorage.setItem("savedItems", JSON.stringify(newStorageVal));
                            setStorage(newStorageVal);
                        }}
                        key={index}
                    />
                )}
            </div>
        </div>
    );
}

export default StoragePage;
