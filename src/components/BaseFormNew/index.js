import React,{ Component } from 'react'
import { Input, Select, Form, Button, Checkbox, DatePicker,TreeSelect,Row,Col} from 'antd'
import moment from "moment";
const FormItem = Form.Item;
const Option = Select.Option;
const CheckboxGroup = Checkbox.Group;
const { TreeNode } = TreeSelect;

class FilterForm extends Component{

    handleFilterSubmit = ()=>{
     
        let fieldsValue = this.props.form.getFieldsValue();
     //   console.log(fieldsValue)
        this.props.filterSubmit(fieldsValue);
    }
    renderTreeNodes = (data) => {
        return data.map((item) => {
            if (item.childrenList) {
                return (
                    <TreeNode title={item.name} value={item.id} key={item.id}>
                        {this.renderTreeNodes(item.childrenList)}
                    </TreeNode>
                );
            } else {
                return (
                    <TreeNode title={item.name} value={item.id} key={item.id} isLeaf/>

                );
            }
        });
    };

    renderAreaTreeNodes = (data) => {
        return data.map((item) => {
            if (item.childrenList) {
                return (
                    <TreeNode title={item.name} value={item.id} key={item.id}>
                        {this.renderAreaTreeNodes(item.childrenList)}
                    </TreeNode>
                );
            } else {
                return (
                    <div/>

                );
            }
        });
    };

    reset = ()=>{
        this.props.form.resetFields();
    }
    disabledDate = (current) => {
        // 不能选今天之后的日期
        return current > moment();
    };

    getOptionList(data){
        if(!data){
            return [];
        }
        let options = [] //[<Option value="0" key="all_key">全部</Option>];
        data.map((item)=>{
            options.push(<Option value={item.id} key={item.id}>{item.name}</Option>)
        })
        return options;
    }
    getOption(data){
        if(!data){
            return [];
        }
        let options = [] ;
        data.map((item)=>{
           
            options.push(<Checkbox value={item.id} label={item.id}>{item.name}</Checkbox>)
           
        })
        return options;
    }
    initFormList = ()=>{
        const { getFieldDecorator } = this.props.form;
        const formList = this.props.formList;
        const formItemList = [];
        const formItemLayout = {
            labelCol: {span: 12},
            wrapperCol: {span: 12}
        };
        if (formList && formList.length>0){
            formList.forEach((item,index)=>{
               
                let label = item.label;
                let field = item.field;
                let initialValue = item.initialValue || '';
                let placeholder = item.placeholder;
                let width = item.width;
             
                if (item.type == 'TIME'){
                    const begin_time = <FormItem label={label} key={'start'+field} style={{marginLeft:10}}>
                        {
                            getFieldDecorator('start'+field)(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD"/>
                            )
                        }
                    </FormItem>;
                    formItemList.push(begin_time)
                    const end_time = <FormItem label="~" colon={false} key={'end'+field}>
                        {
                            getFieldDecorator('end'+field)(
                                <DatePicker showTime={true} placeholder={placeholder} format="YYYY-MM-DD" />

                            )
                        }
                    </FormItem>;
                    formItemList.push(end_time)
                
                }else if(item.type == 'DATE'){
                    const DATE = <Col span={6}><FormItem label={label} key={field} {...formItemLayout}>
                        {
                            getFieldDecorator(field,{
                                initialValue: initialValue
                            })(
                                <DatePicker  placeholder={placeholder} format="YYYY-MM-DD" />
                            )
                        }
                    </FormItem></Col>;
                    formItemList.push(DATE)
                }
                else if(item.type == 'INPUT'){
                    const INPUT = <Col span={6}><FormItem style={{marginBottom:0}} label={label} key={field} {...formItemLayout}>
                        {
                            getFieldDecorator(field,{
                                initialValue: initialValue
                            })(
                                <Input type="text" placeholder={placeholder} />
                            )
                        }
                    </FormItem></Col>;
                    formItemList.push(INPUT)
                } else if (item.type == 'SELECT') {
                   
                    const SELECT = <Col span={6}><FormItem style={{marginBottom:0}} label={label} key={field} {...formItemLayout}>
                        {
                            getFieldDecorator(field, {
                                initialValue: initialValue
                            })(
                                <Select
                                    // style={{ width: width }}
                                    placeholder={placeholder}
                                >
                                    <Option value={null}>{placeholder}</Option>
                                    {this.getOptionList(item.list)}
                                </Select>
                            )
                        }
                    </FormItem></Col>;
                    formItemList.push(SELECT)
                } else if (item.type == 'CHECKBOX') {              
                    const CHECKBOX = <FormItem label={label} key={field}>
                    {
                        getFieldDecorator([field], {
                            valuePropName: 'checked',
                            initialValue: initialValue //true | false
                        })(
                            <CheckboxGroup>
                                {label}
                            </CheckboxGroup>
                        )
                    }
                </FormItem>;
                    formItemList.push(CHECKBOX)
                  }else if(item.type == 'TREE'){
                    const TREE = <Col span={6}><FormItem style={{marginBottom:0}} label={label} key={field} {...formItemLayout}>
                        {
                            getFieldDecorator(field,{
                                initialValue: initialValue
                            })(
                                <TreeSelect
                                    // style={{ width: width }}
                                >
                                        {this.renderTreeNodes(item.list)}
                                </TreeSelect>
                            )
                        }
                    </FormItem></Col>;
                    formItemList.push(TREE)
                }else if(item.type == 'AREA_TREE'){
                    const AREA_TREE = <Col span={6}><FormItem style={{marginBottom:0}} label={label} key={field} {...formItemLayout}>
                        {
                            getFieldDecorator(field,{
                                initialValue: initialValue
                            })(
                                <TreeSelect
                                    // style={{ width: width }}
                                >
                                    {this.renderAreaTreeNodes(item.list)}
                                </TreeSelect>
                            )
                        }
                    </FormItem></Col>;
                    formItemList.push(AREA_TREE)
                }
            })
        }
        return formItemList;
    }
    render(){
        return (
            <Form>
                <Row>
                    { this.initFormList() }
                </Row>
                <FormItem style={{float:"right"}}>
                    <Button onClick={this.reset}>重置</Button>
                    <Button type="primary" style={{ margin: '0 20px' }} onClick={this.handleFilterSubmit}>搜索</Button>
                   
                </FormItem>
            </Form>
        );
    }
}
export default Form.create({})(FilterForm);