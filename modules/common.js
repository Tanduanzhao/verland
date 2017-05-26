const moment = require('moment');
module.exports = {
    singleDateFormat:(obj)=>{
        // console.dir(obj[0]);
        obj = obj.toObject();
        obj.date = moment(obj.date).format('YYYY-MM-DD');
        return obj;
    },
    dateFormat(arr){
        let _n = [];
        arr.forEach((item)=>{
            // console.log(item,'item');
            item = this.singleDateFormat(item);
            _n.push(item)
        })
        return _n;
    }
}
