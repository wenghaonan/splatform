import React,{Component} from 'react';
import {Card,Table,Input,DatePicker,Select,Form} from "antd";
import TextArea from 'antd/lib/input/TextArea';
import './style.less';

const FormItem = Form.Item;
const Option = Select.Option;


export default class DetailForm extends Component {
    render() {
        const userInfo = this.props.userInfo || {};
        const type=this.props.type;
        const { getFieldDecorator } = this.props.form;
        const formItemLayout = {
            labelCol: {span: 7},
            wrapperCol: {span: 14}
        };
        return (


            <Form >

                <FormItem label="所属行业" {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.type:
                            getFieldDecorator('name',{
                                initialValue:userInfo.name,
                                rules: [
                                    {
                                        required: true,
                                        message: '请填写所属行业',
                                    }]
                            })(
                                <Input/>
                            )
                    }
                </FormItem>

                <FormItem {...formItemLayout}>
                    {
                        userInfo && type=='detail'?userInfo.id:
                            getFieldDecorator('id',{
                                initialValue:userInfo.id
                            })(
                                <Input type="hidden"/>
                            )
                    }
                </FormItem>

            </Form>

        );
    }

}
DetailForm = Form.create({})(DetailForm);