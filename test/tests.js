var exports = validator;
test("require validation case", function () {
    var rules = {
        custName: {
            "required": {"message": "custNameNull"}
        }
    }
    var data = {
        custName : ""
    }
    var result = exports.validate(data, rules);
    ok(result.result == false, "result true right!")
    ok(result.field == "custName", "field custName right!")
    ok(result.message == "custNameNull", "result message right!");
    var data = {
        custName : "Hi"
    }
    var result = exports.validate(data, rules);
    ok(result.result == true, "result false right!")

});

test("requiredstring validation case", function () {
   var rules = {
        custName: {
            "requiredstring": {"message": "MustInputTrimed","trim": true}
        },
        custPage: {
            "requiredstring": {"message": "MustInput"}
        }
    }
    var data = {
        custName : " ",
        custPage: " "
    }
    var result = exports.validate(data, rules);
    ok(result.field == "custName", "custName has trimed, but failed.");
    ok(result.stacks.length == 1, "Only custPage passed, because of needness of trim");

});

test("validation int with max, min rules", function () {
    var rules = {
        ageMin: {
            "int": {"min": 18,"max": 100, message: "IntError"}
        },
        ageNone: {
            "int": {"min": 18}
        }
    }
    var data = {
        ageMin : "1",
        ageNone: "20"
    }
    var result = exports.validate(data, rules);
    ok(result.result == false, "ageMin is not in 18 < 100, OK!");
    ok(result.field == "ageMin", "ageMin not pass, OK!");
});

test("validation double with minInclusive, maxInclusive rules", function () {
    var rules = {
        doubleLength: {
            "double": {"minInclusive": 10.000, "maxInclusive": 10.002}
        },
        doublePrice: {
            "double": {"minInclusive": 10.001, "maxInclusive": 10.001}
        },
        doubleExclude: {
            "double": {"minExclusive": 10.001,"maxExclusive": 10.001, message: "ExclusiveError"}
        }
    };
    var data = {
        doubleLength : 10.001,
        doublePrice: 10.001,
        doubleExclude: 10.001
    };
    var result = exports.validate(data, rules);

    ok(result.result == false, "minInclusive and maxInclusive take place, OK!");
    ok(result.message == "ExclusiveError", "minExclusiveValue and maxExclusiveValue take place, OK!");
});

test("validation date with min, max rules", function () {
    var rules = {
        "fromDate": {
            "date": { min: "2012-1-1", max: "2012-12-12", message: "FromError"}
        },
        "endDate": {
             "date" : {min: "2012-1-1", max: "2012-12-12", message: "EndError"}
         }
    };
    var data = {
        fromDate: "2012-6-6",
        endDate : "2013-8-8"
    }
    var result = exports.validate(data, rules);
    ok(result.result == false, "date validation take place, OK!");
    ok(result.message == "EndError", "error value take place, OK!");
});

test("validation email.", function(){
    var rules = {
        rightEmail: {email: {message : "RightError"}},
        wrongEmail: {email: {message : "WrongError"}}
    };
    var data = {
        rightEmail : "liuronghan@baidu.com",
        wrongEmail : "#mail%"
    }
    var result = exports.validate(data, rules);
    ok(result.result == false, "email field, OK!");
    ok(result.message == "WrongError", "message, ok!")
});

test("validation of stringlength, case", function(){
    var rules = {
        accName: {
            stringlength : {maxLength: 10, minLength: 5,message: "accNameError" }
        },
        sendMsg: {
            stringlength : {maxLength: 10, minLength: 5, message: "sendMsg", trim: true}
        },
        sendLength: {
            stringlength : {maxLength: 10, minLength: 5, message : "sendLength"}
        }
    };

    var data = {
        accName : "admin",
        sendMsg: "ok",
        sendLength: "1234567890@@@"
    };
    var result = exports.validate(data, rules);
    ok(result.result == false, "result ,OK!");
    ok(result.stacks.length == 2, "error length  == 2, OK!");
    ok(result.message == "sendMsg", "error message, OK");



    var data = {
        accName: "1234567890-=",
        sendMsg: "     123456          ",
        sendLength: "        2"
    };
    result = exports.validate(data, rules);
    ok(data.sendMsg.length == 21 && result.message !== "sendMsg" , "thought, length > 10, but trimed better , OK!")
    ok(data.sendLength.length == 9 && result.message !== "sendLength" , "");
});