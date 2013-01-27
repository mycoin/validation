/**
 *
 * Struts2 Validation -- lib.js, version 1.1
 * Author: liuronghan
 * Built at 2012/12/16 08:44 GMT
 *
 * (c) baidu.com 2012
 * All rights reserved.
 * https://github.com/mycoin/validation
 */
var rigel = rigel || {};;
(function(window, document, undefined) {
    "";
    var exports = {
        "version": "1.1.7"
    };
    var closure = {
        validators: {}
    };
    closure.result = function (stacks) {
        var result = {};
        if(stacks.length == 0) {
            result.result = true;
            result.stacks = [];
        } else {
            result.result = false;
            result.stacks = stacks;
            result.field = stacks[0].field;
            result.message = stacks[0].message || "ErrorMessage";
        }
        return result;
    }
    closure.validators = function () {
        function trim(string) {
            string = string == null ? "" : string;
            return String(string).replace(new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+$)", "g"), "");
        };

        function modify (value, type) {
            if(value == "" || value == undefined || value == null) {
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
                value = modify(value);
                return value == null ? rule.message : true
            },
            /**
             * checks that a String field is non-null and has a length > 0
             * rule {trim}
             * @see RequiredStringValidator.java
             */
            "requiredstring": function (rule, value) {
                value = modify(value, "");
                rule.trim == true && (value = trim(value));
                return value.length == 0 ? rule.message : true;
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
                    return rule.message;
                } else {
                    value = parseInt(value);
                }
                var min = parseInt(rule.min);
                var max = parseInt(rule.max);
                //only check for a minimum value if the min parameter is set
                if(! isNaN(min) && value - min < 0) {
                    return rule.message;
                }
                //only check for a minimum value if the max parameter is set
                if(! isNaN(max) && value - max > 0) {
                    return rule.message;
                }
                return true;
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
                    return rule.message;
                } else {
                    value = parseFloat(value);
                }
                //the maximum inclusive value
                var maxInclusiveValue = parseFloat(rule.maxInclusiveValue);
                //the minimum inclusive value
                var minInclusiveValue = parseFloat(rule.minInclusiveValue);
                //the maximum exclusive value
                var maxExclusiveValue = parseFloat(rule.maxExclusiveValue);
                //the minimum exclusive value
                var minExclusiveValue = parseFloat(rule.minExclusiveValue);
                
                // nani ? so ga..
                if ((!isNaN(maxInclusiveValue) && value - maxInclusiveValue > 0)
                    || (!isNaN(minInclusiveValue) && value - minInclusiveValue < 0)
                    || (!isNaN(maxExclusiveValue) && value - maxExclusiveValue >= 0)
                    || (!isNaN(minExclusiveValue) && value - minExclusiveValue <= 0)
                    ){
                    return rule.message;
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
                    if(date = Date.parse(date)) {
                        //if type of date is Date, also exit here
                        return new Date(date);
                    }
                    if(/^[0-9\-\/\ :]*$/.test(date)) {
                        date = date.replace("-", "/");
                        if(date = new Date(date)) {
                            return date;
                        }
                    }
                    return NaN;
                }
                var value = parseDate(value);
                if(!value || "Invalid Date" == value) {
                    return rule.message;
                }
                var min = parseDate(rule.min);
                var max = parseDate(rule.max);
                //only check for a minimum value if the min date is set
                if(! isNaN(min) && value.getTime() - min.getTime() < 0) {
                    return rule.message;
                }
                //only check for a minimum value if the max date is set
                if(! isNaN(max) && value.getTime() - max.getTime() > 0) {
                    return rule.message;
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
                rule.expression = "^[_A-Za-z0-9-]+(\.[_A-Za-z0-9-]+)*@([A-Za-z0-9-])+(\.[A-Za-z0-9-]+)*((\.[A-Za-z0-9]{2,})|(\.[A-Za-z0-9]{2,}\.[A-Za-z0-9]{2,}))$";;
                rule.caseSensitive = false;
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
                undefined == rule.caseSensitive && (rule.caseSensitive = true);
                undefined == rule.trim && (rule.trim = true);
                
                rule.trim == true && (value = trim(value));
                var opt = rule.caseSensitive ? "i" :  undefined;
                try{
                    if(!new RegExp(rule.expression, opt).test(value)){
                        return rule.message;
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
            "stringlength": function (rule, value) {
                // if there is no value - don't do comparison
                // if a value is required, a required validator should be added
                value = modify(value, null);
                // as less as length of 0 ? so ga
                if(value == null || value.length <= 0) {
                    return true;
                }
                undefined == rule.minLength && (rule.minLength = -1);
                undefined == rule.maxLength && (rule.maxLength = -1);
                undefined == rule.trim && (rule.trim = true);
                // use a required validator for these
                rule.trim == true && (value = trim(value));

                if ((rule.minLength > -1) && (value.length < rule.minLength)) {
                    return rule.message;
                } else if ((rule.minLength > -1) && (value.length > rule.minLength)) {
                    return rule.message;
                }
                return true;
            }

        };
    }();
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
        var exception = function (key, message) {
            return {field: key, message: message, value: dataMap[key]}
        };
        for(var key in rulesMap || {}) {
            var message = validate(key);
            if(message !== true) {
                //push error message
                stacks.push(new exception(key, message)); 
            }
        }
        return new closure.result(stacks);
    };
    
    rigel.validation = exports;
})(window, document);

/**
java -jar /home/work/code-snippets/runable/WebContent/tools/yuicompressor.jar --type js --charset UTF-8 lib.js -o validation.min.js
*/