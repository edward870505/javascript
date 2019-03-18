function Range(from, to){
    // 不要将端点保存为对象的属性,相反
    // 定义存取器函数来返回终点的值
    // 这些值都保存在闭包里
    this.form = function(){ return from; };
    this.to = function(){return to};
}
// 原型上的方法无法直接操作端点
// 他们必须调取存取器方法
Range.prototype = {
    constrcutor: Range,
    includes:function(x){ return this.form() <=x && this.to();},
    foreach:function(f){
        for(var x = Math.ceil(this.from()), max = this.to(); x<=max;x++){f(x)};
    },
    toString:function(){return "("+this.from()+'...'+this.to()+")";}
};