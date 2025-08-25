# struts-validator

an other form validation based on the struts2 framework .. [README.pdf](README.pdf)

install like:

<pre>npm install struts-validator</pre>

you can define the form validate config like this:

```javascript
var rules = {
    regAccount: {
        required: {
            message: 'please input account.',
        },
        stringLength: {
            maxLength: 18,
            minLength: 3,
            message: 'account length error',
        },
    },
    regCellphone: {
        required: {
            message: 'please input your Cellphone.',
        },
        regex: {
            caseSensitive: false,
            trim: true,
            expression: '^1[3|5|8]{1}[0-9]{9}$',
            message: 'error in Cellphone.',
        },
    },
}
```

familiar with't ? the same structure as validation.xml.

now, use your library to get form data:
var data = $("#reg_form").serialize();

then fire the main function:

```javascript
var checking = validator.validate(data, rules);
if(false == checking.result) {
    alert(checking.message);
    return false;
}
...
```

the result will be like this:

```javascript
result = {
    result: true,
    stacks: [],
    message: 'OK',
}

result = {
    result: false,
    stacks: [
        {
            field: 'loginUserName',
            message: 'error UserName..',
        },
        {
            field: 'loginPassword',
            message: 'error password..',
        },
    ],
    field: 'loginUserName',
    message: 'error UserName..',
}
```
