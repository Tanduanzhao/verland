import React from 'react';
import {Ajax} from './functions/ajax.js';
export default class CustomerAdd extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            required:['cradID','name'],
            cradID:'',
            name:'',
            payStatu:0,
            statu:1,
            checkStatu:0,
            address:'',
            phone:''
        }
    }

    _onAction(){
        return {
            _onStatu:(value)=>{
                this.setState({
                    statu:value
                })
            },
            _onPayStatu:(value)=>{
                this.setState({
                    payStatu:value
                })
            },
            _onCheckStatu:(value)=>{
                this.setState({
                    checkStatu:Number(value)
                })
            },
            _onCradID:(value)=>{
                this.setState({
                    cradID:value
                })
            },
            _onName:(value)=>{
                this.setState({
                    name:value
                })
            },
            _onAddress:(value)=>{
                this.setState({
                    address:value
                })
            },
            _onPhone:(value)=>{
                this.setState({
                    phone:value
                })
            }
        }
    }
    _loadData(id){
        Ajax({
            url:`/admin/customer/${id}`,
            method:'GET'
        }).then((res)=>{
            if(res.status === 1){
                this.setState({
                    checkStatu:res.datas.checkStatu,
                    payStatu:res.datas.payStatu,
                    statu:res.datas.statu
                })
                if(!!res.datas.cradID){
                    this.setState({
                        cradID:res.datas.cradID
                    })
                }
                if(!!res.datas.name){
                    this.setState({
                        name:res.datas.name
                    })
                }
                if(!!res.datas.address){
                    this.setState({
                        address:res.datas.address
                    })
                }
                if(!!res.datas.phone){
                    this.setState({
                        phone:res.datas.phone
                    })
                }

            }
        })
    }

    _addAction(){
        let i=0;
        for(let keys in this.state){
            i++;
            if(this.state[keys] === '' && this.state.required.indexOf(keys) != -1){
                console.log(i);
                alert(`${keys}不能为空!`);
                return false;
            }
        }
        Ajax({
            url:'/admin/customer',
            method:'PUT',
            datas:{
                cradID:this.state.cradID,
                name:this.state.name,
                payStatu:this.state.payStatu,
                statu:this.state.statu,
                checkStatu:this.state.checkStatu,
                address:this.state.address,
                phone:this.state.phone
            }
        }).then((res)=>{
            if(res.status === 1){
                alert('添加用户成功!');
                this.props.router.goBack();
            }else{
                alert(res.message);
            }
        })
    }
    _editAction(id){
        Ajax({
            url:`/admin/customer/${id}`,
            method:'POST',
            datas:{
                cradID:this.state.cradID,
                name:this.state.name,
                payStatu:this.state.payStatu,
                statu:this.state.statu,
                checkStatu:this.state.checkStatu,
                editDate:new Date(),
                address:this.state.address,
                phone:this.state.phone
            }
        }).then((res)=>{
            if(res.status === 1){
                alert('修改成功!');
                this.props.router.goBack();
            }else{
                alert(res.message);
            }
        })
    }

    componentDidMount(){
        if(!!this.props.params.id){
            this._loadData(this.props.params.id)
        }
    }

    render(){
        return(
            <div>
                <Form action={this._onAction()} {...this.state}>
                    <button onClick={this.props.params.id ? this._editAction.bind(this,this.props.params.id) : this._addAction.bind(this)} className="uk-button uk-button-primary">完成</button>
                </Form>
            </div>
        )
    }
}





class Form extends React.Component {
    render(){
        return(
            <div className="uk-form uk-form-stacked">
                <div className="uk-form-row">
                    <label className="uk-form-label">用户编号 *</label>
                    <input value={this.props.cradID} onChange={(e)=>this.props.action._onCradID(e.target.value)} type="text" className="uk-form-input uk-from-width-large"/>
                </div>
                <div className="uk-form-row">
                    <label className="uk-form-label">用户姓名 *</label>
                    <input value={this.props.name} onChange={(e)=>this.props.action._onName(e.target.value)} type="text" className="uk-form-input uk-from-width-large"/>
                </div>
                <div className="uk-form-row">
                    <label className="uk-form-label">地址信息</label>
                    <input value={this.props.address} onChange={(e)=>this.props.action._onAddress(e.target.value)} type="text" className="uk-form-width-large"/>
                </div>
                <div className="uk-form-row">
                    <label className="uk-form-label">联系方式</label>
                    <input value={this.props.phone} onChange={(e)=>this.props.action._onPhone(e.target.value)} type="text" className="uk-form-input"/>
                </div>
                <div className="uk-form-row">
                    <label className="uk-form-label">支付状态</label>
                    <input value="0" type="radio" onChange={this.props.action._onPayStatu.bind(this,0)} checked={this.props.payStatu === 0} id="payStatu-1" name="payStatu"/>
                    <label htmlFor="payStatu-1"> 未支付</label>
                    <input type="radio" onChange={this.props.action._onPayStatu.bind(this,1)} value="1" checked={this.props.payStatu === 1} id="payStatu-2" className="uk-margin-left" name="payStatu"/>
                    <label htmlFor="payStatu-2"> 已支付</label>
                </div>
                <div className="uk-form-row">
                    <label className="uk-form-label">用户状态</label>
                    <input type="radio" value="1" onChange={this.props.action._onStatu.bind(this,1)} checked={this.props.statu === 1} id="statu-1" name="statu"/>
                    <label htmlFor="statu-1"> 正常</label>
                    <input type="radio" value="0" onChange={this.props.action._onStatu.bind(this,0)} id="statu-2" checked={this.props.statu === 0} className="uk-margin-left" name="statu"/>
                    <label htmlFor="statu-2"> 冻结</label>
                    <input type="radio" value="2" onChange={this.props.action._onStatu.bind(this,2)} id="statu-3" className="uk-margin-left" checked={this.props.statu === 2} name="statu"/>
                    <label htmlFor="statu-3"> 异常</label>
                </div>
                <div className="uk-form-row">
                    <label className="uk-form-label">检验状态</label>
                    <select value={this.props.checkStatu} onChange={(e)=>this.props.action._onCheckStatu(e.target.value)}>
                        <option value={0}>未开始</option>
                        <option value={1}>未送检</option>
                        <option value={2}>送检中</option>
                        <option value={3}>样本检验中</option>
                        <option value={4}>报告已送出</option>
                    </select>
                </div>
                <div className="uk-form-row">
                    {
                        this.props.children
                    }
                </div>
            </div>
        )
    }
}
