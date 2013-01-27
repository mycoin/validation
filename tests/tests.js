test("require validation case", function () {
    var rules = {
        custName: {
            "required": {"message": "custNameNull"}
        }
    }
    var data = {
        custName : ""
    }
    var result = rigel.validation.check(data, rules);
    ok(result.result == false, "result true right!")
    ok(result.field == "custName", "field custName right!")
    ok(result.message == "custNameNull", "result message right!");
    var data = {
        custName : "Hi"
    }
    var result = rigel.validation.check(data, rules);
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
    var result = rigel.validation.check(data, rules);
    ok(result.field == "custName", "custName has trimed, but failed.");
    ok(result.stacks.length == 1, "Only custPage passed, because of needness of trim");

});

test("validation int with max, min rules", function () {
    var rules = {
        ageMin: {
            "int": {"min": 18,"max": 100}
        },
        ageNone: {
            "int": {"min": 18}
        }
    }
    var data = {
        ageMin : "1",
        ageNone: "20"
    }
    var result = rigel.validation.check(data, rules);
    ok(result.result == false, "ageMin is not in 18 < 100, OK!");
    ok(result.field == "ageMin", "ageMin not pass, OK!");
});
