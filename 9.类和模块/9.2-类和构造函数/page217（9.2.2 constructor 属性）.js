var F = function(){};//这是一个函数对象

var p = F.prototype;
var c = p.constructor;

console.log('The result of \'c===F\' is: ',c===F);

var o = new F();

console.log('The result of \'o.constructor===F\' is: ',o.constructor===F);
