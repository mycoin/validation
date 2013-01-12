/**
 *                                                        ____   _____
 *  Struts2 Validation -- lib.js, version 1.1             \  /_  /   /
 *  Built at 2012/12/16 08:44 GMT                          \  / /   /
 *                                                          \/ /_  /
 *  (c) baidu.com 2012                                       \  / /
 *  All rights reserved.                                       / /
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
;(function(window, document, undefined) {
    var ENV_DEVELOPMENT = true;

    var exports = null,
        baidu = null,
        __closure = {
            version: "dev-1.0.0",
            validate: {}
        },
        __utils = {};

    var isset = function(field) {
            return !(undefined === field);
        };
    var trim = function(string) {
            string = string == null ? "" : string;
            return string.replace(new RegExp("(^[\\s\\t\\xa0\\u3000]+)|([\\u3000\\xa0\\s\\t]+$)", "g"), "");
        };
    var stringify = function(value) {
            return value == null || value == undefined ? "" : value;
        };
    var empty = function(value) {
            return value == "" || value == null || value == undefined || value == false;
        };
    /*
     * Define the regular expressions that will be used
     */
    __closure.validate = {

        ValidateRequired: function(rule, value) {
            value = stringify(value);
            isset(rule["trim"]) && (value = trim(value));
            return empty(value) ? rule.message : 0;
        },

        ValidateString: function(rule, value) {
            var regex = /^\-?[0-9]+$/,
                result = 0,
                value = stringify(value);

            if(isset(rule["min"]) && value.length < rule["min"] || isset(rule["max"]) && value.length > rule["max"]) {
                result = rule.message;
            }
            return empty(value) ? 0 : result;
        },

        ValidateInt: function(rule, value) {
            var regex = /^\-?[0-9]+$/,
                result = 0,
                value = Number(value);

            if(!/^\-?[0-9]+$/.test(value) || isset(rule["min"]) && value < rule["min"] || isset(rule["max"]) && value > rule["max"]) {
                result = rule.message;
            }
            return empty(value) ? 0 : result;
        }
    };
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
    /**
     * 清理不可见多于字符
     * @param {string} string 事件类型
     * @return {string} string
     */

    //exception function
    __closure.exception = function(message, type) {
        this.message = message;
        this.type = type || "exception";
        this.toString = function() {
            return this.type + ": " + this.message;
        }
    };
    /**
     * 序列化表单，转化为JSON格式
     * @public
     *
     * @param {Element | String} form main one of form elements
     * @param {Object} opt other options
     * @param {Element | String} context handle of validation
     * @return {Object} 表单数据
     */
    __closure.serialize = function(form, opt) {
        var eles = form.elements,
            dataMap = {};
        for(var i = 0, ele; ele = eles[i]; i++) {
            if(!ele.name || ele.name.substring(0, 1) === ":") {
                continue;
            }
            opt.trim == true && (ele.value = __utils.trim(ele.value)); //trim hook
            if(ele.tagName.toLowerCase() === 'input') {
                var type = ele.type.toLowerCase();
                switch(type) {
                case '':
                case 'text':
                case 'password':
                case 'hidden':
                    dataMap[ele.name] = ele.value;
                    break;
                case 'radio':
                    (undefined === dataMap[ele.name]) && (dataMap[ele.name] = "");
                    (true === ele.checked) && (dataMap[ele.name] = ele.value);
                    break;
                case 'checkbox':
                    (undefined === dataMap[ele.name]) && (dataMap[ele.name] = []);
                    (true === ele.checked) && (dataMap[ele.name].push(ele.value));
                    break;
                }
            } else if(ele.tagName.toLowerCase() === 'select') {
                dataMap[ele.name] = ele.value;
            } else if(tag === "textarea") {
                dataMap[key] = ele.value;
            }
        }
        opt.onBeforeValidate && opt.onBeforeValidate.call(null, this, dataMap);
        return dataMap;
    };
    /**
     * 私有函数，验证单个Ele值正确
     * @privacy
     *
     * @param {Object} context 验证规则对象
     * @param {String} key 表单域的名称
     * @param {Object} opt 配置项
     * @return {Array || Number} 验证结果集合
     */
    __closure.check = function(context, key, opt) {
        var message = null;
        var ruleMap = context.rules[key];
        var dataMap = context.data;

        var result, value = dataMap[key] || null;
        //resolve errors
        var resolve = function(errorMsg) {
                (errorMsg || message === null) && (message = errorMsg);
            };
        //traverse rules
        for(var type in ruleMap || {}) {
            var rule = ruleMap[type] || {};
            (type = type.toLowerCase()) && (type = type.substr(0, 1).toUpperCase() + type.substr(1));

            var caller = __closure.validate["Validate" + type] || context.custom["Custom" + type];
            if(typeof caller == "function") {
                resolve(caller.call(null, rule, value, dataMap));
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
    /*
     * The exposed public object to validate a form:
     *
     * @param {Element} the validated form element
     * @param {Element} rules rule map, key as rule
     * @param {Object} opt [{
     *     trim: true will trim the dom elements
     *     onBeforeValidate: hook function before validation
     *     onBeforeValidate: hook function before validation
     *     rules: required|matches[password_confirm]
     * }]
     * @param callback - Function - The callback after validation has been performed.
     */
    exports = function(ele, rules, opt) {
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
        if(ele) {
            this.uuid = "$ID" + new Date().getTime();
            this.rules = rules || {};
            this.form = ele;
            this.custom = {};
            this.opt = opt || {};
            return this;
        }
        throw new __closure.exception("There's no form element to validate.", "ValidateException");
    };
    /**
     * Expose interface function check
     * @public
     *
     * @return {NULL | Object} Verification result, return if there is mistake
     */
    exports.prototype.check = function() {
        var returns = [],
            rulesMap = this.rules;
        this.data = __closure.serialize.call(null, this.form, this.opt) || {};

        for(var key in rulesMap) {
            var ret = __closure.check.call(null, this, key);
            //push error message
            ret && returns.push(ret);
        }
        return returns.length > 0 ? returns : true;
    };
    /**
     * Registered custom validation function, parameters {data, name}
     * @public
     *
     * @return {NULL | Object} Verification result, return if there is mistake
     */
    exports.prototype.register = function(type, method) {
        this.custom["Custom" + type] = method;
    };
    //check if the arguements illegal
    exports.prototype.interrupt = function(key, value) {
        





    }
    //export it out
    Form.Validate = exports;



})(window, document);