import React,{PureComponent} from 'react';
import {Ajax} from './functions/ajax.js';
export default class UserEdit extends PureComponent{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	username:'',
	  	password:'',
	  	email:''
	  };
	}
	_loadUser(){
		Ajax({
			url:`admin/user/${this.props.params.id}`,
			method:'GET'
		}).then((res)=>{
			console.log(res);
			this.setState({
				username:res.datas.username,
				email:res.datas.email
			});
		})
	}
	_addUser(){
		Ajax({
			url:'admin/user',
			datas:{
				username:this.state.username,
				password:this.state.password,
				email:this.state.email
			}
		})
	}
	_updateUser(){
		Ajax({
			url:`admin/user/${this.props.params.id}`,
			method:'POST',
			datas:{
				username:this.state.username,
				password:this.state.password,
				email:this.state.email
			}
		}).then((res)=>{
			this.props.router.goBack();
		})
	}

	_loadMd5(){
		Ajax({
			url:'/getMd5',
			method:'GET'
		}).then((res)=>{
			this.setState({
				password:res.string
			})
		})
	}

	_usernameChange(e){
		this.setState({
			username:this.refs.username.value
		})
	}
	_passwordChange(e){
		this.setState({
			password:e.target.value
		})
	}
	_emailChange(e){
		this.setState({
			email:e.target.value
		})
	}
	componentWillMount() {
		if(this.props.params.id){
			this._loadUser()
		}
	}
	render(){
		return(
			<div className="uk-form">
				<div className="uk-form-row">
					<label className="uk-form-label">用户名</label>
					<div className="uk-form-controls">
						<input type="text" ref="username" onChange={this._usernameChange.bind(this)} value={this.state.username} className="uk-form-width-medium"/>
					</div>
				</div>
				<div className="uk-form-row">
					<label className="uk-form-label">密码</label>
					<div className="uk-form-controls">
						<input type="text" ref="password" onChange={this._passwordChange.bind(this)} value={this.state.password} className="uk-form-width-large"/>
						<button className="uk-button uk-margin-left" onClick={this._loadMd5.bind(this)}>生成</button>
					</div>
				</div>
				<div className="uk-form-row">
					<label className="uk-form-label">邮箱</label>
					<div className="uk-form-controls">
						<input type="text" ref="email" onChange={this._emailChange.bind(this)} value={this.state.email} className="uk-form-width-medium"/>
					</div>
				</div>
				<div className="uk-form-row">
					{
						this.props.params.id ? <button onClick={this._updateUser.bind(this)} className="uk-button uk-button-primary">更新</button> : <button onClick={this._addUser.bind(this)} className="uk-button uk-button-primary">提交</button>
					}
				</div>
			</div>
		)
	}
}