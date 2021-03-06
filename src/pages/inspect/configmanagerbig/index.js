import React,{Component} from 'react';
import CommonPage from './../../../components/CommonPage';
import axios from "../../../axios";

export default class bigclass extends Component{
    state={
        checkList:[{id: 1, name: '小作坊'}, {id: 2, name: '小餐饮'},{id: 3, name: '食品摊贩'}]
    }
    componentDidMount() {
        this.requestIndustry();
    }
    requestIndustry=()=>{
        axios.noLoadingAjax({
            url:'/sys/industry/getList'
        }).then((res)=>{
            if(res.status == 'success'){
                this.setState({
                    industryList:res.data,
                })
            }
        })
    }

    render() {
        const quireList = [
            {
                type: 'SELECT',
                label: '行业类别',
                field: 'industry',
                width: 150,
                list: (this.state.industryList||[]).map((item)=>{return {id: item.id, name:item.name}})
            },{
                type: 'SELECT',
                label: '检查项类型',
                field: 'checkitem',
                width: 150,
                list: this.state.checkList
            },{
                type: 'INPUT',
                label: '名称',
                field: 'name',
            }
        ];
        const baseColumns = [
            {
                title: '行业类别',
                dataIndex: 'industryName'
            },{
                title: '检查项类型',
                dataIndex: 'checkitem',
                render:(checkitem)=>{
                   let data = (this.state.checkList||[]).find((item)=>{return item.id==checkitem})||{}
                   return data.name
                }
            },{
                title: '序号',
                dataIndex: 'seq'
            }, {
                title: '检查项名称',
                dataIndex: 'name',
            }, {
                title: '备注',
                dataIndex: 'remark',
            }
        ];

        const formList = [
            {
                type: 'SELECT',
                label: '行业类型',
                field: 'industry',
                width: '100%',
                list: (this.state.industryList||[]).map((item)=>{return {id: item.id, name:item.name}})
            }, {
                type: 'SELECT',
                label: '检查项类型',
                field: 'checkitem',
                width: '100%',
                list: this.state.checkList
            }, {
                type: 'INPUT',
                label: '序号',
                field: 'seq'
            },{
                type: 'INPUT',
                label: '检查项目名称',
                field: 'name'
            },{
                type: 'TextArea',
                label: '备注',
                field: 'remark',
                rows:1
            }
        ];
        return (
            <CommonPage
                quireList={quireList}
                baseColumns={baseColumns}
                formList={formList}
                baseUrl='/inspect/largeConf'
            />
        );
    }
}