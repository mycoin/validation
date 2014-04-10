/*
 * Other form validatior based on the struts2 framework.
 *
 * Copyright 2013 Baidu Inc. All rights reserved.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the 'Software'), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, restore, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * author:  mycoin (nqliujiangtao@gmail.com)
 * date:    2013/09/28
 * repos:   https://github.com/mycoin/validation
 */
;(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
        
    } else if (typeof exports === 'object') {

        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.validator = factory();
    }
}(this, function () {
    'use strict';

    // exports object
    var exports = {
        version: 'stable-1.0.1'
    },

    /**
     * notice String(undefined) == '', so assert null into ''
     * @param Object {null, uindefined, String}, yes, toString method instead
     * @return return a string that has been trimed.
     */
    trim = function (string) {
        return string.replace(/^[\s\xa0\u3000]+|[\u3000\xa0\s]+$/g, '');
    },

    /**
     * restore null, empty string, and undefined to a param item.
     * @example restore(message, '');
     *
     * @param Object value
     * @param Object type
     * @return Object value (optional)
     */
    restore = function (value, type) {
        if (value === '' || value === undefined || value === null) {
            value = type;
        }
        return value;
    },

    /**
     * parse a string to Date
     * @example parseDate('2014-01-06');
     *
     * @param date [string] string value
     * @return Date
     */
    parseDate = function(date) {
        var temp = date;
        if (temp = Date.parse(date)) {
            //if type of date is Date, also exit here
            return new Date(temp);
        }
        temp = date;
        if (/^[0-9\-\/\ :]*$/.test(temp)) {
            temp = temp.replace(/\-/g, '/');
            if (temp = new Date(temp)) {
                return temp;
            }
        }
        return NaN;
    },

    /**
     * the main validations rules, contains [required, 
        requiredstring, int, double, date, email, regex, url, stringLength..]
     * any bugs contant nqliujiangtao@gmail.com
     * @return true || message string.
     */
    validators = {
        /**
         * RequiredFieldValidator checks if the specified field is not null.
         * @see RequiredFieldValidator.java
         */
        'required': function(rule, value) {
            value = restore(value, null);
            return value == null ? rule['message'] : true;
        },
        /**
         * checks that a String field is non-null and has a length > 0
         * rule {trim}
         * @see RequiredStringValidator.java
         */
        'requiredstring': function(rule, value) {
            value = restore(value, '');
            rule['trim'] == true && (value = trim(value));
            return value.length == 0 ? rule['message'] : true;
        },
        /**
         * checks if the integer specified is within a certain range.
         * rule {min, max}
         * @see IntRangeFieldValidator.java
         */
        'int': function(rule, value) {
            // if there is no value - don't do comparison
            // if a value is required, a required validator should be added
            value = restore(value, null);
            if (value == null) {
                return true;
            }
            if (!/^\-?[0-9]+$/.test(value)) {
                //not a number
                return rule['message'];
            } else {
                value = parseInt(value);
            }
            var min = parseInt(rule['min']);
            var max = parseInt(rule['max']);
            //only check for a minimum value if the min parameter is set
            if (!isNaN(min) && value - min < 0) {
                return rule['message'];
            }
            //only check for a minimum value if the max parameter is set
            if (!isNaN(max) && value - max > 0) {
                return rule['message'];
            }
            return true;
        },
        /**
         * checks if the long specified is within a certain range.
         * rule {min, max, message}
         * @see LongRangeFieldValidator.java
         */
        'long': function() {
            //for yuicompressor `int` is a keyword
            return validators['int']([].slice.call(arguments));
        },
        /**
         * checks if the double specified is within a certain range.
         * rule {minInclusive, maxInclusive, minExclusive, maxExclusive}
         * @see DoubleRangeFieldValidator.java
         */
        'double': function(rule, value) {
            // if there is no value - don't do comparison
            // if a value is required, a required validator should be added
            value = restore(value, null);
            if (value == null) {
                return true;
            }
            if (!/^\-?[0-9]*\.?[0-9]+$/.test(value)) {
                //not a double, nani? double??
                return rule['message'];
            } else {
                value = parseFloat(value);
            }
            //the maximum inclusive value
            var maxI = parseFloat(rule['maxInclusive']);
            //the minimum inclusive value
            var minI = parseFloat(rule['minInclusive']);
            //the maximum exclusive value
            var maxE = parseFloat(rule['maxExclusive']);
            //the minimum exclusive value
            var minE = parseFloat(rule['minExclusive']);

            // nani ? so ga..
            if ((!isNaN(maxI) && value - maxI > 0) 
                    || (!isNaN(minI) && value - minI < 0) 
                    || (!isNaN(maxE) && value - maxE >= 0) 
                    || (!isNaN(minE) && value - minE <= 0)
                ) {
                return rule['message'];
            }
            return true;
        },
        /**
         * checks if the date supplied is within a specific range.
         * rule {min, max}
         * @see DateRangeFieldValidator.java
         */
        'date': function(rule, value) {
            // if there is no value - don't do comparison
            // if a value is required, a required validator should be added
            value = restore(value, null);
            if (value == null) {
                return true;
            }
            var value = parseDate(value);

            if (!value || 'Invalid Date' == value) {
                return rule['message'];
            }
            var min = parseDate(rule['min']);
            var max = parseDate(rule['max']);

            //only check for a minimum value if the min date is set
            if (!isNaN(min) && value.getTime() - min.getTime() < 0) {
                return rule['message'];
            }
            //only check for a minimum value if the max date is set
            if (!isNaN(max) && value.getTime() - max.getTime() > 0) {
                return rule['message'];
            }
            return true;
        },
        /**
         * checks that a given String field is a valid email address.
         * rule {}
         * @see EmailValidator.java
         */
        'email': function(rule, value) {
            //struts2 is so stupid.
            rule['expression'] = '^[_A-Za-z0-9-]+(\.[_A-Za-z0-9-]+)*@([A-Za-z0-9-])+(\.[A-Za-z0-9-]+)*((\.[A-Za-z0-9]{2,})|(\.[A-Za-z0-9]{2,}\.[A-Za-z0-9]{2,}))$';
            
            // no case sensitive
            rule['caseSensitive'] = false;

            return validators.regex(rule, value);
        },

        /**
         * Validates a string field using a regular expression.
         * rule {expression, caseSensitive, trim}
         * @see EmailValidator.java and ExpressionValidator.java.java
         */
        'regex': function(rule, value) {
            value = restore(value, null);
            // string must not be empty
            if (value == null || trim(value).length == 0) {
                return true;
            }
            //from xwork2. e? Java is so stupid
            undefined == rule['caseSensitive'] && (rule['caseSensitive'] = true);
            undefined == rule['trim'] && (rule['trim'] = true);

            rule['trim'] == true && (value = trim(value));
            var opt = rule['caseSensitive'] ? 'i' : undefined;
            try {
                if (!new RegExp(rule['expression'], opt).test(value)) {
                    return rule['message'];
                }
            } catch (ex) {};

            return true;
        },
        /**
         * checks that a given field is a String and a valid URL.
         * rule {}
         * @see EmailValidator.java and ExpressionValidator.java.java
         * @todo what is 'URLUtil.verifyUrl'?? so ga.
         */
        'url': function(rule, value) {
            rule['expression'] = "^((https|http|ftp|rtsp|mms)?://)"
            // FTPusername,password
            + "?(([0-9a-z_!~*'().&=+$%-]+: )?[0-9a-z_!~*'().&=+$%-]+@)?"
            // IP
            + "(([0-9]{1,3}\.){3}[0-9]{1,3}"
            // allowd domains
            + "|"
            // www.
            + "([0-9a-z_!~*'()-]+\.)*"
            // secondhost
            + "([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\."
            // first level domain
            + "[a-z]{2,6})"
            // port
            + "(:[0-9]{1,4})?"
            // aslashisn'trequiredifthereisnofilename
            + "((/?)|"
            // file,hash.
            + "(/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+/?)$";

            // no case sensitive
            rule['caseSensitive'] = false;

            return validators.regex(rule, value);
        },

        /**
         * checks that a String field is of a certain length.
            The 'trim' parameter determines whether it will trim
            If unspecified, the String will be trimmed.
         * rule {minLength, maxLength, trim}
         * @see StringLengthFieldValidator.java
         */
        'stringlength': function(rule, value) {
            // if there is no value - don't do comparison
            // if a value is required, a required validator should be added
            value = restore(value, null);
            // as less as length of 0 ? so ga
            if (value == null || value.length <= 0) {
                return true;
            }
            undefined == rule['minLength'] && (rule['minLength'] = -1);
            undefined == rule['maxLength'] && (rule['maxLength'] = -1);
            undefined == rule['trim'] && (rule['trim'] = true);
            // use a required validator for these
            rule.trim == true && (value = trim(value));

            if ((rule['minLength'] > -1) && (value.length < rule['minLength'])) {
                return rule['message'];
            } else if ((rule['minLength'] > -1) 
                    && (value.length > rule['minLength'])
                ) {
                return rule['message'];
            }
            return true;
        }
    },

    /**
     * the portal entry, check if the data matches the rules.
     * @public
        var rules = {
            'custPhone': {
                'required': {
                    message: 'CustPhone required.'
                },
                'regex': {
                    'caseSensitive': false,
                    'trim': true,
                    'expression': '^1[3|5|8]{1}[0-9]{9}$',
                    'message': '`custPhone` error format.'
                }
            }
        };
        validate({regAccount: '13262665527'}, rules);
        returns {result: true, stacks: [], message: 'OK'}
     *
     * @param dataMap {Object} the form data, JSON format.
     * @param rulesMap {Object} validate mapping, serialized 
     *      by `opensymphony/xwork2/validator`
     * @return {Object} the validate result, key [`result`, `message`, `stacks`].
     */
    validate = exports.validate = function(dataMap, rulesMap) {
        var stacks = [];
        for (var key in rulesMap || {}) {
            for (var name in rulesMap[key] || {}) {
                var rule = rulesMap[key][name] || {};
                var validator = validators[name];
                if (typeof validator == 'function') {
                    var message = validator(rule, dataMap[key], dataMap);
                    message !== true && stacks.push({
                        field: key,
                        message: message,
                        value: dataMap[key]
                    });
                } else {
                    throw new Error('Validation function ' + name + ' not found.');
                }
            }
        }
        return stacks.length ? {
            'result': false,
            'field': stacks[0].field,
            'message': stacks[0].message,
            'stacks': stacks
        } : {
            'result': true,
            'message': 'OK'
        };
    };
    
    return exports;
}));