var server_url = "http://123.24.206.9:8983/";
var websiteName = "BỆNH VIỆN PHỔI TRUNG ƯƠNG";
var $scope;

function getPositionDoctor(user, department, position) {
    var departmentName = "";
    var positionName = "";
    positionName = position.name;
    if (department)
        departmentName = department.name;
    if (!departmentName)
        departmentName = "";
    return positionName + " " + departmentName;
    // return positionName + " " + departmentName + " - Bệnh viện Phổi trung ương";
}

function seeMoreContent(minLength,content, status) {
    var text = "";
    if (status == true) {
        if (content.length > minLength) {
            text = content.substring(0, minLength);
            for (i = minLength; i < 300; i++) {
                text = content.substring(0, i);
                if (text.endsWith(" ")) {
                    return text + "...";
                    status == false;
                }
            }
        } else if (content.length <= minLength){
            return content;
        }
    } else if (status == false) {
        return content;
        status == true;
    }
}

var ImgError = function (source) {
    source.src = "/static/images/Profile1.png";
    source.onerror = "Image";
    return true;
}

function getField(object, key) {
    if (key.indexOf(".") != -1) {
        var arr = key.split(".");
        object = object[arr[0]];
        return getField(object, key.substring(key.indexOf(".") + 1));
    }
    return object[key];
}

Array.prototype.clear = String.prototype.clear || function (key, text) {
    this.splice(0, this.length);
}

Array.prototype.toDic = String.prototype.toDic || function (key, text) {
    var dic = [];
    for (var i = 0; i < this.length; i++) {
        dic.push({
            id: getField(this[i], key),
            text: getField(this[i], text)
        })
    }
    return dic;
}

Array.prototype.pushAll = String.prototype.pushAll || function (arr) {
    for (var i = 0; i < arr.length; i++) {
        this.push(arr[i]);
    }
}


String.prototype.absoluteUrl = String.prototype.absolute || function (defaultValue) {
    var imgUrlLowerCase = this;
    if (this == "")
        if (defaultValue != undefined)
            return defaultValue;
        else
            return this;
    if (this.startsWith("http") || this.startsWith("blob")) {
        return this;
    }
    if (imgUrlLowerCase.toLocaleLowerCase().endsWith(".jpg") || imgUrlLowerCase.toLocaleLowerCase().endsWith(".png") || imgUrlLowerCase.toLocaleLowerCase().endsWith(".gif") || imgUrlLowerCase.toLocaleLowerCase().endsWith(".swf")) {
        if (imgUrlLowerCase.startsWith("/")){
            return server_url + imgUrlLowerCase.slice(1);
        } else
            return server_url + this;
    }
    if (!imgUrlLowerCase.toLocaleLowerCase().endsWith(".jpg") || !imgUrlLowerCase.toLocaleLowerCase().endsWith(".png") || !imgUrlLowerCase.toLocaleLowerCase().endsWith(".gif")) {
        return defaultValue;
    }
    return server_url + this;
}

String.prototype.absoluteUrlFile = String.prototype.absolute || function (defaultValue) {
    if (this == "")
        if (defaultValue != undefined)
            return defaultValue;
        else
            return this;
    if (this.startsWith("http") || this.startsWith("blob")) {
        return this;
    }
    return server_url + this;
}

String.prototype.capitalize = String.prototype.capitalize || function () {
    var val = this.toLowerCase(), newVal = '';
    val = val.split(' ');

    for (var c = 0; c < val.length; c++) {
        newVal += val[c].substring(0, 1).toUpperCase() + val[c].substring(1, val[c].length) + (c + 1 == val.length ? '' : ' ');
    }
    return newVal;
}

function guid() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
}

function genId() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }

    return s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();
}

