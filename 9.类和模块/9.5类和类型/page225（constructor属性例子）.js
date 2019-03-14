function typeAndValue(x){
    if(x==null) return "";
    switch(x.constructor){
        case Number : 
            return "Number: "+x;
            break;
        case String : 
            return "String: '"+ x + "'";
            break;
        case Date:
            return "Date: " + x;
            break;
        case RegExp:
            return "RegExp: " + x;
            break;
        case Complex:
            return "Complex: " + x;
    }
}