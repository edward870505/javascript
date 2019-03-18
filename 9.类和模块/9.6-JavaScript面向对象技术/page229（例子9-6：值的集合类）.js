function Set(){ //这是一个构造函数
    this.values = {};//集合数据保存在对象的属性里
    this.n = 0;//集合中值的个数
    // page241:重载
    // 如果传入一个类数组的对象，将这个元素添加至集合中
    // 否则，将所有的参数都添加至集合中
    if(arguments.length == 1 && isArrayLike(arguments[0]))
        this.add.apply(this, arguments[0]);//把所有参数都添加进这个集合
    else if(arguments.length >0)
        this.add.apply(this,arguments);
}

//将每个参数都添加至集合中
Set.prototype.add = function(){
    for(var i=0; i<arguments.length;i++){//遍历每个参数
        var val = arguments[i];//待添加到集合中的值
        var str = Set._v2s(val);//把它转换为字符砖
        if(!this.values.hasOwnProperty(str)){//如果不在集合中
            this.values[str] = val;//将字符串和值对应起来
            this.n++;//集合中值的计数加一
        }
    }
}

//如果集合中包含这个值，则返回true,否则返回false
Set.prototype.contains = function(value){
    return this.values.hasOwnProperty(Set._v2s(value));
};

//返回集合的大小
Set.prototype.size = function(){
    return this.n;
}

//遍历集合中的所有元素，在指定的上下文中调用f

Set.prototype.foreach = function(f,context){
    for(var s in this.values){//遍历集合中的所有字符串
        if(this.values.hasOwnProperty(s))//忽略继承的属性
        f.call(context, this.values[s]);
    }
};

Set.prototype.equals = function(that){
    // 一些次要情况的快捷处理
    if(this === that ) return true;
    // 如果that对象不是一个集合，它和this不相等
    // 我们用到了instanceof,使得这个方法可以用于Set的任何子类
    // 如果希望采用鸭式辩型的方法，可以降低检查的严格程度
    // 或者可以通过this.constructor == that.constructor来加强检查的严格程度
    // 注意，null和undefined两个值是无法用于instanceof运算的
    if(!(that instanceof Set)) return false;

    // 如果两个集合的大小不一样，则它们不相等
    if(this.size()!=that.size()) return false;

    // 现在检查两个集合中的元素是否完全一样
    // 如果两个集合不相等，则通过抛出异常来终止foreach循环
    try{
        this.foreach(function(v){ if (!that.contains(v)) throw false; });
        return true;//所有元素都匹配；两个集合相等
    }catch(x){
        if(x===false) return false;// 如果集合中有元素在另外一个集合中不存在
        throw x;// 重新抛出异常
    }

    
}



//inherit()返回了一个继承自原型对象p的属性的新对象
//这列使用ES5中的Object.create()函数（如果存在的话）
function inherit(p){
    if( p==null ) throw TypeError();//p是一个对象，但不能是null
    if(Object.create)               //如果Object.create()存在
        return Object.create(p);    //直接使用它
    var t = typeof p;               //否则进一步检测
    if( t!=="object" && t!=="function") throw TypeError();
    function f(){};                 //定义一个构造函数
    f.prototype = p;                //
    return new f();
}

//定义一个扩展函数，用来将第二个以及后续参数复制到第一个参数
//这里我们处理了IE bug:在多数IE版本中
//如果o拥有一个不可枚举的同名属性，则for/in循环
//不会枚举对象o的可枚举属性，也就是说，将不会正确处理诸如toString属性
//除非我们显式检测它
var Extend = (function(){//将这个函数的返回值赋值给extend
    // 在修复它之前，首先检查是否存在bug
    for(var p in {toString:null}){
        //如果代码执行到这里，namefor/in循环会正确工作并返回
        //一个简单版本的extend函数
        return function extend(o){
            for(var i=1; i< arguments.length; i++){
                var source = arguments[i];
                for(var prop in source){
                    o[prop] = source[prop];
                }
            }
            return o;
        }
    }
    //如果代码执行到这里，说明for/in循环会枚举测试对象的toString属性
    //因此返回另一个版本的extend()函数，这个函数显式测试
    //Object.prototype中的不可枚举属性
    return function patched_extend(o){
        for(var i=1; i< arguments.length; i++){
            //复制所有的可枚举属性
            var source = arguments[i];
            for(var prop in source){
                o[prop] = source[p];
            }
        }
        //现在检测特殊属性
        for(var j = 0; j<protoprops.length; j++){
            prop = protoprops[j];
            if(source.hasOwnProperty(prop)) o[prop] = source[prop];
        }
        return o;
    };

    //这个列表出现了需要检查的特殊属性
    var protoprops = ['toString','valueOf','constructor',
                     'hasOwnProperty','isPrototypeOf','propertyIsEnumerable','toLocaleString'];
});

