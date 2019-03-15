//inherit()返回了一个继承自原型对象p的属性的新对象
//这列使用ES5中的Object.create()函数（如果存在的话）
function inherit(p){
    if( p==null ) throw TypeError();//p是一个对象，但不能是null
    if(Object.create)               //如果Object.create()存在
        return Object.create(p);    //直接使用它
    var t = typeof p;               //否则进一步检测
    if( t!=="object" && t!=="function") throw TypeError();
    function f(){};                 //定义一个构造函数
    f.prototype = p;                //
    return new f();
}



//使用工厂方法返回一个新的“范围对象”
function range(from,to){
    //使用inherit()函数来创建对象，这个对象继承自在下面定义的原型对象
    //原型对象作为函数的一个属性存储，并定义所有“范围对象”所共享的方法（行为）
    var r = inherit(range.methods);

    //存储新的范围对象起始位置和结束位置（状态）
    //这两个属性是不可继承的，每个对象都拥有唯一的属性
    r.from = from;
    r.to = to;

    //返回这个新创建的对象
    return r;
}

range.methods = {
    //如果x在范围内，则返回true,否则返回false
    //这个方法可以比较数字范围，也可以比较字符串和日期范围
    includes:function(x){
        return this.from <=x && x<=this.to;
    },
    //对于范围内的每个整数都调用一次f
    //这个方法只可用做数字范围
    foreach:function(f){
        for(var x = Math.ceil(this.from);x<=this.to;x++) {
            console.log(x);
            f(x);
        };
    },
    //返回表示这个范围的字符串
    toString: function(){return "("+this.from+"..."+this.to+")"}
}

var r = range(1,3);


//console.log('The result of r.includes(2) is: '+r.includes(2));
//console.log('The result of r.foreach(console.log) is: '+r.foreach(console.log));
//console.log('The result of console.log(r) is: ');
//console.log(r.toString())

//9.5.1 类和类型
//console.log('The result of Range.methods.isPrototypeOf(r): ',range.methods.isPrototypeOf(r));

//console.log('The result of r.includes(2) is: '+r.includes(2));
//console.log('The result of r.foreach(console.log) is: '+r.foreach(console.log));
//console.log('The result of console.log(r) is: ');
//console.log(r.toString())

//9.5.1 类和类型

//console.log('The result of Range.methods.isPrototypeOf(r): ',range.methods.isPrototypeOf(r));

