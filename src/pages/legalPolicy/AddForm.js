
import React, { Component } from 'react'
import {Row,Col,Input,Select,DatePicker, Upload,Table,Button, Card} from 'antd'
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css'
import moment from 'moment';
import './style.less'
const {Option} = Select
const ButtonGroup = Button.Group;

export default class AddForm extends Component{
    state = {

    }
    changeInput = (data,option) => {
        let value = this.props.lewsData
        value[option] = data
        this.props.dispatchLewsData(value)
    }   
    handleChange = (info) => {
        const fileList = info.fileList;
        let file = fileList.pop();
        if(info.file.status == 'done'){
            this.props.dispatchFileList([file])
        }
    }
    
    render() {
        const columns = [
            {
                title:'资料名称',
                dataIndex:'',
                key:''
            },
            {
                title:'上传日期',
                dataIndex:'',
                key:''
            },
            {
                title:'文件大小',
                dataIndex:'',
                key:''
            },
            {
                title:'操作',
                dataIndex:'operation',
                render:(text,record) => {
                    return <ButtonGroup>
                        <Button type='primary'>查看</Button>
                        <Button type='primary'>下载</Button>
                    </ButtonGroup>
                }
            }
        ]
        const controls =[
            'undo', 'redo', 'separator',
            'font-size', 'line-height', 'letter-spacing', 'separator',
            'text-color', 'bold', 'italic', 'underline', 'strike-through', 'separator',
            'superscript', 'subscript', 'remove-styles', 'emoji',  'separator', 'text-indent', 'text-align', 'separator',
            'headings', 'list-ul', 'list-ol', 'blockquote', 'code', 'separator',
            'link', 'separator', 'hr', 'separator',
            'media', 'separator',
            'clear'
        ]
        let lewsData = this.props.lewsData||{};
        console.log('lewsData', lewsData)
        const status = this.props.type == 'create'?'none':'block'
        const dateFormat = 'YYYY/MM/DD';
        return (
            <div>
                <Row style={{marginTop:10}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>标题：</Col>
                    <Col span={15}><Input placeholder='请输入标题' value={lewsData.title} onChange={(e)=>this.changeInput(e.target.value,'title')} /></Col>
                    <Col span={3} style={{display:status,marginLeft:30}}>
                        <Select
                            style={{width:'100%'}}
                            value={lewsData.effect||undefined}
                            onChange={(value)=>{this.changeInput(value,'effect')}}
                        >
                            <Option value='有效'>有效</Option>
                            <Option value='废止'>废止</Option>
                        </Select>
                    </Col>
                </Row>
                <Row style={{marginTop:30}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>文号：</Col>
                    <Col span={5}><Input placeholder='请输入文号' value={lewsData.articleNumber||''} onChange={(e)=>this.changeInput(e.target.value,'articleNumber')} /></Col>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>成文日期：</Col>
                    <Col span={5}><DatePicker  value={lewsData.issueDate==undefined?null:moment(lewsData.issueDate, dateFormat)} format={dateFormat} onChange={(dataString)=>this.changeInput(dataString,'issueDate')} /></Col>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>发布日期：</Col>
                    <Col span={5}><DatePicker  value={lewsData.writtenDate==undefined?null:moment(lewsData.writtenDate, dateFormat)} format={dateFormat} onChange={(dataString)=>this.changeInput(dataString,'writtenDate')} /></Col>
                </Row>
                <Row style={{marginTop:30}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>主题分类：</Col>
                    <Col span={5}>
                        <Select placeholder='请选择主题分类' style={{width:'100%'}} value={lewsData.subjectClassification||undefined} onChange={(value)=>this.changeInput(value,'subjectClassification')}> 

                        </Select>
                    </Col>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>所属机构：</Col>
                    <Col span={5}>
                        <Select placeholder='请选择所属机构' style={{width:'100%'}} value={lewsData.affiliatedInstitutions||undefined} onChange={(value)=>this.changeInput(value,'affiliatedInstitutions')}> 

                        </Select>
                    </Col>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>业务分类：</Col>
                    <Col span={5}>
                        <Select placeholder='请选择业务分类' style={{width:'100%'}} value={lewsData.businessClassification||undefined} onChange={(value)=>this.changeInput(value,'businessClassification')}> 

                        </Select>
                    </Col>
                </Row>
                <Row style={{marginTop:30}}>
                    <Col span={3} style={{textAlign:'right',fontSize:15}}>题注：</Col>
                    <Col span={18}><Input placeholder='请输入题注' defaultValue={lewsData.caption} onChange={(value)=>this.changeInput(value,'caption')} /></Col>
                </Row>
                <div className="editAreaBody">
                 <BraftEditor
                     controls={controls}
                     contentStyle={{height:500}}
                     value={lewsData.content}
                     onChange={(data)=>this.changeInput(data,'content')}
                 />
                </div>
                <div className="editAreaBody">
                    <span style={{marginTop:30,flex:1}}>上传提示：上传的资质证照文件大小需≤5M；上传资料格式支持：jpg、png、pdf、world格式</span>
                    <Upload
                        name='file'
                        showUploadList={false}
                        // action={}
                        fileList={this.props.fileList}
                        onChange={(info) => this.handleChange(info)}
                    >
                        <Button className='button'>添加附件</Button>
                    </Upload>
                    <Table bordered className='table' columns={columns} dataSource={this.props.fileList}/>
                </div>
            </div>
        )
    }
}