//例6-2中的extend（）函数

/*
 * 把p中的可枚举属性复制到o中，并返回o
 * 如果o和p中含有同名属性，则覆盖o中的属性
 * 这个函数并不处理getter和setter以及复制属性
*/
function extend(o,p){

    for(prop in p){
        o[prop] = p[prop];
    }
    return o;
}

//一个用以定义简单类的函数
function defineClass(constructor,//用以设置实例的属性的函数
                     methods,//实例的方法，复制到原型中
                     statics)//类属性，复制至构造函数中
{
    if(methods) Extend(constructor.prototype, methods);
    if(statics) Extend(constructor, statics);
    return constructor;
}

//Page 243 用一个简单的函数创建简单的子类
function defineSubClass(superClass,//父类的构造函数
                        constructor,//新的子类的构造函数
                        methods,
                        statics)
{
    // 建立子类的原型对象
    constructor.prototype = inherit(superclass.prototype); 
    constructor.prototype.constructor = constructor;
    // 像对常规类一样复制方法和类属性
    if(methods) Extend(constructor.prototype, methods);
    if(statics) Extend(constructor, statics);
    // 返回这个类
    return constructor;
}

extend(Set.prototype,{
    // 将集合转换为字符串
    toString:function(v){
        var s = "{";
        i = 0;
        this.foreach(function(v){s+=((i++>0?",":""))+v});
        return s + "}";
    },
    // 类似toString,但是对于所有的值都将调用toLocaleString
    toLocaleString: function(){
        var s = "{";
        i = 0;
        this.foreach(function(v){
            if (i++>0) s +=',';
            if(v==null) s+=v;
            else s+= v.toLocaleString();
        });
        return s+"}";
    },
    // 将集合转换为数组
    toArray:function(){
        var a = [];
        this.foreach(function(v){a.push(v)});
        return a;
    }   
});




// Page242
Set.fromArray = function(a){
    s= new Set();// 创建一个空集合
    s.add.apply(s, a);// 将数组a的成员作为参数传入add()方法
    return s;//返回这个新集合
}

// Set类的一个辅助构造函数
function SetFromArray(a){
    // 通过以函数的形式调用Set()来初始化这个新对象
    // 将a的元素作为参数传入
    Set.apply(this, a);
}
// 设置原型，以便SetFromArray能创建Set的实例
SetFromArray.prototype = Set.prototype;

var s = new SetFromArray([1,2,3]);
console.log(s instanceof Set);

//这是一个内部函数，用以将任意JavaScript值和唯一的字符串对应起来
Set._v2s = function(val){
    switch(val){
        case undefined : return 'u'; //特殊的原始值
        case null : return 'n'; //值只有一个字母
        case true : return 't';// 代码
        default:switch(typeof val){
            case 'number' : return '#' + val;//数字都带有#前缀
            case 'string' : return '"'+val;//字符串都带有"前缀
                default:return '@'+objectId(val);//对象和函数有@前缀
        }
    }

    function objectId(o){
        var prop = "|**objectid**|";
        if(!o.hasOwnProperty(prop))
            o[prop] = Set._v2s.next++;
        return o[prop];
    }
}

Set._v2s.next = 100; //设置初始id的值


// 对于要从JSON转换为字符串的集合被当做数组对待
Set.prototype.toJSON = Set.prototype.toArray

