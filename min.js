(function(a,b){typeof define==="function"&&define(b);(typeof exports!=="undefined"?exports:a).validator=b()})(this,function(){var a=true,b=null;"use strict";var f={version:"stable-1.0.1"},d=function(a){a==b&&(a=undefined);return String(a).replace(new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+$)","g"),"")},c=function(a,c){if(a===""||a===undefined||a===b)a=c;return a},e=function(a){var b=a;if(b=Date.parse(a))return new Date(b);b=a;if(/^[0-9\-\/\ :]*$/.test(b)){b=b.replace(/\-/g,"/");if(b=new Date(b))return b}return NaN},g={required:function(d,e){e=c(e,b);return e==b?d.message:a},requiredstring:function(b,e){e=c(e,"");b.trim==a&&(e=d(e));return e.length==0?b.message:a},"int":function(d,e){e=c(e,b);if(e==b)return a;if(/^\-?[0-9]+$/.test(e))e=parseInt(e);else return d.message;var g=parseInt(d.min),f=parseInt(d.max);if(!isNaN(g)&&e-g<0)return d.message;if(!isNaN(f)&&e-f>0)return d.message;return a},"long":function(){return this["int"].apply(this,[].slice.call(arguments))},"double":function(d,e){e=c(e,b);if(e==b)return a;if(/^\-?[0-9]*\.?[0-9]+$/.test(e))e=parseFloat(e);else return d.message;var g=parseFloat(d.maxInclusive),i=parseFloat(d.minInclusive),f=parseFloat(d.maxExclusive),h=parseFloat(d.minExclusive);if(!isNaN(g)&&e-g>0||!isNaN(i)&&e-i<0||!isNaN(f)&&e-f>=0||!isNaN(h)&&e-h<=0)return d.message;return a},date:function(d,f){f=c(f,b);if(f==b)return a;var f=e(f);if(!f||"Invalid Date"==f)return d.message;var h=e(d.min),g=e(d.max);if(!isNaN(h)&&f.getTime()-h.getTime()<0)return d.message;if(!isNaN(g)&&f.getTime()-g.getTime()>0)return d.message;return a},email:function(a,b){a.expression="^[_A-Za-z0-9-]+(.[_A-Za-z0-9-]+)*@([A-Za-z0-9-])+(.[A-Za-z0-9-]+)*((.[A-Za-z0-9]{2,})|(.[A-Za-z0-9]{2,}.[A-Za-z0-9]{2,}))$";a.caseSensitive=false;return g.regex(a,b)},regex:function(e,f){f=c(f,b);if(f==b||d(f).length==0)return a;undefined==e.caseSensitive&&(e.caseSensitive=a);undefined==e.trim&&(e.trim=a);e.trim==a&&(f=d(f));var g=e.caseSensitive?"i":undefined;try{if(!new RegExp(e.expression,g).test(f))return e.message}catch(h){}return a},url:function(b,c){return a},stringlength:function(e,f){f=c(f,b);if(f==b||f.length<=0)return a;undefined==e.minLength&&(e.minLength=-1);undefined==e.maxLength&&(e.maxLength=-1);undefined==e.trim&&(e.trim=a);e.trim==a&&(f=d(f));if(e.minLength>-1&&f.length<e.minLength)return e.message;else if(e.minLength>-1&&f.length>e.minLength)return e.message;return a}},h=f.validate=function(b,c){var e=[];for(var d in c||{})for(var f in c[d]||{}){var j=c[d][f]||{},i=g[f];if(typeof i=="function"){var h=i(j,b[d],b);h!==a&&e.push({field:d,message:h,value:b[d]})}else throw new Error("Validation function "+f+" not found.")}return e.length?{result:false,field:e[0].field,message:e[0].message,stacks:e}:{result:a,message:"OK"}};return f})