angular.module('ng.select', []).value('uiSelect2Config', {})
    .directive('ngSelect', ['uiSelect2Config', '$timeout', function (uiSelect2Config, $timeout) {
        var options = {};
        if (uiSelect2Config) {
            angular.extend(options, uiSelect2Config);
        }
        return {
            require: 'ngModel',
            priority: 1,
            link: function (scope, elm, attrs, ngModel) {
                elm.attr("hasChange",0);
                elm.select2();
                scope.$watch(attrs.ngData, function (current, old) {
                    var change = parseInt(elm.attr("hasChange"));
                    if(!change) {
                        elm.attr("hasChange", 1);
                        return;
                    }
                    console.log(elm.attr("data-value"));
                    setTimeout(function () {
                        elm.val(elm.attr("data-value")).trigger("change");
                    }, 1000);
                });
                scope.$watch(attrs.ngModel, function (current, old) {
                    var change = parseInt(elm.attr("hasChange"));
                    if(!change) {
                        elm.attr("hasChange", 1);
                        return;
                    }
                    if (current) {
                        elm.attr("data-value", current);
                        setTimeout(function () {
                            elm.trigger("change");
                            if (attrs.ngChange) {
                                //
                                // var fun = scope.$eval(attrs.ngChange);
                                // if (fun)
                                //     fun();
                            }
                        }, 1000);
                    }
                    else {
                        setTimeout(function () {
                            if (!current)
                                elm.val("");
                            elm.trigger("change");
                        }, 1000);
                    }
                    // if (current === "" || current) {
                    //     if (attrs.ngData) {
                    //         var data = scope.$eval(attrs.ngData);
                    //         if (data && data.length > 0) {
                    //             setTimeout(function () {
                    //                 elm.trigger("change");
                    //             });
                    //         } else {
                    //             setTimeout(function () {
                    //                 elm.trigger("change");
                    //             }, 3000);
                    //         }
                    //     } else
                    //         setTimeout(function () {
                    //             elm.trigger("change");
                    //         });
                    // }
                }, true);
                elm.bind("$destroy", function () {
                    elm.select2("destroy");
                });

                attrs.$observe('disabled', function (value) {
                    elm.select2('enable', !value);
                });

                attrs.$observe('readonly', function (value) {
                    elm.select2('readonly', !!value);
                });
            }
        };
    }]);

