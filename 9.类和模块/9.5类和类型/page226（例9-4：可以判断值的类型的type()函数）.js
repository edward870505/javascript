/**
 * 以字符串形式返回o的类型：
 * -如果o是null,返回'null',如果是NaN,返回‘NaN'
 * -如果typeof返回的值不是'object',则返回这个值
 * -（注意，有一些JavaScript实现将正则表达式识别为函数）
 * -如果o的类不是Object,则返回这个值
 * -如果o包含构造函数切这个构造函数具有名称，则返回这个名称
 * -否则，一律返回Object
 */

function type(o){
    var t,c,n; // type, class, name

    //处理null值的特殊情形
    if(o===null) return 'null';

    //另一种特殊情形：NaN
    if(o!==o) return 'NaN';

    //如果typeof值不是object，则使用这个值
    //可以识别出原始的类型和函数
    if((t = typeof o)!== 'object' ) return t;

    //返回对象的雷鸣，除非值是'Object'
    //这种方式可以识别出大多数的内置对象
    if((c=classof(o)) !== 'Object') return c;

    //如果对象构造函数的名字存在的话，则返回它
    if(o.constrcutor && typeof o.constrcutor ==='function' &&
        (n = o.constrcutor.getName())) return n;
}


 //例子6-4 classof()函数 (Page 151)
function classof(o){
    if(o===null) return 'Null';
    if(o===undefined) return 'Undefined';
    return Object.prototype.toString.call(o).slice(8,-1);
}

//9.4节的Function.getName()方法 (Page 223)
//返回函数的名字，如果它有（非标准的）name属性，则直接使用name属性
//否则，将函数转换为字符串然后从中提取名字
//如果是没有名字的函数，则返回一个空字符串
Function.prototype.getName = function(){
    return this.name || this.toString.match(/function\s*([^()*]\(/)[1];
}