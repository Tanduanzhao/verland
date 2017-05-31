import React from 'react';
import {Ajax} from './functions/ajax.js';
import {Link} from 'react-router';
import Pagination from './pagination.jsx';
export default class IssueList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            datas:[],
            page:{
                pageNo:1
            }
        };
    }

    _loadDatas(){
        Ajax({
            url:`/admin/issue?page=${this.state.page.pageNo}`,
            method:'GET'
        }).then((res)=>{
            if(res.status === 1){
                this.setState({
                    datas:res.datas,
                    page:res.page
                })
            }else{
                alert(res.message);
            }
        })
    }
    _pageChange(num){
        let _p = this.state.page;
        _p.pageNo = num;
        this.setState({
			page:_p
		},()=>{
			this._loadDatas();
		});
    }
    componentDidMount(){
        this._loadDatas()
    }

    render(){
        return(
            <div>
                <Link to={'/index/issue/add'} className="uk-button uk-button-primary">添加问题</Link>
                <List datas={this.state.datas}/>
                {this.state.page.pageNo <=this.state.page.totalPage ? <Pagination pageChange={this._pageChange.bind(this)} totalPage={this.state.page.totalPage} page={this.state.page.pageNo}/> : null}
            </div>
        )
    }
}


class List extends React.Component{
    render(){
        return(
            <table className="uk-table uk-table-striped uk-table-hover">
                <thead>
                    <tr>
                        <th>标题</th>
                        <th>时间</th>
                        <th>状态</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.datas.map((item)=>{
                            return(
                                <tr key={item._id}>
                                    <td><Link to={`/index/issue/${item._id}`}>{item.title}</Link></td>
                                    <td>{item.date}</td>
                                    <td>{item.statu === 1 ? '显示' : '隐藏'}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        )
    }
}
