import React,{PureComponent} from 'react';
import {Ajax} from './functions/ajax.js';
export default class CategoryAdd extends PureComponent{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	ue:null,
	  	imgUrl:null,
	  	categorys:[],
	  	parent:0,
	  	name:''
	  };
	  this.getAllCategory = this.getAllCategory.bind(this);
	}

	getAllCategory(){
		Ajax({
			url:'/admin/category',
			method:'GET'
		}).then((res)=>{
			if(res.status == 0){
				alert(res.message);
			}else{
				this.setState({
					categorys:res.datas
				});
			}
		})
	}

	getSingleCategory(){
		Ajax({
			url:`admin/category/${this.props.params.id}`,
			method:'GET'
		}).then((res)=>{
			if(!!res.status){
				this.setState({
					name:res.datas.name,
					discription:res.datas.discription,
					parent:res.parentId && res.parentId._id,
					imgUrl:res.datas.imgUrl
				});
			}else{
				alert(res.message);
			}
		})
	}

	backAction(){
		this.props.router.goBack();
	}
	addAction(){
		const post = Ajax({
			url:'/admin/category',
			method:'PUT',
			datas:{
				title:this.state.name,
				discription:this.state.discription,
				parentId:this.state.parent,
				imgUrl:this.state.imgUrl
			}
		}).then((res)=>{
			if(res.status === 0){
			}else{
				this.backAction();
			}
		})
	}
	updateAction(){
		Ajax({
			url:`admin/category/${this.props.params.id}`,
			method:'post',
			datas:{
				title:this.state.name,
				discription:this.state.discription,
				parentId:this.state.parent,
				imgUrl:this.state.imgUrl
			}
		}).then((res)=>{
			if(!!res.status){
				this.backAction();
			}
		})
	}
	componentWillMount() {
		if(!!this.props.params.id){
			this.getSingleCategory();
		};
		this.getAllCategory();
	}
	componentDidMount() {
		//实例化编辑器
		this.state.ue = UE.getEditor('file');
		this.state.ue.ready(()=>{
			console.log('ready');
			this.state.ue.hide();
		})
		this.state.ue.addListener('beforeInsertImage',(t,arg)=>{
			console.log(arg[0],'上传的图片结果');
			this.setState({
				imgUrl:arg[0].src
			})
		})
	}
	_parentChange(){
		this.setState({
			parent:this.refs.parent.value
		})
	}
	componentWillUnmount() {
		this.state.ue.destroy();
		this.setState({
			ue:null
		})
	}
	_titleChange(){
		this.setState({
			name:this.refs.name.value
		})
	}
	_discriptionChange(){
		this.setState({
			discription:this.refs.discription.value
		})
	}
	_fileChange(){
		let n = this.state.ue.getDialog("insertimage");
		n.render();
		n.open();
	}

	render(){
		return(
			<div>
				<form className="uk-form uk-form-stacked">
					<div className="uk-form-row">
						<label className="uk-form-label">分类名称</label>
						<input ref="name" value={this.state.name} onChange={this._titleChange.bind(this)} className="uk-form-input uk-form-width-large" type="text"/>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">分类描述</label>
						<textArea ref="discription" rows={5} value={this.state.discription} onChange={this._discriptionChange.bind(this)} className="uk-form-width-large"></textArea>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">分类缩略图</label>
						<div className="uk-form-file">
						    <button type="button" className="uk-button" onClick={this._fileChange.bind(this)}>上传图片</button>
						    <textArea className="uk-hidden" id="file"></textArea>
						    {
						    	this.state.imgUrl && <img className="uk-thumbnail uk-margin-left" src={this.state.imgUrl} width="200"/>
						    }
						</div>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">所属分类</label>
						<select ref="parent" value={this.state.parent} onChange={this._parentChange.bind(this)}>
							<option value="0">首页</option>
							{
								this.state.categorys.map((ele)=>{
									return <option key={ele._id} value={ele._id}>{ele.name}</option>
								})
							}
						</select>
					</div>
					<div className="uk-form-row">
						{
							this.props.params.id ? <button className="uk-button uk-button-primary" onClick={this.updateAction.bind(this)} href="javascript:void(0);">更新</button> : <button className="uk-button uk-button-primary" onClick={this.addAction.bind(this)} href="javascript:void(0);">提交</button>
						}
						<button className="uk-button uk-margin-left" onClick={this.backAction.bind(this)}>返回</button>
					</div>
				</form>
			</div>
		)
	}
}