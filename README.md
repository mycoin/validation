validator.js
==============

an other form validation based on the struts2 framework ..

you can define the form validate config like this:
<pre>
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
</pre>
familiar with't ? the same structure as validation.xml.

now, use your library to get form data:
var data = $("#reg_form").serialize(); 

then fire the main function:
<pre>
var checking = rigel.validation.check(data, rules);
if(false == checking.result) {
    alert(checking.message);
    return false;
}
...
</pre>

the result will be like this:
<pre>
result = {
    result: true,
    stacks:[]
};

result = {
    result: false,
    stacks:[{
            field: "loginUserName",
            message: "error UserName.."
        }, {
            field: "loginPassword",
            message: "error password.."
        }
    ],
    field: "loginUserName",
    message: "error UserName.."
}
</pre>
