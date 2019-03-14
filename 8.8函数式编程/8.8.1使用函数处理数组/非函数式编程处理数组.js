var data = [1,1,3,5,5];//待处理数组

//平均数是所有元素的累加值除以元素个数
var total = 0;

for(var i=0; i<data.length; i++) total += data[i];
var mean = total/data.length;//平均数是3

console.log('平均数mean是:'+mean);//控制台输出mean值

//计算标准差,首先计算每个数据减去平均数之后偏差的平方然后求和
total = 0;
for(var i =0; i<data.length; i++){
    var deviation = data[i] - mean;
    total+= deviation*deviation;
}

var stddev = Math.sqrt(total/(data.length-1));//标准差是 2
console.log('标准差stddev是:'+stddev);//控制台输出mean值


