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
        for(var x = Math.ceil(this.from);x<=this.to;x++) {
            f(x);
        };
    },
    //返回表示这个范围的字符串
    toString: function(){return "("+this.from+"..."+this.to+")"},
    constructor:Range//显示设置构造函数反向引用
}

// 重写Range类的constructor属性
Range.prototype.constructor = Range;

Range.prototype.equals = function(that){
    if(that == null) return false //处理null和undefined
    if(that.constructor !== Range) return false //处理非Range对象
    // 当且仅当两个端点相等，才返回true
    return this.from == that.from && this.to == that.to;
}

// Page237 Range类compareTo方法
// Range.prototype.compareTo = function(that){
    // return this.from - that.from
// }

// page238 Range类compareTo方法（改良版）
// 根据下边界来对Range对象排序，如果下边界相等则比较上边界
// 如果传入非Range值，则抛出异常
// 当且仅当this.equals(that)时才返回true

Range.prototype.compareTo = function(that){
    if(!(that instanceof Range))
        throw new Error("Cant't compare a Range with" + that);
    var diff = this.from - that.from; //比较下边界
    if(diff == 0) diff = this.to - that.to;//如果相等，比较上边界
    return;    
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

// page238 对Range对象组成的数组进行排序
// ranges.sort(function(a,b){ return a.compareTo(b); });

