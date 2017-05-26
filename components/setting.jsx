import React,{PureComponent} from 'react';
import {Ajax} from './functions/ajax.js';
export default class Setting extends PureComponent{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	webSite:'',
	  	keywords:'',
	  	discription:''
	  };
	}


	_loadDate(){
		Ajax({
			url:'admin/setting',
			method:'GET'
		}).then((res)=>{
			if(!!res.datas){
				this.setState({
					webSite:res.datas.webSite,
					keywords:res.datas.keywords || '',
					discription:res.datas.discription || ''
				})
			}
		})
	}


	_webSiteChange(){
		this.setState({
			webSite:this.refs.webSite.value
		})
	}
	_keywordsChange(){
		this.setState({
			keywords:this.refs.keywords.value
		})
	}

	_discriptionChange(){
		this.setState({
			discription:this.refs.discription.value
		})
	}

	_updateDate(){
		Ajax({
			url:'admin/setting',
			method:'PUT',
			datas:{
				webSite:this.state.webSite,
				keywords:this.state.keywords,
				discription:this.state.discription
			}
		}).then((res)=>{
			if(res.status){
				UIkit.notify(res.message,{pos:'bottom-right',status:'success'});
			}
		})
	}

	componentWillMount() {
		this._loadDate()
	}

	render(){
		return(
			<div>
				<form className="uk-form uk-form-stacked">
					<div className="uk-form-row">
						<label className="uk-form-label">网站网址</label>
						<input ref="webSite" value={this.state.webSite} onChange={this._webSiteChange.bind(this)} className="uk-form-input uk-form-width-large" type="text"/>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">网站关键字</label>
						<input ref="keywords" value={this.state.keywords} onChange={this._keywordsChange.bind(this)} className="uk-form-input uk-form-width-large" type="text"/>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">网站描述</label>
						<textArea ref="discription" rows={5} className="uk-form-width-large" value={this.state.discription} onChange={this._discriptionChange.bind(this)}></textArea>
					</div>
					<div className="uk-form-row">
						<button className="uk-button uk-button-primary" onClick={this._updateDate.bind(this)}>更新</button>
					</div>
				</form>
			</div>
		)
	}
}