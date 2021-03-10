import React, { Component } from 'react'
import { Button, Card, Row, Col, Table, Input, Select, Transfer, Modal, Icon, Upload, message } from 'antd'
import './style.less'
import Utils from "../../../utils";
import axios from "../../../axios";
import BraftEditor from 'braft-editor';
import 'braft-editor/dist/index.css'
import ButtonGroup from 'antd/lib/button/button-group'
import Axios from 'axios';
import difference from 'lodash/difference';
import { commonUrl } from '../../../axios/commonSrc'
const { TextArea } = Input;
const { Option } = Select;



class AddForm extends Component {
    state = {
        class: '',
        mockData: [],
        targetKeys: this.props.informData.ids || [],
        isModalVisible: false,
        isSelectVisible: false
    }
    params = {
        pageNo: 1
    }
    //获取政府人员信息
    getGovernment = () => {
        let _this = this
        axios.PostAjax({
            url: '/supervision/ga/getList',
            data: {
                params: { ...this.params, isPage: 1 }
            }
        }).then((res) => {
            if (res.status == 'success') {
                const originTargetKeys = res.data.data.map((item, index) => {
                    return {
                        key: item.id.toString(),
                        name: item.name,
                        deptName: item.deptName,
                        jobName: item.jobName,
                        id: item.id
                    }
                })
                _this.setState({
                    mockData: originTargetKeys,
                })
            }
        })
    }
    changeInput = (data, option) => {
        let value = this.props.informData
        value[option] = data
        this.props.dispatchInformData(value)
    }
    //选择审核人
    //穿梭框改变选择
    onChange = nextTargetKeys => {
        this.setState({ targetKeys: nextTargetKeys });
    };
    componentDidMount() {
        this.getGovernment()
    }
    //选择审核人
    handSelect = (value) => {
        this.changeInput(value, 'reviewerId')
        const reviewer = this.state.mockData.find(
            item => value === item.id
        )
        this.changeInput(reviewer.name, 'reviewer')
        this.setState({
            isSelectVisible: false
        })
    }
    handleReader = () => {
        const valueSelect = this.state.targetKeys || []
        const list = valueSelect.map((item, index) => {
            const reviewer = this.state.mockData.find(
                data => parseInt(item) === data.id
            )
            return reviewer.name
        })
        this.changeInput(this.state.targetKeys, 'ids')
        this.changeInput(list.toString(), 'allReaders')
        this.setState({
            isModalVisible: false
        })
    }
    //上传文件
    handleFile = (info) => {
        const fileList = info.fileList;
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败.`);
        }
        const data = JSON.stringify(fileList)
        this.changeInput(data, 'appendix');

    }
    //查看图片
    handlePreview = file => {
        console.log(file)
        this.setState({
            previewImage: (file.response || {}).data,
            previewVisible: true,
        });
    };
    //下载文件
    downLoad = (file) => {
       const download = commonUrl + '/upload/picture/' + (file.response || {}).data
       window.open(download)
    }
    render() {
        const appendix = JSON.parse(this.props.informData.appendix || JSON.stringify([]))
        const allClass = this.props.class || []
        const status = this.props.status == 'detail' || this.props.status == 'check' ? true : false
        const { informData } = this.props
        const columns = [
            {
                title: '资料名称',
                dataIndex: 'name',
                key: 'name'
            },
            {
                title: '上传日期',
                dataIndex: '',
                key: ''
            },
            {
                title: '文件大小',
                dataIndex: '',
                key: ''
            },
            {
                title: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    return <ButtonGroup>
                        <Button type='primary' style={{display:record.type=='image/jpg'?"":'none'}} onClick={() => { this.handlePreview(record) }}>查看</Button>
                        <Button type='primary' onClick={() => { this.downLoad(record) }}>下载</Button>
                    </ButtonGroup>
                }
            }
        ]
        const TableTransfer = ({ leftColumns, rightColumns, ...restProps }) => (
            <Transfer {...restProps} showSelectAll={false} >
                {({
                    direction,
                    filteredItems,
                    onItemSelectAll,
                    onItemSelect,
                    selectedKeys: listSelectedKeys,
                    disabled: listDisabled,
                }) => {
                    const columns = direction === 'left' ? leftColumns : rightColumns;
                    const pagination = direction === 'left' ? this.state.pagination : true;
                    const rowSelection = {
                        getCheckboxProps: item => ({ disabled: listDisabled || item.disabled }),
                        onSelectAll(selected, selectedRows) {
                            const treeSelectedKeys = selectedRows
                                .filter(item => !item.disabled)
                                .map(({ key }) => key);
                            const diffKeys = selected
                                ? difference(treeSelectedKeys, listSelectedKeys)
                                : difference(listSelectedKeys, treeSelectedKeys);
                            onItemSelectAll(diffKeys, selected);
                        },
                        onSelect({ key }, selected) {
                            onItemSelect(key, selected);
                        },
                        selectedRowKeys: listSelectedKeys,
                    };

                    return (
                        <Table
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={filteredItems}
                            size="small"
                            pagination
                            style={{ pointerEvents: listDisabled ? 'none' : null }}
                            onRow={({ key, disabled: itemDisabled }) => ({
                                onClick: () => {
                                    if (itemDisabled || listDisabled) return;
                                    onItemSelect(key, !listSelectedKeys.includes(key));
                                },
                            })}
                        />
                    );
                }}
            </Transfer>
        );

        const leftTableColumns = [
            {
                dataIndex: 'name',
                title: '姓名',
            },
            {
                dataIndex: 'deptName',
                title: '所属部门',
            },
            {
                dataIndex: 'jobName',
                title: '职务',
            },
        ];
        const columns1 = [
            {
                dataIndex: 'name',
                title: '姓名',
            },
            {
                dataIndex: 'deptName',
                title: '所属部门',
            },
            {
                dataIndex: 'jobName',
                title: '职务',
            },
            {
                dataIndex: '操作',
                dataIndex: 'operation',
                render: (text, record) => {
                    return <ButtonGroup>
                        <Button type='default' onClick={() => this.handSelect(record.id)}>选择</Button>
                    </ButtonGroup>
                }
            }
        ];
        const rightTableColumns = [
            {
                dataIndex: 'name',
                title: '姓名',
            },
        ];
        return (
            <div className='addContent'>
                <div className='leftContent'>
                    <Card title="企业通知类型" style={{ width: 250 }}>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ fontSize: 15 }}>发布人：</Col>
                            <Col span={12}>{informData.userName}</Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ fontSize: 15 }}>发布日期：</Col>
                            <Col span={12}>{informData.issueDate}</Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ fontSize: 15 }}>类型：</Col>
                            <Col span={12}>
                                <Select value={informData.typeId} style={{ width: 120 }} onChange={(value) => this.changeInput(value, 'typeId')} disabled={status}>
                                    {allClass.map((item, index) => {
                                        return <Option key={index} value={item.id}>{item.className}</Option>
                                    })}
                                </Select>
                            </Col>
                        </Row>
                    </Card>
                    <Card title="审核人" style={{ width: 250, marginTop: 10 }} extra={<Button disabled={status} type='primary' onClick={() => this.setState({ isSelectVisible: true })}>审核人</Button>}>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={12} style={{ fontSize: 15 }}>审核人：</Col>
                            <Col span={12}>{informData.reviewer}</Col>
                        </Row>
                    </Card>
                    <Card title="发送给" style={{ width: 250, marginTop: 10 }} extra={<Button disabled={status} type='primary' onClick={() => this.setState({ isModalVisible: true })}>人员</Button>}>
                        <div>{informData.allReaders}</div>
                    </Card>
                </div>
                <div className='rightContent'>
                    <Card title="通知公告正文" style={{ width: 700 }}>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={4} style={{ fontSize: 15 }}>通知文号：</Col>
                            <Col span={20}><Input value={informData.docNumber} disabled={status} onChange={(e) => this.changeInput(e.target.value, 'docNumber')} /></Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={4} style={{ fontSize: 15 }}>标题：</Col>
                            <Col span={20}><Input value={informData.title} disabled={status} onChange={(e) => this.changeInput(e.target.value, 'title')} /></Col>
                        </Row>
                        <Row style={{ marginTop: 10 }}>
                            <Col span={4} style={{ fontSize: 15 }}>通知公告内容：</Col>
                            <Col span={20}><TextArea rows={4} value={informData.content} disabled={status} onChange={(e) => this.changeInput(e.target.value, 'content')} /></Col>
                        </Row>
                    </Card>
                    <Card style={{ width: 700 }}>
                        <div>上传提示：上传的资质证照文件大小需≤5M；上传资料格式支持：jpg、png、pdf、world格式</div>
                        <Upload
                            action={commonUrl + '/upload/uploadReport'}
                            onChange={(info) => this.handleFile(info)}
                            showUploadList={false}
                            fileList={appendix}
                        >
                            <Button style={{ margin: 10 }}><Icon type="upload" />上传附件</Button>
                        </Upload>
                        <Table columns={columns} dataSource={appendix} bordered />
                    </Card>
                </div>
                <Modal
                    width='800px'
                    title='人员列表'
                    visible={this.state.isModalVisible}
                    onOk={() => { this.handleReader() }}
                    onCancel={() => { this.setState({ isModalVisible: false }) }}
                >
                    <TableTransfer
                        dataSource={this.state.mockData}
                        targetKeys={this.state.targetKeys}
                        disabled={false}
                        showSearch={true}
                        onChange={this.onChange}
                        filterOption={(inputValue, item) =>
                            item.name.indexOf(inputValue) !== -1 || item.deptName.indexOf(inputValue) !== -1
                        }
                        leftColumns={leftTableColumns}
                        rightColumns={rightTableColumns}
                    />
                </Modal>
                <Modal
                    width='800px'
                    title='人员列表'
                    visible={this.state.isSelectVisible}
                    footer={null}
                    onCancel={() => { this.setState({ isSelectVisible: false }) }}
                >
                    <Table
                        size='small'
                        dataSource={this.state.mockData}
                        columns={columns1}
                    />
                </Modal>
                <Modal visible={this.state.previewVisible} footer={null} onCancel={() => this.setState({ previewVisible: false })}>
                    <img alt="example" style={{ width: '100%' }} src={commonUrl + '/upload/picture/' + this.state.previewImage} />
                </Modal>
            </div>
        )
    }
}
export default AddForm
