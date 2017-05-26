import React,{PureComponent} from 'react';
import {Link} from 'react-router';
import {Ajax} from './functions/ajax.js';
import CategoryTable from './categoryTable.jsx';
export default class CategoryList extends PureComponent{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	dataSources:[]
	  };
	}
	_delAction(id){
		Ajax({
			url:`admin/category/${id}`,
			method:'DELETE'
		}).then((res)=>{
			if(!res.status){
				alert(res.message);
			}else{
				alert(res.message);
				this._loadCategoryList();
			}
		})
	}
	_loadCategoryList(){
		Ajax({
			url:'/admin/category',
			method:'GET'
		}).then((res)=>{
			if(res.status == 0){
				alert(res.message);
			}else{
				this.setState({
					dataSources:res.datas
				});
			}
		})
	}
	componentDidMount() {
		this._loadCategoryList();
	}
	render(){
		return(
			<div>
				<Link className="uk-button uk-button-primary" to="/index/category/add">新增分类</Link>
				<CategoryTable delAction={this._delAction.bind(this)} dataSources={this.state.dataSources}/>
			</div>
		)
	}
}