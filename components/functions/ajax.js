export function Ajax(obj){
	let body,headers;
	if(obj.type == 'file'){
		body = obj.body,
		headers={
		}
	}else{
		body = JSON.stringify(obj.datas);
		headers = {
			'Accept':'application/json',
			'Content-Type':'application/json'
		}
	}
	return fetch(obj.url,{
		method:obj.method || 'POST',
		credentials: "include",
		body:body,
		headers:headers
	}).then((res)=>{
		return res.json();
	}).then((res)=>{
		let status = 'success';
		if(!res.status){
			status = 'danger';
		}
		if(!res.status){
			UIkit.notify(res.message,{pos:'bottom-right',status:status});
		}
		return new Promise((resolve,reject)=>{

			resolve(res);
		})
	})
}
