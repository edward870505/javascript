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

//定义一个扩展函数，用来将第二个以及后续参数复制到第一个参数
//这里我们处理了IE bug:在多数IE版本中
//如果o拥有一个不可枚举的同名属性，则for/in循环
//不会枚举对象o的可枚举属性，也就是说，将不会正确处理诸如toString属性
//除非我们显式检测它
var Extend = (function(){//将这个函数的返回值赋值给extend
    // 在修复它之前，首先检查是否存在bug
    for(var p in {toString:null}){
        //如果代码执行到这里，namefor/in循环会正确工作并返回
        //一个简单版本的extend函数
        return function extend(o){
            for(var i=1; i< arguments.length; i++){
                var source = arguments[i];
                for(var prop in source){
                    o[prop] = source[prop];
                }
            }
            return o;
        }
    }
    //如果代码执行到这里，说明for/in循环会枚举测试对象的toString属性
    //因此返回另一个版本的extend()函数，这个函数显式测试
    //Object.prototype中的不可枚举属性
    return function patched_extend(o){
        for(var i=1; i< arguments.length; i++){
            //复制所有的可枚举属性
            var source = arguments[i];
            for(var prop in source){
                o[prop] = source[p];
            }
        }
        //现在检测特殊属性
        for(var j = 0; j<protoprops.length; j++){
            prop = protoprops[j];
            if(source.hasOwnProperty(prop)) o[prop] = source[prop];
        }
        return o;
    };

    //这个列表出现了需要检查的特殊属性
    var protoprops = ['toString','valueOf','constructor',
                     'hasOwnProperty','isPrototypeOf','propertyIsEnumerable','toLocaleString'];
});

//一个用以定义简单类的函数
function defineClass(constructor,//用以设置实例的属性的函数
                     methods,//实例的方法，复制到原型中
                     statics)//类属性，复制至构造函数中
{
    if(methods) Extend(constructor.prototype, methods);
    if(statics) Extend(constructor, statics);
    return constructor;
}

//这是Range类的另一个实现
var SimpleRange = 
    defineClass(function(f,t){this.f =f;this.t=t;},
        {
            includes:function(x){return this.f<=x&&x<=this.t;},
            toString:function(){return this.f+'...'+this.t}
        },
        {upto: function(t){return new SimpleRange(0,t);} });


console.log(new SimpleRange(1,3));
