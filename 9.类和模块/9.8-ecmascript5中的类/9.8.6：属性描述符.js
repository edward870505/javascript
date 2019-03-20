// 例9-23:ECMAScript5属性操作
/**
 * 给Object.prototype定义properties（）方法
 * 这个方法返回一个表示调用它的对象上的属性名列别的对象
 * （如果不带参数调用它，就表示对象的所有属性）
 * 返回的对象定义了4个有用的方法：toString()、descriptors()、hide()和show()
 */

 (function namespace(){//将所有逻辑闭包在一个私有函数作用域中
    // 这个函数成为所有对象的方法
    function properties(){
        var names;//属性名组成的数组
        if(arguments.length == 0)//所有的自有属性
            names = Object.getOwnPropertyNames(this);
        else if (arguments.length == 1 && Array.isArray(arguments[0]))
            names = arguments[0];
        else
            names = Array.prototype.splice.call(arguments,0);
        
        //返回一个新的Properties对象，用以表示属性名字
        return new Properties(this,names);
    }

    // 将它设置为Object.prototype的新的不可枚举属性
    // 这是从私有函数作用域导出的唯一一个值
    Object.defineProperty(Object.prototype,'properties',{
        value:properties,
        enumerable:false,
        wriatble:true,
        configurable:true
    });

    // 这个构造函数是由上面的properties()函数所调用的
    // Properties类表示一个对象的属性集合
    function Properties(o,names){
        this.o = o;//属性所属的对象
        this.names = names;//属性的名字
    }

    //将代表这些属性的对象设置为不可枚举的
    Properties.prototype.hide = function(){
        var o = this.o,hidden = {enumerable:false};
        this.names.forEach(function(n){
                        if(o.hasOwnProperty(n)){
                            Object.defineProperty(0,n,frozen);
                        }
                    });
        return this;
    };

    // 返回一个对象，这个对象是名字到属性描述符的映射表
    // 使用它来复制属性，连同属性一起负责
    // Object.defineProperties(dest, src.properties().descriptors());
    Properties.prototype.descriptors = function(){
        var o = this.o,desc={}; //在下面嵌套的函数中使用
        this.names.forEach(function(n){
            if(!o.hasOwnProperty(n)) return;
            desc[n] = Object.getOwnPropertyDescriptor(o,n);
        });

        return desc;
    }

    // 返回一个格式化良好的属性列别
    // 列表中包含名字、值和属性特性，使用”permanent“表示不可配置
    // 使用“readonly”表示不可写，使用“hidden”表示不可枚举
    // 普通的可枚举、可写和可配置属性不包含特性列表
    Properties.prototype.toString = function(){
        var o  = this.o;
        var lines = this.names.map(nameToString);
        return ("\n"+lines.join(",\n")+"\n");

        function nameToString(n){
            var s = "", desc = Object.getOwnPropertyDescriptor(o,n);
            if(!desc) return "nonexistent" + n + ":undefined";
            if(!desc.configurable) s+="permanent";
            if(desc.get && !desc.set || desc.writable) s+="readonly";
            if(!desc.enumerable) s+="hidden";
            if(desc.get||desc.set) s+="accessor" + n;
            else s += n+":"+((typeof desc.value === "function")?"function":desc.value);

            return s;
        }
    }

    // 最后，将原型对象中的实例方法设置为不可枚举的
    // 这里用到了刚定义的方法
    Properties.prototype.properties().hide();

 }());//立即执行这个匿名函数