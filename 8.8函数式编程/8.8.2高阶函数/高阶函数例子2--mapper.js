// 所返回的函数的参数应当是一个实参数组,并对每个数组元素执行函数f()
//并返回所有计算结果组成的数组
// 可以对比一下这个函数和上下文提到的map()函数


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

function mapper(f){
    return function(a){ return map(a, f); };
}

var increment = function(x){ return x+1; };
var incrementer = mapper(increment);

console.log(incrementer([1,2,3]));



