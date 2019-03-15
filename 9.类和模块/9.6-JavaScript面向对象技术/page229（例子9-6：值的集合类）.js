function Set(){ //这是一个构造函数
this.values = {};//集合数据保存在对象的属性里
    this.n = 0;//集合中值的个数
    this.add.apply(this, arguments);//把所有参数都添加进这个集合
}

//将每个参数都添加至集合中
Set.prototype.add = function(){
    for(var i=0; i<arguments.length;i++){//遍历每个参数
        var val = arguments[i];//待添加到集合中的值
        var str = Set._v2s(val);//把它转换为字符砖
        if(!this.values.hasOwnProperty(str)){//如果不在集合中
            this.values[str] = val;//将字符串和值对应起来
            this.n++;//集合中值的计数加一
        }
    }
}

//如果集合中包含这个值，则返回true,否则返回false
Set.prototype.contains = function(value){
    return this.values.hasOwnProperty(Set._v2s(value));
};

//返回集合的大小
Set.prototype.size = function(){
    return this.n;
}

//遍历集合中的所有元素，在指定的上下文中调用f

Set.prototype.foreach = function(f,context){
    for(var s in this.values){//遍历集合中的所有字符串
        if(this.values.hasOwnProperty(s))//忽略继承的属性
        f.call(context, this.values[s]);
    }
};

//这是一个内部函数，用以将任意JavaScript值和唯一的字符串对应起来
Set._v2s = function(val){
    switch(val){
        case undefined : return 'u'; //特殊的原始值
        case null : return 'n'; //值只有一个字母
        case true : return 't';// 代码
        default:switch(typeof val){
            case 'number' : return '#' + val;//数字都带有#前缀
            case 'string' : return '"'+val;//字符串都带有"前缀
                default:return '@'+objectId(val);//对象和函数有@前缀
        }
    }

    function objectId(o){
        var prop = "|**objectid**|";
        if(!o.hasOwnProperty(prop))
            o[prop] = Set._v2s.next++;
        return o[prop];
    }
}

Set._v2s.next = 100; //设置初始id的值

var s = new Set();
s.add(1,'abc',{x:1});
console.log(s);

