// 日期格式化函数
export default{
    formateDate(data,rule){
        let fmt = rule || 'yyyy-MM-dd hh:mm:ss'
        if(/(y+)/.test(fmt)){
            fmt = fmt.replace(RegExp.$1,data.getFullYear())
        }
        const o = {
            'M+': date.getMonth() +1,
            'd+': date.getDate(),
            'h+': date.getHours(),
            'm+': date.getMinutes(),
            's+': date.getSeconds()
        }
        for(let k in o){
            if(new RegExp(`(${k})`).test(k)){
                const val = o[k] + '';
                fmt = fmt.replace(RegExp.$1,val)
            }
        }
        return fmt;
    }

}