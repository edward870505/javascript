//首先定义两个简单的函数
var sum = function(x,y){ return x+y };
var square = function(x){ return x*x };

//然后将这些函数与数组方法配合使用计算出平均数和标准差
var data = [1,1,3,5,5];
var mean = data.reduce(sum)/data.length;
var deviations = data.map(function(x){ return x-mean});
var stddev = Math.sqrt(deviations.map(square).reduce(sum)/(data.length-1));

//输出stddev
console.log('stddev：'+stddev);
