import React from "react";
import {Form, Radio} from 'antd';
import 'antd/dist/antd.css'
import Compose from "./Compose";

const layout = {
    labelCol: {span: 4},
    wrapperCol: {span: 18},
};
const FirstOption = [
    {label: 'Uppercase', value: 1},
    {label: 'Lowercase', value: 2}
];
const SecondOption = [
    {
        label: 'A(1~4)',
        value: 1
    }, {
        label: 'B(5~8)',
        value: 2
    }, {
        label: 'C(9~12)',
        value: 3
    }, {
        label: 'D(13~16)',
        value: 4
    },
];
const thirdOption = [
    {
        label: '1',
        value: 1
    }, {
        label: '2',
        value: 2
    }, {
        label: '3',
        value: 3
    }, {
        label: '4',
        value: 4
    },
];
const App = () => {
    const onFinish = values => {
        console.log('Success:', values);
    };

    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };

    return (
        <Form
            {...layout}
            name="basic"
            initialValues={{
                test: {
                    first: 1,
                    second: 1,
                    third: 1
                }
            }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
        >
            <Form.Item
                label="标题"
                name="test"
            >
                <Compose>
                    <Radio.Group options={FirstOption}
                                 optionType={'button'}
                                 field={'first'}/>
                    <div style={{height: 20}}/>
                    <Radio.Group options={SecondOption}
                                 field={'second'}
                                 listen={['first']}
                                 handle={(first) => {
                                     if (first === 1) {
                                         return [
                                             {
                                                 label: 'A(1~4)',
                                                 value: 1
                                             }, {
                                                 label: 'B(5~8)',
                                                 value: 2
                                             }, {
                                                 label: 'C(9~12)',
                                                 value: 3
                                             }, {
                                                 label: 'D(13~16)',
                                                 value: 4
                                             },
                                         ]
                                     } else if (first === 2) {
                                         return [
                                             {
                                                 label: 'a(-1~-4)',
                                                 value: 1
                                             }, {
                                                 label: 'b(-5~-8)',
                                                 value: 2
                                             }, {
                                                 label: 'c(-9-~12)',
                                                 value: 3
                                             }, {
                                                 label: 'd(-13~-16)',
                                                 value: 4
                                             },
                                         ]
                                     }
                                 }}/>
                    <div style={{height: 20}}/>
                    <Radio.Group options={thirdOption}
                                 field={'third'}
                                 listen={['first', 'second']}
                                 handle={(first, second) => {
                                     return [
                                         {
                                             label: `${(first ? 1 : -1) * ((second - 1) * 4 + 1)}`,
                                             value: 1
                                         }, {
                                             label: `${(first ? 1 : -1) * ((second - 1) * 4 + 2)}`,
                                             value: 2
                                         }, {
                                             label: `${(first ? 1 : -1) * ((second - 1) * 4 + 3)}`,
                                             value: 3
                                         }, {
                                             label: `${(first ? 1 : -1) * ((second - 1) * 4 + 4)}`,
                                             value: 4
                                         },
                                     ]
                                 }}
                    />
                </Compose>
            </Form.Item>
        </Form>
    );
};

export default App;
