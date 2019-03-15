//这是一个构造函数，用以初始化新创建的“范围对象”
//这里并没有创建并返回一个对象，仅仅是初始化

function Range(from,to){
    //存储新的范围对象起始位置和结束位置（状态）
    //这两个属性是不可继承的，每个对象都拥有唯一的属性
    this.from = from;
    this.to = to;
}

//所有的范围对象都继承自这个对象
//注意，属性的名字必需是'prototype'

Range.prototype = {
    //如果x在范围内，则返回true,否则返回false
    //这个方法可以比较数字范围，也可以比较字符串和日期范围
    includes:function(x){
        return this.from <=x && x<=this.to;
    },
    //对于范围内的每个整数都调用一次f
    //这个方法只可用做数字范围
    foreach:function(f){
        var toffrom = typeof this.from;
        var tofto = typeof this.to;
        if(toffrom!=="number" || tofto !=="number") throw TypeError();
        for(var x = Math.ceil(this.from);x<=this.to;x++) {
            f(x);
        };
    },
    //返回表示这个范围的字符串
    toString: function(){return "("+this.from+"..."+this.to+")"},
    constructor:Range//显示设置构造函数反向引用
}

//var r = new Range(1,3);
//console.log('The result of r.constructor is :',r.constructor);
//console.log('The result of r.includes(2) is: '+r.includes(2));
//console.log('The result of r.foreach(console.log) is: '+r.foreach(console.log));
//console.log('The result of console.log(r) is: ');
//console.log(r.toString())
//console.log('The result of r instanceof Range is: '+ r instanceof Range);

//9.5.4 鸭式辨型(Page 227)
var lowercase = new Range('a','z');

