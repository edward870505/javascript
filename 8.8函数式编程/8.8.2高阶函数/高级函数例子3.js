//返回一个新的可以计算f(g())的函数
//返回的函数h()将它所有的实参传入g()，然后将g()的返回值传入f()
//调用f()和g()时的this值和调用h()时的this值是同一个this

function compose(f,g){
    return function(){
        //需要给f()传入一个参数,所以使用f()的call()方法
        //需要给g()传入很多参数，所以使用g的apply()方法
        return f.call(this, g.apply(this,arguments));
    };
}

var square = function(x){ return x*x; };
var sum = function(x,y){ return x+y };
var squareofsum = compose(square, sum);

console.log('The result of squareofsum is :',squareofsum(2,3));


