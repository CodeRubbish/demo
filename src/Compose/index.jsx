import React, {Component, Fragment} from 'react';

const toObject = (fields, value) => {
    const obj = {};
    fields.forEach(key => {
        obj[key] = undefined
    });
    return Object.assign(obj, value);
};

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
        this.state = toObject(fields, value)
    }

    handleOnChange = (field, e) => {
        console.log(field, e.target.value);
        const {onChange} = this.props;
        this.setState({[field]: e.target.value}, () => {
            onChange(this.state);
            this.handleTheOptions(field);
        });
    };
    handleTheOptions = (fieldH) => {
        this.listenList.forEach(({listen, handle, field}) => {
            if (~listen.indexOf(fieldH)) {
                const args = listen.map(key => this.state[key]);
                this.optionList[field] = handle(...args);
            }
        })
    };

    render() {
        console.log('this.state', this.state);
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
