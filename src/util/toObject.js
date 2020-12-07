export default function toObject(fields, value) {
    const obj = {};
    fields.forEach(key => {
        obj[key] = undefined
    });
    return Object.assign(obj, value);
};
