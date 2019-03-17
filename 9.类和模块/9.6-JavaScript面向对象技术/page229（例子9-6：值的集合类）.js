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

Set.prototype.equals = function(that){
    // 一些次要情况的快捷处理
    if(this === that ) return true;
    // 如果that对象不是一个集合，它和this不相等
    // 我们用到了instanceof,使得这个方法可以用于Set的任何子类
    // 如果希望采用鸭式辩型的方法，可以降低检查的严格程度
    // 或者可以通过this.constructor == that.constructor来加强检查的严格程度
    // 注意，null和undefined两个值是无法用于instanceof运算的
    if(!(that instanceof Set)) return false;

    // 如果两个集合的大小不一样，则它们不相等
    if(this.size()!=that.size()) return false;

    // 现在检查两个集合中的元素是否完全一样
    // 如果两个集合不相等，则通过抛出异常来终止foreach循环
    try{
        this.foreach(function(v){ if (!that.contains(v)) throw false; });
        return true;//所有元素都匹配；两个集合相等
    }catch(x){
        if(x===false) return false;// 如果集合中有元素在另外一个集合中不存在
        throw x;// 重新抛出异常
    }

    
}

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

//例6-2中的extend（）函数

/*
 * 把p中的可枚举属性复制到o中，并返回o
 * 如果o和p中含有同名属性，则覆盖o中的属性
 * 这个函数并不处理getter和setter以及复制属性
*/
function extend(o,p){

    for(prop in p){
        o[prop] = p[prop];
    }
    return o;
}


extend(Set.prototype,{
    // 将集合转换为字符串
    toString:function(v){
        var s = "{";
        i = 0;
        this.foreach(function(v){s+=((i++>0?",":""))+v});
        return s + "}";
    },
    // 类似toString,但是对于所有的值都将调用toLocaleString
    toLocaleString: function(){
        var s = "{";
        i = 0;
        this.foreach(function(v){
            if (i++>0) s +=',';
            if(v==null) s+=v;
            else s+= v.toLocaleString();
        });
        return s+"}";
    },
    // 将集合转换为数组
    toArray:function(){
        var a = [];
        this.foreach(function(v){a.push(v)});
        return a;
    }   
});

// 对于要从JSON转换为字符串的集合被当做数组对待
Set.prototype.toJSON = Set.prototype.toArray

var s = new Set();
s.add(1,'abc',{x:1});
console.log(s);
