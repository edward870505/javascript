//这个高阶函数返回一个新的函数,这个新函数将它的实参传入f()
//并返回f的返回值的逻辑非

function not(f){
    return function(){//返回一个新的函数
        var result = f.apply(this,arguments);//调用f()
        return !result;//对结果求反
    };
}

var even = function(x){//判断a是否为偶数的函数
    return x%2 === 0;
};

var odd = not(even);

console.log('是否每个元素都为奇数：',[1,1,3,5,5].every(odd));



