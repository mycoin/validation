/**
 *
 * Struts2 Validation -- lib.js, version 1.1
 * Author: nqliujiangtao@gmail.com
 * Built at 2012/12/30 12:55 GMT
 *
 * (c) www.baidu.com 2012
 * All rights reserved.
 * https://github.com/mycoin/validation
 */
var rigel = rigel || {};
;(function(window, document, undefined) {
    // use the trict mode 
    "use strict";
    var exports = {};
    var closure = {validators: {}};
    /**
     * entry of result, passed if stacks arraylength is 0, or wrong fields data
     * @param <Array> stacks
     */
    closure.result = function (stacks) {
        var ret = {
            result: !stacks.length,
            stacks: stacks
        };
        !ret.result && (ret.field = stacks[0].field);
        !ret.result && (ret.message = stacks[0].message);
        return ret;
    }
    /**
     * the main validations rules, contains [required, 
        requiredstring, int, double, date, email, regex, url, stringLength..]
     * @return true || message string.
     */
    closure.validators = function () {
        /**
         * notice String(undefined) == "", so assert null into ""
         * @param Object {null, uindefined, String}, yes, toString method instead 
         * @return return a string that has been trimed.
         */
        function trim(string) {
            string == null && (string = undefined);
            return String(string).replace(new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+$)", "g"), "");
        };
        /**
         * modify null, empty string, and undefined to a param item.
         * @example modify(message, "");
         *
         * @param Object value
         * @param Object type
         * @return Object value (optional)
         */
        function modify (value, type) {
            if(value === "" || value === undefined || value === null) {
                value = type;
            }
            return value;
        }
        return {
            /**
             * RequiredFieldValidator checks if the specified field is not null.
             * @see RequiredFieldValidator.java
             */
            "required": function (rule, value) {
                value = modify(value, null);
                return value == null ? rule["message"] : true
            },
            /**
             * checks that a String field is non-null and has a length > 0
             * rule {trim}
             * @see RequiredStringValidator.java
             */
            "requiredstring": function (rule, value) {
                value = modify(value, "");
                rule["trim"] == true && (value = trim(value));
                return value.length == 0 ? rule["message"] : true;
            },
            /**
             * checks if the integer specified is within a certain range.
             * rule {min, max}
             * @see IntRangeFieldValidator.java
             */
            "int": function (rule, value) {
                // if there is no value - don't do comparison
                // if a value is required, a required validator should be added
                value = modify(value, null);
                if(value == null) {
                    return true;
                }
                if(! /^\-?[0-9]+$/.test(value)) {
                    //not a number
                    return rule["message"];
                } else {
                    value = parseInt(value);
                }
                var min = parseInt(rule["min"]);
                var max = parseInt(rule["max"]);
                //only check for a minimum value if the min parameter is set
                if(! isNaN(min) && value - min < 0) {
                    return rule["message"];
                }
                //only check for a minimum value if the max parameter is set
                if(! isNaN(max) && value - max > 0) {
                    return rule["message"];
                }
                return true;
            },
            /**
             * checks if the long specified is within a certain range.
             * rule {min, max, message}
             * @see LongRangeFieldValidator.java
             */
            "long": function () {
                //yui int keywords
                return this["int"].apply(this, [].slice.call(arguments));
            },
            /**
             * checks if the double specified is within a certain range.
             * rule {minInclusive, maxInclusive, minExclusive, maxExclusive}
             * @see DoubleRangeFieldValidator.java
             */
            "double": function (rule, value) {
                // if there is no value - don't do comparison
                // if a value is required, a required validator should be added
                value = modify(value, null);
                if(value == null) {
                    return true;
                }
                if(! /^\-?[0-9]*\.?[0-9]+$/.test(value)) {
                    //not a double, nani? double??
                    return rule["message"];
                } else {
                    value = parseFloat(value);
                }
                //the maximum inclusive value
                var maxI = parseFloat(rule["maxInclusive"]);
                //the minimum inclusive value
                var minI = parseFloat(rule["minInclusive"]);
                //the maximum exclusive value
                var maxE = parseFloat(rule["maxExclusive"]);
                //the minimum exclusive value
                var minE = parseFloat(rule["minExclusive"]);
                
                // nani ? so ga..
                if ((!isNaN(maxI) && value - maxI > 0)
                    || (!isNaN(minI) && value - minI < 0)
                    || (!isNaN(maxE) && value - maxE >= 0)
                    || (!isNaN(minE) && value - minE <= 0)
                    ){
                    return rule["message"];
                }
                return true;
            },
            /**
             * checks if the date supplied is within a specific range.
             * rule {min, max}
             * @see DateRangeFieldValidator.java
             */
            "date": function (rule, value) {
                // if there is no value - don't do comparison
                // if a value is required, a required validator should be added
                value = modify(value, null);
                if(value == null) {
                    return true;
                }
                var parseDate = function (date) {
                    var temp = date;
                    if(temp = Date.parse(date)) {
                        //if type of date is Date, also exit here
                        return new Date(temp);
                    }
                    temp = date;
                    if(/^[0-9\-\/\ :]*$/.test(temp)) {
                        temp = temp.replace(/\-/g, "/");
                        if(temp = new Date(temp)) {
                            return temp;
                        }
                    }
                    return NaN;
                }
                var value = parseDate(value);

                if(!value || "Invalid Date" == value) {
                    return rule["message"];
                }
                var min = parseDate(rule["min"]);
                var max = parseDate(rule["max"]);

                //only check for a minimum value if the min date is set
                if(! isNaN(min) && value.getTime() - min.getTime() < 0) {
                    return rule["message"];
                }
                //only check for a minimum value if the max date is set
                if(! isNaN(max) && value.getTime() - max.getTime() > 0) {
                    return rule["message"];
                }
                return true;
            },
            /**
             * checks that a given String field is a valid email address.
             * rule {}
             * @see EmailValidator.java
             */
            "email": function (rule, value) {
                //struts2 is so stupid.
                rule["expression"] = "^[_A-Za-z0-9-]+(\.[_A-Za-z0-9-]+)*@([A-Za-z0-9-])+(\.[A-Za-z0-9-]+)*((\.[A-Za-z0-9]{2,})|(\.[A-Za-z0-9]{2,}\.[A-Za-z0-9]{2,}))$";
                rule["caseSensitive"] = false;
                return closure.validators.regex(rule, value);
            },
            /**
             * Validates a string field using a regular expression.
             * rule {expression, caseSensitive, trim}
             * @see EmailValidator.java and ExpressionValidator.java.java
             */
            "regex": function (rule, value) {
                value = modify(value, null);
                // string must not be empty
                if(value == null || trim(value).length == 0) {
                    return true;
                }
                //from xwork2. e? Java is so stupid
                undefined == rule["caseSensitive"] && (rule["caseSensitive"] = true);
                undefined == rule["trim"] && (rule["trim"] = true);
                
                rule["trim"] == true && (value = trim(value));
                var opt = rule["caseSensitive"] ? "i" :  undefined;
                try{
                    if(!new RegExp(rule["expression"], opt).test(value)){
                        return rule["message"];
                    } 
                } catch(ex){};
                
                return true;
            } ,
            /**
             * checks that a given field is a String and a valid URL.
             * rule {}
             * @see EmailValidator.java and ExpressionValidator.java.java
             * @todo what is "URLUtil.verifyUrl"?? so ga.
             */
            "url": function (rule, value) {
                return true;
            },
            /**
             * checks that a String field is of a certain length.
                The "trim" parameter determines whether it will trim
                If unspecified, the String will be trimmed.
             * rule {minLength, maxLength, trim}
             * @see StringLengthFieldValidator.java
             */
            "stringLength": function (rule, value) {
                // if there is no value - don't do comparison
                // if a value is required, a required validator should be added
                value = modify(value, null);
                // as less as length of 0 ? so ga
                if(value == null || value.length <= 0) {
                    return true;
                }
                undefined == rule["minLength"] && (rule["minLength"] = -1);
                undefined == rule["maxLength"] && (rule["maxLength"] = -1);
                undefined == rule["trim"] && (rule["trim"] = true);
                // use a required validator for these
                rule.trim == true && (value = trim(value));

                if ((rule["minLength"] > -1) && (value.length < rule["minLength"])) {
                    return rule["message"];
                } else if ((rule["minLength"] > -1) && (value.length > rule["minLength"])) {
                    return rule["message"];
                }
                return true;
            }

        };
    }();
    /**
     * the portal entry, check if the data matches the rules. exports the error statcks.
     * @param Object dataMap the data, pls use baidu.form.seriser
     * @see StringLengthFieldValidator.java
     */
    exports.check = function(dataMap, rulesMap) {
        var stacks = [];
        var validate = function() {
            for(var type in rulesMap[key] || {}) {
                var rule = rulesMap[key][type] || {};
                var func = closure.validators[type];
                if(typeof func == "function") {
                    var message = func(rule, dataMap[key], dataMap);
                    if(true !== message){ 
                        return message; 
                    }
                } else {
                    console.warn("Validation function " + type + " not found.");
                }
            }
            return true;
        }
        //clever closure..
        var exception = function (key, message) {
            if(typeof message == "undefined") {
                console.warn("need message field input " + key + " not found.");
            }
            return {field: key, message: message, value: dataMap[key]}
        };
        for(var key in rulesMap || {}) {
            var message = validate(key);
            message !== true && stacks.push(new exception(key, message)); 
        }
        return new closure.result(stacks);
    };
    /**
     * the register entry, you can register a function onto the validators
     * @param string name
     * @param Function function the callback function, pass {rule, value, data}
     */
    exports.reg = function(){
        
    }
    // add version field.
    exports.version = "stable-1.0";
    // export it
    rigel.validation = exports;
})(window, document);

/**
using:
you can define the form validate config like this:
var rules = {
    "regAccount": {
        "required": {
            message: "please input account."
        },
        "stringLength": {
            maxLength: 18, 
            minLength: 3, 
            message: "account length error"
        }
    },
    "regCellphone": {
        "required": {
            message: "please input your Cellphone."
        },
        "regex": {
            "caseSensitive": false,
            "trim": true,
            "expression": "^1[3|5|8]{1}{0-9}{9}$",
            "message": "error in Cellphone."
        }
    }
}
now, use your library get form data:
var data = $("#reg_form").serialize(); 

then fire the main function:
var checking = rigel.validation.check(data, rules);
if(!checking.result) {
    alert(checking.message);
} else {
    balalala....
}

java -jar /home/local/bin/yuicompressor.jar --type js --charset UTF-8 lib.js -o lib.min.js
*/