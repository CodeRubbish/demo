import React, {Component, Fragment} from 'react';

const toObject = (fields, value) => {
    const obj = {};
    fields.forEach(key => {
        obj[key] = undefined
    });
    return Object.assign(obj, value);
};

// 默认 handler 只能监听其上层的变化
// 考虑影响 内容变化字段为 options 后续可添加配置字段
/**
 *  暂未考虑 options 变化同时 value 也变化，如果考虑 只需考虑handler执行的顺序，保证每个handler执行时，
 *  其监听字段的handler已经执行完毕，并且options改变联动value的改变，多次合成一次setState
 */
// 如果 表单 5项中 三项中具有强关联性质，那么应该先compose其中3项，再Compose新的项和其余两项。
// 值联动 可以相同形式实现，如果对表单项选择后，对其中某个输入项 存在输入范围限制，同样可以配置，其输入范围规则 可以以改变其配置字段，和配置项。

//如果更为通用，那么handler 函数应该返回对象，用于修改其余表单项的 props;
export default class Compose extends Component {
    constructor(props) {
        super(props);
        const {children, value} = props;
        const fields = [], listenList = [], optionList = {};
        React.Children.forEach(children, function (child) {
            const {field, listen, options, handle} = child.props;
            optionList[field] = options;
            if (field) fields.push(field);
            if (listen) listenList.push({listen, handle, field});

        });
        this.optionList = optionList;
        this.listenList = listenList;
        if (value && Object.keys(value).length !== 0) this.handleTheOptions(undefined, toObject(fields, value));
        this.state = toObject(fields, value);
    }

    handleOnChange = (field, e) => {
        const {onChange} = this.props;
        const newValues = {...this.state, [field]: e.target.value};
        this.handleTheOptions(field, newValues);
        onChange(newValues);
        this.setState(newValues);
    };
    handleTheOptions = (fieldH, values) => {
        this.listenList.forEach(({listen, handle, field}) => {
            if (fieldH) {
                if (~listen.indexOf(fieldH)) {
                    const args = listen.map(key => values[key]);
                    this.optionList[field] = handle(...args);
                }
            } else {
                const args = listen.map(key => values[key]);
                this.optionList[field] = handle(...args);
            }
        })
    };

    render() {
        const {children} = this.props;
        return (
            <Fragment>
                {React.Children.map(children, ((ele, index) => {
                    const {type, props} = ele;
                    const {field, listen, handle, children, options, ...other} = props;
                    if (field) {
                        return React.createElement(type, Object.assign({}, other, {
                            options: this.optionList[field],
                            onChange: this.handleOnChange.bind(this, field),
                            value: this.state[field]
                        }), children);
                    }
                    return ele;
                }))}
            </Fragment>
        )
    }
}
