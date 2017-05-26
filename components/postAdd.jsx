import React,{Component} from 'react';
import Link from 'react-router';
import {Ajax} from './functions/ajax.js';
export default class PostAdd extends Component{
	constructor(props) {
	  super(props);
	
	  this.state = {
	  	id:'edit',
	  	imgUrl:null,
	  	ue:null,
	  	categorys:[],
	  	title:'',
	  	typeId:0,
	  	keywords:''
	  };
	  this._getSinglePost = this._getSinglePost.bind(this);
	  this._titleOnchange = this._titleOnchange.bind(this);
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
	backAction(){
		this.props.router.goBack();
	}
	addAction(){
		const post = Ajax({
			url:'/admin/post',
			method:'PUT',
			datas:{
				title:this.state.title,
				content:this.state.ue.getContent(),
				typeId:this.refs.parent.value,
				imgUrl:this.state.imgUrl,
				keywords:this.state.keywords
			}
		}).then((res)=>{
			if(res.status === 0){
				alert(res.message);
			}else{
				alert(res.message);
				this.backAction();
			}
		})
	}
	updateAction(){
		Ajax({
			url:`admin/post/${this.props.params.id}`,
			method:'POST',
			datas:{
				title:this.state.title,
				content:this.state.ue.getContent(),
				typeId:this.refs.parent.value,
				imgUrl:this.state.imgUrl,
				keywords:this.state.keywords
			}
		}).then((res)=>{
			if(!!res.status){
				alert(res.message);
				this.backAction();
			}else{
				alert(res.message);
			}
		})
	}
	_titleOnchange(event){
		this.setState({
			title:event.target.value
		})
	}
	_typeIdOnchange(){
		this.setState({
			typeId:this.refs.parent.value
		})
	}

	_setContent(content){
		return ()=>{
			this.state.ue.setContent(content)
		}
	}
	_keywordsOnchange(){
		this.setState({
			keywords:this.refs.keywords.value
		})
	}
	//请求问固定ID文章
	_getSinglePost(){
		Ajax({
			url:`/admin/post/${this.props.params.id}`,
			method:'GET'
		}).then((res)=>{
			if(!!res.status){
				this.setState({
					title:res.datas.title,
					imgUrl:res.datas.imgUrl,
					keywords:res.datas.keywords
				});
				if(!!res.datas.typeId){
					this.setState({
						typeId:res.datas.typeId._id
					})
				}
				this.state.ue.addListener('ready',this._setContent(res.datas.content))
				// var value = prompt(res.datas.content, '');
				// this.state.ue.body.innerHTML=res.datas.content;
				// console.log(this.state.ue.getContent());
				// ue.setContent(res.datas.content);
				// console.dir(this.state.ue)
			}else{
				alert(res.message);
			}
		})
	}

	componentDidMount() {
		this.state.ue = UE.getEditor(this.state.id)
		this.getAllCategory();
		if(this.props.params.id){
			this._getSinglePost();
		};
		this.state.ue.addListener('beforeInsertImage',(t,arg)=>{
			this.setState({
				imgUrl:arg[0].src
			})
		});
	}
	_openImgUpdialog(){
		let d = this.state.ue.getDialog("insertimage");
		d.render();
		d.open();
	}
	componentWillUnmount() {
		this.state.ue.destroy();
		this.setState({
			ue:null
		})
	}
	render(){
		return(
			<div>
				<form className="uk-form uk-form-stacked">
					<div className="uk-form-row">
						<label className="uk-form-label">标题</label>
						<input ref="title" onChange={this._titleOnchange.bind(this)} value={this.state.title} className="uk-form-input uk-form-width-large" type="text"/>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">关键字<small className="uk-margin-left">(多关键字请用|分开)</small></label>
						<input ref="keywords" onChange={this._keywordsOnchange.bind(this)} value={this.state.keywords} className="uk-form-input uk-form-width-large" type="text"/>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">缩略图</label>
						<button type="button" className="uk-button" onClick={this._openImgUpdialog.bind(this)}>上传图片</button>
						{
							this.state.imgUrl && <img src={this.state.imgUrl} className="uk-margin-left uk-thumbnail"/>
						}
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">文章内容</label>
						<script id={this.state.id} style={{width:'100%',height:'200px'}}></script>
					</div>
					<div className="uk-form-row">
						<label className="uk-form-label">所属分类</label>
						<select ref="parent" value={this.state.typeId} onChange = {this._typeIdOnchange.bind(this)}>
							<option value="0">未分类</option>
							{
								this.state.categorys.map((ele)=>{
									return <option value={ele._id} key={ele._id}>{ele.name}</option>
								})
							}
						</select>
					</div>
					<div className="uk-form-row">
						{
							this.props.params.id ? <a className="uk-button uk-button-primary" onClick={this.updateAction.bind(this)} href="javascript:void(0);">更新</a> : <a className="uk-button uk-button-primary" onClick={this.addAction.bind(this)} href="javascript:void(0);">提交</a>
						}
						<a href="javascript:void(0);" className="uk-button uk-margin-left" onClick={this.backAction.bind(this)}>返回</a>
					</div>
				</form>
			</div>
		)
	}
}