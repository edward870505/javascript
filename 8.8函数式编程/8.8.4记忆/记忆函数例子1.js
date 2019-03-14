//返回f()的带有记忆功能的版本
//只有当f()的实参的字符串表示都不相同它才会工作
function memorize(f){
    var cache = {};//将值保存在闭包内
    return function(){
        //将实参转换为字符串形式，并将其用做缓存的键
        var key = arguments.length+Array.prototype.join.call(arguments,",");
        if(key in cache) return cache[key];
        else return cache[key] = f.apply(this,arguments);
    }
}

//返回两个整数的最大公约数
//使用欧几里德算法
function gcd(a,b){
    var t;
    if(a<b) t=b, b=a, a=t;
    while(b!=0) t=b, b = a%b, a=t;
    return a;
}

var gcdmemo = memorize(gcd);
console.log('The result of gcdmemo(85,187) is: ',gcdmemo(85,187));

//注意，当我们写一个递归函数时，往往需要实现记忆功能
//我们更希望调用实现了记忆功能的递归函数，而不是原递归函数
var factorial = memorize(function(n){
                    return (n<=1)?1:n*factorial(n-1);
                });

console.log('The result of factorial(5) is :',factorial(5));



