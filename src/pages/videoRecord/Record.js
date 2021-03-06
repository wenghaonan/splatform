import React,{Component} from 'react';
import { Row, Col ,Input, Modal, Icon,Select,Button,Table, Divider,DatePicker} from 'antd';
import moment from 'moment'
import axios from '../../axios'
import Utils from "../../utils";
import {commonUrl} from '../../axios/commonSrc'


class Record extends Component{
    state={
        visible:false,
        dataList:[],
        nowCheck:{}
    }
    params = {
        pageNo:1
    }
    componentDidMount(){
        this.requestList()
    }

    requestList = ()=>{
        console.log("执行request")
        let _this = this;
        axios.ajax({
            url:'/videoRecord/getPageLookByEnterpriseId',
            data:{
                params:{
                    ...this.params,
                    id:this.props.videoInfo.enterpriseId
                }
            }
        }).then((res)=>{
            if(res.status == "success"){
                let dataList  = res.data.data.map((item,i)=>{
                    item.key = i;
                    return item;
                })
                this.setState({
                    dataList,
                    pagination:Utils.pagination(res,(current)=>{
                        _this.params.pageNo = current;//	当前页数
                        _this.requestList(); //刷新列表数据
                    })
                })
            }
        })
    }

    handleClickCheck(record){
        this.setState({
            visible:true,
            nowCheck:record

        })
    }
    handleExport(value){
        window.open(commonUrl+'/videoRecord/download?checkId='+value)
    }
    deleteRecord(id){
        if(window.confirm("是否删除？")){
            axios.ajax({
                url:'/videoRecord/delete',
                data:{
                    params:{
                        id:id
                    }
                }
            }).then((res)=>{
                if(res.status == "success"){
                    this.requestList()
                }
            })
        }
    }
    render(){
        const {dataList,nowCheck} = this.state
        const videoInfo = this.props.videoInfo || {};
        const columns = [
            {
                title: '巡查时间',
                dataIndex: 'recordTime',
                render:Utils.formatDate
            },
            {
                title: '巡查违规等级',
                dataIndex: 'level',
            },
            {
                title: '记录人员',
                dataIndex: 'recordPerson',
            },
            {
                title: '处理人',
                dataIndex: 'handlePersonName',
            },
            {
                title: '处理时间',
                dataIndex: 'handleTime',
                render:Utils.formatDate
            },
            {
                title: '操作',
                key: 'action',
                render: (text, record) => (
                    <span>
                  <a style={{paddingRight:10}} onClick={()=>this.handleClickCheck(record)}>查看</a>

                  <a onClick={()=>this.handleExport(record.id)}>下载巡查单</a>
                        &nbsp;&nbsp;
                        <a onClick={()=>this.deleteRecord(record.id)}>删除</a>
                </span>
                ),
            },
        ];


        return (
            <div className='commonEnterpriseBox'>
                <Row>
                    <Col span={24}>
                        <table>
                            <tbody>
                            <tr>
                                <td style={{background:'#F2F2F2'}}>企业名称</td>
                                <td><Input value={videoInfo.enterpriseName} disabled/></td>
                                <td style={{background:'#F2F2F2'}}>社会信用代码</td>
                                <td><Input value={videoInfo.permissionId} disabled/></td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2'}}>企业地址</td>
                                <td colspan={10}><Input value={videoInfo.address} disabled/></td>
                            </tr>
                            <tr>
                                <td style={{background:'#F2F2F2'}}>所在区域</td>
                                <td><Input value={videoInfo.areaName} disabled/></td>
                                <td style={{background:'#F2F2F2'}}>法人/负责人</td>
                                <td><Input value={videoInfo.charger} disabled/></td>
                                <td style={{background:'#F2F2F2'}}>联系电话</td>
                                <td><Input value={videoInfo.contact} disabled/></td>
                            </tr>
                            </tbody>
                        </table>
                    </Col></Row>

                <div style={{fontSize:16,marginTop:5,width:100,height:25,border:'1px solid #ddd',verticalAlign:'middle',textAlign:"center"}}>巡查记录</div>

                <Table
                    dataSource={this.state.dataList}
                    columns={columns}
                    pagination={this.state.pagination}/>



                <Modal
                    title="记录详情"
                    closable={true}
                    footer={false}
                    onCancel={()=>this.setState({visible:false})}
                    width={1000}
                    mask={false}
                    visible={this.state.visible}
                >
                    <div className='commonEnterpriseBox'>
                        <Row>
                            <Col span={24}>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td style={{background:'#F2F2F2'}}>企业名称</td>
                                        <td><Input value={videoInfo.enterpriseName} disabled/></td>
                                        <td style={{background:'#F2F2F2'}}>社会信用代码</td>
                                        <td><Input value={videoInfo.permissionId} disabled/></td>
                                    </tr>
                                    <tr>
                                        <td style={{background:'#F2F2F2'}}>企业地址</td>
                                        <td colspan={10}><Input value={videoInfo.address} disabled/></td>
                                    </tr>
                                    <tr>
                                        <td style={{background:'#F2F2F2'}}>所在区域</td>
                                        <td><Input value={videoInfo.areaName} disabled/></td>
                                        <td style={{background:'#F2F2F2'}}>法人</td>
                                        <td><Input value={videoInfo.charger} disabled/></td>
                                        <td style={{background:'#F2F2F2'}}>负责人</td>
                                        <td><Input value={videoInfo.charger}disabled/></td>

                                    </tr>
                                    <tr>
                                        <td style={{background:'#F2F2F2'}}>巡查违规等级</td>
                                        <td><Input value={nowCheck.level} disabled/></td>
                                        <td style={{background:'#F2F2F2'}}>巡查时间</td>
                                        <td><DatePicker disabled style={{width:'100%'}}
                                                        value={nowCheck.recordTime=moment(nowCheck.recordTime)}
                                                        format="YYYY-MM-DD HH:mm:ss"/></td>
                                        <td style={{background:'#F2F2F2'}}>此前已违规次数</td>
                                        <td><Input value={nowCheck.recordCount} disabled/></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </Col>
                        </Row>
                        <div  style={{fontSize:16,marginTop:5,width:100,height:25,border:'1px solid #ddd',verticalAlign:'middle',textAlign:"center"}}>执法取证照片</div>
                        <div className='commonEnterpriseBox'>
                            <Row>
                                <Col span={12}>
                                    <div style={{width:360,height:220}}>
                                        <img src={commonUrl+'/upload/cut/'+nowCheck.recordPicture1} height={220} width={360}/>
                                    </div>
                                </Col>
                                <Col span={12}>
                                    <div style={{width:360,height:220}}>
                                        <img src={commonUrl+'/upload/cut/'+nowCheck.recordPicture2} height={220} width={360}/>
                                    </div></Col>
                            </Row>
                        </div>
                        <div style={{fontSize:16,marginTop:5,width:100,height:25,border:'1px solid #ddd',verticalAlign:'middle',textAlign:"center"}}>巡查记录</div>
                        <Row>
                            <Col span={24}>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td colspan={1} style={{background:'#F2F2F2'}}>巡查记录</td>
                                        <td colspan={10} ><Input value={nowCheck.recordContent} style={{height:100}} disabled/></td>
                                    </tr>
                                    <tr>
                                        <td style={{background:'#F2F2F2'}}>记录人</td>
                                        <td><Input value={nowCheck.recordPerson} disabled/></td>
                                        <td style={{background:'#F2F2F2'}}>记录时间</td>
                                        <td><DatePicker disabled style={{width:'100%'}}
                                                        value={nowCheck.recordTime=moment(nowCheck.recordTime)}
                                                        format="YYYY-MM-DD HH:mm:ss"/></td>
                                    </tr>
                                    </tbody>
                                </table></Col></Row>
                        <div style={{fontSize:16,marginTop:5,width:100,height:25,border:'1px solid #ddd',verticalAlign:'middle',textAlign:"center"}}>处理意见</div>
                        <Row>
                            <Col span={24}>
                                <table>
                                    <tbody>
                                    <tr>
                                        <td colspan={1} style={{background:'#F2F2F2'}}>处理意见</td>
                                        <td colspan={10} ><Input style={{height:100}} value={nowCheck.handleContent} disabled/></td>
                                    </tr>
                                    <tr>
                                        <td style={{background:'#F2F2F2'}}>处理人</td>
                                        <td><Input value={nowCheck.handlePersonName} disabled/></td>
                                        <td style={{background:'#F2F2F2'}}>处理时间</td>
                                        <td><DatePicker style={{width:'100%'}} disabled value={nowCheck.handleTime=moment(nowCheck.handleTime)} format="YYYY-MM-DD HH:mm:ss" /></td>
                                    </tr>
                                    </tbody>
                                </table></Col></Row>
                    </div>
                </Modal>

            </div>

        );
    }
}
export default Record