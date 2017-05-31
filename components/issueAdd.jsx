import React from 'react';
import {Ajax} from './functions/ajax.js';
export default class IssueAdd extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            datas:{
                title:'',
                content:'',
                statu:1
            }
        }
    }

    _onAction(){
        let state = this.state.datas;
        return {
            _onTitle:(value)=>{
                state.title = value;
                this.setState({
                    datas:state
                })
            },
            _onContent:(value)=>{
                state.content = value;
                this.setState({
                    datas:state
                })
            },
            _onStatu:(value)=>{
                state.statu = value;
                this.setState({
                    datas:state
                })
            }
        }
    }
    _onAdd(){
        Ajax({
            url:'/admin/issue',
            method:'PUT',
            datas:this.state.datas
        }).then((res)=>{
            if(res.status === 1){
                this.props.router.goBack()
            }else{
                alert(res.message);
            }
        })
    }
    _setContent(content){
        return ()=>{
			this.ue.setContent(content)
		}
    }
    _loadDate(id){
        Ajax({
            url:`/admin/issue/${id}`,
            method:'GET'
        }).then((res)=>{
            if(res.status === 1){
                this.setState({
                    datas:res.datas
                });
                console.log(res.datas);
            }else{
                alert(res.message);
            }
        })
    }
    _onEdit(id){
        Ajax({
            url:`/admin/issue/${id}`,
            method:'POST',
            datas:{
                title:this.state.datas.title,
                content:this.state.datas.content,
                statu:this.state.datas.statu
            }
        }).then((res)=>{
            if(res.status === 1){
                alert('更新成功!');
                this.props.router.goBack();
            }else{
                alert(res.message);
            }
        })
    }

    componentDidMount(){
        if(this.props.params.id){
            this._loadDate(this.props.params.id);
        }
    }
    render(){
        return(
            <div>
                <Form onAction={this._onAction.bind(this)} datas={this.state.datas}>
                    {
                        this.props.params.id ? <button onClick={this._onEdit.bind(this,this.props.params.id)} className="uk-button uk-button-primary">修改</button> : <button onClick={this._onAdd.bind(this)} className="uk-button uk-button-primary">提交</button>
                    }
                </Form>
            </div>
        )
    }
}

class Form extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            ue:`ueditor${Math.random()}`
        }
    }
    componentDidMount(){
        this.ue = UE.getEditor(this.state.ue);
        this.ue.addListener('ready',()=>{
            setTimeout(()=>{
                this.ue.setContent(this.props.datas.content)
            },500)//不知道为什么这里要设置异步执行？

        })
        this.ue.addListener('contentChange',()=>{
            this.props.onAction()._onContent(this.ue.getContent())
        })
    }
    componentWillUnmount(){
        this.ue.destroy();
        this.ue = null;
    }

    render(){
        return(
            <div className="uk-form uk-form-stacked">
                <div className="uk-form-row">
                    <label className="uk-form-label">问题</label>
                    <input type="text" value={this.props.datas.title} onChange={(e)=>this.props.onAction()._onTitle(e.target.value)} className="uk-form-width-large"/>
                </div>
                <div className="uk-form-row">
                    <label className="uk-form-label">回答</label>
                    <script style={{width:'100%',height:'200px'}} id={this.state.ue}></script>
                </div>
                <div className="uk-form-row">
                    <label className="uk-form-label">标题</label>
                    <input name="statu" value={1} type="radio" id="statu-1" checked={this.props.datas.statu === 1} onChange={(e)=>this.props.onAction()._onStatu(1)}/>
                    <label htmlFor="statu-1"> 显示 </label>
                    <input name="statu" value={0} type="radio" id="statu-0" checked={this.props.datas.statu === 0} onChange={(e)=>this.props.onAction()._onStatu(0)}/>
                    <label htmlFor="statu-0"> 隐藏 </label>
                </div>
                <div className="uk-form-row">
                    {this.props.children}
                </div>
            </div>
        )
    }
}
