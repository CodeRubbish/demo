// 默认 handler 只能监听其上层的变化
// 考虑影响 内容变化字段为 options 后续可添加配置字段
/**
 *  暂未考虑 options 变化同时 value 也变化，如果考虑 只需考虑handler执行的顺序，保证每个handler执行时，
 *  其监听字段的handler已经执行完毕，并且options改变联动value的改变，多次合成一次setState
 */
// 如果 表单 5项中 三项中具有强关联性质，那么应该先compose其中3项，再Compose新的项和其余两项。
// 值联动 可以相同形式实现，如果对表单项选择后，对其中某个输入项 存在输入范围限制，同样可以配置，其输入范围规则 可以以改变其配置字段，和配置项。

//如果更为通用，那么handler 函数应该返回对象，用于修改其余表单项的 props;
import React, {Component, Fragment} from 'react';
import getParams from "../util/getParams";
import toObject from "../util/toObject";

const collector = (children, fieldList, listenList) => {
    React.Children.forEach(children, function (child) {
        const {field, children, handle} = child.props;
        if (field) fieldList.push(field);
        if (handle) {
            listenList.push({listen: getParams(handle.toString()), handle, field});
        }
        if (React.Children.count(children) !== 0) {
            collector(children, fieldList, listenList);
        }
    });
};

export default class Compose extends Component {
    constructor(props) {
        super(props);
        const {children, value} = props;
        const fields = [], listenList = [];
        collector(children, fields, listenList);
        this.initialValue = JSON.parse(JSON.stringify(value));
        this.listenList = listenList;
        this.mapProps = {};
        if (value && Object.keys(value).length !== 0) this.handleProps(undefined, toObject(fields, value));
        this.state = toObject(fields, value);
    }

    handleOnChange = (field, e) => {
        const {onChange} = this.props;
        const newValues = {...this.state, [field]: e.target.value};
        this.handleProps(field, newValues);
        onChange(newValues);
        this.setState(newValues);
    };
    handleProps = (fieldH, values) => {
        this.listenList.forEach(({listen, handle, field}) => {
            if (fieldH) {
                //任意表单输入项改变
                if (~listen.indexOf(fieldH)) {
                    const args = listen.map(key => values[key]);
                    this.mapProps[field] = handle(...args);
                    //切换时候重置回默认值
                    values[field] = this.initialValue[field];
                }
            } else {
                const args = listen.map(key => values[key]);
                this.mapProps[field] = handle(...args);
            }
        })
    };
    getMapChildren = children => {
        return React.Children.map(children, ((ele) => {
            const {type, props} = ele;
            const {field, handle, children, ...other} = props;
            let childList = children;
            let tag = false;
            if (React.Children.count(children) !== 0) {
                childList = this.getMapChildren(children);
                tag = true;
            }
            if (field) {
                const newProps = Object.assign({}, other, {
                    ...this.mapProps[field],
                    onChange: this.handleOnChange.bind(this, field),
                    value: this.state[field],
                });
                return React.createElement(type, newProps, childList);
            }
            if (tag) {
                return React.createElement(type, props, childList);
            }
            return ele;
        }));
    };

    render() {
        const {children} = this.props;
        return (
            <Fragment>
                {this.getMapChildren(children)}
            </Fragment>
        )
    }
}
