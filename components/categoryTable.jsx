import React,{PureComponent} from 'react';
const moment = require('moment');
import {Link} from 'react-router';
console.log();
export default class CategoryTable extends PureComponent{
	render(){
		return(
			<table className="uk-table uk-table-striped uk-table-hover">
				<thead>
			        <tr>
			            <th>分类名称</th>
			            <th>创建时间</th>
			            <th>所属分类</th>
			            <th></th>
			        </tr>
			    </thead>
		    	{
		    		this.props.dataSources.length === 0 ? null : <Main {...this.props} dataSources={this.props.dataSources}/>
		    	}
			</table>
		)
	}
}

class Main extends PureComponent{
	_delAction(id){
		this.props.delAction(id);
	}
	render(){
		return(
			<tbody>
				{
					this.props.dataSources.map((ele,index)=>{
		    			return (
		    				<tr key={ele._id}>
		    					<td>{ele.name}</td>
		    					<td>{moment(ele.date).format('YYYY/MM/DD')}</td>
		    					<td>{(ele.parentId && ele.parentId.name) || '首页'}</td>
		    					<td>
		    						<Link className="uk-button uk-button-mini" to={`/index/category/edit/${ele._id}`}><i className="uk-icon-edit"></i>修改</Link>
		    						<a className="uk-button uk-button-mini uk-margin-left uk-button-danger" href="javascript:void(0)" onClick={this._delAction.bind(this,ele._id)}><i className="uk-icon-trash"></i>删除</a>
		    					</td>
		    				</tr>
		    			)
		    		})
				}
			</tbody>
		)
	}
}