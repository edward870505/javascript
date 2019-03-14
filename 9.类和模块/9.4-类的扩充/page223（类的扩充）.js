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

