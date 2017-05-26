import React,{PureComponent} from 'react';
export default class Pagination extends PureComponent{
	constructor(props) {
	  super(props);
	}
	render(){

		let pageRow = [];
		for(let i = 1;i<=this.props.totalPage;i++){
    		pageRow.push(<li key={Math.random()} onClick={()=>{this.props.pageChange(i)}} className={this.props.page == i && "uk-active"}><span>{i}</span></li>)
    	}
		return (
			<ul className="uk-pagination">
			    {pageRow}
			</ul>
		)
	}
}