// 也可以通过父类构造函数的方法来做到这一点
Function.prototype.extend = function(constructor,methods,statics){
    return defineSubClass(this,constructor,methods,statics);
}

//这是Range类的另一个实现
var SimpleRange = 
    defineClass(function(f,t){this.f =f;this.t=t;},
        {
            includes:function(x){return this.f<=x&&x<=this.t;},
            toString:function(){return this.f+'...'+this.t}
        },
        {upto: function(t){return new SimpleRange(0,t);} });




console.log(new SimpleRange(1,3));

// 例9-12：SingletonSet：一个简单的子类
// 构造函数
function SingletionSet(member){
    this.member = member;// 记住集合中这个唯一的成员
    // 创建一个原型对象，这个原型对象继承自Set的原型
    SingletionSet.prototype = inherit(Set.prototype);
    // 给原型添加属性
    //如果有同名属性就覆盖Set.prototype中的同名属性
    Extend(SingletonSet.prototype,{
        // 设置合适的constructor属性
        constructor:SingletonSet,
        // 这个集合是只读的，调用add()和remove()会报错
        add:function(){throw 'read-only set';},
        remove:function(){throw 'read-only set'},
        // SingletonSet的实例永远只有一个元素
        size:function(){return 1},
        // 这个方法只调用一次，传入这个集合的唯一成员
        foreach:function(f,context){f.call(context,this.member);};,
        // contains()方法只需检查传入的值是否匹配这个集合唯一的成员即可
        contains:function(x){
            return x === this.member;
        }
    });



}

//page 244
SingletonSet.prototype.equals = function(that){
    return that instanceof Set && that.size() == 1 && that.contains(this.member);
}

// page 245
/**
 * NonNullSet是Set的子类，它的成员不能是null和undefined
 */
function NonNullSet(){
    // 仅链接到父类
    // 作为普通函数调用父类的构造函数来初始化通过该构造函数调用创建的对象
    Set.apply(this, arguments);
}

// 将NonNullSet设置为Set的子类
NonNullSet.prototype = inherit(Set.prototype);
NonNullSet.prototype.constructor = NonNullSet;

// 为了将null和undefined排除在外，只需重写add()方法
NonNullSet.prototype.add = function(){
    // 检查参数是不是null或undefined
    for(var i=0; i< arguments.length; i++){
        if(arguments[i] == null)
            throw new Error("Can't add null or undefined to a NonNullSet");
    }

    // 调用父类的add()方法以执行实际插入操作
    return Set.prototype.add.apply(this, arguments);
}


// page 246,类工厂和方法链
/**
 * 这个函数返回具体Set类的子类
 * 并重写该类的add()方法用以对添加的元素做特殊的过滤
 */

 function filteredSetSubclass(superclass, filter) {
     var constructor = function () {//子类构造函数
         superclass.apply(this, arguments);//调用父类构造函数
     };
     var proto = constructor.prototype = inherit(superclass.prototype);
     proto.constructor = constructor;
     proto.add = function(){
        //  在添加任何成员之前首先使用过滤器将所有参数进行过滤
        for(var i =0; i<arguments.length; i++){
            var v = arguments[i];
            if(!filter(v)) throw ('value '+v+'rejected by filter');
        }
        // 调用父类的add()方法
        superclass.prototype.add.apply(this, arguments);
     };
    
     return constructor;

 }

 //page 246,使用包装函数和例9-11的Function.prototype.extend()方法来重写NonNullSet
 var NonNullSet = (function(){ //定义并立即调用这个函数
    var superclass = Set; // 仅指定父类
    return superclass.extend(function(){superclass.apply(this, arguments)},
                             {
                                 add:function(){
                                     检查参数是否是null或undefined
                                     for(var i =0; i < arguments.length; i++){
                                        if(arguments[i] == null)
                                            throw new Error("Can't add null or undefined");
                                     }

                                    //  调用父类的add()方法以实际执行实际插入操作
                                    return superclass.prototype.add.apply(this, arguments);
                                 }

                             });


 }());


var s = new Set();
s.add(1,'abc',{x:1});
console.log(s);

