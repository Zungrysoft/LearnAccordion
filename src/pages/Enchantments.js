import './Enchantments.css';
import enchantmentData from '../data/enchantments.json';
import Enchantment from '../components/Enchantment.js';

function editEnchantments(data, id, lvl) {
    // If level is zero, remove the enchantment from the list
    if (lvl <= 0) {
        return data.filter((ench) => ench.id !== id);
    }

    // Edit the enchantment in the list
    let edited = false;
    data = data.map((ench) => {
        if (ench.id === id) {
            edited = true;
            return {
                id: id,
                lvl: lvl,
            }
        }
        return ench;
    })
    // If it wasn't already in the list, add it
    if (!edited) {
        data = [
            ...data,
            {
                id: id,
                lvl: lvl,
            }
        ]
    }

    return data;
}

function currentLevel(enchantments, id) {
    let ret = 0;
    enchantments.forEach((ench) => {
        if (ench.id === id) {
            ret = ench.lvl;
        }
    });
    return ret;
}

function EnchantmentsPage({ data, onChange }) {
    return (
        <div>
            <table>
                {Object.keys(enchantmentData).map((id) =>
                    <Enchantment
                        enchantment={enchantmentData[id]}
                        startValue={currentLevel(data.enchantments, id)}
                        onChange={(lvl) => {
                            onChange({
                                ...data,
                                enchantments: editEnchantments(data.enchantments, id, lvl)
                            })
                        }}
                        key={id}
                    />
                )}
            </table>
        </div>
    );
}

export default EnchantmentsPage;
