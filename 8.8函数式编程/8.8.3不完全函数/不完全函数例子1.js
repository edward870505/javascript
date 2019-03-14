//实现一个工具函数将类数组对象（或对象）转换为真正数组
//在后面的示例代码中用到了这个方法将arguments对象转换为真正的数组
function array(a,n){
    return Array.prototype.slice.call(a, n ||0);
}

//这个函数的实参传递至左侧
function partialLeft(f /*, ...*/){
    var args = arguments;//保存外部的实际参数
    return function(){
        var a = array(args, 1);//开始处理外部的第一个args
        a = a.concat(array(arguments));//然后增加所有的内部实参
        return f.apply(this,a);//然后基于这个实参列表调用f()
    }
}

//这个函数的实参传递至右侧
function partialRight(f /*,...*/){
    var args = arguments;
    return function(){
        var a = array(arguments);//从内部实参开始
        a = a.concat(array(args, 1));//然后从外部第一个args开始添加
        return f.apply(this,a);//最后基于这个实参列表调用f()
    }
}

// 这个函数的实参被用做模板
// 实参列表中的undefined值被填充
function partial(f/*,...*/){
    var args = arguments;
    return function(){
        var a = array(args, 1);//从外部args开始
        var i = 0, j = 0;
        //遍历args,从内部实参填充undefined值
        for(; i < a.length; i++){
            if(a[i] === undefined) a[i] = arguments[j++];
        }
        //现在将剩下的内部实参都追加进去
        a = a.concat(array(arguments,j));
        return f.apply(this, a);
    }
}

//这个函数带有三个实参
var f = function(x,y,z){
    return x*(y-z);
};

console.log('The result of partialLeft is: ',partialLeft(f,2)(3,4));
console.log('The result of partialRight is: ',partialRight(f,2)(3,4));
console.log('The result of partial is: ',partial(f,undefined,2)(3,4));


var sum = function(x,y){return x+y;};//初等函数
var product = function(x,y){return x*y;};



var increment = partialLeft(sum,1);
var cuberoot = partialRight(Math.pow, 1/3);
String.prototype.first = partial(String.prototype.charAt, 0);
String.prototype.last = partial(String.prototype.substr, -1, 1);


console.log('The result of increment is: ', increment(2,3,4));
console.log('The result of cuberoot is: ',cuberoot(9));
console.log('The result of String.prototype.first is: ','hello'.first());
console.log('The result of String.prototype.last is: ','hello'.last());

//使用不完全调用的组合来重新组织求平均数和标准差的代码，这是非常纯粹的函数式编程
var data = [1,1,3,5,5];

var neg = partial(product, -1);//定义其他函数
var square = partial(Math.pow,undefined, 2);
var sqrt = partial(Math.pow, undefined, .5);
var reciprocal = partial(Math.pow, undefined, -1);

//ES3不存在内置方法，可以自定义map()和reduce()
//对于每个数组元素调用f(),并返回一个结果数组
//如果Array.prototype.map定义了的话，就使用这个方法
var map = Array.prototype.map ? function(a,f){ return a.map(f)}
                              : function(a,f){
                                  var results = [];
                                  for(var i =0; i<a.length; i++){
                                    if( i in a) results[i] = f.call(null, a[i], i, a);
                                  }
                                  return results;
                              };

//使用函数f()和可选的初始值将数组a减至一个值
//如果Array.prototype.reduce存在的话，就使用这个方法
var reduce = Array.prototype.reduce ? function(a,f,initial){ 
                                        if(arguments.length > 2){
                                            return a.reduce(f,initial);//如果传入了初始值
                                        }else{
                                            return a.reduce(f);//否则没有初始值
                                        }
                                    }
                                    : function(a,f,initial){//这个算法来自ES5规范
                                        var i =0, len = a.length, accumulator;
                                        //以特定的初始值开始,否则第一个值取自a
                                        if( arguments.length>2) accumulator = initial;
                                        else{//找到数组中第一个已定义的索引
                                            if(len == 0) throw TypeError();
                                            while(i < len){
                                                if( i in a){
                                                    accumulator = a[i++];
                                                    break;
                                                }
                                                else i++;
                                            }
                                            if(i == len) throw TypeError();
                                        }
                                        //对于数组中剩下的元素依次调用f()
                                        while(i<len){
                                            if(i in a)
                                                accumulator = f.call(undefined,accumulator,a[i],i,a);
                                            i++;
                                        }

                                        return accumulator;
                                    };

function compose(f,g){
    return function(){
        //需要给f()传入一个参数,所以使用f()的call()方法
        //需要给g()传入很多参数，所以使用g的apply()方法
        return f.call(this, g.apply(this,arguments));
    };
}

//现在计算平均值和标准差，所有的函数调用都不带运算符
//这段代码看起来很像Lisp代码
var mean = product(reduce(data,sum), reciprocal(data.length));
var stddev = sqrt(
    product(
        reduce(
            map(
                data,
                compose(square,
                        partial(
                            sum,
                            neg(mean)
                        ))
            ),
            sum
        ),
        reciprocal(
            sum(data.length, -1)
        )
    )
);

console.log('The result of stddev is :',stddev);





