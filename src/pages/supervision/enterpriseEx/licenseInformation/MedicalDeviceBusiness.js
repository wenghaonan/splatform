import React,{Component} from 'react';
import {Select,Input,Radio,DatePicker,Checkbox,Button,Icon,Modal} from 'antd';
import connect from "react-redux/es/connect/connect";
import {changeEnterprise} from "../../../../redux/action";
import axios from "../../../../axios";
import moment from "moment";


const Option = Select.Option;
const { TextArea } = Input;
@connect(
    state=>({
        input:state.enterprise
    }),
    {
        changeEnterprise,
    }
)
class MedicalDeviceBusiness extends Component{

    state={categoryList:[],licenceList:[]}

    componentDidMount() {
        this.requestList();
    }
    requestList=()=>{
        axios.ajax({
            url:'/supervision/enterprise/getCateAndLicence',
            data:{
                params:{id:12}
            }
        }).then((res)=>{
            if(res.status == "success"){
                this.setState({
                    categoryList:res.data.categoryList,
                    licenceList:res.data.licenceList
                })
            }
        })
    }
    onCheckChange=(value,option,index)=>{
        this.changeInput(value.join(','),option,index)
    }

    changeStartTime=(value,option,index)=>{
        let medicalBusinessList = this.props.input.medicalBusinessList||[];
        medicalBusinessList[index][option]=value;
        medicalBusinessList[index].giveTime=value;
        medicalBusinessList[index].endTime=moment(value).add(5,'years').subtract(1,'day')
        let input = {...this.props.input,medicalBusinessList}
        this.props.changeEnterprise(input);
    }
    changeInput=(value,option,index)=>{
        
        let medicalBusinessList = this.props.input.medicalBusinessList||[];
        medicalBusinessList[index][option] = value;
        let input = {...this.props.input,medicalBusinessList}
         this.props.changeEnterprise(input)  
    }
    render() {

        const checkStatus = this.props.type=='detail'?true:false;
        const medicalBusinessList = this.props.input.medicalBusinessList||[]
        const index =this.props.index
        const formData =medicalBusinessList[index]||{}
        
        return (
            <div>
                {/* 许可证信息 */}
                
                <table>
                    <tbody>
                    <tr>
                        <td>企业名称</td>
                        <td colSpan={3}><Input value={formData.businessName} onChange={(e)=>this.changeInput(e.target.value,"businessName",index)} placeholder={"请输入经营者名称"} disabled={checkStatus}/></td>
                       
                    </tr>
                    <tr>
                        <td>库房地址</td>
                        <td colSpan={3}><Input value={formData.businessAddress} onChange={(e)=>this.changeInput(e.target.value,"businessAddress",index)} placeholder={"请输入企业住所或经营场所地址"} disabled={checkStatus}/></td>
                    </tr>
                    <tr>
                        <td>许可证号<span style={{color:'#FF3300'}}>*</span></td>
                        <td><Input value={formData.registerNumber} onChange={(e)=>this.changeInput(e.target.value,"registerNumber",index)} placeholder={"请输入证号"} disabled={checkStatus}/></td>
                        <td>经营方式<span style={{color:'#FF3300'}}>*</span></td>
                        <td> <Select placeholder={"请选择经营方式"} value={formData.category} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"category",index)} disabled={checkStatus}>
                            <Option value="零售">零售</Option>
                            <Option value="零售连锁">零售连锁</Option>
                            <Option value="批发">批发</Option>
                           </Select></td>
                    </tr>
                    <tr>
                        <td >经营范围</td>
                        <td colSpan={3}><TextArea maxLength={100} placeholder="请填写经营范围" value={formData.medicalSubject} onChange={(e)=>this.changeInput(e.target.value,"medicalSubject",index)} rows={5}  disabled={checkStatus}/></td>
                       
