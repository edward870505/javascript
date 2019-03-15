//如果o实现了除第一个参数之外的参数所表示的方法，则返回true
function quacks(o /*, ...*/){
    for(var i = 1; i<arguments.length; i++){
        var arg = arguments[i];
        switch(typeof arg){//如果参数是：
            case 'string'://string:直接用名字做检查
               if(typeof o[arg] !== 'function') return false;
               continue;
            case 'function': //function: 检查函数的原型对象上的方法
                //如果实参是函数，则使用它的原型
                arg = arg.prototype //进入下一个case
            case 'object'://object:检查匹配的方法
                for(var m in arg){//遍历对象的每个属性
                    if(typeof arg[m] !== 'function') continue;//跳过不是方法的属性
                    if(typeof o[m]!== 'function') return false;
                }      

        }
    }
    
    //如果程序能执行到这里，说明o实现了所有的方法
    return true;


}