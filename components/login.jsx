import React,{PureComponent} from 'react';
import {Ajax} from './functions/ajax.js';
export default class Login extends PureComponent{
	constructor(props) {
	  super(props);
	  this.loginAction = this.loginAction.bind(this);
	}

	componentWillMount() {
		const data = Ajax({
			url:'/admin/logined',
			datas:{
				name:'cashely',
				age:12
			}
		}).then((res)=>{
			if(res.status == 1){
				this.props.router.push('/');
			}
		});

	}

	loginAction(){
		Ajax({
			url:'/admin/login',
			datas:{
				username:this.refs.username.value,
				password:this.refs.password.value
			}
		}).then((res)=>{
			if(res.status === 0){
				alert(res.messages);
			}else{
				this.props.router.push('/index');
			}
		})

	}

	render(){
		return (
			<div className="uk-container uk-container-center">
				<div className="uk-margin-large-top uk-container-center uk-width-1-3">
					<form className="uk-form">
						<div className="uk-form-row">
							<img className="uk-thumbnail uk-thumbnail-mini uk-align-center uk-border-circle" src="http://www.getuikit.net/docs/images/placeholder_200x200.svg" alt=""/>
						</div>
						<div className="uk-form-row uk-form-icon uk-width-1-1">
							<i className="uk-icon-calendar"></i>
							<input type="text" ref="username" placeholder="用户名" className="username uk-width-1-1 uk-form-large"/>
						</div>
						<div className="uk-form-row uk-form-icon uk-width-1-1">
							<i className="uk-icon-calendar"></i>
							<input type="password" ref="password" placeholder="密码" className="password uk-width-1-1 uk-form-large"/>
						</div>
						<div className="uk-form-row">
							<a href="javascript:void(0);" onClick={this.loginAction} id="login" className="uk-button uk-button-primary uk-button-large uk-width-1-1">登录</a>
						</div>
					</form>
				</div>
			</div>
		)
	}
}