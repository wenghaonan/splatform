
import React, { Component } from 'react'
import {Button, Card,Col,Row, Table} from 'antd'
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css'
import './style.less'
import { render } from 'less'
import ButtonGroup from 'antd/lib/button/button-group'

export default class DetailForm extends Component {
    state = {
        list:[]
    }

    render() {
        const detailData = this.props.detailData||{}
        console.log("法律法规详细信息",detailData)
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
        const controls =[]
        return (
            <div>
                <Card>
                    <Row>
                        <Col span={3}>标题：</Col>
                        <Col span={14}>{detailData.title}</Col>
                        <Col span={2}>效力：</Col>
                        <Col span={3}>{detailData.effect}</Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col span={3}>文号：</Col>
                        <Col span={5}>{detailData.articleNumber}</Col>
                        <Col span={3}>成文日期：</Col>
                        <Col span={5}>{detailData.issueDate}</Col>
                        <Col span={3}>发布日期：</Col>
                        <Col span={5}>{detailData.writtenDate}</Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col span={3}>主题分类：</Col>
                        <Col span={5}>{detailData.subjectClassification}</Col>
                        <Col span={3}>所属机构：</Col>
                        <Col span={5}>{detailData.affiliatedInstitutions}</Col>
                        <Col span={3}>业务分类：</Col>
                        <Col span={5}>{detailData.businessClassification}</Col>
                    </Row>
                    <Row style={{marginTop:10}}>
                        <Col span={3}>题注：</Col>
                        <Col span={21}>{detailData.caption}</Col>
                    </Row>
                </Card>
                <Card style={{marginTop:20}}>
                    <div>
                    <BraftEditor 
                        readOnly={true}
                        controls={controls}
                        contentStyle={{height:500}}
                        value={detailData.content}
                    />
                    </div>
                </Card>
                <Card style={{marginTop:20}}> 
                    <Table columns={columns} dataSource={this.state.list} bordered/>
                </Card>
            </div>
        )
    }
}