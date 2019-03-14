//多次调用这个函数f,传入一个迭代数
//比如，要输出'hello三次
//var n =3;
//n.times(function(n){console.log(n+"hello");})
Number.prototype.times = function(f, context){
    var n = Number(this);
    for(var i=0;i<n;i++) f.call(context,i);
};

var n =3;
n.times(function(n){console.log(n+"hello");})

//如果不存在ES5的String.trim()方法的话，就定义它
//这个方法用以去除字符串开头和结尾的空格
String.prototype.trim = String.prototype.trim || function(){
    if(!this) return this;//空字符不做处理
    return this.replace(/^\s+ |\s+$/g,"");//使用正则表达式进行空格替换
}

//返回函数的名字，如果它有（非标准的）name属性，则直接使用name属性
//否则，将函数转换为字符串然后从中提取名字
//如果是没有名字的函数，则返回一个空字符串
Function.prototype.getName = function(){
    return this.name || this.toString.match(/function\s*([^()*]\(/)[1];
}