var ngApp = angular.module('bvpApp', ['ngSanitize', 'ng.select', 'ui.select2', 'ngValidate', 'pascalprecht.translate'])
    .factory("fileManager", ['$http', function ($http) {
        return {
            upload: function (fileData, callBack, error, fileId) {
                var oMyForm = new FormData();
                oMyForm.append("file", fileData);
                $.ajax({
                    dataType: 'json',
                    enctype: 'multipart/form-data',
                    type: 'POST',
                    url: "/file/uploadImage",
                    data: oMyForm,
                    processData: false,  // tell jQuery not to process the data
                    contentType: false,  // tell jQuery not to set contentType
                    success: function (data) {
                        callBack(data, fileId);
                    },
                    error: function (data) {
                        error(data, fileId);
                    }
                });
            },
            uploadFiles: function (fileData, callBack, error) {
                var oMyForm = new FormData();
                oMyForm.append("file", fileData);
                $.ajax({
                    dataType: 'json',
                    enctype: 'multipart/form-data',
                    type: 'POST',
                    url: "/file/uploadFile",
                    data: oMyForm,
                    processData: false,  // tell jQuery not to process the data
                    contentType: false,  // tell jQuery not to set contentType
                    success: function (data) {
                        callBack(data);
                    },
                    error: function (data) {
                        error(data);
                    }
                });
            }
        }
    }])
    .factory("httpRequest", ['$http', function ($http) {
        return {
            $http: $http,
            post: function (url, data, success, failed, showLoading) {
                if (showLoading)
                    $("body").addClass("loading");
                $http({
                    method: 'post',
                    url: url,
                    data: data
                }).then(function successCallback(response) {
                        if (showLoading)
                            $("body").removeClass("loading");
                        if (success)
                            success(response.data);
                    },
                    function errorCallback(response) {
                        if (showLoading)
                            $("body").removeClass("loading");
                        if (failed)
                            failed(response.data);
                    });
            },
            get: function (url, success, failed, showLoading) {
                if (showLoading)
                    $("body").addClass("loading");
                $http({
                    method: 'get',
                    url: url
                }).then(function successCallback(response) {
                    if (showLoading)
                        $("body").removeClass("loading");
                    if (success)
                        success(response.data);
                }, function errorCallback(response) {
                    if (showLoading)
                        $("body").removeClass("loading");
                    if (failed)
                        failed(response.data);
                });
            },
            delete: function (url, success, failed, showLoading) {
                if (showLoading)
                    $("body").addClass("loading");
                $http({
                    method: 'DELETE',
                    url: url
                }).then(function successCallback(response) {
                    if (showLoading)
                        $("body").removeClass("loading");
                    if (success)
                        success(response.data);
                }, function errorCallback(response) {
                    if (showLoading)
                        $("body").removeClass("loading");
                    if (failed)
                        failed(response.data);
                });
            },
        }
    }])
    .directive('ckeditor', function ($rootScope) {
        return {
            require: 'ngModel',
            link: function (scope, element, attr, ngModel) {
                // enable ckeditor
                var ckeditor = CKEditorSetup.Show(attr.id);

                ckeditor.on('change', function () {
                    ngModel.$setViewValue(this.getData());
                });
            }
        };
    })
    .directive('ngRepeatDone', function () {
        return function (scope, element, attrs) {
            if (scope.$last) { // all are rendered
                scope.$eval(attrs.ngRepeatDone);
            }
        }
    })
    .directive('ngEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 13) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEnter);
                    });
                    event.preventDefault();
                }
            });
        };
    })
    .directive('ngEsc', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if (event.which === 27) {
                    scope.$apply(function () {
                        scope.$eval(attrs.ngEsc);
                    });
                    event.preventDefault();
                }
            });
        };
    })
    .directive('ngFileChange', function () {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs, ngModel) {
                var onChangeFunc = $scope.$eval(attrs.ngFileChange);
                element.bind('change', function (event) {
                    // ngModel.$setViewValue(event.target.value);
                    onChangeFunc($scope);
                    $scope.$apply();
                });
            }
        };
    })
    .directive('compile', function ($compile, $parse) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                var parsed = $parse(attr.ngBindHtml);

                function getStringValue() {
                    return (parsed(scope) || '').toString();
                }

                // Recompile if the template changes
                scope.$watch(getStringValue,
                    function () {
                        $compile(element,
                            null,
                            -9999)(
                            scope); // The -9999 makes it skip directives so that we do not recompile ourselves
                    });
            }
        };
    })
    .directive('ngDateMilisecond', function () {
        return {
            restrict: 'A',
            link: function ($scope, element, attrs) {

            }
        }
    })
    .directive('ngDatePicker', ['$parse', function ($parse) {
        return {
            restrict: 'A',
            require: '^ngModel',
            link: function ($scope, element, attrs, ngModel, ngDateMilisecond) {
                var format = attrs.ngDatePicker;
                var _callback = attrs.ngDatePickerCallBack;
                var callback;
                if (_callback)
                    callback = $scope.$eval(_callback);
                if (!format)
                    format = "dd/mm/yy";
                element.datepicker({
                    changeMonth: true,
                    changeYear: true,
                    numberOfMonths: 1,
                    defaultDate: "+1w",
                    prevText: '<i class="fa fa-chevron-left"></i>',
                    nextText: '<i class="fa fa-chevron-right"></i>',
                    dateFormat: format,
                    onSelect: function (date) {
                        if (attrs.ngDateMilisecond) {
                            try {
                                $scope.$apply(function () {
                                    $parse(attrs.ngDateMilisecond).assign($scope, element.datepicker("getDate").getTime());
                                });
                            } catch (e) {

                            }
                        }
                        if (ngModel)
                            ngModel.$setViewValue(date);
                        if (callback)
                            callback($scope);
                        $scope.$apply();
                    }
                });
            }
        };
    }])
    .directive('ngDatePickerCallBack', function () {
        return {
            restrict: 'A',
            link: function (scope, element, attrs) {
            }
        };
    })
    .directive('ngInputDate',function(){
        return {
            restrict:'A',
            require: "^ngModel",
            link:function (scope, element, attrs, ngModel) {
                element.checkDate({
                    callback:function () {
                        scope.$apply(function () {
                            scope.$eval(attrs.ngInputDate);
                        });
                    }
                })
            }
        }
    });
ngApp.config(["$translateProvider", function ($translateProvider) {
    try {
        var lan = storageMgr.read("LANG");
        var data = JSON.parse(lan);
        $translateProvider.translations('en', data.en);
        $translateProvider.translations('vi', data.vi);
        $translateProvider.preferredLanguage('vi');
    } catch (e) {
        console.log(e);
    }

    $.getJSON('/dictionary/dictionary', function (dataApp) {

        try {
            var data = {
                vi: {},
                en: {}
            }
            dataApp.forEach(function (item) {
                data.vi[item.key] = item.vi;
                data.en[item.key] = item.en;
            })
            storageMgr.write("LANG", JSON.stringify(data), 365)
            $translateProvider.translations('en', data.en);
            $translateProvider.translations('vi', data.vi);
            $translateProvider.preferredLanguage('vi');
        } catch (e) {
            console.log(e);
        }
    }).fail(function (e) {
    });
}]);
ngApp.filter('range', function () {
    return function (input, total) {
        total = parseInt(total);
        for (var i = 0; i < total; i++)
            input.push(i);
        return input;
    };
});
