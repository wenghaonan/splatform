import {Component} from "react";
import axios from "../../../axios";
import Utils from "../../../utils";
import {Button, Card, Modal, Table} from "antd";
import React from "react";
import connect from "react-redux/es/connect/connect";
import RecordForm from './RecordForm';
const ButtonGroup = Button.Group;

@connect(
    state=>({
        input:state.employee
    })
)
class Record extends Component{
    state={
        selectedRowKeys: [],
    };
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList();
    }

    requestList = ()=>{
        let _this = this;
        let type=this.props.type
        axios.ajax({
            url:type=='create'?'/supervision/caTransfer/getPage':'/supervision/caTransfer/getByCaId?id='+this.props.input.id,
            data:{
                params:{...this.params,id:this.props.input.id}
            }
        }).then((res)=>{
            if(res.status == "success"){
                let list  = res.data.data.map((item,i)=>{
                    item.key = i+1;
                    return item;
                })
                this.setState({
                    list:list,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;//	当前页数
                        _this.requestList(); //刷新列表数据
                    })
                })
            }
        })
    }
    handleOperator = (type,item)=>{
        if(type =='create'){
            if(this.props.type=='edit'){
                this.setState({
                    title:'创建员工',
                    isVisible:true,
                    type
                })
            }else{
                alert("此处不允许该项操作,添加内容请点击编辑！")
                return;
            }
        }else if(type=="edit" || type=='detail'){

            this.setState({
                title:type=='edit'?'编辑用户':'查看详情',
                isVisible:true,
                recordInfo:item,
                type
            })
        }else if(type=="delete"){
            Modal.confirm({
                content:'确定要删除吗？',
                onOk:()=>{
                    axios.ajax({
                        url: '/supervision/caTransfer/delete',
                        data: {
                            params: {
                                id: item.id
                            }
                        }
                    }).then((res)=>{
                        if(res.status == 'success'){
                            this.setState({
                                isVisible:false
                            })
                            this.requestList();
                        }
                    })
                }
            })
        }
    }
    handleSubmit = ()=>{
        let type = this.state.type;
        let data = this.recordForm.props.form.getFieldsValue();//获取表单的值
        data.transferTime=Utils.formatDate(data.transferTime);
        data.boardingTime=Utils.formatDate(data.boardingTime);
        if(type=='create'){
            data.caId=this.props.input.id;
        }
        axios.ajax({
            url:type=='create'?'/supervision/caTransfer/insert':'/supervision/caTransfer/update',
            data:{
                params:{
                    ...data,
                }
            }
        }).then((res)=>{
            if(res){
                this.recordForm.props.form.resetFields();//表单重置
                this.setState({
                    isVisible:false,
                })
                this.requestList();
            }
        })
    }

    render() {
        const columns = [
            {
                title: '序号',
                dataIndex: 'key',

            }, {
                title: '调离时间',
                dataIndex: 'transferTime',
                render: Utils.formatDate
            },{
                title: '旧岗位',
                dataIndex: 'primaryPost',
            },
            {
                title: '新岗位',
                dataIndex: 'presentPost',
            },
            {
                title: '登记时间',
                dataIndex: 'boardingTime',
                render: Utils.formatDate
            },
            {
                title: '操作',
                dataIndex:'operation',
                render:(text, record)=>{

                    return <ButtonGroup>
                        <Button type="primary" size='small'  onClick={() => {this.handleOperator('detail',record)}}>查询</Button>
                        <Button type="primary" size='small'  onClick={() => {this.handleOperator('edit',record)}}>修改</Button>
                        <Button type="primary" size='small'  onClick={() => {this.handleOperator('delete',record)}}>删除</Button>
                    </ButtonGroup>


                }
            }
        ];


        return (
            <div>
                <div style={{marginTop:10}}>
                    <Button  type="primary" onClick={()=> {this.handleOperator('create',null)}} style={{marginBottom:5}}>添加</Button>
                    {/*使用封装好的ETable组件实现角色列表的展示*/}
                    <Table
                        size='small'
                        dataSource={this.state.list}
                        pagination={this.state.pagination}
                        columns={columns}
                    />
                </div>
                <Modal
                    title={this.state.title}
                    visible={this.state.isVisible}
                    onOk={this.handleSubmit}
                    destroyOnClose
                    width={400}
                    onCancel={()=>{
                        this.recordForm.props.form.resetFields();//表单重置
                        this.setState({
                            isVisible:false,
                            recordInfo:{}
                        })
                    }}
                >
                    <RecordForm recordInfo={this.state.recordInfo||{}} wrappedComponentRef={(inst) => this.recordForm = inst }/>
                </Modal>
            </div>

        )
    }
}
export default Record;