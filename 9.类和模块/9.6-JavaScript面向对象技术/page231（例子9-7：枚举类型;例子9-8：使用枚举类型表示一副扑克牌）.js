/** 
 * Page 231-232
 * （
 *  例子9-7：枚举类型;
 *  例子9-8：使用枚举类型表示一副扑克牌
 * ）
*/

//这个函数创建一个新的枚举类型，实参对象表示类的每个实例的名字和值
//返回值是一个构造函数，它标识这个新类
//注意，这个函数也可能抛出异常，不能用它创建该类的实例
//包括由值组成的数组，以及一个foreach()迭代函数
function enumeration(namesToValues){
    //这个虚拟的构造函数是返回值
    var enumeration = function(){throw "Can't Instantiate Enumerate";};

    //枚举值继承自这个对象
    var proto = enumeration.prototype = {
        constructor: enumeration, //标识类别
        toString: function(){return this.name;},//返回名字
        valueOf:function(){return this.value;},//返回值
        toJSON:function(){return this.name;}//转换为HSON
    }
    
    enumeration.values = []; //用以存放枚举对象的数组

    //现在创建新类型的实例
    for(name in namesToValues){//遍历每个值
        var e= inherit(proto);//创建一个代表它的对象
        e.name= name;//给它一个名字
        e.value = namesToValues[name];//给它一个值
        enumeration[name] = e;//将它设置为构造函数的属性
        enumeration.values.push(e);//将它存储到值数组中
    }
    //一个类方法，用来对类的实例进行迭代
    enumeration.foreach = function(f,c){
        for(var i=0; i<this.values.length; i++) f.call(c, this.values[i]);
    };

    //返回标识这个新类型的构造函数
    return enumeration;

}

//例9-8：使用枚举类型表示一副扑克牌
//定义一个表示“玩牌”的类
function Card(suit,rank){
    this.suit = suit;
    this.rank = rank;
}

//使用枚举类型定义花色和点数
Card.Suit = enumeration({Clubs:1,Diamonds:2,Hearts:3,Spades:4});
Card.Rank = enumeration({Two:2,Three:3,Four:4,Five:5,
                         Six:6,Seven:7,Eight:8,Nine:9,
                         Ten:10,Jack:11,Queen:12,King:13,Ace:14});


//定义用以描述牌面的文本
Card.prototype.toString = function(){
    return this.rank.toString() + "of" + this.suit.toString();
};

//比较扑克牌中两张牌的大小
Card.prototype.compareTo = function(that){
    if(this.rank < that.rank) return -1;
    if(this.rank > that.rank) return 1;
    return 0;
}

//以扑克牌的玩法规则对牌进行排序的函数
Card.orderByRank = function(a,b){return a.compareTo(b)};

//以桥牌的玩法规则对扑克牌进行排序的函数
Card.orderBySuit = function(a,b){
    if(a.suit < b.suit) return -1;
    if(a.suit > b.suit) return 1;
    if(a.rank <b .rank) return -1;
    if(a.rank > b.rank) return 1;
    return 0;
}

//定义用以表示一副扑克牌的类
function Deck(){
    var cards = this.cards = []; //一副扑克牌就是由牌组成的数组
    Card.Suit.foreach(function(s){//初始化这个数组
                        Card.Rank.foreach(function(r){
                                            cards.push(new Card(s,r))
                                          });

                     })
}

//洗牌的方法：重新洗牌并返回洗好的牌
Deck.prototype.shuffle = function(){
    //遍历数组中的每个原色，随机找出牌面最小的元素，并与之（当前遍历的元素）交换
    var deck = this.cards, len = deck.length;
    for(var i = len-1; i>0;i--){
        var r = Math.floor(Math.random()*(i+1)), temp;//随机数
        temp = deck[i], deck[i] = deck[r],deck[r] = temp;//交换
    }
    return this;

}

//发牌的方法：返回牌的数组
Deck.prototype.deal = function(n){
    if(this.cards.length < n) throw 'Out of cards';
    return this.cards.splice(this.cards.length - n,n);
}

var deck = new Deck().shuffle();
var hand = deck.deal(13).sort(Card.orderBySuit);





//例6-1中的inherit()函数
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

