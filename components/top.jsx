import React,{PureComponent} from 'react';
import {Ajax} from './functions/ajax.js';
export default class Top extends PureComponent{
	_loginOut(){
		Ajax({
			url:'admin/loginOut'
		}).then((res)=>{
			this.props.router.replace('/login');
		})
	}
	render(){
		return(
			<div className="ui-layout-north uk-panel-box uk-text-middle uk-padding">
				<h2 className="uk-float-left uk-margin-remove">网站后台管理系统</h2>
				<span className="uk-float-right">当前登录用户为:{this.props.username}<button onClick={this._loginOut.bind(this)} className="uk-button uk-button-danger uk-margin-left"><i className="uk-icon-power-off uk-icon-justify"></i> 注销</button></span>
			</div>
		)
	}
}