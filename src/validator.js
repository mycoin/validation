/*
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
 * file:    another form validator based on the struts2 framework.
 * author:  Liu,Ronghan(liuronghan@baidu.com)
 * date:    2013/09/28
 * repos:   https://github.com/mycoin/validation
 */
;(function (global, factory) {
    // for AMD and CMD.
    typeof define === 'function' && define(factory);

    // Node.js and Browser `global`
    (typeof exports !== 'undefined' ? exports : global).validator = factory();

}(this, function () {
    // using strict mode
    'use strict'; 

    // exports object
    var exports = {
        version: 'stable-1.0.1'
    };
    
    /**
     * mark the right validation result.
     *  
     * @const
     * @type {number}
     */
    var OK = true;

    /**
     * strip whitespace from the beginning and end of a string
     *
     * @function
     * @public
     *
     * @param {String} source the target string that will be trimmed.
     * @return {string} the trimed string
     */
    function trim(source) {
        // don't use String(obj) because it could be overriden.
        source = ('' + source).replace(/^\s+/, '');

        // the source may be changed, never cache the length.
        for (var i = source.length - 1; i >= 0; i--) {
            if (/\S/.test(source.charAt(i))) {
                source = source.substring(0, i + 1);
                break;
            }
        }
        return source;
    };

    /**
     * restore null, empty string, and undefined to a default value.
     * @example restore(message, '');
     *
     * @param {*} value unknown subject
     * @param {*} optValue value the instead value
     * @return {*} value (optional)
     */
    function restore(value, optValue) {
        if (value === '' || value === undefined || value === null) {
            value = optValue;
        }
        return value;
    };

    /**
     * parse a string representation of a date, and returns the date type
     *
     * @param {string=} source the date string to parse
     * @return Date
     */
    function parseDate(source) {
        var ret = source;
        if (ret = Date.parse(source)) {
            // A string representing an RFC2822 or ISO 8601 date.
            return new Date(ret);
        }
        ret = source;
        if (/^[0-9\-\/\ :]*$/.test(ret)) {
            ret = ret.replace(/\-/g, '/');
            if (ret = new Date(ret)) {
                return ret;
            }
        }
        return false;
    };

    /**
     * Simple common assertion API
     * @public
     *
     * @param {*} condition The condition to test.  Note that this may be used to
     *     test whether a value is defined or not, and we don't want to force a
     *     cast to Boolean.
     * @param {string=} optMessage A message to use in any error.
     */
    function assert(condition, optMessage) {
        if (!condition) {
            var msg = 'Assertion failed';
            if (optMessage) {
                msg = msg + ': ' + optMessage;
            }
            throw new Error(msg);
        }
    }

    /**
     * the main validations rules, contains [required, requiredstring, int, 
     * double, date, email, regex, url, stringLength..]
     * any bugs contact nqliujiangtao@gmail.com
     */
    var validators = {
        /**
         * RequiredFieldValidator checks if the specified field is not null.
         * see the logic RequiredFieldValidator.java
         *
         * @param {Object} rule for `RequiredFieldValidator`
         * @param {*} value the value 
         */
        'required': function (rule, value) {
            value = restore(value, null);
            return value === null ? rule.message : OK;
        },

        /**
         * checks that a String field is non-null and has a length > 0
         * see the logic RequiredStringValidator.java
         *
         * @param {Object} rule for `RequiredStringValidator`
         * @param {*} value the value 
         */
        'requiredstring': function (rule, value) {
            value = restore(value, '');
            rule.trim === true && (value = trim(value));
            return value.length === 0 ? rule.message : OK;
        },

        /**
         * checks if the integer specified is within a certain range.
         * see the logic IntRangeFieldValidator.java
         *
         * @param {Object} rule for `IntRangeFieldValidator`
         * @param {*} value the value 
         */
        'int': function (rule, value) {
            // if there is no value - don't do comparison
            value = restore(value, null);
            if (value === null) {
                // if a value is required, a required validator should be added
                return true;
            }
            if (!/^\-?[0-9]+$/.test(value)) {
                // not a number
                return rule.message;
            } 
            else {
                value = parseInt(value);
            }
            var min = parseInt(rule.min);
            var max = parseInt(rule.max);

            // only check for a minimum value if the min parameter is set
            if (!isNaN(min) && value - min < 0) {
                return rule.message;
            }

            // only check for a minimum value if the max parameter is set
            if (!isNaN(max) && value - max > 0) {
                return rule.message;
            }
            return OK;
        },

        /**
         * checks if the long specified is within a certain range.
         * see the logic LongRangeFieldValidator.java
         *
         * @param {Object} rule for `LongRangeFieldValidator`
         * @param {*} value the value 
         */
        'long': function (rule, value) {
            // for yuicompressor `int` is a keyword
            return validators['int'].call(this, rule, value);
        },

        /**
         * checks if the double specified is within a certain range.
         * see the logic DoubleRangeFieldValidator.java
         *
         * @param {Object} rule for `DoubleRangeFieldValidator`
         * @param {*} value the value
         */
        'double': function (rule, value) {
            // if there is no value - don't do comparison
            // if a value is required, a required validator should be added
            value = restore(value, null);

            if (value === null) {
                return OK;
            }
            if (!/^\-?[0-9]*\.?[0-9]+$/.test(value)) {
                // not a double, nani? double??
                return rule.message;
            }
            else {
                value = parseFloat(value);
            }

            // the maximum inclusive value
            var maxInclusive = parseFloat(rule.maxInclusive);

            // the minimum inclusive value
            var minInclusive = parseFloat(rule.minInclusive);

            // the maximum exclusive value
            var maxExclusive = parseFloat(rule.maxExclusive);

            // the minimum exclusive value
            var minExclusive = parseFloat(rule.minExclusive);


            // nani ? so ga..
            if ((!isNaN(maxInclusive) && value - maxInclusive > 0) 
                    || (!isNaN(minInclusive) && value - minInclusive < 0) 
                    || (!isNaN(maxExclusive) && value - maxExclusive >= 0) 
                    || (!isNaN(minExclusive) && value - minExclusive <= 0)
                ) {
                return rule.message;
            }
            return OK;
        },

        /**
         * checks if the date supplied is within a specific range.
         * see the logic DateRangeFieldValidator.java
         *
         * @param {Object} rule rule for `DateRangeFieldValidator`
         * @param {*} value the value
         */
        'date': function (rule, value) {
            // if there is no value - don't do comparison
            value = restore(value, null);

            // if a value is required, a required validator should be added
            if (value === null) {
                return OK;
            }
            value = parseDate(value);

            // invalid date, return the error message.
            if (!value || 'Invalid Date' === value) {
                return rule.message;
            }

            var min = parseDate(rule.min);
            var max = parseDate(rule.max);

            // only check for a minimum value if the min date is set
            if (!isNaN(min) && value.getTime() - min.getTime() < 0) {
                return rule.message;
            }

            // only check for a minimum value if the max date is set
            if (!isNaN(max) && value.getTime() - max.getTime() > 0) {
                return rule.message;
            }

            return OK;
        },
        /**
         * checks that a given String field is a valid email address.
         * see the logic EmailValidator.java
         *
         * @param {Object} rule rule for `EmailValidator`
         * @param {*} value the value
         */

        'email': function (rule, value) {
            // set `CaseSensitive` false.
            rule.caseSensitive = false;

            // expression to validate that the string is an email address
            rule.expression = ''
                + '\\b'
                + '^[_A-Za-z0-9-]+(\.[_A-Za-z0-9-]+)*@([A-Za-z0-9-])+'
                + '(\.[A-Za-z0-9-]+)*((\.[A-Za-z0-9]{2,})|(\.[A-Za-z0-9]{2,}'
                + '\.[A-Za-z0-9]{2,}))$';

            // notice that `EmailValidator` extends `RegexFieldValidator`.
            return validators.regex.call(this, rule, value);
        },

        /**
         * Validates a string field using a regular expression.
         * see the logic ExpressionValidator.java
         *
         * @param {Object} rule rule for `ExpressionValidator`
         * @param {*} value the value
         */
        'regex': function (rule, value) {
            value = restore(value, null);
            // string must not be empty
            if (value === null || trim(value).length === 0) {
                return OK;
            }

            // logic from xwork2. Java is so stupid
            undefined === rule.caseSensitive && (rule.caseSensitive = true);
            undefined === rule.trim && (rule.trim = true);

            // er, trim value flag.
            rule.trim === true && (value = trim(value));
            var opt = rule.caseSensitive ? 'i' : undefined;

            try {
                // create a regular expression from given string.
                if (!new RegExp(rule.expression, opt).test(value)) {
                    return rule.message;
                }
            }
            catch (ex) {
                // bad regular expression? do nothing.
            };

            return OK;
        },
        /**
         * checks that a given field is a String and a valid URL.
         * see the logic com.opensymphony.xwork2.util.URLUtil
         *
         * @param {Object} rule rule for `URLUtil.java`
         * @param {*} value the value
         * @todo convert 'URLUtil.verifyUrl' logic to javascript.
         */
        'url': function (rule, value) {
            return OK;
        },
        /**
         * checks that a String field is of a certain length, a 'trim' parameter
         * determines whether it will trimed If unspecified it will be trimmed.
         * see the logic StringLengthFieldValidator.java
         *
         * @param {Object} rule for `StringLengthFieldValidator.java`
         * @param {*} value the value
         */
        'stringlength': function (rule, value) {
            // if there is no value - don't do comparison
            // if a value is required, a required validator should be added
            value = restore(value, null);

            // as less as length of 0 ? so ga
            if (value === null || value.length <= 0) {
                return OK;
            }

            undefined === rule.minLength && (rule.minLength = -1);
            undefined === rule.maxLength && (rule.maxLength = -1);
            undefined === rule.trim && (rule.trim = true);

            // use a required validator for these
            if (rule.trim === true) {
                value = trim(value);
            }

            if ((rule.minLength > -1) && (value.length < rule.minLength)) {
                return rule.message;
            } 
            else if ((rule.minLength > -1) && (value.length > rule.minLength)) {
                return rule.message;
            }

            return OK;
        }
    };
    /**
     * the portal entry, check if the data matches the rules..
     * @public
     *
     * @param {Object} collection the form data, JSON format.
     * @param {Object} rules validate mapping, serialized by `xwork2/validator`
     * @exception
     * @return {Object} the validate result, key [`result`, `message`, `stacks`].
     */
    exports.validate = function (collection, rules) {
        var stacks = [];

        for (var key in rules || {}) {
            for (var name in rules[key] || {}) {
                var rule = rules[key][name] || {};
                var func = validators[name];
                if (typeof func === 'function') {
                    // get the error message
                    var message = func(rule, collection[key], collection);

                    if (message !== OK) {
                        stacks.push({
                            field: key,
                            message: message,
                            value: collection[key]
                        });
                    }
                }
                else {
                    assert(false, 'Validator `' + name + '` not found.');
                }
            }
        }

        // notice the stacks`s length marks the validation result.
        return stacks.length ? {
            'result': false,
            'field': stacks[0].field, // the nearest field
            'message': stacks[0].message,
            'stacks': stacks
        } : {
            'result': true,
            'message': 'OK'
        };
    };

    /**
     * validate a form synchronously.
     * @public
     */
    exports.validateSync = function () {
        // setTimeout(fn, 0) often assumed to be done synchronously. 
        var me = this;
        var argv = [].slice.call(arguments, 0);

        // see {@link http://ejohn.org/blog/how-javascript-timers-work/}
        setTimeout(
            function() {
                exports.validate.apply(me, argv); 
            }, 
            0
        );
    };

    return exports;
}));
