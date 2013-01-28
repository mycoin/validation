x-validator.js
==============

an other form validation based on the struts2 framework ..

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
if(false == checking.result) {
    alert(checking.message);
    return false;
}