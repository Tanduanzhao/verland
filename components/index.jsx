import React,{PureComponent} from 'react';
import Top from './top.jsx';
import Left from './left.jsx';
import {Ajax} from './functions/ajax.js';
export default class Index extends PureComponent{
	constructor(props) {
	  super(props);

	  this.state = {
	  	username:null
	  };
	}
	componentWillMount() {
		Ajax({
			url:'/admin/userInfo',
			method:'GET',
		}).then((res)=>{
			if(res.status == 0){
				this.props.router.push('/login');
			}else{
				this.setState({
					username:res.username
				})
			}
		})
	}
	render(){
		return (
			<div className="ui-layout">
				<Top router={this.props.router} username={this.state.username}/>
				<Left/>
				<div className="ui-layout-center">{this.props.children}</div>
			</div>
		)
	}
}
