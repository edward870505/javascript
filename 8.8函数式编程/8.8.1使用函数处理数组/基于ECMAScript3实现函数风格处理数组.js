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


//首先定义两个简单的函数
var sum = function(x,y){ return x+y };
var square = function(x){ return x*x };

//然后将这些函数与数组方法配合使用计算出平均数和标准差
var data = [1,1,3,5,5];
var mean = data.reduce(sum)/data.length;
var deviations = map(data,function(x){ return x-mean});
var stddev = Math.sqrt(reduce(map(deviations,square),sum)/(data.length-1));

//输出stddev
console.log('stddev：'+stddev);
