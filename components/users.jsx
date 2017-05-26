import React,{PureComponent} from 'react';
import {Link} from 'react-router';
import {Ajax} from './functions/ajax.js';
import Pagination from './pagination.jsx';
const moment = require('moment');
export default class Users extends PureComponent{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	dataSources:[],
	  	page:1,
	  	totalPage:1
	  };
	}
	_loadUserList(){
		Ajax({
			url:`admin/users?page=${this.state.page}`,
			method:'GET'
		}).then((res)=>{
			this.setState({
				dataSources:res.datas,
				page:res.page,
				totalPage:res.totalPage
			});
		})
	}
	_pageChange(num){
		this.setState({
			page:num
		},()=>{
			this._loadUserList()
		})
	}
	componentDidMount(){
		this._loadUserList();
	}
	render(){
		return(
			<div>
				<Link className="uk-button" to="/index/users/add">添加用户</Link>
				<UsersTable dataSources={this.state.dataSources}/>
				<Pagination pageChange={this._pageChange.bind(this)} totalPage={this.state.totalPage} page={this.state.page}/>
			</div>
		)
	}
}




class UsersTable extends PureComponent{
	render(){
		return(
			<table className="uk-table">
				<thead>
					<tr>
						<th>帐号</th>
						<th>注册时间</th>
						<th>最近登录时间</th>
						<th>登录地点</th>
						<th>邮箱</th>
						<th></th>
					</tr>
				</thead>
				<tbody>
					{
						this.props.dataSources.map((ele)=>{
							return(
								<tr key={ele._id}>
									<td>{ele.username}</td>
									<td>{moment(ele.loginDate).format('YYYY-MM-DD')}</td>
									<td>{ele.lastDate && moment(ele.lastDate).format('YYYY-MM-DD HH:m:s')}</td>
									<td>{(ele.ip && ele.ip.substr(0,7) == '::ffff:') ? ele.ip.substr(7) : ele.ip}</td>
									<td>{ele.email}</td>
									<td><Link className="uk-button uk-button-mini" to={`/index/users/edit/${ele._id}`}><i className="uk-icon-edit"></i>修改</Link></td>
								</tr>
							)
						})
					}
				</tbody>
			</table>
		)
	}
}