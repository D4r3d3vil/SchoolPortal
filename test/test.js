Array.prototype.remove = function(value, ary) {
    return ary.filter(function(v) {
        return v != value;
    });
}
let students = ["test", "test1"]
console.log(students.remove("test", students)) 