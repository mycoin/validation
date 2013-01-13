/**
 *                                                        ____________
 *  Struts2 Validation -- lib.js, version 1.1             \  /_  /   /
 *  Built at 2012/12/16 08:44 GMT                          \  / /   /
 *                                                          \/ /_  /
 *  (c) baidu.com 2012                                       \  / /
 *  All rights reserved.                                      \/ /
 *  Visit https://github.com/mycoin/validation for details     \/
 *
 */
var Form = {};
var debug = function(error, type) {
        console[type || "warn"](error);
    };
/*
 * If you would like an application-wide config, change this default name.
 * Otherwise, use the Validate to handle form specific messages.
 */
;
(function(window, document, undefined) {
    var exports = null,
        __closure = {
            version: "dev-1.0.0",
            main: {}
        },
        __utils = {};
    /*
     * Define the regular expressions that will be used
     */
    __closure.main = function() {
        function isset(field) {
            return !(undefined === field);
        };

        function trim(string) {
            string = string == null ? "" : string;
            return String(string).replace(new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+$)", "g"), "");
        };

        function empty(value) {
            if(value == null || value == undefined) {
                value = "";
            }
            return value.length == 0;
        };
        function stringify(value) {
            return value == null || value == undefined ? "" : value;
        };

        return {
            "required": function(R, value) {
                value = stringify(value);
                R["trim"] && (value = trim(value));
                return empty(value) ? R.message : 0;
            },

            "string": function(R, value) {
                var regex = /^\-?[0-9]+$/,
                    result = 0,
                    value = stringify(value);

                if(isset(R["min"]) && value.length < R["min"] || isset(R["max"]) && value.length > R["max"]) {
                    result = R.message;
                }
                return empty(value) ? 0 : result;
            },

            "int": function(R, value) {
                var regex = /^\-?[0-9]+$/,
                    result = 0,
                    value = Number(value);

                if(!/^\-?[0-9]+$/.test(value) || isset(R["min"]) && value < R["min"] || isset(R["max"]) && value > R["max"]) {
                    result = R.message;
                }
                return empty(value) ? 0 : result;
            }
        }
    }();
    var ruleRegex = /^(.+)\[(.+)\]$/,
        numericRegex = /^[0-9]+$/,
        integerRegex = /^\-?[0-9]+$/,
        decimalRegex = /^\-?[0-9]*\.?[0-9]+$/,
        emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,6}$/i,
        alphaRegex = /^[a-z]+$/i,
        alphaNumericRegex = /^[a-z0-9]+$/i,
        alphaDashRegex = /^[a-z0-9_-]+$/i,
        naturalRegex = /^[0-9]+$/i,
        naturalNoZeroRegex = /^[1-9][0-9]*$/i,
        ipRegex = /^((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){3}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})$/i,
        base64Regex = /[^a-zA-Z0-9\/\+=]/i;

    //exception function
    __closure.exception = function(message, type) {
        this.message = message;
        this.type = type || "exception";
        this.toString = function() {
            return this.type + ": " + this.message;
        }
    };
    //filter value
    __closure.trim = function (ele) {
        var regex = new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+$)", "g")
        ele.value = ele.value.replace(regex, "");
    }

    //xss value
    __closure.xss = function (ele) {
        ele.value = ele.value.replace(/<\/?[^>]+>/g,''); //remove html tags
    }
    /**
     * Serialization forms, into JSON format
     * @public
     *
     * @param {Element | String} form main one of form elements
     * @param {Object} opt other options
     * @param {Element | String} context handle of validation
     * @return {Object} Form data
     */
    __closure.serialize = function(form, opt) {
        var eles = form.elements,
            dataMap = {};
        for(var i = 0, ele; ele = eles[i]; i++) {
            if(!ele.name || ele.name.substring(0, 1) === ":") {
                continue;
            }
            if(ele.tagName.toLowerCase() === "input") {
                var type = ele.type.toLowerCase();
                true == opt.without_trim || __closure.trim(ele);
                switch(type) {
                case "":
                case "text":
                case "password":
                    dataMap[ele.name] = ele.value;
                    break;
                case "radio":
                    (undefined === dataMap[ele.name]) && (dataMap[ele.name] = "");
                    (true === ele.checked) && (dataMap[ele.name] = ele.value);
                    break;
                case "checkbox":
                    (undefined === dataMap[ele.name]) && (dataMap[ele.name] = []);
                    (true === ele.checked) && (dataMap[ele.name].push(ele.value));
                    break;
                case "hidden":
                    dataMap[ele.name] = ele.value;
                    break;
                }
            } else if(ele.tagName.toLowerCase() === "select") {
                dataMap[ele.name] = ele.value;
            } else if(tag === "textarea") {
                opt.without_xss || __closure.xss(ele); //xss hook
                dataMap[key] = ele.value;
            }
        }
        typeof opt.onBeforeValidate == "function" && opt.onBeforeValidate(dataMap);
        return dataMap;
    };
    /**
     * Private function, verify the correct individual Ele value
     * @privacy
     *
     * @param {Object} context Validation rule object
     * @param {String} key the form elements name
     * @param {Object} opt configuire
     * @return {Array || Number} result data
     */
    __closure.check = function(context, key, opt) {
        var message = null;
        var ruleMap = context._rulesMap[key];
        var dataMap = context.data;

        var result, value = dataMap[key] || null;
        //traverse rules
        for(var type in ruleMap || {}) {
            var rule = ruleMap[type] || {};
            var caller = __closure.main[type] || context.custom[type];
            if(typeof caller == "function") {
                var errorMsg = caller.call(null, rule, value, dataMap);
                (errorMsg || message === null) && (message = errorMsg);
            } else {
                __closure.warn("Validation function " + type + " is not found, please register it.");
            }
        }
        return message; //? {message:message, key: key} : 0;
    }
    /**
     * Error messages warning
     * @privacy
     *
     * @param {String} message Error messages
     */
    __closure.warn = function(message) {
        console.warn(message);
    }

    __closure.exception = function (context, field, message) {
        this.field = field;
        this.message = message;
        return this;
    };
    /*
     * The exposed public object to validate a form:
     *
     * @param {Element} the validated form element
     * @param {Element} rules rule map, key as rule
     * @param {Object} opt [{
     *     trim: true will trim the dom elements
     *     rules: required|matches[password_confirm]
     * }]
     * @param callback - Function - The callback after validation has been performed.
     */
    exports = function(ele, rulesMap, opt) {
        if(!(ele && ele.nodeName && ele.nodeType == 1)) {
            ele = document.forms[ele] || document.getElementById(ele);
        }
        while(ele) {
            if(ele.tagName == 'FORM') {
                break;
            }
            ele = ele.parentNode;
            (ele.tagName == 'BODY') && (ele = null);
        }
        if(ele && rulesMap) {
            this._rulesMap = rulesMap || {};
            this.form = ele;
            this.custom = {};
            this.opt = opt || {};
            this.stack = [];
            return this;
        }
        throw new __closure.warn("No rules or elements to validate.");
    };
    /**
     * Expose interface function check
     * @public
     *
     * @return {NULL | Object} Verification result, return if there is mistake
     */
    exports.prototype.check = function(data) {
        this.stack = [];
        var rulesMap = this._rulesMap;
        this.data = data || __closure.serialize(this.form, this.opt) || {};
        for(var key in rulesMap) {
            var message = __closure.check(this, key);
            if(0 == message || undefined == message || null == message) {
                continue;
            }
            var error = new __closure.exception(this, key, message);
            //push error message
            this.stack.push(error);
        }
        return this.stack.length == 0;
    };

    exports.prototype.getException = function() {
        if(this.stack.length == 0) {
            return null;
        } else {
            return this.stack[0];
        }
    };
    //get error message 
    exports.prototype.getMessage = function() {
        return this.getException().message;
    };
    //get field name
    exports.prototype.getFieldName = function() {
        return this.getException().field;
    };
    //Registered custom validation function, parameters {data, name}
    exports.prototype.register = function(type, method) {
        this.custom[type] = method;
        return this;
    };
    //set parameter
    exports.prototype.setParameter = function(key, value) {
        this.opt[key] = value;
        return this;
    };
    //export it out
    Form.Validate = exports;
})(window, document);