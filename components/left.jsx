import React,{PureComponent} from 'react';
import {Link} from 'react-router';
export default class Left extends PureComponent{

	constructor(props) {
	  super(props);

	  this.state = {
	  	index:0,
	  	menus:[
		// 	{
	 //  		name:"文章管理",
	 //  		iconName:"file-text-o",
	 //  		path:"/index/post"
		//  	},
  // 		{
	 //  		name:"栏目管理",
	 //  		iconName:"book",
	 //  		path:"/index/category"
		//  	},
		{
			name:"客户管理",
			iconName:"credit-card",
			path:'/index/customer'
		},{
			name:"问答管理",
			iconName:"question",
			path:"/index/issue"
		},
	  	{
	  		name:"用户管理",
	  		iconName:"user",
	  		path:"/index/users"
	  	},{
	  		name:"网站设置",
	  		iconName:'cog',
	  		path:"/index/setting"
	  	}
		// {
	 //  		name:"幻灯片",
	 //  		iconName:'image',
	 //  		path:'/index/slider'
		//  	},
		]
	  }
	}

	changeTab(_index){
		this.setState({
			index:_index
		})
	}


	render(){
		return(
			<div className="ui-layout-west">
				<div className="uk-nav uk-nav-side">
					{
						this.state.menus.map((ele,index)=>{
							return	<Link activeClassName="uk-active" key={Math.random()} to={ele.path}><i className={`uk-icon-${ele.iconName} uk-icon-justify`}></i> {ele.name}</Link>
						})
					}
				</div>
			</div>
		)
	}
}
