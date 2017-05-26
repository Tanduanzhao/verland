import React,{PureComponent} from 'react';
import PostTable from './postTable.jsx';
import {Ajax} from './functions/ajax.js';
import {Link} from 'react-router';
import Pagination from './pagination.jsx';
export default class PostList extends PureComponent{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	dataSources:[],
	  	page:1
	  };
	}
	_delAction(id){
		Ajax({
			url:`admin/post/${id}`,
			method:'DELETE'
		}).then((res)=>{
			if(!res.status){
				UIkit.notify(res.message,{pos:'bottom-right',status:'danger'});
			}else{
				UIkit.notify(res.message,{pos:'bottom-right',status:'success'});
				this._loadPostList();
			}
		})
	}
	_pageChange(num){
		this.setState({
			page:num
		},()=>{
			this._loadPostList();
		});
	}
	_loadPostList(){
		Ajax({
			url:'admin/post?page=' + this.state.page,
			method:'GET'
		}).then((res)=>{
			this.setState({
				dataSources:res.datas,
				totalPage:res.totalPage,
				page:res.page
			});
		})
	}
	componentDidMount() {
		this._loadPostList();
	}

	render(){
		return(
			<div>
				<Link className="uk-button uk-button-primary" to="/index/post/add">添加文章</Link>
				<PostTable delAction={this._delAction.bind(this)} dataSources={this.state.dataSources}/>
				{
					this.state.totalPage && <Pagination pageChange={this._pageChange.bind(this)} totalPage={this.state.totalPage} page={this.state.page}/>
				}
			</div>
		)
	}
}