String.prototype.isEmail = function () {
    // var re = /^([a-zA-Z0-9]){4,}\@[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9].[a-zA-Z]{2,}$/g;
    // var re = /^([a-zA-Z0-9]+(\.|_)?[a-zA-Z0-9]+)*\@[a-zA-Z0-9][a-zA-Z0-9-]{1,61}([a-zA-Z0-9].[a-zA-Z]{2,})+$/g;
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g
    return re.test(this.toLowerCase());
}
String.prototype.isNickname = function () {
    var re = /^([a-zA-Z0-9_]){6,}$/g;
    return re.test(this.toLowerCase());
}
String.prototype.isUserName = function () {
    var re = /^([a-zA-Z0-9_]){6,}$/g;
    return re.test(this.toLowerCase());
}
String.prototype.isFullName = function () {
    var re = /[0-9~!@#$%^&*()+\-_=\[\]{};':"\\|,.<>\/?]/;
    return !re.test(this);
}

String.prototype.isPhoneNumber = function () {
    var re = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/g;
    return re.test(this);
}
