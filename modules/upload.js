var formidable  = require('formidable');
var form = new formidable.IncomingForm();
form.encoding = 'utf-8';
form.keepExtensions = true;
form.maxFieldsSize = 2 * 1024 * 1024;
form.maxFields = 1000;
form.hash = false;
form.multiples = false;
form.uploadDir = "./public/uploads/img/";
module.exports = function(req){
    return new Promise(function(resolve,reject){
    		form.parse(req,function(err,fields,files){
		        console.log(files.upload.path);
		        if(!err){
	        		resolve(files)
	        	}else{
	        		reject(err);
	        	}
		    });
        	
        })
    
}