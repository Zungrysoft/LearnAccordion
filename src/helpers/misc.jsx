export function fillKeys(object, keys) {
    if (keys.length === 0) {
        return;
    }

    if (!(typeof object[keys[0]] === 'object')) {
        object[keys[0]] = {};
    }

    fillKeys(object[keys[0]], keys.slice(1));
};