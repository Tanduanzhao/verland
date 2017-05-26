import React,{PureComponent} from 'react';
import {Link} from 'react-router';
const moment = require('moment');
import {Ajax} from './functions/ajax.js';
export default class PostTable extends PureComponent{
	render(){
		return(
			<table className="uk-table uk-table-striped uk-table-hover">
				<thead>
			        <tr>
			            <th>文章标题</th>
			            <th>发布用户</th>
			            <th>发布时间</th>
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
		    					<td><Link to={`/index/post/edit/${ele._id}`}>{ele.title}</Link></td>
		    					<td>{ele.publishUser}</td>
		    					<td>{moment(ele.publishDate).format('YYYY-MM-DD HH:mm:ss')}</td>
		    					<td>{(ele.typeId && ele.typeId.name) || '未分类' }</td>
		    					<td>
		    						<Link className="uk-button uk-button-mini" to={`/index/post/edit/${ele._id}`}><i className="uk-icon-edit"></i>编辑</Link> 
		    						<a href="javascript:void(0)" className="uk-button uk-button-mini uk-margin-left uk-button-danger" onClick={this._delAction.bind(this,ele._id)}><i className="uk-icon-trash">删除</i></a>
		    					</td>
		    				</tr>
		    			)
		    		})
				}
			</tbody>
		)
	}
}