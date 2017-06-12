import React from 'react';
import {Ajax} from './functions/ajax.js';
import {Link} from 'react-router';
import Pagination from './pagination.jsx';
export default class Customer extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            datas:[],
            page:{
                pageNo:1
            }
        }
    }

    _loadDatas(){
        Ajax({
            url:`/admin/customer?page=${this.state.page.pageNo}`,
            method:'GET'
        }).then((res)=>{
            if(res.status === 1){
              console.log(res.datas);
                this.setState({
                    datas : res.datas,
                    page : res.page
                })
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
        this._loadDatas();
    }
    render(){
        return(
            <div>
                <div>
                    <Link className="uk-button" to={`/index/customer/add`}>录入用户</Link>
                </div>
                <List datas = {this.state.datas}/>
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
                        <th>客户编号</th>
                        <th>客户姓名</th>
                        <th>付款状态</th>
                        <th>检验状态</th>
                        <th>注册日期</th>
                        <th>操作</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        this.props.datas.map((item)=>{
                            return (<tr key={item._id}>
                                        <td>{item.cradID}</td>
                                        <td>{item.name}</td>
                                        <td>{(function(){
                                            switch (item.payStatu) {
                                                case 0: return '未支付';
                                                case 1: return '已支付';
                                            }
                                        })()}</td>
                                        <td>
                                          {(function(){
                                            switch (item.checkStatu) {
                                              case 0: return '未开始';
                                              case 1: return '未送检';
                                              case 2: return '送检中';
                                              case 3: return '样本检验中';
                                              case 4: return '报告已送出';
                                            }
                                          })()}
                                        </td>
                                        <td>{item.date}</td>
                                        <td><Link className="uk-button uk-button-mini" to={`/index/customer/${item._id}`}><i className="uk-icon-edit"></i></Link></td>
                                    </tr>)
                        })
                    }
                </tbody>
            </table>
        )
    }
}
