import React, {Component, Fragment} from 'react';
import getParams from "../util/getParams";
import toObject from "../util/toObject";

const collector = (children, fieldList, listenList) => {
    React.Children.forEach(children, function (child) {
        if (typeof child === "object") {
            const {field, children, handle} = child.props;
            if (field) fieldList.push(field);
            if (handle) {
                listenList.push({listen: getParams(handle.toString()), handle, field});
            }
            if (React.Children.count(children) !== 0) {
                collector(children, fieldList, listenList);
            }
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
            if (typeof ele !== 'object') return ele;
            const {field, handle, children, ...other} = props;
            let childList = children;
            let tag = false;
            if (React.Children.count(children) !== 0) {
                childList = this.getMapChildren(children);
                tag = true;
            }
            if (field) {
                const newProps = Object.assign({}, other, {
                    value: this.state[field],
                    ...this.mapProps[field],
                    //onChange无法被覆盖
                    onChange: this.handleOnChange.bind(this, field),
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
