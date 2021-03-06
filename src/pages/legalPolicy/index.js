import React, { Component } from 'react'
import {Button,Card,Collapse,Table,Modal} from 'antd'
import  BaseForm  from '../../components/BaseForm';
import Utils from "../../utils";
import axios from "../../axios";
import DetailForm from './DetailForm';
import {commonUrl} from '../../axios/commonSrc';
import { T } from 'antd/lib/upload/utils';
const Panel = Collapse.Panel;
const ButtonGroup = Button.Group



export default class LegalPolicy extends Component {
    
    state = {
        //查看拟态框的状态
        isVisible:false,
        title:'',
        list:[],
        record:''
    }
    //查询条件
    params = {
        pageNo:1
    }

    componentDidMount(){
        this.requestList();
        this.getBusinessType();
        this.getLowType();
        this.requestGetSC();
    }
    //查询列表 刷新数据
    requestList = (params) => {
        let _this = this
        axios.PostAjax({
            url:'/lawAndDocument/getFullDatabaseSearch',
            data:{
                params:{...this.params}
            }
        }).then((res) => {
            if(res.status == 'success'){
                _this.setState({
                    list:res.data.data,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;//	当前页数
                        _this.requestList(); //刷新列表数据
                    })
                })
            }
        })
    }
    //获取全库分类
    // getPoolType = (params) => {
    //     let _this = this
    //     axios.ajax({
    //         url:'',
    //         data:{
    //             params:{}
    //         }
    //     }).then((res) => {
    //         if(res.status == 'success'){
    //             console.log('接口调用成功')
    //         }
    //     })
    // }
    //获取法律分类
    getLowType = (params) => {
        let _this = this
        axios.ajax({
            url:'',
            data:{
                params:{}
            }
        }).then((res) => {
            if(res.status == 'success'){
                console.log('接口调用成功')
            }
        })
    }
    //获取业务分类
    getBusinessType = (params) => {
        let _this = this
        let level = 2
        axios.ajax({
            url:'/lawAndDocument/getBusinessType',
            data:{
                params:{level,}
            }
        }).then((res) => {
            if(res.status == 'success'){
                let businessType = res.data||[]
                console.log(businessType)
                let list = businessType.map((item,key)=>{
                    item.id = item.className
                    item.name = item.className
                    return item
                })
                _this.setState({
                    businessType:list
                })
            }
        })
    }
    //获取主题分类
    requestGetSC = ()=>{
        let level = 0
        axios.ajax({
            url:'/lawAndDocument/getBusinessType',
            data:{
                params:{
                    level,
                }
            }
        }).then((res)=>{
            if(res){
                let themeType = res.data||[]
                let list = themeType.map((item,key)=>{
                    item.id = item.className
                    item.name = item.className
                    return item
                })
                this.setState({
                    themeType:list
                })
            }
        })
    }
    //查询
    handleFilterSubmit = (params) => {
        this.params = params;
        this.requestList()
    }
    
    render() {
        const columns = [
            {
                title: '文库分类',
                dataIndex: 'type',
                key:'type',
                render:(type) => {
                    if(type == 1) {
                        return '法律法规'
                    }
                    else if(type == 2) {
                        return '总局文件'
                    }
                    else{
                        return '地方性文件'
                    }
                }
            },
            {
                title: '主题分类',
                dataIndex: 'subjectClassification',
                key:'subjectClassification'
            },
            {
                title: '标题',
                dataIndex: 'title',
                key: 'title'
            },
            {
                title: '业务分类',
                dataIndex: 'businessClassification',
                key: 'businessClassification'
            },
            {
                title: '文号',
                dataIndex: 'articleNumber',
                key: 'articleNumber'
            },
            {
                title: '发布日期',
                dataIndex: 'issueDate',
                key: 'issueDate'
            },
            {
                title: '检索情况',
                dataIndex: '',
                render:(text,record) => {
                    return <p style={{margin:0}}>命中{record.target}条</p>
                }
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text,record) => {
                    return <ButtonGroup>
                        <Button type='primary' onClick={() => {this.setState({isVisible:true,title:record.title,record:record})}}>查看</Button>
                    </ButtonGroup>
                }
            },
        ]
        const formList = [
            {
                type: 'SELECT',
                label: '文库分类',
                placeholder: '请选择文库种类',
                field: 'type',
                width: 150,
                list: [{id: 1, name: '法律法规'}, {id: 2, name: '总局文件'}, {id: 3, name: '地方性文件'}]
            },
            {
                type: 'SELECT',
                label: '主题分类',
                placeholder: '请选择主题种类',
                field: 'subjectClassification',
                width: 150,
                list: this.state.themeType||[]
            },
            {
                type: 'SELECT',
                label: '业务分类',
                placeholder: '请选择业务种类',
                field: 'businessClassification',
                width: 150,
                list: this.state.businessType||[]
            },
            {
                type: 'INPUT',
                label: '请输入关键词',
                field: 'content',
                width: 150,
            },
            {
                type: 'SELECT',
                label: '检索类型',
                placeholder: '请选择检索类型',
                field: 'classType',
                width: 150,
                list: [{id: 2, name: '标题'}, {id: 1, name: '内容'}, {id: 3, name: '附件'}]
            },
        ]
        return (
            <div>
                <Card>
                    <Collapse >
                        <Panel header="查询" key="1" >
                            <BaseForm formList={formList} filterSubmit={this.handleFilterSubmit}/>
                        </Panel>
                    </Collapse>
                </Card>
                <Card style={{marginTop:10}}>
                    <div style={{marginTop:10}}>
                        <Table
                        bordered
                        dataSource={this.state.list}
                        defaultExpandAllRows={true}
                        pagination={this.state.pagination}
                        columns={columns}
                        expandedRowRender={ record => {
                        return(<p style={{margin:0,textAlign: "left"}}>题注：{record.description}</p>)}}
                        />
                    </div>
                </Card>
                <Modal
                width='1000px'
                title= {'法律法规'+ '>' + this.state.title }
                visible={this.state.isVisible}
                onOk={() => {
                    this.setState({
                        isVisible:false
                    })
                }}
                destroyOnClose={true}
                onCancel={()=>{
                    this.setState({
                        isVisible:false
                    })
                }}
                >
                    <DetailForm detailData={this.state.record}/>
                </Modal>
            </div>
        )
    }
}