function Range(from, to){
    // 不要将端点保存为对象的属性,相反
    // 定义存取器函数来返回终点的值
    // 这些值都保存在闭包里
    this.form = function(){ return from; };
    this.to = function(){return to};
}
// 原型上的方法无法直接操作端点
// 他们必须调取存取器方法
// page255
Range.prototype = {
    constrcutor: Range,
    includes:function(x){ return this.form() <=x && this.to();},
    foreach:function(f){
        for(var x = Math.ceil(this.from()), max = this.to(); x<=max;x++){f(x)};
    },
    toString:function(){return "("+this.from()+'...'+this.to()+")";}
};


// 例9-18：创建一个不可变的类，它的属性和方法都是只读的
function Range(from, to){
    // 这些事对from和to只读属性的描述符
    var props = {
        from:{value:from,enumerable:true,writable:false,configuarable:false},
        to:{value:to,enumerable:true,writable:false,configuarable:false}
    };

    if(this instanceof Range)//如果作为构造函数来调用
        Object.defineProperties(this,props);//定义属性
    else //否则作为工厂方法调用
        return Object.create(Range.prototype,props)//属性由props指定

}

// 如果用同样的方法给Range.prototype对象添加属性
// 那么我们需要给这些属性设置他们的特性
// 因为我们无法识别出他们的可枚举性、可写性或可配置性，这些属性特性默认都是false
Object.defineProperties(Range.prototype,{
    includes:{
        value:function(x){ return this.from <=x && x<=this.to;}
    },
    foreach:function(f){
        for(var x = Math.ceil(this.from);x<=this.to;x++) f(x);
    },
    toString:function(){
        return "("+this.from + "..."+this.to+")";
    }
});

// 例9-19：属性描述工具函数
// 将o的指定名字（或所有）的属性设置为不可写的和不可配置的
function freezeProps(o){
    var props = (arguments.length == 1) //如果只有一个参数
        ? Object.getOwnPropertyNames(o)//使用所有的属性
        : Array.prototype.splice.call(arguments,1);//否则传入了指定名字的属性
    props.forEach(function(n){ //将他们都设置为只读的和不可变的
        // 忽略不可配置的属性
        if(!Object.getOwnPropertyDescriptor(o,n).configurable) return;
        Object.defineProperty(o,n,{writable:false,configurable:false});
    });
    return o; //所以我们可以继续使用它   
}

// 将o指定名字（或所有）的属性设置为不可枚举的和可配置的
function hideProps(o){
    var props = (arguments.length ==1)
        ? Object.getOwnPropertyNames(o)
        : Array.prototype.splice.call(arguments,1);
    props.forEach(function(n){
        if(!Object.getOwnPropertyDescriptor(o,n).configurable) return;
        Object.defineProperty(o,n,{enumerable:false});
    });
    return o;
}

// 例9-20：一个简单的不可变的类
function Range(from, to){//不可变的类Range的构造函数
    this.from = from;
    this.to = to;
    freezeProps(this);//将属性设置为不可变的
}

Range.prototype = hideProps({
    constrcutor = Range,
    includes:function(x){return this.from <=x && x<=this.to;},
    foreach:function(f){for(var x=Math.ceil(this.from);x<=this.to;x++) f(x);},
    toString:function(){return "("+this.from+"..."+this.to+")"}
});

// 例9-21：将Range类的端点严格封装起来
// 这个版本的Range类是可变的，但将端点变量进行了良好的封装
// 但端点的大小顺序还是固定的:from <= to
function Range(from,to){
    if(from>to) throw new Error("Range: from must be <= to");
    // 定义存取器方法以维持不变
    function getFrom() {
        return from;
    }

    function getTo() {
        return to;
    }

    function setFrom(f){
        if(f<=to) from = f;//设置from的值时，不允许from大于to
        else throw new Error("Range: to must be >= from");
    }

    function setTo(){
        if(t>=from) to = t;//设置to值的时候，不允许to小于from
        else throw Error("Range:to must be >= from");
    }

    //将使用取值其的属性设置为可枚举的，不可配置的
    Object.defineProperties(this,{
        from:{get:getFrom, set:setFrom,enumerable:true,configurable:true},
        to:{get:getTo,set:setTo,enumerable:true,configurable:true}
    });
}




