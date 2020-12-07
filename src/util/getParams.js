export default function getParams(string) {
    let funStr = string;
    if (~string.indexOf('=>')) {
        funStr = string.slice(0, string.indexOf('=>'))
    }
    let result = funStr.slice(funStr.indexOf('(') + 1, funStr.indexOf(')')).split(',');
    result = result.map(str => {
        let item = str.trim();
        for (let i = 0; i < item.length; i++) {
            if (item[i] === '=' || /\s/.test(item[i])) {
                return item.slice(0, i);
            }
        }
        return item;
    });
    console.log('解析到的参数', result);
    return result;
};