                    </tr>
                    <tr>
                        <td>有效期自</td>
                        <td><DatePicker style={{width:'100%'}}
                            disabled={checkStatus}
                            value={formData.startTime==null?null:moment(formData.startTime)}
                            onChange={(date)=>this.changeStartTime(date,'startTime',index)}
                            showTime={true} placeholder="请选择开始时间" format="YYYY-MM-DD"/></td>
                        <td>发证日期</td>
                        <td><DatePicker style={{width:'100%'}}
                            disabled={checkStatus}
                            value={formData.giveTime==null?null:moment(formData.giveTime)}
                            onChange={(date)=>this.changeInput(date,'giveTime',index)}
                            showTime={true} placeholder="请选择发证时间" format="YYYY-MM-DD"/></td>
                    </tr>
                    <tr>
                        <td>有效期至</td>
                        <td><DatePicker
                            style={{width:'100%'}}
                            disabled={checkStatus}
                            value={formData.endTime==null?null:moment(formData.endTime)}
                            onChange={(date)=>this.changeInput(date,'endTime',index)}
                            showTime={true} placeholder="请输入有效期" format="YYYY-MM-DD"/></td>
                        <td>发证机关</td>
                        <td><Select placeholder={"请选择发证机关"} value={formData.issueAuthority} style={{width:"100%"}}
                            onChange={(value)=>this.changeInput(value,"issueAuthority",index)}  disabled={checkStatus}>
                                {this.state.licenceList.map((item)=>(<Option value={item.name}>{item.name}</Option>))}
                            </Select></td>
                    </tr>
                    </tbody>
                </table>
            {/* 检查及评定 */}
            
                <div className='commonEnterpriseBoxHead1'>检查及评定</div>
                <div className='commonEnterpriseBoxHead2'></div>
                <table style={{width:'50%'}}>
                <tbody>
                    <tr>
                        <td style={{width:'10%'}}>检查归类<span style={{color:'#FF3300'}}>*</span></td>
                        <td style={{width:'3%'}}><img src={require("./imgs/药品经营.png")} style={{height:'8%'}} alt=""/></td>
                        <td style={{width:'30%'}}><Checkbox.Group style={{width:'100%',textAlign:"left"}} value={formData.checkType?formData.checkType.split(','):[]}
                            onChange={(value)=>this.onCheckChange(value,'checkType',index)} disabled={checkStatus}>

                                <Checkbox style={{marginLeft:5}} value={'药品经营'}>药品经营</Checkbox>

                            </Checkbox.Group>
                        </td>
                    </tr>
                </tbody>
                </table>
                <table>
                    <tbody>
                    <tr>
                        <td style={{width:'10%'}}>量化等级</td>
                        <td style={{width:'40%'}}><Radio.Group style={{float:"left"}} value={formData.dynamicGrade} onChange={(e)=>this.changeInput(e.target.value,"dynamicGrade",index)} disabled={checkStatus}>
                            <Radio value={"A"}>A</Radio>
                            <Radio value={"B"}>B</Radio>
                            <Radio value={"C"}>C</Radio>
                            <Radio value={"D"}>D</Radio>
                            </Radio.Group>
                        </td>
                        <td style={{width:'10%'}}>年终评定</td>
                        <td style={{width:'40%'}}>
                            <Select placeholder={"请选择年终评定"} value={formData.yearAssessment} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"yearAssessment",index)} disabled={checkStatus}>
                            <Option value="优秀">优秀</Option>
                            <Option value="良好">良好</Option>
                            <Option value="一般">一般</Option>
                            <Option value="差">差</Option>
                           </Select>
                        </td>
                    </tr>
                    <tr>
                        <td>监管巡查频次</td>
                        <td ><Select placeholder="请选择巡查频次" value={formData.patrolFrequency} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"patrolFrequency",index)} disabled={checkStatus}>
                            <Option value="一次">一次</Option>
                            <Option value="二次">二次</Option>
                            <Option value="三次">三次</Option>
                            <Option value="四次">四次</Option>
                            </Select>
                        </td>
                        <td>企业规模</td>
                        <td ><Select placeholder={"请选择企业规模"} value={formData.enterpriseScale} style={{width:"100%"}}onChange={(value)=>this.changeInput(value,"enterpriseScale",index)} disabled={checkStatus}>
                            <Option value="特大型">特大型</Option>
                            <Option value="大型">大型</Option>
                            <Option value="中型">中型</Option>
                            <Option value="小型">小型</Option>
                            <Option value="微型">微型</Option>
                           </Select>
                        </td>
                    </tr>
                    </tbody>
                </table>
                    
        </div>
            
        )
    }
}
export default MedicalDeviceBusiness;

