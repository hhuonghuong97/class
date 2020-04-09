var listRole = [
    {id: 1, name: "Người dùng"},
    {id: 2, name: "Bác sĩ"},
    {id: 4, name: "Admin"},
    {id: 7, name: "Tất cả"},
]

function getRoleName(item) {
    var role = "";
    for (var i = 0; i < listRole.length; i++) {
        if ((item.role & listRole[i].id) == listRole[i].id) {
            if (listRole[i].id == 7)
                continue;
            if (role)
                role += ", ";
            role += listRole[i].name;
        }
    }
    return role;
};

function getRole(item, roleSelected) {
    item.role = 7;
    if (roleSelected) {
        var role = 0;
        for (var i = 0; i < roleSelected.length; i++) {
            role = role | roleSelected[i];
        }
        if (role == 0)
            role = 7;
        item.role = role;
    }
};

function getListRoleFromMenu(item) {
    var result = [];
    for (var i = 0; i < listRole.length; i++) {
        if ((listRole[i].id & item.role) == listRole[i].id) {
            if (listRole[i].id == 7)
                continue;
            result.push(listRole[i].id);
        }
    }
    return result;
};

var webType = 1;

ngApp.controller('bvpController', function ($scope, $http, $sce, fileManager) {
    $scope.dataTest = {};
    $scope.fileMgr = {
        chooseFile: function () {
            $("[file-input-id]").trigger("click");
        },
        selectFile: function () {
            var selector = $(event.target);
            var fileName = selector[0].value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
            if (common.endWith(fileName, ".pdf")) {
                $scope.dataTest.file = URL.createObjectURL(selector[0].files[0]);
                $scope.uploadingFile = false;
                fileManager.uploadFiles(selector[0].files[0], function (data) {
                    if (data.success) {
                        $scope.dataTest.file = data.data.file;
                        $scope.$apply();
                    } else {
                        alertSmallBox("Thêm file lỗi", error);
                    }
                }, function (response) {
                })
            } else {
                $("#select-file").val("");
                alertSmallBox("Vui lòng chọn file có định dạng .pdf", error)
            }
        },
        selectFileImg: function () {
            var selector = $(event.target);
            var fileName = selector[0].value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
            if (common.endWith(fileName, ".jpg") ||
                common.endWith(fileName, ".png") ||
                common.endWith(fileName, ".gif")) {
                $scope.dataTest.imageUrl = URL.createObjectURL(selector[0].files[0]);
                $scope.uploadingImg = false;
                fileManager.upload(selector[0].files[0], function (data) {
                    if (data.success) {
                        $scope.dataTest.imageUrl = data.data.images[0].image;
                        $scope.$apply();
                    } else {
                        alertSmallBox("Thêm ảnh lỗi", error);
                    }
                }, function (response) {
                });
            } else {
                $("#select-file-image-cover").val("");
                alertSmallBox("Vui lòng chọn hình ảnh có định dạng png, jpg, gif", error)
            }
        }
    };
    $scope.showLargeModal = function () {
        $("#bs-example-modal-lg").modal('show');
    };
    $scope.showSmallModal = function () {
        $("#bs-example-modal-sm").modal('show');
    };
    $scope.showLargeModalAdd = function () {
        $("#bs-example-modal-lg-add").modal('show');
    };
    $scope.showConfirmDialog = function () {
        confirmDialog("XÁC NHẬN", "Bạn có chắc chắn muốn nhận thông báo này?", function () {

        });
    };
    $scope.showAlertSuccess = function () {
        alertSmallBox("success", success);
    };
    $scope.showAlertError = function () {
        alertSmallBox("error", error);
    };
});
ngApp.controller('mgrSlideItemController', function ($scope, $http, httpRequest, fileManager) {
    $scope.href = window.location.origin;
    $scope.slideItem = [];
    $scope.dataSlideItem = {};
    $scope.stt = 1;
    $scope.size = 10;
    $scope.name = "";
    var urlPage = common.getQueryStringHash("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            $scope.page = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.page = urlPage;
        var url = "/slide-item/search?"
            + "&page=" + $scope.page
            + "&size=" + $scope.size
            + "&name=" + $scope.name
            + "&webType=" + webType
        httpRequest.get(url
            , function (data) {
                if (data.success) {
                    $scope.slideItem = data.data.data;
                    $scope.totalPage = common.getTotalPage($scope.size, data.data.total);
                    $scope.stt = 1 + ($scope.page - 1) * $scope.size;
                    $scope.listPage = [];
                    for (var i = $scope.page - 5; i < $scope.page + 5; i++) {
                        if (i > 0 && i <= $scope.totalPage)
                            $scope.listPage.push(i);
                    }
                    window.history.replaceState({}, "", "/admin/slide-item?trang=" + $scope.page);

                }
            }, function (data) {
            }, true);
    };
    $scope.loadPage(urlPage);
    $scope.imageUrl = {
        chooseFile: function () {
            $("[file-input-id]").trigger("click");
        },
        selectFile: function () {
            var selector = $(event.target);
            var fileName = selector[0].value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
            if (common.endWith(fileName, ".jpg") ||
                common.endWith(fileName, ".png") ||
                common.endWith(fileName, ".gif")) {
                $scope.dataSlideItem.image = URL.createObjectURL(selector[0].files[0]);
                $scope.uploading = true;
                fileManager.upload(selector[0].files[0], function (data) {
                    if (data.success) {
                        $scope.dataSlideItem.image = data.data.images[0].image;
                        $scope.uploading = false;
                        $scope.$apply();
                    } else {
                        alertSmallBox("Thêm ảnh lỗi");
                    }
                }, function (response) {
                });
            } else {
                $("#select-file-image-cover").val("");
                alertSmallBox("Vui lòng chọn hình ảnh có định dạng png, jpg, gif")
            }
        }
    };
    $.validator.addMethod("noFirstSpace", function (value, element) {
        return value && value[0] != ' ';
    }, "Vui lòng không để khoảng trống đầu dòng!");
    $scope.validationSlideItem = {
        rules: {
            nameSlideItem: {
                required: true,
                noFirstSpace: true
            }
        },
        messages: {
            nameSlideItem: {
                required: "Vui lòng nhập tên slide item!",
            }
        }
    };
    $scope.createSlideItem = function () {
        if ($("#form-slide-item").valid()) {
            if (!$scope.dataSlideItem.image) {
                alertSmallBox("Vui lòng chọn ảnh slide item!", error);
                return;
            }
            var oldHref = $scope.dataSlideItem.href;
            if (oldHref == null || oldHref == "") {
                $scope.dataSlideItem.href = "";
            } else if (oldHref.startsWith($scope.href)) {
                var newHref = oldHref.replace($scope.href, "");
                $scope.dataSlideItem.href = newHref;
            }
            $scope.dataSlideItem.webType = webType;
            httpRequest.post("/slide-item/create"
                , {slideItem: $scope.dataSlideItem}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.closedSlide();
                        $scope.loadPage(urlPage);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    };
    $scope.deleteSlideItem = function (item) {
        confirmDialog("Xác nhận", "Bạn có chắc chắn muốn xóa slide item này?", function () {
            $http({
                method: 'DELETE',
                url: '/slide-item/delete/' + item.slideItem.id,
            }).then(function successCallback(response) {
                if (response.data.success) {
                    alertSmallBox(response.data.data, success);
                    $scope.loadPage(urlPage);
                }
                else
                    alertSmallBox(response.data.message, error);
            });
        });
    };
    $scope.showdataUpdate = function (item) {
        $scope.showPopupSlideItem();
        $scope.dataSlideItem = JSON.parse(JSON.stringify(item.slideItem));
        $scope.dataSlideItem.image = item.slideItem.image.absoluteUrl();
    };
    $scope.resetImgInput = function () {
        $("#select-file-image-cover").val("");
    };
    $scope.canceldataSlideItem = function () {
        $scope.dataSlideItem = {};
        $scope.resetImgInput();
    };
    $scope.updateSlideItem = function (item) {
        if (!$scope.dataSlideItem.image) {
            alertSmallBox("Vui lòng chọn ảnh slide item!", error);
            return;
        }
        var oldHref = $scope.dataSlideItem.href;
        if (oldHref == null || oldHref == "") {
            $scope.dataSlideItem.href = "";
        } else if (oldHref.startsWith($scope.href)) {
            var newHref = oldHref.replace($scope.href, "");
            $scope.dataSlideItem.href = newHref;
        }
        if ($("#form-slide-item").valid()) {
            httpRequest.post("/slide-item/update/" + item.id
                , {
                    slideItem: {
                        id: $scope.dataSlideItem.id,
                        image: $scope.dataSlideItem.image,
                        href: $scope.dataSlideItem.href,
                        name: $scope.dataSlideItem.name,
                        webType: 1
                    }
                }
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.loadPage(urlPage);
                        $scope.closedSlide();
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    };
    $scope.showPopupSlideItem = function () {
        $("#popup-add-slideItem").modal('show');
    }
    $scope.closedSlide = function () {
        $("label.error").attr("style", "display:none;");
        $("#popup-add-slideItem").modal('hide');
        $scope.canceldataSlideItem();
    }
    $scope.checkHrefSlide = function (item) {
        if (item.href.startsWith("/")) {
            return $scope.href + item.href;
        } else {
            return item.href;
        }
    };
});
ngApp.controller('mgrSlideController', function ($scope, $http, httpRequest) {
    $scope.checkActive = true;
    $scope.checkActiveSlide = function (active) {
        $scope.checkActive = active;
    }
    $scope.slide = [];
    $scope.slideItem = [];
    $scope.dataSlide = {};
    $scope.slideItemIds = [];
    $scope.stt = 1;
    $scope.query = "";
    $scope.active = "";
    $scope.size = 10;
    $scope.intervalTime = "";
    $scope.autoPlay = "";
    $scope.name = "";
    $scope.webType = 1;
    var urlPage = common.getQueryStringHash("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            $scope.page = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.page = urlPage;
        var url = "/slide/search?"
            + "page=" + $scope.page
            + "&size=" + $scope.size
            + "&name=" + $scope.name
            + "&active=" + $scope.active
            + "&intervalTime=" + $scope.intervalTime
            + "&autoPlay=" + $scope.autoPlay
            + "&webType=" + $scope.webType
        httpRequest.get(url
            , function (data) {
                if (data.success) {
                    $scope.slide = data.data.data;
                    $scope.totalPage = common.getTotalPage($scope.size, data.data.total);
                    $scope.stt = 1 + ($scope.page - 1) * $scope.size;
                    $scope.listPage = [];
                    for (var i = $scope.page - 5; i < $scope.page + 5; i++) {
                        if (i > 0 && i <= $scope.totalPage)
                            $scope.listPage.push(i);
                    }
                    window.history.replaceState({}, "", "/admin/slide?trang=" + $scope.page);
                }
            }, function (data) {
            }, true);
    };
    $scope.loadPage(urlPage);
    httpRequest.get("/slide-item/search?"
        + "page=" + $scope.page
        + "&size=" + $scope.size
        + "&name=" + $scope.name
        + "&webType=" + $scope.webType
        , function (data) {
            if (data.success) {
                $scope.slideItem = data.data.data;
            }
        }, function (data) {
        }, true);
    $.validator.addMethod("selectCheck", function (value, element) {
        if ($(element).find("option").length > 1 && !value)
            return false;
        return true;
    }, "Vui lòng chọn slide item!");
    $.validator.addMethod("noFirstSpace", function (value, element) {
        return value && value[0] != ' ';
    }, "Vui lòng không để khoảng trống đầu dòng!");
    $scope.validationSlide = {
        rules: {
            nameSlide: {
                required: true,
                noFirstSpace: true
            },
            intervalTime: {
                required: true,
                number: true,
            },
            slideItemIds: {
                required: true,
                selectCheck: true
            },
        },
        messages: {
            nameSlide: {
                required: "Vui lòng nhập tên slide!",
            },
            intervalTime: {
                required: "Vui lòng nhập thời gian chờ",
                number: "Vui lòng nhập thời gian chờ bằng số",
            },
            slideItemIds: {
                required: "Vui lòng chọn slide item!",
            }
        }
    }
    $scope.createSlide = function () {
        $scope.dataSlide.active = $scope.checkActive ? 1 : 0;
        if ($scope.dataSlide.intervalTime > 10){
            alertSmallBox("Thời gian chờ không được lớn hơn 10s!", error);
            return;
        }
        if ($("#form-slide").valid()) {
            httpRequest.post("/slide/create"
                , {
                    slide: {
                        name: $scope.dataSlide.name,
                        active: $scope.dataSlide.active,
                        intervalTime: $scope.dataSlide.intervalTime * 1000,
                        webType: webType,
                    }
                    , slideItemIds: $scope.slideItemIds
                }
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        setTimeout(function () {
                            $scope.closedSlide();
                            $scope.loadPage(urlPage);
                        }, 1000)
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    }
    $scope.deleteSlide = function (item) {
        confirmDialog("Xác nhận", "Bạn có chắc chắn muốn xóa slide này?", function () {
            $http({
                method: 'DELETE',
                url: '/slide/delete/' + item.slide.id,
            }).then(function successCallback(response) {
                if (response.data.success) {
                    alertSmallBox(response.data.data, success);
                    setTimeout(function () {
                        $scope.loadPage(urlPage);
                    }, 1000)
                }
                else
                    alertSmallBox(response.data.message, error);
            });
        });
    };
    $scope.showdataUpdate = function (item) {
        $scope.showSlide();
        $scope.dataSlide = JSON.parse(JSON.stringify(item.slide));
        if (item.slide.active == 1) {
            $scope.dataSlide.active = true;
        } else {
            $scope.dataSlide.active = false;
        }
        $scope.dataSlide.intervalTime = item.slide.intervalTime / 1000;
        for (var i = 0; i < item.slideItems.length; i++) {
            $scope.slideItemIds[i] = item.slideItems[i].id;
        }

    }
    $scope.updateSlide = function (dataSlide) {
        if ($scope.dataSlide.intervalTime > 10){
            alertSmallBox("Thời gian chờ không được lớn hơn 10s!", error);
            return;
        }
        if ($("#form-slide").valid()) {
            $scope.dataSlide.active = $scope.checkActive ? 1 : 0;
            httpRequest.post("/slide/update/" + dataSlide.id
                , {
                    slide: {
                        name: $scope.dataSlide.name,
                        active: $scope.dataSlide.active,
                        intervalTime: $scope.dataSlide.intervalTime * 1000,
                        webType: webType,
                    }, slideItemIds: $scope.slideItemIds
                }
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        setTimeout(function () {
                            $scope.closedSlide();
                            $scope.loadPage(urlPage);
                        }, 1000)
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    }
    $scope.activeSlide = function (item) {
        if (item.active == 1) {
            var content = "Bạn có chắc chắn muốn hủy kích hoạt slide này?";
            var data = {active: 0};
            var message = "Hủy kích hoạt thành công!";
            var error = "Hủy kích hoạt thất bại!"
        } else {
            content = "Bạn có chắc chắn muốn kích hoạt slide này?";
            data = {active: 1}
            message = "Kích hoạt slide thành công!";
            error = "Kích hoạt slide thất bại!"
        }
        confirmDialog("XÁC NHẬN", content, function () {
            httpRequest.post("/slide/active/" + item.id,
                data,
                function (data) {
                    if (data.success) {
                        alertSmallBox(message, "success");
                        $scope.loadPage(urlPage);
                    } else {
                        alertSmallBox(error, error);
                    }
                }, function (data) {
                }, true);
        })
    };
    $scope.canceldataSlide = function () {
        $scope.dataSlide = {};
        $scope.slideItemIds = [];
        $scope.checkActive = true;

    }
    $scope.showSlide = function () {
        $("#popup-add-slide").modal('show');
    }
    $scope.closedSlide = function () {
        $("#popup-add-slide").modal('hide');
        $("label.error").attr("style", "display:none;");
        $scope.canceldataSlide();
    }
});
ngApp.controller('mgrSlidePlaceController', function ($scope, $http, httpRequest) {
    $scope.slidePlace = [];
    $scope.slideItem = [];
    $scope.dataSlide = {};
    $scope.slideItemIds = [];
    $scope.sttSlide = 1;
    $scope.name = "";
    $scope.webType = 1;
    $scope.page = 1;
    $scope.size = 10;
    $scope.listSlide = [];
    $scope.intervalTime = "";
    $scope.autoPlay = "";
    $scope.active = "";
    $scope.initSlider = function (item) {
        if (item.slide && item.slideItems) {
            setTimeout(function () {
                $('#' + item.slidePlace.name).owlCarousel({
                    autoplayTimeout: item.slide.intervalTime,
                    loop: true,
                    margin: 0,
                    nav: false,
                    dots: false,
                    autoplay: item.slide.autoPlay,
                    items: 1
                })
            }, 1000);
        }
    },
        $scope.loadPage = function (page) {
            $scope.page = page;
            var url = "/slide-place/search?"
                + "page=" + $scope.page
                + "&size=" + $scope.size
                + "&name=" + $scope.name
                + "&webType=" + $scope.webType
            httpRequest.get(url
                , function (data) {
                    if (data.success) {
                        $scope.slidePlace = data.data.data;
                        $scope.totalPage = common.getTotalPage($scope.size, data.data.total);
                        $scope.sttSlide = 1 + ($scope.page - 1) * $scope.size;
                        $scope.listPage = [];
                        for (var i = $scope.page - 5; i < $scope.page + 5; i++) {
                            if (i > 0 && i <= $scope.totalPage)
                                $scope.listPage.push(i);
                        }
                    }
                }, function (data) {
                }, true);
        };
    $scope.loadPage(1);
    $scope.updateShow = function (item) {
        $scope.showSlide();
        $scope.slidePlace.name = item.slidePlace.name;
        $scope.id1 = item.slidePlace.id;
        $scope.ids = item.slide.id;

    }
    $scope.updateSlidePlace = function (item) {
        if ($("#form-slidePlace").valid()) {
            httpRequest.post("/slide-place/update/" + item
                , {
                    slidePlace: {
                        name: $scope.slidePlace.name,
                        webType: 1
                    }, slideId: $scope.ids
                }
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.closedSlide();
                        $scope.loadPage(1);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    };
    $scope.loadListSlide = function (page) {
        var url = "/slide/search?"
            + "page=" + $scope.page
            + "&size=" + $scope.size
            + "&name=" + $scope.name
            + "&active=" + $scope.active
            + "&intervalTime=" + $scope.intervalTime
            + "&autoPlay=" + $scope.autoPlay
            + "&webType=" + $scope.webType
        httpRequest.get(url
            , function (data) {
                if (data.success) {
                    $scope.listSlide = data.data.data;
                }
            }, function (data) {
            }, true);
    }


    $scope.loadListSlide(1);
    $scope.showSlide = function () {
        $("#modal-create-slide-place").modal('show');
    }
    $scope.closedSlide = function () {
        $("#modal-create-slide-place").modal('hide');
        $("label.error").attr("style", "display:none;");
    }
});
ngApp.controller('mgrUserController', function ($scope, httpRequest) {
    $scope.user = [];
    $scope.dataUser = {};
    $scope.dataSearch = {
        page: '',
        size: '10',
        name: '',
        email: '',
        socialType: '',
        username: '',
        role: '1',
        deleted: '',
        block: '',
        isHighlight: '',
        colIndex: '',
        departmentId: '',
        gender: '',
    }
    var urlPage = common.getQueryStringHref("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            $scope.dataSearch.page = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.dataSearch.page = urlPage;
        var url = "/user/search?"
            + "page=" + $scope.dataSearch.page
            + "&size=" + $scope.dataSearch.size
            + "&name=" + $scope.dataSearch.name
            + "&email=" + $scope.dataSearch.email
            + "&socialType=" + $scope.dataSearch.socialType
            + "&username=" + $scope.dataSearch.username
            + "&role=" + $scope.dataSearch.role
            + "&deleted=" + $scope.dataSearch.deleted
            + "&block=" + $scope.dataSearch.block
            + "&isHighlight=" + $scope.dataSearch.isHighlight
            + "&colIndex=" + $scope.dataSearch.colIndex
            + "&departmentId=" + $scope.dataSearch.departmentId
            + "&gender=" + $scope.dataSearch.gender
        httpRequest.get(url, function (data) {
            if (data.success && data.data) {
                $scope.user = data.data.data;
                $scope.totalPage = common.getTotalPage($scope.dataSearch.size, data.data.total);
                $scope.listPage = [];
                $scope.stt = 1 + ($scope.dataSearch.page - 1) * $scope.dataSearch.size;
                for (var i = $scope.dataSearch.page - 5; i < $scope.dataSearch.page + 5; i++) {
                    if (i > 0 && i <= $scope.totalPage)
                        $scope.listPage.push(i);
                }
                window.history.replaceState({}, "", "/admin/nguoi-dung?trang=" + $scope.dataSearch.page);
            }
        }, function (data) {
        }, true);
    };
    $scope.loadPage(urlPage);
    $scope.showAddAccount = function () {
        $scope.user.gender = 1;
        var modal = $("#modal-add-user");
        $("#modal-add-user").modal("show");

    };
    $.validator.addMethod("requiredName", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập đầy đủ họ tên!");
    $scope.validationUser = {
        rules: {
            name: {
                requiredName: true,
                maxlength: 50,
            },
        },
        messages: {
            name: {
                maxlength: "Họ và tên vui lòng không nhập quá 50 ký tự!"
            },
        }
    };
    $scope.checkShowHome = false;
    $scope.checkIsShowHome = function (status) {
        $scope.checkShowHome = status;
    }
    $scope.showPopupUser = function () {
        $("#modal-create-user").modal('show');
    }
    $scope.closedPopupUser = function () {
        $scope.dataUser = {};
        $("#modal-create-user").modal('hide');
    }
    $scope.createAccount = function () {
        if ($("#form-user").valid()) {
            $scope.user.role = 1;
            $scope.dataUser.password = 123456;
            // $scope.dataUser.hospitalEmployee = $scope.checkShowHome ? 1 : 0
            httpRequest.post("/user/create"
                , {user: $scope.dataUser}
                , function (data) {
                    if (data.success) {
                        $scope.loadPage(1);
                        $scope.closedPopupUser();
                        alertSmallBox(data.data, success);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function () {
                }, true);
        }
    };
    $scope.resetPassword = function (item) {
        confirmDialog("XÁC NHẬN", "Bạn có muốn đặt lại mật khẩu tài khoản " + item.username + " này?", function () {
            httpRequest.post("/user/reset-password/" + item.id
                , {}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function () {
                }, true);
        })
    };
    $scope.block = function (item) {
        if (item.block == 1) {
            var content = "Bạn có chắc chắn muốn mở khóa tài khoản " + item.username + " này?";
            var data = {block: 0};
            var messageSuccess = "Mở khóa tài khoản thành công!";
            var messageError = "Mở khóa tài khoản không thành công!";
        } else {
            content = "Bạn có chắc chắn muốn khóa tài khoản " + item.username + " này?";
            data = {block: 1}
            messageSuccess = "Khóa tài khoản thành công!";
            messageError = "Khóa tài khoản không thành công!";
        }
        confirmDialog("XÁC NHẬN", content, function () {
            httpRequest.post("/user/block/" + item.id
                , data
                , function (data) {
                    if (data.success) {
                        alertSmallBox(messageSuccess, success);
                        urlPage = common.getQueryStringHref("trang");
                        if (!urlPage) {
                            urlPage = 1
                        }
                        $scope.loadPage(urlPage);
                    } else {
                        alertSmallBox(messageError, error);
                    }
                }, function (data) {
                }, true);
        });
    };
});

ngApp.controller('mgrPositionController', function ($scope, httpRequest) {
    $scope.data = [];
    $scope.dataPosition = {};
    $scope.dataSearch = {
        page: '',
        size: '10',
        name: '',
        status: '-1'
    }
    var urlPage = common.getQueryStringHref("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            $scope.dataSearch.page = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.dataSearch.page = urlPage;
        var url = "/position/search?"
            + "page=" + $scope.dataSearch.page
            + "&size=" + $scope.dataSearch.size
            + "&status=" + $scope.dataSearch.status
            + "&name=" + $scope.dataSearch.name
        httpRequest.get(url, function (data) {
            if (data.success) {
                $scope.data = data.data.data;
                $scope.totalPage = common.getTotalPage($scope.dataSearch.size, data.data.total);
                $scope.stt = 1 + ($scope.dataSearch.page - 1) * $scope.dataSearch.size;
                $scope.listPage = [];
                for (var i = $scope.dataSearch.page - 5; i < $scope.dataSearch.page + 5; i++) {
                    if (i > 0 && i <= $scope.totalPage)
                        $scope.listPage.push(i);
                }
                window.history.replaceState({}, "", "/admin/chuc-vu?trang=" + $scope.dataSearch.page);
            }
        }, function (data) {
        }, true);
    };
    $scope.loadPage(urlPage);
    $.validator.addMethod("requiredName", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập tên chức vụ!");
    $.validator.addMethod("requiredValue", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập value!");
    $scope.validationPostion = {
        rules: {
            name: {
                requiredName: true,
                maxlength: 255
            },
            value: {
                requiredValue: true,
                number: true
            }
        },
        messages: {
            name: {
                maxlength: "Tên chức vụ tối đa 255 ký tự!",
            },
            value: {
                number: "Value chỉ được phép nhập số!"
            }
        }
    };
    $scope.create = function () {
        if ($("#form-position").valid()) {
            httpRequest.post("/position/create"
                , {position: $scope.dataPosition}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.loadPage(1);
                        $scope.cancelData();
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function () {
                }, true);
        }
    };
    $scope.cancelData = function () {
        $scope.dataPosition = {};
    }
    $scope.showdataUpdate = function (item) {
        $scope.dataPosition = JSON.parse(JSON.stringify(item));
    };
    $scope.update = function () {
        if ($("#form-position").valid()) {
            httpRequest.post("/position/update/" + $scope.dataPosition.id
                , {position: $scope.dataPosition}
                , function (data) {
                    if (data.success) {
                        urlPage = common.getQueryStringHref("trang");
                        if (!urlPage) {
                            urlPage = 1
                        }
                        $scope.loadPage(urlPage);
                        $scope.cancelData();
                        alertSmallBox(data.data, success);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function () {
                }, true);
        }
    };
    $scope.changeStatus = function (item) {
        if (item.status == 0) {
            var content = "Bạn có chắc chắn muốn active chức vụ " + item.name + " này không?";
            var data = {status: 1};
            var messageSuccess = "Active chức vụ thành công!";
            var messageError = "Active chức vụ không thành công!";
        } else {
            content = "Bạn có chắc chắn muốn inactive chức vụ " + item.name + " này không?";
            data = {status: 0}
            messageSuccess = "Inactive chức vụ thành công!";
            messageError = "Inactive chức vụ không thành công!";
        }
        confirmDialog("XÁC NHẬN", content, function () {
            httpRequest.post("/position/update-status/" + item.id
                , data
                , function (data) {
                    if (data.success) {
                        alertSmallBox(messageSuccess, success);
                        urlPage = common.getQueryStringHref("trang");
                        if (!urlPage) {
                            urlPage = 1
                        }
                        $scope.loadPage(urlPage);
                    } else {
                        alertSmallBox(messageError, error);
                    }
                }, function (data) {
                }, true);
        });
    }
    $scope.delete = function (item) {
        confirmDialog("Xác nhận", 'Bạn có muốn xóa chức vụ không?', function () {
            httpRequest.delete("/position/delete/" + item.id
                , function (data) {
                    if (data.success) {
                        urlPage = common.getQueryStringHref("trang");
                        if (!urlPage) {
                            urlPage = 1
                        }
                        $scope.loadPage(urlPage);
                        alertSmallBox(data.data, success);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function () {
                }, true);
        })
    };
});
ngApp.controller('mgrAdminController', function ($scope, httpRequest) {
    $scope.roleAdminBvp = [
        {role: 1, name: "Tài khoản"},
        {role: 2, name: "Tin tức, Góc tri ân"},
        {role: 4, name: "Tư vấn online, Từ khóa"},
        {role: 8, name: "Menu, Slide, Page"},
        {role: 16, name: "Quảng cáo"},
        {role: 32, name: "Đặt khám, Xét Nghiệm",},
        {role: 64, name: "Tài liệu, Khóa học"},
        {role: 128, name: "Thư viện Ảnh, Video"},
        {role: 256, name: "Giao lưu trực tuyến"},
        {role: 512, name: "Trang chủ"},
    ];
    $scope.data = [];
    $scope.dataAdmin = {};
    $scope.dataSearch = {
        page: '',
        size: '10',
        name: '',
        email: '',
        socialType: '',
        username: '',
        role: '156',
        deleted: '',
        block: '',
        isHighlight: '',
        colIndex: '',
        departmentId: '',
        gender: '',
    }
    var urlPage = common.getQueryStringHref("trang")
    if (urlPage) {
        if (urlPage % 1 === 0) {
            $scope.dataSearch.page = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.dataSearch.page = urlPage;
        var url = "/user/search?"
            + "page=" + $scope.dataSearch.page
            + "&size=" + $scope.dataSearch.size
            + "&name=" + $scope.dataSearch.name
            + "&email=" + $scope.dataSearch.email
            + "&socialType=" + $scope.dataSearch.socialType
            + "&username=" + $scope.dataSearch.username
            + "&role=" + $scope.dataSearch.role
            + "&deleted=" + $scope.dataSearch.deleted
            + "&block=" + $scope.dataSearch.block
            + "&isHighlight=" + $scope.dataSearch.isHighlight
            + "&colIndex=" + $scope.dataSearch.colIndex
            + "&departmentId=" + $scope.dataSearch.departmentId
            + "&gender=" + $scope.dataSearch.gender
        httpRequest.get(url, function (data) {
            if (data.success && data.data) {
                $scope.data = data.data.data;
                $scope.totalPage = common.getTotalPage($scope.dataSearch.size, data.data.total);
                $scope.listPage = [];
                $scope.stt = 1 + ($scope.dataSearch.page - 1) * $scope.dataSearch.size;
                for (var i = $scope.dataSearch.page - 5; i < $scope.dataSearch.page + 5; i++) {
                    if (i > 0 && i <= $scope.totalPage)
                        $scope.listPage.push(i);
                }
                window.history.replaceState({}, "", "/admin/quan-ly/admin?trang=" + $scope.dataSearch.page);
            }
        }, function (data) {
        }, true);
    };
    $scope.loadPage(urlPage);
    $scope.checkAdminBvp = false;
    $scope.checkIsAdminBvp = function (status) {
        $scope.checkAdminBvp = status;
        if (status) {
            for (var i = 0; i < $scope.roleAdminBvp.length; i++) {
                var role = $scope.roleAdminBvp[i].role;
                document.getElementById("role_" + role).checked = true;
            }
        } else {
            for (var i = 0; i < $scope.roleAdminBvp.length; i++) {
                var role = $scope.roleAdminBvp[i].role;
                document.getElementById("role_" + role).checked = false;
            }
        }
    }
    $scope.selectAdminRole = function (role) {
        if (!document.getElementById("role_" + role).checked && $scope.checkAdminBvp) {
            $scope.checkAdminBvp = false;
            return;
        }
        var adminRole = 0;
        for (var i = 0; i < $scope.roleAdminBvp.length; i++) {
            var role = $scope.roleAdminBvp[i].role;
            if (document.getElementById("role_" + role).checked) {
                adminRole++;
            }
        }
        if (adminRole == $scope.roleAdminBvp.length) {
            $scope.checkAdminBvp = true;
        }
    };
    $scope.checkAdminHoiLao = false;
    $scope.checkIsAdminHoiLao = function (status) {
        $scope.checkAdminHoiLao = status;
    }
    $scope.checkAdminChongLao = false;
    $scope.checkIsAdminChongLao = function (status) {
        $scope.checkAdminChongLao = status;
    }
    $scope.cancelData = function () {
        $scope.dataAdmin = {};
        $scope.checkAdminBvp = false;
        $scope.checkAdminHoiLao = false;
        $scope.checkAdminChongLao = false;
        for (var i = 0; i < $scope.roleAdminBvp.length; i++) {
            var role = $scope.roleAdminBvp[i].role;
            document.getElementById("role_" + role).checked = false;
        }
    }
    $scope.showPopupAdmin = function () {
        $scope.dataAdmin.gender = "1";
        $("#modal-admin").modal('show');
    }
    $scope.closedPopupAdmin = function () {
        $scope.cancelData();
        $("#modal-admin").modal('hide');
        $(".smart-form label.error").remove();
    }
    $.validator.addMethod("requiredName", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập họ tên!");
    $.validator.addMethod("requiredUserName", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập tên tài khoản!");
    $.validator.addMethod("requiredEmail", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập địa chỉ email!");
    $.validator.addMethod("isFullName", function (value, element) {
        return value.isFullName();
    }, "Họ và tên vui lòng không nhập ký tự đặc biệt!");
    $.validator.addMethod("isNickname", function (value, element) {
        var re = /^([a-zA-Z0-9_]){5,}$/g;
        return re.test(value.toLowerCase());
    }, "Tên tài khoản chỉ chứa các ký tự chữ, số và dấu _");
    $.validator.addMethod("isEmail", function (value, element) {
        return value.isEmail();
    }, "Vui lòng nhập đúng định dạng email!");
    $scope.validationAdminForm = {
        rules: {
            name: {
                requiredName: true,
                isFullName: true,
                maxlength: 50,
            },
            username: {
                requiredUserName: true,
                minlength: 5,
                isNickname: true,
            },
            gender: {
                required: true,
            },
            email: {
                requiredEmail: true,
                isEmail: true,
            }
        },
        messages: {
            name: {
                maxlength: "Tên tài khoản tối đa 50 ký tự!",
            },
            username: {
                minlength: "Tên tài khoản tối thiểu 5 ký tự!",
            },
            gender: {
                required: "Vui lòng chọn giới tính!",
            },
        }
    };
    $scope.getAdminRole = function () {
        var adminRole = 0;
        for (var i = 0; i < $scope.roleAdminBvp.length; i++) {
            var role = $scope.roleAdminBvp[i].role;
            if (document.getElementById("role_" + role).checked) {
                adminRole = adminRole | role
            }
        }
        return adminRole;
    };
    $scope.createAdmin = function () {
        $scope.dataAdmin.role = (($scope.checkAdminBvp ? 4 : 0) | ($scope.checkAdminHoiLao ? 16 : 0) | ($scope.checkAdminChongLao ? 128 : 0))
        if ($scope.dataAdmin.role == 0) {
            $scope.dataAdmin.role = 4
        }
        $scope.dataAdmin.adminRole = $scope.getAdminRole();
        if ($scope.dataAdmin.adminRole != 0) {
            $scope.dataAdmin.role = ($scope.dataAdmin.role | 4)
        }
        $scope.dataAdmin.password = 123456;
        if ($("#form-admin").valid()) {
            httpRequest.post("/user/create"
                , {user: $scope.dataAdmin}
                , function (data) {
                    if (data.success) {
                        $scope.closedPopupAdmin();
                        $scope.loadPage(1);
                        alertSmallBox(data.data, success);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function () {
                }, true);
        }
    };
    $scope.showDataUpdate = function (item) {
        $scope.dataAdmin = JSON.parse(JSON.stringify(item));
        var adminRole = 0
        for (var i = 0; i < $scope.roleAdminBvp.length; i++) {
            var role = $scope.roleAdminBvp[i].role;
            if ((item.adminRole & role) == role) {
                document.getElementById("role_" + role).checked = true;
                adminRole++;
            }
        }
        if (adminRole == $scope.roleAdminBvp.length) {
            $scope.checkAdminBvp = true;
        }
        if ((item.role & 16) == 16) {
            $scope.checkAdminHoiLao = true;
        } else {
            $scope.checkAdminHoiLao = false;
        }
        if ((item.role & 128) == 128) {
            $scope.checkAdminChongLao = true;
        } else {
            $scope.checkAdminChongLao = false;
        }
        $scope.showPopupAdmin();
    };
    $scope.updateAdmin = function (item) {
        $scope.dataAdmin.role = (($scope.checkAdminBvp ? 4 : 0) | ($scope.checkAdminHoiLao ? 16 : 0) | ($scope.checkAdminChongLao ? 128 : 0))
        if ($scope.dataAdmin.role == 0) {
            $scope.dataAdmin.role = 4
        }
        $scope.dataAdmin.adminRole = $scope.getAdminRole();
        if ($scope.dataAdmin.adminRole != 0) {
            $scope.dataAdmin.role = ($scope.dataAdmin.role | 4)
        }
        if ($("#form-admin").valid()) {
            httpRequest.post("/user/update/" + item.id
                , {user: $scope.dataAdmin}
                , function (data) {
                    if (data.success) {
                        urlPage = common.getQueryStringHref("trang");
                        if (!urlPage) {
                            urlPage = 1
                        }
                        $scope.loadPage(urlPage);
                        $scope.closedPopupAdmin();
                        alertSmallBox(data.data, success);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function () {
                }, true);
        }
    };
    $scope.resetPassword = function (item) {
        confirmDialog("XÁC NHẬN", "Bạn có muốn đặt lại mật khẩu tài khoản " + item.username + " này?", function () {
            httpRequest.post("/user/reset-password/" + item.id
                , {}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function () {
                }, true);
        })
    }
    $scope.block = function (item) {
        if (item.block == 1) {
            var content = "Bạn có chắc chắn muốn mở khóa tài khoản " + item.username + " này?";
            var data = {block: 0};
            var messageSuccess = "Mở khóa tài khoản thành công!";
            var messageError = "Mở khóa tài khoản không thành công!";
        } else {
            content = "Bạn có chắc chắn muốn khóa tài khoản " + item.username + " này?";
            data = {block: 1}
            messageSuccess = "Khóa tài khoản thành công!";
            messageError = "Khóa tài khoản không thành công!";
        }
        confirmDialog("XÁC NHẬN", content, function () {
            httpRequest.post("/user/block/" + item.id
                , data
                , function (data) {
                    if (data.success) {
                        alertSmallBox(messageSuccess, success);
                        urlPage = common.getQueryStringHref("trang");
                        if (!urlPage) {
                            urlPage = 1
                        }
                        $scope.loadPage(urlPage);
                    } else {
                        alertSmallBox(messageError, error);
                    }
                }, function (data) {
                }, true);
        });
    }
});
ngApp.controller('mgrTagController', function ($scope, httpRequest) {
    $scope.tag = [];
    $scope.dataTag = {};
    $scope.dataSearch = {
        page: '',
        size: '10',
        name: '',
    }
    var urlPage = common.getQueryStringHref("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            $scope.dataSearch.page = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.dataSearch.page = urlPage;
        var url = "/tag/search?"
            + "page=" + $scope.dataSearch.page
            + "&size=" + $scope.dataSearch.size
            + "&name=" + $scope.dataSearch.name
        httpRequest.get(url, function (data) {
            if (data.success) {
                $scope.tag = data.data.data;
                $scope.totalPage = common.getTotalPage($scope.dataSearch.size, data.data.total);
                $scope.stt = 1 + ($scope.dataSearch.page - 1) * $scope.dataSearch.size;
                $scope.listPage = [];
                for (var i = $scope.dataSearch.page - 5; i < $scope.dataSearch.page + 5; i++) {
                    if (i > 0 && i <= $scope.totalPage)
                        $scope.listPage.push(i);
                }
                window.history.replaceState({}, "", "/admin/tu-khoa?trang=" + $scope.dataSearch.page);
            }
        }, function (data) {
        }, true);
    };
    $scope.loadPage(urlPage);
    $scope.createTag = function () {
        var tags = $("#tags-input").tagsinput('items');
        for (var i = 0; i < tags.length; i++) {
            if (tags[i].length > 20) {
                tags.splice(i, 1);
            }
        }
        if (tags.length == 0) {
            alertSmallBox("Vui lòng nhập từ khóa cần thêm!", error);
            return;
        }
        httpRequest.post("/tag/create-multiple"
            , {tags: tags}
            , function (data) {
                if (data.success) {
                    $scope.dataTag = data.data;
                    if ($scope.dataTag.tags.length > 0) {
                        $scope.countTags = "Bạn vừa thêm mới thành công " + $scope.dataTag.tags.length + " từ khóa!"
                    }
                    if ($scope.dataTag.tagExisted.length > 0) {
                        var tagExisteds = '';
                        for (var i = 0; i < $scope.dataTag.tagExisted.length; i++) {
                            tagExisteds = tagExisteds + $scope.dataTag.tagExisted[i].name + '. '
                        }
                        var title = "Bạn vừa nhập trùng các từ khóa:" + '"' + tagExisteds + '". ' + "Hệ thống sẽ tự động loại bỏ các từ khóa này!"
                        confirmOkDialog("Thông báo", title, function () {
                            if ($scope.dataTag.tags.length > 0) {
                                $scope.loadPage(1);
                                alertSmallBox($scope.countTags, success);
                            }
                        })
                    } else if ($scope.dataTag.tags.length > 0) {
                        $scope.loadPage(1);
                        alertSmallBox($scope.countTags, success);
                    }
                    $("#tags-input").tagsinput('removeAll');
                } else {
                    alertSmallBox(data.message, error);
                }
            }, function () {
            }, true);
    };
    $scope.canceldataTag = function () {
        $("#tags-input").tagsinput('removeAll');
    }
    $scope.showdataUpdate = function (item) {
        $("label.error").attr("style", "display:none;");
        $scope.showPopupTag();
        $scope.dataTag = JSON.parse(JSON.stringify(item));
    };
    $scope.validationTag = {
        rules: {
            name: {
                required: true,
            },
        },
        messages: {
            name: {
                required: "Vui lòng nhập từ khóa!"
            },
        }
    };
    $scope.showPopupTag = function () {
        $("#modal-update-tag").modal("show");
    }
    $scope.closedPopupTag = function () {
        $scope.dataTag = {};
        $("#modal-update-tag").modal("hide");
    }
    $scope.updateTag = function (item) {
        if ($("#form-tag").valid()) {
            httpRequest.post("/tag/update/" + item.id
                , {name: $scope.dataTag.name}
                , function (data) {
                    if (data.success) {
                        urlPage = common.getQueryStringHref("trang");
                        if (!urlPage) {
                            urlPage = 1
                        }
                        $scope.loadPage(urlPage);
                        $scope.closedPopupTag();
                        alertSmallBox(data.data, success);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function () {
                }, true);
        }
    };
    $scope.deleteTag = function (item) {
        confirmDialog("Xác nhận", 'Bạn có muốn xóa từ khóa ' + '"' + item.name + '"' + ' không?', function () {
            httpRequest.delete("/tag/delete/" + item.id
                , function (data) {
                    if (data.success) {
                        urlPage = common.getQueryStringHref("trang");
                        if (!urlPage) {
                            urlPage = 1
                        }
                        $scope.loadPage(urlPage);
                        alertSmallBox(data.data, success);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function () {
                }, true);
        })
    };
});
ngApp.controller('mgrNewsController', function ($scope, httpRequest, $http) {
    $scope.data = [];
    $scope.sttNews = 1;
    $scope.size = 10;
    $scope.content = "";
    $scope.isHotNews = "";
    $scope.menuId = "";
    $scope.fromHoiLao = '';
    $scope.charity = "";
    $scope.highlightNoti = "";
    $scope.belongDepartment = "";
    $scope.pageId = "";
    $scope.type = "";
    $scope.title = "";
    $scope.startDate = "";
    $scope.endDate = "";
    var urlPage = common.getQueryStringHref("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            urlPage = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.page = urlPage;
        var url = "/mgrNews/newsSearch?"
            + "page=" + $scope.page
            + "&size=" + $scope.size
            + "&content=" + $scope.content
            + "&isHotNews=" + $scope.isHotNews
            + "&menuId=" + $scope.menuId
            + "&webType=" + webType
            + "&fromHoiLao=" + $scope.fromHoiLao
            + "&charity=" + $scope.charity
            + "&highlightNoti=" + $scope.highlightNoti
            + "&belongDepartment=" + $scope.belongDepartment
            + "&pageId=" + $scope.pageId
            + "&type=" + $scope.type
            + "&title=" + $scope.title
            + "&startDate=" + $scope.startDate
            + "&endDate=" + $scope.endDate
        httpRequest.get(url
            , function (data) {
                if (data.success) {
                    $scope.data = data.data.data;
                    $scope.totalPage = common.getTotalPage($scope.size, data.data.total);
                    $scope.sttNews = 1 + ($scope.page - 1) * $scope.size;
                    $scope.listPage = [];
                    for (var i = $scope.page - 5; i < $scope.page + 5; i++) {
                        if (i > 0 && i <= $scope.totalPage)
                            $scope.listPage.push(i);
                    }
                    window.history.replaceState({}, "", "/admin/tin-tuc?trang=" + $scope.page);
                }
            }, function (data) {
            }, true);
    };
    $scope.loadPage(urlPage);
    $scope.searchTitle = function () {
        $scope.loadPage(urlPage);
    }
    $scope.deleteNews = function (item) {
        confirmDialog("Xác nhận", "Bạn có chắc chắn muốn xóa tin tức này?", function () {
            $http({
                method: 'DELETE',
                url: '/news/deleteNews/' + item.id,
            }).then(function successCallback(response) {
                if (response.data.success) {
                    alertSmallBox(response.data.data, success);
                    $scope.loadPage(urlPage);
                }
                else
                    alertSmallBox(response.data.message, error);
            });
        });
    };
    $scope.isHotNewsYe = function (item) {
        if (item.isHotNews == 0)
            return false
        if (item.isHotNews == 1)
            return true
        return false
    };
    $scope.isCharity = function (item) {
        if (item.charity && item.charity == 0)
            return false
        if (item.charity == 1)
            return true
        return false
    }
    $scope.cancelCharity = function (item) {
        if (item.charity == 1) {
            var content = "Bạn có muốn hủy hiển thị tin tức này ở Góc từ thiện trên trang chủ?";
            var data = {charity: 0};
            var message = "Hủy tin ở Góc từ thiện thành công!";
            var error = "Hủy tin ở Góc từ thiện thất bại!"
        } else {
            content = "Bạn có chắc chắn muốn chọn tin tức hiển thị ở Góc từ thiện trên trang chủ không?";
            data = {charity: 1}
            message = "Chọn hiển thị tin tức ở Góc từ thiện thành công!";
            error = "Chọn hiển thị tin tức ở Góc từ thiện thất bại!"
        }
        confirmDialog("XÁC NHẬN", content, function () {
            httpRequest.post("/news/setCharity/" + item.id,
                data,
                function (data) {
                    if (data.success) {
                        alertSmallBox(message, "success");
                        $scope.loadPage(urlPage);
                    } else {
                        alertSmallBox(error, error);
                    }
                }, function (data) {
                }, true);
        })
    };
    $scope.setHotNews = function (item) {
        if (item.isHotNews == 1) {
            var content = "Bạn có chắc chắn muốn hủy chọn tin nổi bật này này?";
            var data = {isHotNews: 0};
            var message = "Hủy tin nổi bật thành công!";
            var error = "Hủy tin nổi bật thất bại!"
        } else {
            content = "Bạn có chắc chắn muốn chọn tin tức này thành tin nổi bật?";
            data = {isHotNews: 1}
            message = "Chọn tin tức thành tin nổi bật thành công!";
            error = "Chọn tin thức thành tin nổi bật thất bại!"
        }
        confirmDialog("XÁC NHẬN", content, function () {
            httpRequest.post("/news/setHotNews/" + item.id,
                data,
                function (data) {
                    if (data.success) {
                        alertSmallBox(message, "success");
                        $scope.loadPage(urlPage);
                    } else {
                        alertSmallBox(error, error);
                    }
                }, function (data) {
                }, true);
        })
    };
    $scope.group = 1;
    $scope.menuByGroup = [];
    $scope.menuId = "";
    $scope.isActive = '';
    $scope.getMenuByGroup1 = function () {
        httpRequest.get("/menu/getByGroup/" + $scope.group + "?isActive=" +  $scope.isActive
            , function (data) {
                if (data.success) {
                    $scope.menuByGroup = data.data.menus;
                }
            }, function (data) {
            }, true);
    }
    $scope.getMenuByGroup1();
    $scope.dataNewsMenu = {};
    $scope.showPopupAssignToMenu = function (item) {
        $scope.getMenuByGroup1();
        httpRequest.get("/news/getDetail/" + item.id
            , function (data) {
                if (data.success) {
                    $scope.dataNewsMenu = data.data.menu;
                    $scope.tempId = item.id;
                    if ($scope.dataNewsMenu == undefined) {
                        $scope.menuAssign = "";
                    } else {
                        $scope.menuAssign = JSON.parse(JSON.stringify(data.data.menu.id.toString()));
                    }
                }
            }, function (data) {
            }, true);
    }
    $scope.assignToMenu = function () {
        httpRequest.post("/news/assignToMenu/" + $scope.tempId,
            {menuId: $scope.menuAssign},
            function (data) {
                if (data.success) {
                    alertSmallBox("Phân loại vào menu thành công!", "success");
                    $('#popup-assign-to-menu').modal('hide');
                    $scope.loadPage(1);
                    delete $scope.menuAssign;
                } else {
                    alertSmallBox("Phân loại menu không thành công", "error");
                }
            }, function (data) {
            }, true);
    }
    $scope.openPopupWindow = function (url, item) {
        $scope.getHost = window.location.host;
        $scope.urlNews = $scope.getHost + '/tin-tuc/' + item.linkAlias;
        newwindow = window.open(url + $scope.urlNews, 'name', 'height=450,width=600,left=30, top=100');
        if (window.focus) {
            newwindow.focus()
        }
        return false;
    };
});
ngApp.controller('mgrPageController', function ($scope, $http, httpRequest, fileManager) {
    $scope.href = window.location.origin;
    $scope.data = [];
    $scope.dataPage = {};
    $scope.stt = 1;
    $scope.dataSearch = {
        size: 10,
        name: '',
        type: '',
    }
    var urlPage = common.getQueryStringHash("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            urlPage = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.dataSearch.page = urlPage;
        var url = "/page/search"
            + "?page=" + $scope.dataSearch.page
            + "&size=" + $scope.dataSearch.size
            + "&name=" + $scope.dataSearch.name
            + "&type=" + $scope.dataSearch.type
            + "&webType=" + webType
        httpRequest.get(url
            , function (data) {
                if (data.success) {
                    $scope.data = data.data.data;
                    $scope.totalPage = common.getTotalPage($scope.dataSearch.size, data.data.total);
                    $scope.stt = 1 + ($scope.dataSearch.page - 1) * $scope.dataSearch.size;
                    $scope.listPage = [];
                    for (var i = $scope.dataSearch.page - 5; i < $scope.dataSearch.page + 5; i++) {
                        if (i > 0 && i <= $scope.totalPage)
                            $scope.listPage.push(i);
                    }
                    window.history.replaceState({}, "", "/admin/page?trang=" + $scope.dataSearch.page);
                }
            }, function (data) {
            }, true);
    };
    $scope.loadPage(urlPage);
    $scope.resetImgInput = function () {
        $("#select-file").val("");
    }
    $scope.cancelData = function () {
        $scope.dataPage = {};
        $scope.resetImgInput();
    }
    $scope.showPopupPage = function () {
        $("#modal-page").modal('show');
    }
    $scope.closedPopupPage = function () {
        $("#modal-page").modal('hide');
        $scope.cancelData();
    }
    $scope.filePage = {
        chooseFile: function () {
            $("[file-input-id]").trigger("click");
        },
        selectFile: function () {
            var selector = $(event.target);
            var fileName = selector[0].value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
            if (common.endWith(fileName, ".pdf")) {
                $scope.dataPage.file = URL.createObjectURL(selector[0].files[0]);
                $scope.uploadingFile = true;
                fileManager.uploadFiles(selector[0].files[0], function (data) {
                    if (data.success) {
                        $scope.dataPage.file = data.data.file;
                        $scope.uploadingFile = false;
                        $scope.$apply();
                    } else {
                        alertSmallBox("Thêm file lỗi");
                    }
                }, function (response) {
                });
            } else {
                $("#select-file").val("");
                alertSmallBox("Vui lòng chọn file có định dạng .pdf")
            }
        }
    };
    $.validator.addMethod("requiredName", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập tên page!");
    $.validator.addMethod("requiredTitle", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập tiêu đề Page!");
    $scope.validationPage = {
        rules: {
            name: {
                requiredName: true,
            },
            title: {
                requiredTitle: true,
                maxlength: 1000,
            },
            file: {
                required: function () {
                    if (!$scope.dataPage.file)
                        return true;
                    return false;
                }
            }
        },
        messages: {
            name: {
                required: "Vui lòng nhập tên page!",
            },
            title: {
                required: "Vui lòng nhập tiêu đề page",
                maxlength: "Vui lòng nhập ít hơn 1000 ký tự",
            },
            file: {
                required: "Vui lòng chọn file tải lên"
            }
        },
        errorPlacement: function (error, element) {
            if (element.attr("id") === "contentPage") {
                error.insertAfter($("#textarea").parent());
            } else if (element.attr("id") === "select-file") {
                error.insertAfter($("#text-file-name").parent());
            } else {
                error.insertAfter(element.parent());
            }
        },
    }
    $scope.create = function () {
        if ($("#form-page").valid()) {
            $scope.dataPage.type = 3;
            $scope.dataPage.webType = webType;
            httpRequest.post("/page/create"
                , {page: $scope.dataPage}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.closedPopupPage();
                        $scope.loadPage(urlPage);
                    } else {
                        $scope.closedPopupPage();
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    }
    $scope.delete = function (item) {
        confirmDialog("Xác nhận", "Bạn có chắc chắn muốn xóa page này?", function () {
            $("body").addClass("loading");
            $http({
                method: 'DELETE',
                url: '/page/delete/' + item.id,
            }).then(function successCallback(response) {
                if (response.data.success) {
                    alertSmallBox(response.data.data, success);
                    urlPage = common.getQueryStringHref("trang");
                    if (!urlPage) {
                        urlPage = 1
                    }
                    $scope.loadPage(urlPage);
                    $("body").removeClass("loading");
                } else {
                    $("body").removeClass("loading");
                    alertSmallBox(response.data.message, error);
                }
            });
        });
    };
    $scope.showdataUpdate = function (item) {
        $scope.showPopupPage();
        $scope.dataPage = JSON.parse(JSON.stringify(item));
        $scope.dataPage.type = JSON.parse(JSON.stringify(item.type.toString()));
    }
    $scope.update = function () {
        if ($("#form-page").valid()) {
            httpRequest.post("/page/update/" + $scope.dataPage.id,
                {page: $scope.dataPage},
                function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.closedPopupPage();
                        urlPage = common.getQueryStringHref("trang");
                        if (!urlPage) {
                            urlPage = 1
                        }
                        $scope.loadPage(urlPage);
                    } else {
                        $scope.closedPopupPage();
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    }
});
ngApp.controller('mgrPageNewsController', function ($scope, $http, httpRequest, fileManager) {
    $scope.pageId = common.getQueryStringHref("pageId");
    $scope.listNews = [];
    $scope.dataNews = {};
    $scope.stt = 1;
    $scope.dataSearch = {
        size: 10,
        content: '',
        isHotNews: '',
        webType: '',
        belongDepartment: 1,
        pageId: $scope.pageId,
        title: '',
    }
    var urlPage = common.getQueryStringHash("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            urlPage = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.dataSearch.page = urlPage;
        var url = "/mgrNews/newsSearch?"
            + "page=" + $scope.dataSearch.page
            + "&size=" + $scope.dataSearch.size
            + "&content=" + $scope.dataSearch.content
            + "&isHotNews=" + $scope.dataSearch.isHotNews
            + "&webType=" + webType
            + "&belongDepartment=" + $scope.dataSearch.belongDepartment
            + "&pageId=" + $scope.dataSearch.pageId
            + "&title=" + $scope.dataSearch.title
        httpRequest.get(url
            , function (data) {
                if (data.success) {
                    $scope.data = data.data.data;
                    $scope.totalPage = common.getTotalPage($scope.dataSearch.size, data.data.total);
                    $scope.stt = 1 + ($scope.dataSearch.page - 1) * $scope.dataSearch.size;
                    $scope.listPage = [];
                    for (var i = $scope.dataSearch.page - 5; i < $scope.dataSearch.page + 5; i++) {
                        if (i > 0 && i <= $scope.totalPage)
                            $scope.listPage.push(i);
                    }
                    window.history.replaceState({}, "", "/admin/page/hoat-dong?pageId=" + $scope.pageId + "&trang=" + $scope.dataSearch.page);
                }
            }, function (data) {
            }, true);
    };
    $scope.loadPage(urlPage);
    $scope.resetImgInput = function () {
        $("#select-file-image-cover").val("");
        for (instance in CKEDITOR.instances) {
            CKEDITOR.instances[instance].setData("");
        }
    }
    $scope.cancelData = function () {
        $scope.dataNews = {};
        $scope.checkHotNews = false;
        $scope.resetImgInput();
    }
    $scope.showPopupNews = function () {
        $("#modal-news").modal('show');
    }
    $scope.closedPopupNews = function () {
        $scope.cancelData();
        $("#modal-news").modal('hide');
    }
    $scope.checkIsHotNews = function (item) {
        $scope.checkHotNews = item;
    }
    $scope.cancelHotNews = function (item) {
        if (item.isHotNews == 1) {
            var content = "Bạn có chắc chắn muốn hủy chọn tin nổi bật này này?";
            var data = {isHotNews: 0};
            var message = "Hủy tin nổi bật thành công!";
            var error = "Hủy tin nổi bật thất bại";
        } else {
            content = "Bạn có chắc chắn muốn chọn tin tức này thành tin nổi bật?";
            data = {isHotNews: 1}
            message = "Chọn tin tức thành tin nổi bật thành công!";
            var error = "Hủy chọn tin tức thành tin nổi bật thất bại";
        }
        confirmDialog("XÁC NHẬN", content, function () {
            httpRequest.post("/news/setHotNews/" + item.id,
                data,
                function (data) {
                    if (data.success) {
                        alertSmallBox(message, "success");
                        $scope.loadPage(urlPage);
                    } else {
                        alertSmallBox(error, error);
                    }
                }, function (data) {
                }, true);
        })
    };
    $scope.fileMgr = {
        chooseFile: function () {
            $("[file-input-id]").trigger("click");
        },
        selectFile: function () {
            var selector = $(event.target);
            var fileName = selector[0].value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
            if (common.endWith(fileName, ".jpg") ||
                common.endWith(fileName, ".png") ||
                common.endWith(fileName, ".gif")) {
                $scope.dataNews.imagePreview = URL.createObjectURL(selector[0].files[0]);
                $scope.uploading = true;
                fileManager.upload(selector[0].files[0], function (data) {
                    if (data.success) {
                        $scope.dataNews.imagePreview = data.data.images[0].image;
                        $scope.uploading = false;
                        $scope.$apply();
                    } else {
                        alertSmallBox("Thêm ảnh lỗi", error);
                    }
                }, function (response) {
                });

            } else {
                alertSmallBox("Vui lòng chọn hình ảnh có định dạng png, jpg, gif")
            }
        }
    };
    $.validator.addMethod("requiredTile", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập tiêu đề!");
    $.validator.addMethod("requiredContentPreview", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập nội dung xem trước!");
    $scope.validationNews = {
        rules: {
            title: {
                requiredTile: true,
                maxlength: 150
            },
            contentPreview: {
                requiredContentPreview: true,
                maxlength: 500
            },
            image: {
                required: function () {
                    if (!$scope.dataNews.imagePreview)
                        return true;
                    return false;
                }
            }
        },
        errorPlacement: function (error, element) {
            if (element.attr("id") === "select-file-image-cover") {
                error.insertAfter($("#text-file-name-image-cover").parent());
            } else {
                error.insertAfter(element.parent());
            }
        },
        messages: {
            title: {
                required: "Vui lòng nhập tiêu đề tin tức!",
                maxlength: "Tiêu đề tin tức vui lòng nhập tối đa 150 ký tự!"
            },
            contentPreview: {
                required: "Vui lòng nhập Văn bản xem trước!",
                maxlength: "Nội dung xem trước của tin tức vui lòng nhập tối đa 500 ký tự!"
            },
            image: {
                required: "Vui lòng chọn ảnh!"
            }
        }
    };
    $scope.create = function () {
        $scope.dataNews.isHotNews = $scope.checkHotNews ? 1 : 0;
        $scope.dataNews.webType = webType;
        $scope.dataNews.belongDepartment = 1;
        if ($("#form-news").valid()) {
            httpRequest.post("/news/createNews"
                , {news: $scope.dataNews, pageId: $scope.pageId}
                , function (data) {
                    if (data.success) {
                        alertSmallBox("Thêm mới hoạt động thành công!", success);
                        $scope.closedPopupNews();
                        $scope.cancelData();
                        $scope.loadPage(1);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    };
    $scope.delete = function (item) {
        confirmDialog("Xác nhận", "Bạn có chắc chắn muốn xóa hoạt động này?", function () {
            $http({
                method: 'DELETE',
                url: '/news/deleteNews/' + item.id,
            }).then(function successCallback(response) {
                if (response.data.success) {
                    alertSmallBox(response.data.data, success);
                    urlPage = common.getQueryStringHref("trang");
                    if (!urlPage) {
                        urlPage = 1
                    }
                    $scope.loadPage(urlPage);
                }
                else
                    alertSmallBox(response.data.message, error);
            });
        });
    };
    $scope.showDataUpdate = function (item) {
        $scope.showPopupNews();
        $scope.dataNews = JSON.parse(JSON.stringify(item));
        $scope.checkHotNews = $scope.dataNews.isHotNews;
        setTimeout(function () {
            CKEditorSetup.SetData("content", item.content);
        }, 500);
    }
    $scope.update = function () {
        $scope.dataNews.isHotNews = $scope.checkHotNews ? 1 : 0;
        if ($("#form-news").valid()) {
            httpRequest.post("/news/createNews"
                , {news: $scope.dataNews, pageId: $scope.pageId}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.message, success);
                        $scope.closedPopupNews();
                        urlPage = common.getQueryStringHref("trang");
                        if (!urlPage) {
                            urlPage = 1
                        }
                        $scope.loadPage(urlPage);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    };
    $scope.setHotNews = function (item) {
        if (item.isHotNews == 1) {
            var content = "Bạn có chắc chắn muốn hủy chọn hoạt động nổi bật này?";
            var data = {isHotNews: 0};
            var message = "Hủy hoạt động nổi bật thành công!";
            var error = "Hủy hoạt động nổi bật thất bại!"
        } else {
            content = "Bạn có chắc chắn muốn chọn hoạt động này thành hoạt động nổi bật?";
            data = {isHotNews: 1}
            message = "Chọn hoạt động nổi bật thành công!";
            error = "Chọn hoạt động nổi bật thất bại!"
        }
        confirmDialog("XÁC NHẬN", content, function () {
            httpRequest.post("/news/setHotNews/" + item.id,
                data,
                function (data) {
                    if (data.success) {
                        alertSmallBox(message, "success");
                        urlPage = common.getQueryStringHref("trang");
                        if (!urlPage) {
                            urlPage = 1
                        }
                        $scope.loadPage(urlPage);
                    } else {
                        alertSmallBox(error, error);
                    }
                }, function (data) {
                }, true);
        })
    };

});
ngApp.controller('mgrPageAlbumController', function ($scope, $http, httpRequest, fileManager) {
    $scope.pageId = common.getQueryStringHref("pageId");
    $scope.data = [];
    $scope.dataAlbum = {};
    $scope.stt = 1;
    $scope.dataSearch = {
        size: 10,
        name: '',
        belongDepartment: 1,
        pageId: $scope.pageId,
    }
    var urlPage = common.getQueryStringHash("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            urlPage = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.dataSearch.page = urlPage;
        var url = "/album/search?"
            + "page=" + $scope.dataSearch.page
            + "&size=" + $scope.dataSearch.size
            + "&name=" + $scope.dataSearch.name
            + "&belongDepartment=" + $scope.dataSearch.belongDepartment
            + "&pageId=" + $scope.dataSearch.pageId
        httpRequest.get(url
            , function (data) {
                if (data.success) {
                    $scope.data = data.data.data;
                    $scope.totalPage = common.getTotalPage($scope.dataSearch.size, data.data.total);
                    $scope.stt = 1 + ($scope.dataSearch.page - 1) * $scope.dataSearch.size;
                    $scope.listPage = [];
                    for (var i = $scope.dataSearch.page - 5; i < $scope.dataSearch.page + 5; i++) {
                        if (i > 0 && i <= $scope.totalPage)
                            $scope.listPage.push(i);
                    }
                    window.history.replaceState({}, "", "/admin/page/album?pageId=" + $scope.pageId + "&trang=" + $scope.dataSearch.page);
                }
            }, function (data) {
            }, true);
    };
    $scope.loadPage(urlPage);
    $scope.listImages = [];
    if ($scope.dataAlbum && $scope.dataAlbum.images) {
        for (var i = 0; i < $scope.dataAlbum.images.length; i++) {
            $scope.listImages.push({
                image: $scope.dataAlbum.images[i],
                uploading: false
            });
        }
    }
    $scope.fileMgr = {
        remove: function (item) {
            for (var i = 0; i < $scope.listImages.length; i++) {
                if ($scope.listImages[i].image == item.image) {
                    $scope.listImages.splice(i, 1);
                    break;
                }
            }
        },
        uploadSuccess: function (id, image) {
            for (var i = 0; i < $scope.listImages.length; i++) {
                if ($scope.listImages[i].id == id) {
                    $scope.listImages[i].image = image;
                    $scope.listImages[i].uploading = false;
                    $scope.$apply();
                    break;
                }
            }
        },
        chooseFile: function (id) {
            setTimeout(function () {
                $('#' + id).trigger("click");
            }, 100)
        },
        selectImgPreview: function () {
            var selector = $(event.target);
            var fileName = selector[0].value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
            if (common.endWith(fileName, ".jpg") ||
                common.endWith(fileName, ".png") ||
                common.endWith(fileName, ".gif")) {
                $scope.dataAlbum.imagePreview = URL.createObjectURL(selector[0].files[0]);
                $scope.uploading = true;
                fileManager.upload(selector[0].files[0], function (data) {
                    if (data.success) {
                        $scope.dataAlbum.imagePreview = data.data.images[0].image;
                        $scope.uploading = false;
                        $scope.$apply();
                    } else {
                        alertSmallBox("Thêm ảnh lỗi");
                    }
                }, function (response) {
                });
            } else {
                alertSmallBox("Vui lòng chọn hình ảnh có định dạng png, jpg, gif")
            }
        },
        selectFile: function () {
            var selector = $(event.target);
            for (var i = 0; i < selector[0].files.length; i++) {
                var filePath = URL.createObjectURL(selector[0].files[i]);
                var fileName = selector[0].value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
                var fileId = filePath.substring(filePath.length - 5, filePath.length);
                if (common.endWith(fileName, ".jpg") ||
                    common.endWith(fileName, ".png") ||
                    common.endWith(fileName, ".gif")) {

                    $scope.listImages.push({
                        id: fileId,
                        uploading: true,
                        image: filePath,
                    })

                    fileManager.upload(selector[0].files[i], function (data, fileId) {
                        if (data.success) {
                            var images = data.data.images[0].image;
                            $scope.fileMgr.uploadSuccess(fileId, images);
                        } else {
                            $scope.fileMgr.remove(fileId);
                        }
                    }, function (data, fileId) {
                        $scope.fileMgr.remove(fileId);
                    }, fileId);
                } else {
                    alertSmallBox("Vui lòng chọn hình ảnh có định dạng png, jpg, gif")
                }
            }
        },
    }
    $scope.removeImgPreview = function (dataAlbum) {
        dataAlbum.imagePreview = "";
        $scope.resetImgInput();
    }
    $scope.resetImgInput = function () {
        $("#select-file-image-cover").val("");
        $("#select-file-image-cover2").val("");
    }
    $scope.cancelData = function () {
        $scope.dataAlbum = {};
        $scope.resetImgInput();
    }
    $scope.showPopupAlbum = function () {
        $scope.listImages = [];
        $("#modal-album").modal('show');
    }
    $scope.closedPopupAlbum = function () {
        $("#modal-album").modal('hide');
        $scope.cancelData();
    }
    $.validator.addMethod("requiredName", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập tên album!");
    $scope.validationAlbum = {
        rules: {
            name: {
                requiredName: true,
            },
            file1: {
                required: function () {
                    if (!$scope.dataAlbum.imagePreview)
                        return true
                    return false
                }
            }
        },
        errorPlacement: function (error, element) {
            if (element.attr("id") === "select-file-image") {
                error.insertAfter($("#text-file-image-name").parent());
            } else {
                error.insertAfter(element.parent());
            }
        },
        messages: {
            file1: {
                required: "Vui lòng chọn ảnh!",
            }
        },

    }
    $scope.create = function () {
        if ($("#form-album").valid()) {
            if (!$scope.dataAlbum.imagePreview) {
                alertSmallBox("Vui lòng chọn ảnh đại diện!");
                return;
            }
            var imageUrls = [];
            for (var i = 0; i < $scope.listImages.length; i++) {
                imageUrls.push($scope.listImages[i].image);
            }
            if (imageUrls.length > 0) {
                $scope.dataAlbum.images = imageUrls.toString();
            }
            if (!$scope.dataAlbum.images) {
                alertSmallBox("Vui lòng chọn ảnh!", error);
                return;
            }
            $scope.dataAlbum.belongDepartment = 1;
            httpRequest.post("/album/create"
                , {album: $scope.dataAlbum, pageId: $scope.pageId}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.closedPopupAlbum();
                        $scope.loadPage(urlPage);
                    } else {
                        $scope.closedPopupAlbum();
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    }
    $scope.delete = function (item) {
        confirmDialog("Xác nhận", "Bạn có chắc chắn muốn xóa album này?", function () {
            $("body").addClass("loading");
            $http({
                method: 'DELETE',
                url: '/album/delete/' + item.id,
            }).then(function successCallback(response) {
                if (response.data.success) {
                    alertSmallBox(response.data.data, success);
                    urlPage = common.getQueryStringHref("trang");
                    if (!urlPage) {
                        urlPage = 1
                    }
                    $scope.loadPage(urlPage);
                    $("body").removeClass("loading");
                }
                else
                    alertSmallBox(response.data.message, error);
            });
        });
    };
    $scope.showdataUpdate = function (item) {
        $scope.showPopupAlbum();
        $scope.dataAlbum = JSON.parse(JSON.stringify(item));
        if (item.images) {
            var dataImages = item.images.split(",");
            for (var i = 0; i < dataImages.length; i++) {
                $scope.listImages.push({image: dataImages[i]})
            }
        }
    }
    $scope.update = function () {
        if ($("#form-album").valid()) {
            var imageUrls = [];
            for (var i = 0; i < $scope.listImages.length; i++) {
                imageUrls.push($scope.listImages[i].image);
            }
            if (imageUrls.length > 0) {
                $scope.dataAlbum.images = imageUrls.toString();
            }
            if (!$scope.dataAlbum.images) {
                alertSmallBox("Vui lòng chọn ảnh!", error);
                return;
            }
            httpRequest.post("/album/update/" + $scope.dataAlbum.id
                , {album: $scope.dataAlbum, pageId: $scope.pageId}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.closedPopupAlbum();
                        urlPage = common.getQueryStringHref("trang");
                        if (!urlPage) {
                            urlPage = 1
                        }
                        $scope.loadPage(urlPage);
                    } else {
                        $scope.closclosedPopupAlbumedPopup();
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    }
});
ngApp.controller('mgrAlbumController', function ($scope, $http, httpRequest, fileManager) {
    $scope.data = [];
    $scope.dataAlbum = {};
    $scope.stt = 1;
    $scope.dataSearch = {
        size: 10,
        name: '',
    }
    var urlPage = common.getQueryStringHash("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            $scope.dataSearch.page = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.dataSearch.page = urlPage;
        var url = "/album/search?"
            + "page=" + $scope.dataSearch.page
            + "&size=" + $scope.dataSearch.size
            + "&name=" + $scope.dataSearch.name
        httpRequest.get(url
            , function (data) {
                if (data.success) {
                    $scope.data = data.data.data;
                    $scope.totalPage = common.getTotalPage($scope.dataSearch.size, data.data.total);
                    $scope.stt = 1 + ($scope.dataSearch.page - 1) * $scope.dataSearch.size;
                    $scope.listPage = [];
                    for (var i = $scope.dataSearch.page - 5; i < $scope.dataSearch.page + 5; i++) {
                        if (i > 0 && i <= $scope.totalPage)
                            $scope.listPage.push(i);
                    }
                    window.history.replaceState({}, "", "/admin/thu-vien-anh?trang=" + $scope.dataSearch.page);
                }
            }, function (data) {
            }, true);
    };
    $scope.loadPage(urlPage);
    $scope.listImages = [];
    if ($scope.dataAlbum && $scope.dataAlbum.images) {
        for (var i = 0; i < $scope.dataAlbum.images.length; i++) {
            $scope.listImages.push({
                image: $scope.dataAlbum.images[i],
                uploading: false
            });
        }
    }
    $scope.fileMgr = {
        remove: function (item) {
            for (var i = 0; i < $scope.listImages.length; i++) {
                if ($scope.listImages[i].image == item.image) {
                    $scope.listImages.splice(i, 1);
                    break;
                }
            }
        },
        uploadSuccess: function (id, image) {
            for (var i = 0; i < $scope.listImages.length; i++) {
                if ($scope.listImages[i].id == id) {
                    $scope.listImages[i].image = image;
                    $scope.listImages[i].uploading = false;
                    $scope.$apply();
                    break;
                }
            }
        },
        chooseFile: function (id) {
            setTimeout(function () {
                $('#' + id).trigger("click");
            }, 100)
        },
        selectImgPreview: function () {
            var selector = $(event.target);
            var fileName = selector[0].value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
            if (common.endWith(fileName, ".jpg") ||
                common.endWith(fileName, ".png") ||
                common.endWith(fileName, ".gif")) {
                $scope.dataAlbum.imagePreview = URL.createObjectURL(selector[0].files[0]);
                $scope.uploading = true;
                fileManager.upload(selector[0].files[0], function (data) {
                    if (data.success) {
                        $scope.dataAlbum.imagePreview = data.data.images[0].image;
                        $scope.uploading = false;
                        $scope.$apply();
                    } else {
                        alertSmallBox("Thêm ảnh lỗi");
                    }
                }, function (response) {
                });
            } else {
                alertSmallBox("Vui lòng chọn hình ảnh có định dạng png, jpg, gif")
            }
        },
        selectFile: function () {
            var selector = $(event.target);
            for (var i = 0; i < selector[0].files.length; i++) {
                var filePath = URL.createObjectURL(selector[0].files[i]);
                var fileName = selector[0].value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
                var fileId = filePath.substring(filePath.length - 5, filePath.length);
                if (common.endWith(fileName, ".jpg") ||
                    common.endWith(fileName, ".png") ||
                    common.endWith(fileName, ".gif")) {

                    $scope.listImages.push({
                        id: fileId,
                        uploading: true,
                        image: filePath,
                    })

                    fileManager.upload(selector[0].files[i], function (data, fileId) {
                        if (data.success) {
                            var images = data.data.images[0].image;
                            $scope.fileMgr.uploadSuccess(fileId, images);
                        } else {
                            $scope.fileMgr.remove(fileId);
                        }
                    }, function (data, fileId) {
                        $scope.fileMgr.remove(fileId);
                    }, fileId);
                } else {
                    alertSmallBox("Vui lòng chọn hình ảnh có định dạng png, jpg, gif")
                }
            }
        },
    }
    $scope.removeImgPreview = function (dataAlbum) {
        dataAlbum.imagePreview = "";
        $scope.resetImgInput();
    }
    $scope.resetImgInput = function () {
        $("#select-file-image-cover").val("");
        $("#select-file-image-cover2").val("");
    }
    $scope.cancelData = function () {
        $scope.dataAlbum = {};
        $scope.resetImgInput();
    }
    $scope.showPopupAlbum = function () {
        $scope.listImages = [];
        $("#modal-album").modal('show');
    }
    $scope.closedPopupAlbum = function () {
        $("#modal-album").modal('hide');
        $scope.cancelData();
    }
    $.validator.addMethod("requiredName", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập tên album!");
    $scope.validationAlbum = {
        rules: {
            name: {
                requiredName: true,
            },
            file1: {
                required: function () {
                    if (!$scope.dataAlbum.imagePreview)
                        return true
                    return false
                }
            }
        },
        errorPlacement: function (error, element) {
            if (element.attr("id") === "select-file-image") {
                error.insertAfter($("#text-file-image-name").parent());
            } else {
                error.insertAfter(element.parent());
            }
        },
        messages: {
            file1: {
                required: "Vui lòng chọn ảnh!",
            }
        },

    }
    $scope.create = function () {
        if ($("#form-album").valid()) {
            if (!$scope.dataAlbum.imagePreview) {
                alertSmallBox("Vui lòng chọn ảnh đại diện!");
                return;
            }
            var imageUrls = [];
            for (var i = 0; i < $scope.listImages.length; i++) {
                imageUrls.push($scope.listImages[i].image);
            }
            if (imageUrls.length > 0) {
                $scope.dataAlbum.images = JSON.stringify(imageUrls);
            }
            if (!$scope.dataAlbum.images) {
                alertSmallBox("Vui lòng chọn ảnh!", error);
                return;
            }

            httpRequest.post("/album/create"
                , {album: $scope.dataAlbum}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.closedPopupAlbum();
                        $scope.loadPage(urlPage);
                    } else {
                        $scope.closedPopupAlbum();
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    }
    $scope.delete = function (item) {
        confirmDialog("Xác nhận", "Bạn có chắc chắn muốn xóa album này?", function () {
            $("body").addClass("loading");
            $http({
                method: 'DELETE',
                url: '/album/delete/' + item.id,
            }).then(function successCallback(response) {
                if (response.data.success) {
                    alertSmallBox(response.data.data, success);
                    urlPage = common.getQueryStringHref("trang");
                    if (!urlPage) {
                        urlPage = 1
                    }
                    $scope.loadPage(urlPage);
                    $("body").removeClass("loading");
                }
                else
                    alertSmallBox(response.data.message, error);
            });
        });
    };
    $scope.showdataUpdate = function (item) {
        $scope.showPopupAlbum();
        $scope.dataAlbum = JSON.parse(JSON.stringify(item));
        if (item.images) {
            var dataImages = JSON.parse(item.images);
            // var dataImages = item.images.split(",");
            for (var i = 0; i < dataImages.length; i++) {
                $scope.listImages.push({image: dataImages[i]})
            }
        }
    }
    $scope.update = function () {
        if ($("#form-album").valid()) {
            var imageUrls = [];
            for (var i = 0; i < $scope.listImages.length; i++) {
                imageUrls.push($scope.listImages[i].image);
            }
            if (imageUrls.length > 0) {
                $scope.dataAlbum.images = JSON.stringify(imageUrls);
            }
            if (!$scope.dataAlbum.images) {
                alertSmallBox("Vui lòng chọn ảnh!", error);
                return;
            }
            httpRequest.post("/album/update/" + $scope.dataAlbum.id
                , {album: $scope.dataAlbum}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.closedPopupAlbum();
                        urlPage = common.getQueryStringHref("trang");
                        if (!urlPage) {
                            urlPage = 1
                        }
                        $scope.loadPage(urlPage);
                    } else {
                        $scope.closclosedPopupAlbumedPopup();
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    }
});

ngApp.controller('mgrCourseController', function ($scope, $http, httpRequest, fileManager) {
    $scope.data = [];
    $scope.allCourseItem = [];
    $scope.dataCourse = {};
    $scope.stt = 1;
    $scope.dataSearch = {
        name: '',
        size: 10
    }
    var urlPage = common.getQueryStringHash("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            $scope.dataSearch.page = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.dataSearch.page = urlPage;
        var url = "/course/search?"
            + "page=" + $scope.dataSearch.page
            + "&size=" + $scope.dataSearch.size
            + "&name=" + $scope.dataSearch.name
        httpRequest.get(url
            , function (data) {
                if (data.success) {
                    $scope.data = data.data.data;
                    $scope.totalPage = common.getTotalPage($scope.dataSearch.size, data.data.total);
                    $scope.stt = 1 + ($scope.dataSearch.page - 1) * $scope.dataSearch.size;
                    $scope.listPage = [];
                    for (var i = $scope.dataSearch.page - 5; i < $scope.dataSearch.page + 5; i++) {
                        if (i > 0 && i <= $scope.totalPage)
                            $scope.listPage.push(i);
                    }
                    window.history.replaceState({}, "", "/admin/khoa-hoc?trang=" + $scope.dataSearch.page);
                }
            }, function (data) {
            }, true);
    };
    $scope.loadPage(urlPage);
    $scope.imageUrl = {
        chooseFile: function () {
            $("[file-input-id]").trigger("click");
        },
        selectFile: function () {
            var selector = $(event.target);
            var fileName = selector[0].value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
            if (common.endWith(fileName, ".jpg") ||
                common.endWith(fileName, ".png") ||
                common.endWith(fileName, ".gif")) {
                $scope.dataCourse.thumbnail = URL.createObjectURL(selector[0].files[0]);
                $scope.uploading = true;
                fileManager.upload(selector[0].files[0], function (data) {
                    if (data.success) {
                        $scope.dataCourse.thumbnail = data.data.images[0].image;
                        $scope.uploading = false;
                        $scope.$apply();
                    } else {
                        alertSmallBox("Thêm ảnh lỗi", error);
                    }
                }, function (response) {
                });

            } else {
                alertSmallBox("Vui lòng chọn hình ảnh có định dạng png, jpg, gif")
            }
        }
    };
    $.validator.addMethod("requiredName", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập tên khóa học!");
    $scope.validationCourse = {
        rules: {
            name: {
                requiredName: true,
            },
            file1: {
                required: function () {
                    if (!$scope.dataCourse.thumbnail)
                        return true;
                    return false;
                }
            }
        },
        errorPlacement: function (error, element) {
            if (element.attr("id") === "select-file-image-cover") {
                error.insertAfter($("#text-file-name").parent());
            } else {
                error.insertAfter(element.parent());
            }
        },
        messages: {
            file1: {
                required: "Vui lòng chọn ảnh khóa học!"
            }
        }
    }
    $scope.create = function () {
        if ($("#form-course").valid()) {
            httpRequest.post("/course/create"
                , {course: $scope.dataCourse}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.cancelData();
                        $scope.loadPage(1);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    }
    $scope.resetImgInput = function () {
        $("#select-file-image-cover").val("");
    }
    $scope.cancelData = function () {
        $scope.dataCourse = {};
        $scope.resetImgInput();
        $scope.listUser = {};
    }
    $scope.delete = function (item) {
        confirmDialog("Xác nhận", "Bạn có chắc chắn muốn xóa khóa học này?", function () {
            $("body").addClass("loading");
            $http({
                method: 'DELETE',
                url: '/course/delete/' + item.id,
            }).then(function successCallback(response) {
                if (response.data.success) {
                    alertSmallBox(response.data.data, success);
                    urlPage = common.getQueryStringHref("trang");
                    if (!urlPage) {
                        urlPage = 1
                    }
                    $scope.loadPage(urlPage);
                    $("body").removeClass("loading");
                }
                else
                    alertSmallBox(response.data.message, error);
            });
        });
    }
    $scope.showdataUpdate = function (item) {
        $scope.dataCourse = JSON.parse(JSON.stringify(item));
    }
    $scope.update = function (item) {
        if ($("#form-course").valid()) {
            httpRequest.post("/course/update/" + item.id
                , {course: $scope.dataCourse}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        urlPage = common.getQueryStringHref("trang");
                        if (!urlPage) {
                            urlPage = 1
                        }
                        $scope.loadPage(urlPage);
                        $scope.cancelData();
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    }
});
ngApp.controller('mgrCourseItemController', function ($scope, $http, httpRequest, fileManager) {
    $scope.courseId = common.getQueryStringHref("courseId");
    $scope.data = [];
    $scope.dataCourseItem = {};
    $scope.stt = 1;
    $scope.dataSearch = {
        size: '10',
        name: '',
    }
    var urlPage = common.getQueryStringHash("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            $scope.dataSearch.page = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.dataSearch.page = urlPage;
        var url = "/course-item/search?"
            + "page=" + $scope.dataSearch.page
            + "&size=" + $scope.dataSearch.size
            + "&courseId=" + $scope.courseId
            + "&name=" + $scope.dataSearch.name
        httpRequest.get(url
            , function (data) {
                if (data.success) {
                    $scope.data = data.data.data;
                    $scope.totalPage = common.getTotalPage($scope.dataSearch.size, data.data.total);
                    $scope.stt = 1 + ($scope.dataSearch.page - 1) * $scope.dataSearch.size;
                    $scope.listPage = [];
                    for (var i = $scope.dataSearch.page - 5; i < $scope.dataSearch.page + 5; i++) {
                        if (i > 0 && i <= $scope.totalPage)
                            $scope.listPage.push(i);
                    }
                }
            }, function (data) {
            }, true);
    };
    $scope.loadPage(urlPage);
    $scope.fileMgr = {
        chooseFile: function () {
            $("[file-input-id]").trigger("click");
        },
        selectFile: function () {
            var selector = $(event.target);
            var fileName = selector[0].value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
            if (common.endWith(fileName, ".swf")) {
                $scope.dataCourseItem.files = URL.createObjectURL(selector[0].files[0]);
                $scope.uploading = true;
                fileManager.uploadFiles(selector[0].files[0], function (data) {
                    if (data.success) {
                        $scope.dataCourseItem.files = data.data.file;
                        $scope.uploading = false;
                        $scope.$apply();
                        // $scope.dataCourseItem.files = $scope.dataCourseItem.file;
                    } else {
                        alertSmallBox("Thêm file lỗi", error);
                    }
                }, function (response) {
                })
            } else {
                $("#select-file").val("");
                alertSmallBox("Vui lòng chọn file có định dạng swf")
            }
        }
    };
    $.validator.addMethod("requiredName", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập tên bài học!");
    $scope.validationCourseItem = {
        rules: {
            name: {
                requiredName: true,
            },
            file1: {
                required: function () {
                    if (!$scope.dataCourseItem.files)
                        return true;
                    return false;
                }
            }
        },
        errorPlacement: function (error, element) {
            if (element.attr("id") === "select-file") {
                error.insertAfter($("#text-file").parent());
            } else {
                error.insertAfter(element.parent());
            }
        },
        messages: {
            file1: {
                required: "Vui lòng chọn file tải lên"
            }
        }
    }
    $scope.create = function () {
        if ($("#form-course-item").valid()) {
            httpRequest.post("/course-item/create"
                , {courseItem: $scope.dataCourseItem, courseId: $scope.courseId}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.cancelData();
                        $scope.loadPage(1);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    }
    $scope.resetImgInput = function () {
        $("#select-file").val("");
    }
    $scope.cancelData = function () {
        $scope.dataCourseItem = {};
        $scope.resetImgInput();
    }
    $scope.delete = function (item) {
        confirmDialog("Xác nhận", "Bạn có chắc chắn muốn xóa bài học này?", function () {
            $("body").addClass("loading");
            $http({
                method: 'DELETE',
                url: '/course-item/delete/' + item.id,
            }).then(function successCallback(response) {
                if (response.data.success) {
                    alertSmallBox(response.data.data, success);
                    urlPage = common.getQueryStringHref("trang");
                    if (!urlPage) {
                        urlPage = 1
                    }
                    $scope.loadPage(urlPage);
                    $("body").removeClass("loading");
                }
                else
                    alertSmallBox(response.data.message, error);
            }, $("body").removeClass("loading"));
        });
    }
    $scope.showdataUpdate = function (item) {
        $scope.dataCourseItem = JSON.parse(JSON.stringify(item));
    }
    $scope.update = function (item) {
        if ($("#form-course-item").valid()) {
            httpRequest.post("/course-item/update/" + item.id
                , {courseItem: $scope.dataCourseItem}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        urlPage = common.getQueryStringHref("trang");
                        if (!urlPage) {
                            urlPage = 1
                        }
                        $scope.loadPage(urlPage);
                        $scope.cancelData();
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    }
});
ngApp.controller('mgrVideoController', function ($scope, $http, httpRequest, fileManager) {
    $scope.data = [];
    $scope.dataVideo = {};
    $scope.stt = 1;
    $scope.dataSearch = {
        size: 10,
        name: '',
        isHotVideo: '',
        webType: webType
    }
    var urlPage = common.getQueryStringHash("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            $scope.dataSearch.page = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.dataSearch.page = urlPage;
        var url = "/video/search?"
            + "page=" + $scope.dataSearch.page
            + "&size=" + $scope.dataSearch.size
            + "&name=" + $scope.dataSearch.name
            + "&isHotVideo=" + $scope.dataSearch.isHotVideo
            + "&webType=" + $scope.dataSearch.webType
        httpRequest.get(url
            , function (data) {
                if (data.success) {
                    $scope.data = data.data.data;
                    $scope.totalPage = common.getTotalPage($scope.dataSearch.size, data.data.total);
                    $scope.stt = 1 + ($scope.dataSearch.page - 1) * $scope.dataSearch.size;
                    $scope.listPage = [];
                    for (var i = $scope.dataSearch.page - 5; i < $scope.dataSearch.page + 5; i++) {
                        if (i > 0 && i <= $scope.totalPage)
                            $scope.listPage.push(i);
                    }
                    window.history.replaceState({}, "", "/admin/video?trang=" + $scope.dataSearch.page);
                }
            }, function (data) {
            }, true);
    };
    $scope.loadPage(urlPage);
    $scope.resetImgInput = function () {
        $("#select-file-image-cover").val("");
    };
    $scope.cancelData = function () {
        $scope.dataVideo = {};
        $scope.resetImgInput();
    };
    $scope.imageUrl = {
        chooseFile: function () {
            $("[file-input-id]").trigger("click");
        },
        selectFile: function () {
            var selector = $(event.target);
            var fileName = selector[0].value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
            if (common.endWith(fileName, ".jpg") ||
                common.endWith(fileName, ".png") ||
                common.endWith(fileName, ".gif")) {
                $scope.dataVideo.thumbnail = URL.createObjectURL(selector[0].files[0]);
                $scope.uploading = true;
                fileManager.upload(selector[0].files[0], function (data) {
                    if (data.success) {
                        $scope.dataVideo.thumbnail = data.data.images[0].image;
                        $scope.uploading = false;
                        $scope.$apply();
                    } else {
                        alertSmallBox("Thêm ảnh lỗi", error);
                    }
                }, function (response) {
                });
            } else {
                alertSmallBox("Vui lòng chọn hình ảnh có định dạng png, jpg, gif")
            }
        }
    };
    $.validator.addMethod("requiredName", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập tên video!");
    $.validator.addMethod("requiredUrl", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập tên URL video!");
    $.validator.addMethod("urlYoutube", function (url) {
        var p = /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
        return (url.match(p)) ? RegExp.$1 : false;
    }, "Vui lòng nhập link từ Youtube!");
    $scope.validationVideo = {
        rules: {
            name: {
                requiredName: true,
            },
            url: {
                requiredUrl: true,
                url: true,
                urlYoutube: true
            }
        },
        messages: {
            url: {
                url: "Vui lòng nhập đúng định dạng URL!"
            }
        }
    }
    $scope.checkisHotVideo = function (isHotVideo) {
        $scope.checkHotVideo = isHotVideo;
    }
    $scope.create = function () {
        if ($("#form-video").valid()) {
            $scope.dataVideo.url = $scope.dataVideo.url.replace("watch?v=", "embed/");
            if ($scope.checkHotVideo)
                $scope.dataVideo.isHotVideo = 1
            if (!$scope.checkHotVideo)
                $scope.dataVideo.isHotVideo = 0
            if ($scope.checkHotVideo == undefined)
                $scope.dataVideo.isHotVideo = 0
            $scope.dataVideo.webType = webType;
            httpRequest.post("/video/create"
                , {video: $scope.dataVideo}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.cancelData();
                        $scope.loadPage(urlPage);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    };
    $scope.delete = function (item) {
        confirmDialog("Xác nhận", "Bạn có chắc chắn muốn xóa video này?", function () {
            $("body").addClass("loading");
            $http({
                method: 'DELETE',
                url: '/video/delete/' + item.id,
            }).then(function successCallback(response) {
                if (response.data.success) {
                    alertSmallBox(response.data.data, success);
                    urlPage = common.getQueryStringHref("trang");
                    if (!urlPage) {
                        urlPage = 1
                    }
                    $scope.loadPage(urlPage);
                    $("body").removeClass("loading");
                }
                else
                    alertSmallBox(response.data.message, error);
            });
        });
    };
    $scope.showdataUpdate = function (item) {
        $scope.dataVideo = JSON.parse(JSON.stringify(item));
        if (!item.isHotVideo)
            $scope.checkHotVideo = false;
        if (item.isHotVideo)
            $scope.checkHotVideo = true;
    };
    $scope.update = function () {
        if ($("#form-video").valid()) {
            $scope.dataVideo.url = $scope.dataVideo.url.replace("watch?v=", "embed/");
            if ($scope.checkHotVideo == true)
                $scope.dataVideo.isHotVideo = 1
            if ($scope.checkHotVideo == false)
                $scope.dataVideo.isHotVideo = 0
            if ($scope.checkHotVideo == undefined)
                $scope.dataVideo.isHotVideo = 0
            httpRequest.post("/video/update/" + $scope.dataVideo.id
                , {video: $scope.dataVideo}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.cancelData();
                        urlPage = common.getQueryStringHref("trang");
                        if (!urlPage) {
                            urlPage = 1
                        }
                        $scope.loadPage(urlPage);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    };
    $scope.setActive = function (item) {
        if (item.isHotVideo) {
            var content = "Bạn có chắc chắn muốn in-active video này?";
            var data = {active: 0};
            var messageSuccess = "In-active video thành công!";
            var messageError = "In-active video không thành công!";
        } else {
            content = "Bạn có chắc chắn muốn active video này?";
            data = {active: 1}
            messageSuccess = "Active video thành công!";
            messageError = "Active video không thành công!";
        }
        confirmDialog("XÁC NHẬN", content, function () {
            httpRequest.post("/video/active/" + item.id
                , data
                , function (data) {
                    if (data.success) {
                        alertSmallBox(messageSuccess, success);
                        urlPage = common.getQueryStringHref("trang");
                        if (!urlPage) {
                            urlPage = 1
                        }
                        $scope.loadPage(urlPage);
                    } else {
                        alertSmallBox(messageError, error);
                    }
                }, function (data) {
                }, true);
        });
    };
    $scope.removeThumbnail = function (dataVideo) {
        dataVideo.thumbnail = "";
        $scope.resetImgInput();
    }
});
ngApp.controller('mgrOnlineExchangeController', function ($scope, $http, httpRequest) {
    $scope.originHref = window.location.origin;
    $scope.data = [];
    $scope.dataOnlineExchange = {};
    $scope.dataDate = {};
    $scope.dataDoctor = {};
    $scope.stt = 1;
    $scope.dataSearch = {
        size: 10,
        topic: '',
        active: '',
        startTime: '',
        endTime: ''
    };
    var urlPage = common.getQueryStringHash("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            $scope.page = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.dataSearch.page = urlPage;
        if ($scope.dateSearch) {
            // $scope.dateSearch2 = $("#dateSearch").val().getDateByString().getTime();
        } else {
            $scope.dateSearch2 = "";
        }
        var url = "/online-exchange/search?"
            + "page=" + $scope.dataSearch.page
            + "&size=" + $scope.dataSearch.size
            + "&topic=" + $scope.dataSearch.topic
            + "&active=" + $scope.dataSearch.active
            + "&startTime=" + $scope.dataSearch.startTime
            + "&endTime=" + $scope.dataSearch.endTime
        httpRequest.get(url, function (data) {
            if (data.success) {
                $scope.data = data.data.data;
                $scope.totalPage = common.getTotalPage($scope.dataSearch.size, data.data.total);
                $scope.stt = 1 + ($scope.dataSearch.page - 1) * $scope.dataSearch.size;
                $scope.listPage = [];
                for (var i = $scope.dataSearch.page - 5; i < $scope.dataSearch.page + 5; i++) {
                    if (i > 0 && i <= $scope.totalPage)
                        $scope.listPage.push(i);
                }
                window.history.replaceState({}, "", "/admin/giao-luu-truc-tuyen?trang=" + $scope.dataSearch.page);
            }
        }, function (data) {
        }, true);
    };
    $scope.loadPage(urlPage);
    $scope.searchDateTime = function () {
        if ($("#date-search").val() && $("#date-search").parent().data('DateTimePicker').date()) {
            $scope.dataSearch.startTime = $("#date-search").parent().data('DateTimePicker').date()._d.format("yyyy-MM-dd");
        } else {
            $scope.dataSearch.startTime = "";
        }
        $scope.loadPage(1);
    }
    $scope.listDoctor = [];
    $scope.loadDoctor = function () {
        httpRequest.get("/user/search?size=999999&role=2&block=0"
            , function (data) {
                if (data.success && data.data) {
                    $scope.listDoctor = data.data.data;
                }
            }, function (data) {
            }, true);
    }
    $scope.loadDoctor();
    $scope.cancelData = function () {
        $scope.dataOnlineExchange = {};
        $scope.dataDate = {};
        $scope.dataDoctor = {};
        $scope.checkApproval = false;
    };
    $scope.showPopupOnlineExchange = function () {
        $("label.error").attr("style", "display:none;")
        $("#modal-online-exchange").modal('show');
    };
    $scope.closedPopupOnlineExchange = function () {
        $("#modal-online-exchange").modal('hide');
        $scope.cancelData();
    };
    $scope.checkIsApproval = function (approval) {
        $scope.checkApproval = approval;
    };
    $.validator.addMethod("requiredTopic", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập chủ đề giao lưu!");
    $.validator.addMethod("requiredLocation", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập địa chỉ!");
    $scope.validationOnlineExchange = {
        rules: {
            topic: {
                requiredTopic: true,
            },
            location: {
                requiredLocation: true,
            },
            startTime: {
                required: true,
            },
            endTime: {
                required: true,
            },
            doctorIds: {
                required: true,
            }
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        },
        messages: {
            startTime: {
                required: "Vui lòng chọn giờ bắt đầu!",
            },
            endTime: {
                required: "Vui lòng chọn giờ kết thúc!",
            },
            doctorIds: {
                required: "Vui lòng chọn bác sĩ!",
            }
        }
    };
    $scope.create = function () {
        if ($("#form-online-exchange").valid()) {
            if ($("#start-time").val() && $("#start-time").parent().data('DateTimePicker').date()) {
                $scope.dataOnlineExchange.startTime = $("#start-time").parent().data('DateTimePicker').date()._d.format("yyyy-MM-dd HH:mm:ss");
            }
            if ($("#end-time").val() && $("#end-time").parent().data('DateTimePicker').date()) {
                $scope.dataOnlineExchange.endTime = $("#end-time").parent().data('DateTimePicker').date()._d.format("yyyy-MM-dd HH:mm:ss");
            }

            var x = new Date($scope.dataOnlineExchange.startTime);
            var y = new Date($scope.dataOnlineExchange.endTime);

            if (x >= y) {
                alertSmallBox("Vui lòng chọn thời gian kết thúc lớn hơn thời gian bắt đầu!", error);
                return;
            }
            if ($scope.dataDoctor.doctorIds.length <= 0) {
                alertSmallBox("Vui lòng chọn bác sĩ tham gia!");
                return;
            }
            // if ($scope.checkApproval) {
            //     $scope.dataOnlineExchange.active = 1;
            // } else {
            //     $scope.dataOnlineExchange.active = 0;
            // }
            httpRequest.post("/online-exchange/create"
                , {
                    onlineExchange: $scope.dataOnlineExchange,
                    doctorIds: $scope.dataDoctor.doctorIds
                }
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.cancelData();
                        $scope.closedPopupOnlineExchange();
                        $scope.loadPage(1);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    };
    $scope.delete = function (item) {
        confirmDialog("Xác nhận", "Bạn có chắc chắn muốn xóa chủ đề này?", function () {
            $("body").addClass("loading");
            $http({
                method: 'DELETE',
                url: '/online-exchange/delete/' + item.id,
            }).then(function successCallback(response) {
                if (response.data.success) {
                    alertSmallBox(response.data.data, success);
                    urlPage = common.getQueryStringHref("trang");
                    if (!urlPage) {
                        urlPage = 1
                    }
                    $scope.loadPage(urlPage);
                    $("body").removeClass("loading");
                }
                else
                    alertSmallBox(response.data.message, error);
            }, $("body").removeClass("loading"));
        });
    };
    $scope.getDoctors = function (item) {
        var result = [];
        for (var i = 0; i < item.length; i++) {
            result.push(item[i].doctor.id);
        }
        return result;
    };
    $scope.showdataUpdate = function (item) {
        $scope.dataOnlineExchange = JSON.parse(JSON.stringify(item.onlineExchange));
        $scope.dataDoctor.doctorIds = $scope.getDoctors(item.doctors);
        $scope.dataOnlineExchange.startTime = JSON.parse(JSON.stringify(item.onlineExchange.startTime.toDateObject().format("HH:mm dd-MM-yyyy")));
        $scope.dataOnlineExchange.endTime = JSON.parse(JSON.stringify(item.onlineExchange.endTime.toDateObject().format("HH:mm dd-MM-yyyy")));
        $scope.startDate = item.onlineExchange.startTime;
        $scope.endTime = item.onlineExchange.endTime;
        $("#modal-online-exchange").modal('show');
        // $scope.showPopupOnlineExchange(item);
        // if (item.active) {
        //     $scope.checkApproval = true;
        // } else {
        //     $scope.checkApproval = false;
        // }Chọn giờ làm việc để dạng dropdown
    };
    $scope.update = function () {
        if ($("#form-online-exchange").valid()) {
            if ($("#start-time").val() && $("#start-time").parent().data('DateTimePicker').date()) {
                $scope.dataOnlineExchange.startTime = $("#start-time").parent().data('DateTimePicker').date()._d.format("yyyy-MM-dd HH:mm:ss");
            }
            if ($("#end-time").val() && $("#end-time").parent().data('DateTimePicker').date()) {
                $scope.dataOnlineExchange.endTime = $("#end-time").parent().data('DateTimePicker').date()._d.format("yyyy-MM-dd HH:mm:ss");
            }
            $scope.dataOnlineExchange.startTime = $scope.dataOnlineExchange.startTime.toDateObject().format("yyyy-MM-dd HH:mm:ss");
            $scope.dataOnlineExchange.endTime = $scope.dataOnlineExchange.endTime.toDateObject().format("yyyy-MM-dd HH:mm:ss");
            var x = new Date($scope.dataOnlineExchange.startTime);
            var y = new Date($scope.dataOnlineExchange.endTime);

            if (x >= y) {
                alertSmallBox("Vui lòng chọn thời gian kết thúc lớn hơn thời gian bắt đầu!", error);
                return;
            }
            if ($scope.dataDoctor.doctorIds.length <= 0) {
                alertSmallBox("Vui lòng chọn bác sĩ tham gia!");
                return;
            }
            // if ($scope.checkApproval) {
            //     $scope.dataOnlineExchange.active = 1;
            // } else {
            //     $scope.dataOnlineExchange.active = 0;
            // }
            httpRequest.post("/online-exchange/update/" + $scope.dataOnlineExchange.id
                , {
                    onlineExchange: $scope.dataOnlineExchange,

                    doctorIds: $scope.dataDoctor.doctorIds
                }, function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        urlPage = common.getQueryStringHref("trang");
                        if (!urlPage) {
                            urlPage = 1
                        }
                        $scope.loadPage(urlPage);
                        $scope.cancelData();
                        $scope.closedPopupOnlineExchange();
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    };
    $scope.active = function (item) {
        if (item.active) {
            var content = "Bạn có chắc chắn muốn in-active chủ đề này?";
            var data = {active: 0};
            var messageSuccess = "In-active chủ đề thành công!";
            var messageError = "In-active chủ đề không thành công!";
        } else {
            content = "Bạn có chắc chắn muốn active chủ đề này?";
            data = {active: 1}
            messageSuccess = "Active chủ đề thành công!";
            messageError = "Active chủ đề không thành công!";
        }
        confirmDialog("Xác nhận", content, function () {
            httpRequest.post("/online-exchange/active/" + item.id
                , data
                , function (data) {
                    if (data.success) {
                        alertSmallBox(messageSuccess, success);
                        $scope.loadPage(urlPage);
                        $scope.cancelData();
                        $scope.closedPopupOnlineExchange();
                    } else {
                        alertSmallBox(messageError, error);
                    }
                }, function (data) {
                }, true);
        })
    };
});
ngApp.controller('mgrOnlineExchangeQuestionController', function ($scope, $http, httpRequest) {
    $scope.exchangeId = common.getQueryStringHref('exchangeId');
    $scope.data = [];
    $scope.dataOnlineExchangeQuestion = {};
    $scope.dataDoctor = {};
    $scope.stt = 1;
    $scope.dataSearch = {
        size: 10,
        content: '',
        approval: '',
        name: '',
        email: '',
        doctorId: ''
    }
    var urlPage = common.getQueryStringHash("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            $scope.page = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.dataSearch.page = urlPage;
        var url = "/online-exchange-question/search?"
            + "page=" + $scope.dataSearch.page
            + "&size=" + $scope.dataSearch.size
            + "&exchangeId=" + $scope.exchangeId
            + "&content=" + $scope.dataSearch.content
            + "&approval=" + $scope.dataSearch.approval
            + "&name=" + $scope.dataSearch.name
            + "&email=" + $scope.dataSearch.email
            + "&doctorId=" + $scope.dataSearch.doctorId
        httpRequest.get(url, function (data) {
            if (data.success) {
                $scope.data = data.data.data;
                $scope.totalPage = common.getTotalPage($scope.dataSearch.size, data.data.total);
                $scope.stt = 1 + ($scope.dataSearch.page - 1) * $scope.dataSearch.size;
                $scope.listPage = [];
                for (var i = $scope.page - 5; i < $scope.dataSearch.page + 5; i++) {
                    if (i > 0 && i <= $scope.totalPage)
                        $scope.listPage.push(i);
                }
                window.history.replaceState({}, "", "/admin/giao-luu-truc-tuyen/danh-sach-cau-hoi?exchangeId=" + $scope.exchangeId + "&trang=" + $scope.dataSearch.page);
            }
        }, function (data) {
        }, true);
    };
    $scope.loadPage(urlPage);
    $scope.checkFullname = function (item) {
        if (item.onlineExchangeQuestion.hideInfo) {
            return "Ẩn Danh";
        } else {
            return item.author.name;
        }
    };
    $scope.checkEmail = function (item) {
        if (item.onlineExchangeQuestion.hideInfo) {
            return '******@****.com';
        } else {
            return item.author.email;
        }
    };
    $scope.doctors = [];
    // $scope.getDoctors = function () {
    //     $http({
    //         method: 'GET',
    //         url: '/online-exchange/get-detail/' + $scope.exchangeId
    //     }).then(function successCallback(response) {
    //         if (response.data.success) {
    //             $scope.doctors = response.data.data.doctors;
    //         }
    //     }, function errorCallback(response) {
    //     });
    // };
    // $scope.getDoctors();
    $scope.getDoctors = function () {
        httpRequest.get("/online-exchange/get-detail/" + $scope.exchangeId
            , function (data) {
                if (data.success) {
                    $scope.doctors = data.data.doctors;
                }
            });
    }
    $scope.getDoctors();
    $scope.cancelData = function () {
        $scope.dataOnlineExchangeQuestion = {};
        $scope.dataDoctor = {};
    };
    $scope.showPopupOnlineExchangeQuestion = function () {
        $("#modal-online-exchange-question").modal('show');
    };
    $scope.closedPopupOnlineExchangeQuestion = function () {
        $("#modal-online-exchange-question").modal('hide');
        $("label.error").attr("style", "display:none;");
        $scope.cancelData();
    };
    $scope.showdataUpdate = function (item) {
        $scope.dataOnlineExchangeQuestion = JSON.parse(JSON.stringify(item.onlineExchangeQuestion));
        if (item.doctor) {
            $scope.dataDoctor.doctorId = JSON.parse(JSON.stringify(item.doctor.id.toString()));
            // setTimeout(function () {
            //     $("#doctorId").val(item.doctor.id).trigger("change");
            // }, 1500)
        }
        $("#modal-online-exchange-question").modal('show');
    }
    $.validator.addMethod("requiredContent", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập nội dung câu hỏi!");
    $.validator.addMethod("requiredAnswer", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập nội dung câu trả lời!");
    $scope.validationOnlineExchangeQuestion = {
        rules: {
            content: {
                requiredContent: true,
            },
            answer: {
                requiredAnswer: true,
            },
            doctorId: {
                required: true,
            }
        },
        messages: {
            doctorId: {
                required: "Vui lòng chọn bác sĩ!",
            }
        }
    };
    $scope.update = function () {
        if ($("#form-online-exchange-question").valid()) {
            if (!$scope.dataDoctor.doctorId) {
                alertSmallBox("Vui lòng chọn bác sĩ!", error);
                return;
            }
            $scope.dataOnlineExchangeQuestion.approval = 1;
            httpRequest.post("/online-exchange-question/update/" + $scope.dataOnlineExchangeQuestion.id,
                {
                    doctorId: $scope.dataDoctor.doctorId,
                    onlineExchangeQuestion: $scope.dataOnlineExchangeQuestion
                },
                function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.loadPage(urlPage);
                        $scope.cancelData();
                        $scope.closedPopupOnlineExchangeQuestion();
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    };
    $scope.approval = function (item) {
        if (item.approval) {
            var content = "Bạn có chắc chắn muốn hủy duyệt câu hỏi này?";
            var messeageSuccess = "Hủy duyệt câu hỏi thành công!";
            var messeageError = "Hủy duyệt câu hỏi không thành công!";
            var data = {approval: 0}
        } else {
            content = "Bạn có chắc chắn muốn duyệt câu hỏi này?";
            messeageSuccess = "Duyệt câu hỏi thành công!";
            messeageError = "Duyệt câu hỏi không thành công!";
            data = {approval: 1};
        }
        confirmDialog("Xác nhận", content, function () {
            httpRequest.post("/online-exchange-question/approval/" + item.id
                , data
                , function (data) {
                    if (data.success) {
                        alertSmallBox(messeageSuccess, success);
                        $scope.loadPage(urlPage);
                        $scope.closedPopupOnlineExchangeQuestion();
                    } else {
                        alertSmallBox(messeageError, error);
                    }
                }, function (data) {
                }, true);
        })
    };
});
ngApp.controller('mgrHospitalUtilityController', function ($scope, $http, httpRequest, fileManager) {
    $scope.href = window.location.origin;
    $scope.data = [];
    $scope.dataUtilitity = {};
    $scope.stt = 1;
    $scope.dataSearch = {
        name: '',
        size: 10,
    }
    var urlPage = common.getQueryStringHash("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            $scope.dataSearch.page = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.dataSearch.page = urlPage;
        var url = "/hospital-utility/search?"
            + "name=" + $scope.dataSearch.name
            + "&page=" + $scope.dataSearch.page
            + "&size=" + $scope.dataSearch.size
        httpRequest.get(url
            , function (data) {
                if (data.success) {
                    $scope.data = data.data.data;
                    $scope.totalPage = common.getTotalPage($scope.dataSearch.size, data.data.total);
                    $scope.stt = 1 + ($scope.dataSearch.page - 1) * $scope.dataSearch.size;
                    $scope.listPage = [];
                    for (var i = $scope.dataSearch.page - 5; i < $scope.dataSearch.page + 5; i++) {
                        if (i > 0 && i <= $scope.totalPage)
                            $scope.listPage.push(i);
                    }
                    window.history.replaceState({}, "", "/admin/dich-vu-tai-benh-vien?trang=" + $scope.dataSearch.page);
                }
            }, function (data) {
            }, true);
    };
    $scope.loadPage(urlPage);
    $scope.imageUrl = {
        chooseFile: function () {
            $("[file-input-id]").trigger("click");
        },
        selectFile: function () {
            var selector = $(event.target);
            var fileName = selector[0].value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
            if (common.endWith(fileName, ".jpg") ||
                common.endWith(fileName, ".png") ||
                common.endWith(fileName, ".gif")) {
                $scope.dataUtilitity.image = URL.createObjectURL(selector[0].files[0]);
            } else {
                alertSmallBox("Vui lòng chọn hình ảnh có định dạng png, jpg, gif")
            }
        }
    };
    $scope.resetImgInput = function () {
        $("#select-file-image-cover").val("");
    };
    $scope.cancelData = function () {
        $("label.error").attr("style", "display:none;");
        $scope.dataUtilitity = {};
        $scope.resetImgInput();
    };
    $.validator.addMethod("requiredName", function (value, element) {
        if ((!value || value.trim() == ""))
            return false;
        return true;
    }, "Vui lòng nhập nhập tên dịch vụ!");
    $scope.validationUtility = {
        rules: {
            name: {
                requiredName: true,
            },
            file1: {
                required: function () {
                    if (!$scope.dataUtilitity.image)
                        return true;
                    return false;
                }
            }
        },
        errorPlacement: function (error, element) {
            if (element.attr("id") === "select-file-image-cover") {
                error.insertAfter($("#text-file-name").parent());
            } else {
                error.insertAfter(element.parent());
            }
        },
        messages: {
            file1: {
                required: "Vui lòng chọn ảnh!"
            }
        }
    };
    $scope.createUtilitity = function () {
        var oldHref = $scope.dataUtilitity.href;
        if (oldHref == null || oldHref == "") {
            $scope.dataUtilitity.href = "";
        } else if (oldHref.startsWith($scope.href)) {
            var newHref = oldHref.replace($scope.href, "");
            $scope.dataUtilitity.href = newHref;
        }
        if ($("#form-utility").valid()) {
            httpRequest.post("/hospital-utility/create"
                , {hospitalUtility: $scope.dataUtilitity}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.cancelData();
                        $scope.loadPage(1);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    };
    $scope.createUtilitityWithImg = function () {
        var selector = $("[file-input-id]");
        if (selector[0].files.length > 0) {
            var width = $("#img-cover")[0].naturalWidth;
            var height = $("#img-cover")[0].naturalHeight;
            var du = width / height;
            if (du >= 2.0 || du <= 1.0) {
                alertSmallBox("Nên chọn ảnh có kích thước 360x213!", error)
                return
            }

            $("body").addClass("loading");
            fileManager.upload(selector[0].files[0], function (data) {
                $("body").removeClass("loading");
                if (data.success) {
                    $scope.dataUtilitity.image = data.data.images[0].image;
                    $scope.createUtilitity();
                } else {
                    alertSmallBox("Thêm ảnh lỗi");
                }
            }, function (response) {
                $("body").removeClass("loading");
            });
        } else {
            $scope.createUtilitity();
        }
    };
    $scope.delete = function (item) {
        confirmDialog("Xác nhận", "Bạn có chắc chắn muốn xóa dịch vụ này?", function () {
            $http({
                method: 'DELETE',
                url: '/hospital-utility/delete/' + item.id,
            }).then(function successCallback(response) {
                if (response.data.success) {
                    alertSmallBox(response.data.data, success);
                    urlPage = common.getQueryStringHref("trang");
                    if (!urlPage) {
                        urlPage = 1
                    }
                    $scope.loadPage(urlPage);
                }
                else
                    alertSmallBox(response.data.message, error);
            });
        });
    };
    $scope.showdataUpdate = function (item) {
        $scope.dataUtilitity = JSON.parse(JSON.stringify(item));
        $scope.dataUtilitity.image = item.image.absoluteUrl();
    };
    $scope.updateUtilitityWithImg = function (item) {
        var oldHref = $scope.dataUtilitity.href;
        if (oldHref == null || oldHref == "") {
            $scope.dataUtilitity.href = "";
        } else if (oldHref.startsWith($scope.href)) {
            var newHref = oldHref.replace($scope.href, "");
            $scope.dataUtilitity.href = newHref;
        }
        var selector = $("[file-input-id]");
        if (selector[0].files.length > 0) {
            var width = $("#img-cover")[0].naturalWidth;
            var height = $("#img-cover")[0].naturalHeight;
            var du = width / height;
            if (du >= 2.0 || du <= 1.0) {
                alertSmallBox("Nên chọn ảnh có kích thước 360x213!", error)
                return
            }
            $("body").addClass("loading");
            fileManager.upload(selector[0].files[0], function (data) {
                $("body").removeClass("loading");
                if (data.success) {
                    $scope.dataUtilitity.image = data.data.images[0].image;
                    if ($("#form-utility").valid()) {
                        httpRequest.post("/hospital-utility/update/" + item.id
                            , {hospitalUtility: $scope.dataUtilitity}
                            , function (data) {
                                if (data.success) {
                                    alertSmallBox(data.data, success);
                                    $scope.cancelData();
                                    if (!urlPage) {
                                        urlPage = 1
                                    }
                                    $scope.loadPage(urlPage);
                                } else {
                                    alertSmallBox(data.message, error);
                                }
                            }, function (data) {
                            }, true);
                    }
                } else {
                    alertSmallBox("Thêm ảnh lỗi");
                }
            }, function (response) {
                $("body").removeClass("loading");
            });
        } else {
            if ($("#form-utility").valid()) {
                httpRequest.post("/hospital-utility/update/" + item.id
                    , {hospitalUtility: $scope.dataUtilitity}
                    , function (data) {
                        if (data.success) {
                            alertSmallBox(data.data, success);
                            $scope.cancelData();
                            if (!urlPage) {
                                urlPage = 1
                            }
                            $scope.loadPage(urlPage);
                        } else {
                            alertSmallBox(data.message, error);
                        }
                    }, function (data) {
                    }, true);
            }
        }
    };
    $scope.checkHrefUtility = function (item) {
        if (item.href) {
            if (item.href.startsWith("/")) {
                return $scope.href + item.href;
            } else {
                return item.href;
            }
        } else {
            return "";
        }
    };
});
ngApp.controller('mgrDictionaryController', function ($scope, $http, httpRequest) {
    $scope.data = [];
    $scope.item;
    $scope.index = 0;
    $scope.search = {};
    $scope.loadData = function () {
        httpRequest.get("/dictionary/get-dictionary"
            , function (data) {
                if (data.success)
                    $scope.data = data.data;
            }, function () {
            }, true);
    }
    $scope.loadData();
    $scope.showdataUpdate = function (item, index) {
        $scope.dic = common.clone(item);
        $scope.item = item;
        $scope.index = index;
        $("#modal-update-key").modal("show");
    }
    $scope.showAddDic = function () {
        $scope.dic = {};
        $scope.item = undefined;
        $scope.index = -1;
        $("#modal-update-key").modal("show");
    }
    $scope.clear = function () {
        $scope.dic.vi = "";
        $scope.dic.en = "";
    }
    $scope.save = function () {
        if ($scope.dic && !$scope.dic.key) {
            alertSmallBox("Vui lòng nhập cụm từ cần dịch");
        }
        httpRequest.post("/dictionary/update", $scope.dic, function (data) {
            if (data.success) {
                if ($scope.index == -1) {
                    $scope.data.splice(0, 0, $scope.dic);
                    alertSmallBox("Thêm thành công", "success");
                }
                else {
                    $scope.data[$scope.index] = $scope.dic;
                    alertSmallBox("Cập nhật thành công", "success");
                }
                $("#modal-update-key").modal("hide");
            }
            else {
                if ($scope.index == -1) {
                    alertSmallBox("Thêm không thành công", "error");

                } else {
                    alertSmallBox("Cập nhật không thành công", "error");
                }
            }
        }, function () {
        }, true);
    }
    $scope.removeKey = function (item) {
        confirmDialog("Xác nhận", "Bạn có muốn xóa từ khóa này?", function () {
            httpRequest.delete("/dictionary/delete/" + item.key
                , function (data) {
                    if (data.success) {
                        alertSmallBox("Xóa thành công", "success");
                        $scope.data.splice($scope.data.indexOf(item), 1);
                    }
                    else {
                        alertSmallBox("Xóa không thành công");
                    }
                }, function () {
                }, true);
        })
    }
});

ngApp.controller('bookingAtHomeController', function ($scope, httpRequest, $http, $sce) {
    $scope.listStatus = [
        {
            val: "",
            text: "--Tất cả--"
        },
        {
            val: "0",
            text: "Chờ xác nhận",
            class: "label-default"
        },
        {
            val: "1",
            text: "Đặt lịch thành công",
            class: "label-success"

        },
        {
            val: "2",
            text: "Đã xác nhận",
            class: "label-warning"
        },
        {
            val: "3",
            text: "Đã thanh toán",
            class: "label-success"
        },
        {
            val: "4",
            text: "Đã gửi mẫu",
            class: "label-info"
        },
        {
            val: "5",
            text: "Chờ kết quả",
            class: "label-primary"
        },
        {
            val: "6",
            text: "Đã có kết quả",
            class: "label-primary"
        },
        {
            val: "7",
            text: "Đã trả kết quả",
            class: "label-primary"
        },
    ];
    $scope.cacheProvinces = [];
    $scope.cacheDistricts = [];
    $scope.listProvinces = [];
    $scope.listDistricts = [];
    $scope.dataCountries = [];
    $scope.dataProvinces = [];
    $scope.dataDistricts = [];
    $scope.profile = {};
    $scope.data = [];
    $scope.getStatus = function (status) {
        for (var i = 0; i < $scope.listStatus.length; i++) {
            if ($scope.listStatus[i].val === status + "")
                return $scope.listStatus[i];
        }
        return undefined;
    };
    $scope.selectedCountries = function () {
        if ($scope.cacheProvinces[$scope.profile.countryId]) {
            $scope.listProvinces = $scope.cacheProvinces[$scope.profile.countryId];
        }
        else {
            $scope.cacheProvinces[$scope.profile.countryId] = [];
            for (var i = 0; i < $scope.dataProvinces.length; i++) {
                if ($scope.dataProvinces[i] && $scope.dataProvinces[i].hisCountryId == $scope.profile.countryId) {
                    $scope.cacheProvinces[$scope.profile.countryId].push($scope.dataProvinces[i]);
                }
            }
            $scope.listProvinces = $scope.cacheProvinces[$scope.profile.countryId];
        }
        $scope.profile.zoneId = "";
    };
    $scope.selectProvinces = function () {
        if ($scope.cacheDistricts[$scope.profile.provinceId]) {
            $scope.listDistricts = $scope.cacheDistricts[$scope.profile.provinceId];
        }
        else {
            $scope.cacheDistricts[$scope.profile.provinceId] = [];
            for (var i = 0; i < $scope.dataDistricts.length; i++) {
                if ($scope.dataDistricts[i] && $scope.dataDistricts[i].hisProvinceId == $scope.profile.provinceId) {
                    $scope.cacheDistricts[$scope.profile.provinceId].push($scope.dataDistricts[i]);
                }
            }
            $scope.listDistricts = $scope.cacheDistricts[$scope.profile.provinceId];
        }
        $scope.profile.zoneId = "";
    };
    $scope.selectDistricts = function () {
        var url = "/booking/getZonesByDistrict/" + $scope.profile.districtId
        httpRequest.get(url, function (data) {
            if (data.success) {
                $scope.listZones = data.data.zones;
            }
        });
    };
    $scope.loadAddress = function () {
        httpRequest.get("/mgrBooking/getListAddress", function (data) {
            if (data.success) {
                $scope.dataCountries = data.data.dataCountries;
                $scope.dataProvinces = data.data.dataProvinces;
                $scope.dataDistricts = data.data.dataDistricts;
            }
            setTimeout(function () {
                $scope.dataCountries.forEach(function (item) {
                    if (item.name == "Việt Nam") {
                        $scope.defaultCountry = item.hisCountryId;
                    }
                })
                console.log($scope.defaultCountry);
            }, 500);
        })
    };
    $scope.loadAddress();
    $scope.listZones = [];
    $scope.profileName = "";
    $scope.packServiceName = "";
    $scope.searchStartTime = "";
    $scope.searchEndTime = "";
    $scope.searchPhoneNumber = "";
    $scope.searchAddress = "";
    $scope.searchPhoneNumber = "";
    $scope.searchDistrictId = "";
    $scope.searchStatus = "";
    $scope.searchValue = "";
    $scope.page = 1;
    $scope.size = 10;
    $scope.totalPage = 10;
    $scope.stt = 1;
    $scope.title = "";
    $scope.namePack = "";
    $scope.nameService = "";
    $scope.districtId = "";
    $scope.isShowChange = false;
    $scope.cacheMedicalPack = [];
    $scope.cacheMedicalService = [];
    $scope.listServicesSelected = [];
    $scope.listMedicalPack = [];
    $scope.listMedicalServices = [];
    $scope.listPackageSelect = [];
    $scope.LoadTechnician = function () {
        httpRequest.get("/technician/searchTechnician", function (data) {
            if (data.success) {
                $scope.listTecchnician = data.data.data;
            }
        }, function (data) {
        }, false)
    };
    $scope.loadListDistrictAccess = function () {
        httpRequest.get("/get-medical-test-district", function (data) {
            if (data.success) {
                $scope.listDistrictAccess = data.data;
            }
            ;
        }, function (data) {
        }, false)
    };
    $scope.loadListDistrictAccess();
    $scope.LoadTechnician();
    $scope.loadPage = function (page) {
        $scope.page = page;
        var url = "/mgrMedical/searchMedicalTestAtHome?"
            + "profileName=" + $scope.profileName
            + "&packServiceName=" + $scope.packServiceName
            + "&phoneNumber=" + $scope.searchPhoneNumber
            + "&address=" + $scope.searchAddress
            + "&districtId=" + $scope.searchDistrictId
            + "&status=" + $scope.searchStatus
            + "&value=" + $scope.searchValue
            + "&page=" + $scope.page
            + "&size=" + $scope.size
            + "&startTime="
        if ($scope.searchStartTime)
            url += $("#searchStartTime").datepicker("getDate").getTime();
        url += "&endTime=";
        if ($scope.searchEndTime)
            url += $("#searchEndTime").datepicker("getDate").getTime();
        url += "&createdDate=";
        httpRequest.get(url, function (data) {
            if (data.success && data.data != null) {
                $scope.data = data.data.data;
                $scope.totalPage = common.getTotalPage($scope.size, data.data.total);
                $scope.stt = 1 + ($scope.page - 1) * $scope.size;
                $scope.listPage = [];
                for (var i = $scope.page - 5; i < $scope.page + 5; i++) {
                    if (i > 0 && i <= $scope.totalPage)
                        $scope.listPage.push(i);
                }
            }
        }, function (data) {
        }, true);
    };
    $scope.loadServiceSelectedByUser = function (pack, service) {
        pack.forEach(function (item) {

        });
    };
    $scope.getListSelectedItem = function () {
        $scope.listPackageSelect = Object.values($scope.cacheMedicalPack);
        $scope.listServiceSelect = Object.values($scope.cacheMedicalService)
    };
    $scope.loadListMedicalPack = function () {
        var url = "/booking-medical-pack?namePack=" + $scope.namePack
        httpRequest.get(url, function (data) {
            $scope.loading = true;
            if (data.success) {
                $scope.listMedicalPack = data.data.data;
            }
            $scope.loading = false;
        });
    };
    $scope.loadListMedicalServices = function () {
        var url = "/booking-medical-services?nameService=" + $scope.nameService
        httpRequest.get(url, function (data) {
            $scope.loading = true;
            if (data.success) {
                $scope.listMedicalServices = data.data.data;
            }
            $scope.loading = false;
        });
    };
    $scope.countSelectedItem = function () {
        var text = Object.keys($scope.cacheMedicalPack).length.toString() + " gói xét nghiệm và " + Object.keys($scope.cacheMedicalService).length.toString() + " dịch vụ lẻ."
        return text;
    };
    $scope.removeSelectedItem = function () {
        $scope.cacheMedicalPack = [];
        $scope.cacheMedicalService = [];
        $scope.listServicesSelected = [];
        $scope.listPackageSelect = [];
        $scope.listServiceSelect = [];
    };
    $scope.cashBooking = function () {
        var cashPack = 0;
        var cashService = 0;
        for (var i = 0; i < $scope.listMedicalPack.length; i++) {
            if ($scope.cacheMedicalPack[$scope.listMedicalPack[i].pack.id]) {
                cashPack = cashPack + $scope.listMedicalPack[i].pack.pricePackage
            }
        }
        for (var i = 0; i < $scope.listMedicalServices.length; i++) {
            if ($scope.cacheMedicalService[$scope.listMedicalServices[i].service.id]) {
                cashService = cashService + $scope.listMedicalServices[i].service.priceService
            }
        }
        return (cashPack + cashService).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    $scope.convertPrice = function (price) {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    };
    $scope.addMedicalPack = function (item) {
        if ($scope.listServicesSelected.length == 0 && Object.keys($scope.cacheMedicalService).length == 0) {
            if (!$scope.cacheMedicalPack[item.pack.id])
                $scope.cacheMedicalPack[item.pack.id] = [];
            $scope.cacheMedicalPack[item.pack.id].push(item);
            $scope.getListSelectedItem();
            $scope.addServiceSelect(item);
        } else {
            for (var i = 0; i < item.services.length; i++) {
                if ($scope.listServicesSelected.indexOf(item.services[i].id) != -1) {
                    alertSmallBox("Gói này có chứa các xét nghiệm nằm trong một gói khác bạn đã chọn. Vui lòng chọn lại!", error)
                    return;
                } else if ($scope.cacheMedicalService[item.services[i].id]) {
                    $scope.serviceError = item.services[i].id;
                    $scope.addPack = item;
                    $('#modal-notice').modal('show');
                    return;
                }
            }
            if (!$scope.cacheMedicalPack[item.pack.id])
                $scope.cacheMedicalPack[item.pack.id] = [];
            $scope.cacheMedicalPack[item.pack.id].push(item);
            $scope.getListSelectedItem();
            $scope.addServiceSelect(item);
        }
        console.log($scope.listServicesSelected)
    };
    $scope.removeMedicalPack = function (item) {
        if ($scope.cacheMedicalPack[item.pack.id]) {
            delete $scope.cacheMedicalPack[item.pack.id];
            console.log($scope.cacheMedicalPack);
        }
        $scope.getListSelectedItem();
        $scope.removeServiceSelect(item);
        console.log($scope.listServicesSelected);

    };
    $scope.addMedicalService = function (item) {
        if (!$scope.cacheMedicalService[item.service.id])
            $scope.cacheMedicalService[item.service.id] = []
        $scope.cacheMedicalService[item.service.id].push(item)
        $scope.getListSelectedItem();
    };
    $scope.removeMedicalService = function (item) {
        if (item.service) {
            if ($scope.cacheMedicalService[item.service.id]) {
                delete $scope.cacheMedicalService[item.service.id];
                console.log($scope.cacheMedicalService);
            }
        } else {
            if ($scope.cacheMedicalService[item]) {
                delete $scope.cacheMedicalService[item];
            }
        }
        $scope.getListSelectedItem();
    };
    $scope.selectedPack = function (item) {
        if ($scope.cacheMedicalPack[item.pack.id]) {
            return true;
        } else {
            return false;
        }
    };
    $scope.selectedService = function (item) {
        if ($scope.cacheMedicalService[item.service.id]) {
            return true;
        } else {
            return false;
        }
    };
    $scope.addServiceSelect = function (item) {
        if (item.pack) {
            for (var i = 0; i < item.services.length; i++) {
                $scope.listServicesSelected.push(item.services[i].id)
            }
        } else {
            $scope.listServicesSelected.push(item.service.id);
        }
        console.log($scope.listServicesSelected)
    };
    $scope.removeServiceSelect = function (item) {
        if (item.pack) {
            for (var i = 0; i < item.services.length; i++) {
                $scope.listServicesSelected.splice($scope.listServicesSelected.indexOf(item.services[i].id), 1);
            }
        } else {
            $scope.listServicesSelected.splice($scope.listServicesSelected.indexOf(item.service.id), 1)
        }
    };
    $scope.checkServiceSelect = function (item) {
        for (var i = 0; i <= $scope.listServicesSelected.length; i++) {
            if ($scope.listServicesSelected.indexOf(item.service.id) != -1) {
                return false;
            } else {
                return true;
            }
        }
    };
    $scope.loadListMedicalServices();
    $scope.loadListMedicalPack();
    $scope.loadServiceAndPackSelected = function (packs, services) {
        console.log($scope.listMedicalPack)
        console.log(packs)
        console.log(services)
        if (packs) {
            packs.forEach(function (item) {
                var packSeleted = $scope.listMedicalPack.filter(function (pack) {
                    return pack.pack.id === item.id;
                });
                if (packSeleted.length > 0 && packSeleted[0].services) {
                    packSeleted[0].services.forEach(function (item) {
                        $scope.listServicesSelected.push(item.id)
                    });
                    $scope.cacheMedicalPack[packSeleted[0].pack.id] = [];
                    $scope.cacheMedicalPack[packSeleted[0].pack.id].push(packSeleted[0]);
                }
            });
        }
        if (services) {
            services.forEach(function (item) {
                var ser = {
                    service: item
                }
                $scope.cacheMedicalService[item.id] = [];
                $scope.cacheMedicalService[item.id].push(ser);
            });
        }
        $scope.getListSelectedItem();
    };
    $scope.showNoteBooking = function (bookingId, itemBooking) {
        $scope.notebookingId = bookingId;
        if (itemBooking.booking.note != undefined) {
            $scope.noteBooking = itemBooking.booking.note;
        } else {
            $scope.noteBooking = "";
        }
        var modal = $("#place-modal-edit-note");
        $("#place-modal-edit-note").modal("show");
    };
    $scope.showUpdateMedicalBooking = function (item) {
        $scope.isShowChange = true;
        $scope.itemMedical = JSON.parse(JSON.stringify(item));
        $scope.startTime = item.booking.startTime;
        if (item.booking.endTime == '0' || item.booking.endTime) {
            $scope.endTime = (item.booking.startTime + 60 * 60 * 1000)
        }
        $scope.nameTechnician = "Mạc Văn Minh";
        $scope.loadServiceAndPackSelected(item.packs, item.services);
        $scope.bookingMedical = item.booking.bookingDate.toDateObject('-').ddmmyyyy();
        var modal = $("#modalEditMedicalAtHome");
        $("#modalEditMedicalAtHome").modal("show");
    };
    $scope.changeIsShow = function () {
        $scope.isShowChange = false;
    };
    $scope.loadDefaltValue = function () {
        $scope.cacheMedicalPack = [];
        $scope.cacheMedicalService = [];
        $scope.listServicesSelected = [];
        $scope.listPackageSelect = [];
        $scope.listServiceSelect = [];
        $scope.loadServiceAndPackSelected($scope.itemMedical.packs, $scope.itemMedical.services);
    };
    $scope.updateMedicalBooking = function () {
        var url = "/mgrMedical/updateMedicalAtHome/" + $scope.itemMedical.booking.id;
        if ($("#form-edit-medical").valid()) {
            $scope.itemMedical.booking.bookingDate = $("#bookingMedical").val().getDateByString().getTime();
            $scope.itemMedical.booking.startTime = getDayAndTime($("#bookingMedical").val().getDateByString(), $("#booking-start").val()).getTime();
            $scope.itemMedical.booking.endTime = getDayAndTime($("#bookingMedical").val().getDateByString(), $("#booking-end").val()).getTime();
            var dataMedical = {
                districtId: $scope.districtId,
                medicalServiceIds: Object.keys($scope.cacheMedicalService),
                medicalPackIds: Object.keys($scope.cacheMedicalPack),
                booking: $scope.itemMedical.booking,
            }
            httpRequest.post(url, dataMedical, function (data) {
                if (data.success) {
                    $scope.loadPage(1);
                    $("#modalEditMedicalAtHome").modal("hide");
                    alertSmallBox(data.data, success);
                    setTimeout(function () {
                        $("[rel=tooltip]").tooltip();
                    }, 1000);
                } else {
                    alertSmallBox(data.message, error);
                }
            }, function () {
            }, true);
        }
    };
    $scope.showZone = function () {
        if ($scope.profile.districtId) {
            if ($scope.listZones && $scope.listZones.length > 0) {
                return true;
            } else {
                return false;
            }
        } else {
            return true;
        }
    };
    // $scope.assignTechnician=function () {
    //     var url = "/mgrMedical/assign-technician/" + $scope.itemMedical.booking.id;
    //     var dataTechnician = {
    //         technicianId: $scope.technician,
    //     }
    //     httpRequest.post(url, dataTechnician, function (data) {
    //         if (data.success) {
    //             alertSmallBox("Gán kĩ thuật viên thành công!",success)
    //         } else {
    //             alertSmallBox("Gán kĩ thuật viên thất bại!",error)
    //         }
    //     }, function () {
    //     }, true);
    // };
    $scope.checkProfile = function (statusBooking, itemProfile) {
        console.log(itemProfile);
        $scope.profile = JSON.parse(JSON.stringify(itemProfile));
        $scope.selectedCountries();
        $scope.selectProvinces();
        $scope.selectDistricts();
        if (statusBooking != 2) {
            if (itemProfile.dob == '0') {
                itemProfile.dob = ""
            }
            $scope.bod = itemProfile.dob.toDateObject('-').ddmmyyyy();
            $scope.bodAge = itemProfile.dob.toDateObject('-').getAge();
            var modal = $("#modalAddProfileEdit");
            $("#modalAddProfileEdit").modal("show");
        } else if (statusBooking == 2) {
            var modal = $("#modalAddProfileInfo");
            $("#modalAddProfileInfo").modal("show");
        }
    };
    $("#txtDOB").checkDate({
        callback: function () {
            $scope.bodAge = $("#txtDOB").datepicker("getDate").getAge();
            $scope.$apply();
        },
        maxDate: new Date()
    });
    $scope.getAddress = function (profile) {
        var address = "";
        if (profile.zoneName) {
            if (address)
                address += ", ";
            address += profile.zoneName;
        }
        if (profile.districtName) {
            if (address)
                address += ", ";
            address += profile.districtName;
        }
        if (profile.provinceName) {
            if (address)
                address += ", ";
            address += profile.provinceName;
        }
        if (profile.countryName) {
            if (address)
                address += ", ";
            address += profile.countryName;
        }
        return address;
    }
    $scope.updateProfileByAdmin = function (profileId) {
        var url = "/admin/updateProfileByAdmin/" + profileId
        if ($("#form-add-profile").valid()) {
            $scope.profile.dob = $("#txtDOB").datepicker("getDate").getTime();
            if ($scope.profile.countryId == $scope.defaultCountry) {
                if ($scope.profile.zoneId || $scope.profile.zoneId != "") {
                    $scope.profile.zoneName = $('#zones').select2('data')[0].text.trim();
                }
                if ($scope.profile.districtId) {
                    $scope.profile.districtName = $('#districts').select2('data')[0].text.trim()
                }
                if ($scope.profile.provinceId) {
                    $scope.profile.provinceName = $('#provinces').select2('data')[0].text.trim()
                }
                if (!$scope.showZone()) {
                    $scope.profile.zoneId = 0;
                    $scope.profile.zoneName = "";
                }
            } else {
                $scope.profile.zoneId = 0;
                $scope.profile.zoneName = "";
                $scope.profile.districtId = 0;
                $scope.profile.districtName = "";
                $scope.profile.provinceId = 0;
                $scope.profile.provinceName = "";
            }
            if ($scope.profile.countryId) {
                $scope.profile.countryName = $('#countries').select2('data')[0].text.trim()
            }
            $scope.profile.address = $scope.getAddress($scope.profile);
            var dataProfile = {
                "profile": $scope.profile,
            }
            httpRequest.post(url, dataProfile, function (data) {
                if (data.success) {
                    $scope.loadPage(1);
                    $("#modalAddProfileEdit").modal("hide");
                    alertSmallBox(data.data, success);
                    setTimeout(function () {
                        $("[rel=tooltip]").tooltip();
                    }, 1000);
                } else {
                    alertSmallBox(data.message, error);
                }
            }, function () {
            }, true);
        }
    };
});
ngApp.controller('mgrNewsHoiLaoController', function ($scope, httpRequest, $http) {
    $scope.listNewsHoiLao = [];
    $scope.sttNewsHoiLao = 1;
    $scope.size = 10;
    $scope.content = "";
    $scope.isHotNews = "";
    $scope.menuIdSearch = "";
    $scope.fromHoiLao = "3";
    $scope.charity = "";
    var urlPage = common.getQueryStringHash("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            $scope.page = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.page = urlPage;
        var url = "/mgrNews/newsSearch?"
            + "page=" + $scope.page
            + "&size=" + $scope.size
            + "&content=" + $scope.content
            + "&isHotNews=" + $scope.isHotNews
            + "&menuId=" + $scope.menuIdSearch
            + "&webType=2"
            + "&fromHoiLao=" + $scope.fromHoiLao
            + "&charity=" + $scope.charity
        httpRequest.get(url
            , function (data) {
                if (data.success) {
                    $scope.listNewsHoiLao = data.data.data;
                    $scope.totalPage = common.getTotalPage($scope.size, data.data.total);
                    $scope.sttNewsHoiLao = 1 + ($scope.page - 1) * $scope.size;
                    $scope.listPage = [];
                    for (var i = $scope.page - 5; i < $scope.page + 5; i++) {
                        if (i > 0 && i <= $scope.totalPage)
                            $scope.listPage.push(i);
                    }
                    window.history.replaceState({}, "", "/admin/tin-tuc-hoi-lao?trang=" + $scope.page);
                }
            }, function (data) {
            }, true);
    };
    $scope.loadPage(urlPage);
    $scope.group = 1;
    $scope.menuByGroup = [];
    $scope.menuId = "";
    $scope.getMenuByGroup1 = function () {
        httpRequest.get("/mgrMenu/getByGroup/" + $scope.group
            , function (data) {
                if (data.success) {
                    $scope.menuByGroup = data.data.data;
                }
            }, function (data) {
            }, true);
    }
    $scope.dataNewsMenu = {};
    $scope.getMenuByGroup1();
    $scope.assignToMenu = function (menuAssign) {
        httpRequest.post("/news/assignToMenu/" + menuAssign,
            {newsId: $scope.tempId},
            function (data) {
                if (data.success) {
                    alertSmallBox("Phân loại vào menu thành công!", "success");
                    $scope.closePopupAssignToMenu();
                } else {
                    alertSmallBox("Phân loại menu không thành công", "error");
                }
            }, function (data) {
            }, true);
    }
    $scope.acceptMoveToBvp = function (item) {
        confirmDialog("Xác nhận", "Bạn có chắc chắn muốn xác nhận tin tức từ Hội lao?", "Có", "Không", function () {
            $http({
                method: 'POST',
                url: '/news/acceptMoveToBvp/' + item.id,
            }).then(function successCallback(response) {
                if (response.data.success) {
                    alertSmallBox(response.data.data, success);
                    $scope.loadPage(urlPage);
                }
                else
                    alertSmallBox(response.data.message, error);
            });
        });
    }
    $scope.rejectMoveToBvp = function (item) {
        confirmDialog("Xác nhận", "Bạn có chắc chắn muốn hủy tin tức từ Hội lao?", "Có", "Không", function () {
            $http({
                method: 'POST',
                url: '/news/rejectMoveToBvp/' + item.id,
            }).then(function successCallback(response) {
                if (response.data.success) {
                    alertSmallBox(response.data.data, success);
                    $scope.loadPage(urlPage);
                }
                else
                    alertSmallBox(response.data.message, error);
            });
        });
    }
});
ngApp.controller('manageTechnician', function ($scope, httpRequest, $sce) {
    $scope.searchNickName = "";
    $scope.searchFullName = "";
    $scope.searchGender = "";
    $scope.searchPhone = "";
    $scope.searchEmail = "";
    $scope.searchStatus = "";
    $scope.data = [];
    $scope.page = 1;
    $scope.size = 10;
    $scope.totalPage = 10;
    $scope.dataAccount = {};
    $scope.sttAccount = "";
    $scope.listDepartment = [];
    $scope.loadPage = function (page) {
        $scope.page = page;
        var url = "/mgrBooking/searchTechnicianInHome?"
            + "page=" + $scope.page
            + "&size=" + $scope.size
            + "&nickname=" + $scope.searchNickName
            + "&fullName=" + $scope.searchFullName
            + "&email=" + $scope.searchEmail
            + "&gender=" + $scope.searchGender
            + "&phoneNumber=" + $scope.searchPhone
            + "&status=" + $scope.searchStatus
        httpRequest.get(url, function (data) {
            if (data.success && data.data) {
                $scope.data = data.data.data;
                $scope.totalPage = common.getTotalPage($scope.size, data.data.total);
                $scope.listPage = [];
                $scope.sttAccount = 1 + ($scope.page - 1) * $scope.size;
                for (var i = $scope.page - 5; i < $scope.page + 5; i++) {
                    if (i > 0 && i <= $scope.totalPage)
                        $scope.listPage.push(i);
                }
            } else {
                $scope.data = [];
                $scope.totalPage = common.getTotalPage($scope.size, 0);
                $scope.listPage = [];
                $scope.sttAccount = 1 + ($scope.page - 1) * $scope.size;
                for (var i = $scope.page - 5; i < $scope.page + 5; i++) {
                    if (i > 0 && i <= $scope.totalPage)
                        $scope.listPage.push(i);
                }
            }
        }, function (data) {
        }, true);
    };
    $scope.blockAccount = function (item, action) {
        var title = 'Bạn có muốn' + (action == 0 ? ' mở' : '') + ' khóa tài khoản ' + '"' + item.username + '"' + ' không?'
        confirmDialog("Xác nhận", title, "Có", "Không", function () {
            var url = "/admin/blockTechnicianByAdmin?accountId=" + item.id
            var blook = {
                isBlocked: action
            }
            httpRequest.post(url, blook, function (data) {
                if (data.success) {
                    alertSmallBox(data.data, success);
                    $scope.loadPage(1);
                } else {
                    alertSmallBox(data.message, error);
                }
            }, function () {
            }, true);
        })
    };
    $scope.showEditAccount = function (item) {
        $scope.account = JSON.parse(JSON.stringify(item.user));
        $scope.account.departmentId = item.department ? item.department.id : "";
        $scope.account.gender = $scope.account.gender + "";
        $scope.account.index = $scope.account.index + "";
        $scope.account.birthday = ($scope.account.dob && $scope.account.dob != 0) ? $scope.account.dob.toDateObject('-').format("dd-MM-yyyy") : "";
        $scope.showHomePage = $scope.account.isHighlight == 1;

        $("#modal-add-user").modal("show");
        $("#form-user #select-file-image").val("");
        $("#form-user #img-temp-avatar").remove();
        if ($scope.imgAvatar.jcrop_api != undefined) {
            $scope.imgAvatar.jcrop_api.destroy();
        }

        $("#form-user").valid();
    }
    $scope.resetAccount = function (item) {
        var title = 'Bạn có muốn reset lại mật khẩu tài khoản ' + '"' + item.username + '"' + ' không?'
        confirmDialog("Xác nhận", title, "Có", "Không", function () {
            var url = "/admin/resetTechnicianByAdmin?accountId=" + item.id
            httpRequest.post(url, {}, function (data) {
                if (data.success) {
                    alertSmallBox(data.data, success);
                    $scope.loadPage(1);
                } else {
                    alertSmallBox(data.message, error);
                }
            }, function () {
            }, true);
        })
    };
    $scope.showAddAccount = function () {
        $scope.account = {
            index: "",
            gender: "1",
            bod: "",
            birthday: "",
            department: ""
        };
        $("#form-user #select-file-image").val("");
        $("#form-user #img-temp-avatar").remove();
        if ($scope.imgAvatar.jcrop_api != undefined) {
            $scope.imgAvatar.jcrop_api.destroy();
        }
        $("#modal-add-user").modal("show");
        $("#form-user").valid();
    };
    $scope.save = function (avatar) {
        if ($("#form-user").valid()) {
            var selector = $("#form-user #select-file-image");
            if (selector[0].files.length == 0 && !$scope.account.avatarUrl) {
                alertSmallBox("Vui lòng chọn ảnh đại diện cho bác sĩ", error);
                return;
            }
            if (selector[0].files.length > 0 && !avatar) {
                var oMyForm = new FormData();
                oMyForm.append("file", selector[0].files[0]);
                oMyForm.append('cropPointX', $scope.imgAvatar.cropPointX);
                oMyForm.append('cropPointY', $scope.imgAvatar.cropPointY);
                oMyForm.append('imageCropWidth', $scope.imgAvatar.imageCropWidth);
                oMyForm.append('imageCropHeight', $scope.imgAvatar.imageCropHeight);
                oMyForm.append('orgWidth', $("#form-user #img-temp-avatar")[0].naturalWidth);
                oMyForm.append('orgHeight', $("#form-user #img-temp-avatar")[0].naturalHeight);
                oMyForm.append('clientWidth', $("#form-user #img-temp-avatar").width());
                oMyForm.append('clientHeight', $("#form-user #img-temp-avatar").height());
                $.ajax({
                    dataType: 'json',
                    enctype: 'multipart/form-data',
                    type: 'POST',
                    url: "/user/upload-avatar",
                    data: oMyForm,
                    processData: false,  // tell jQuery not to process the data
                    contentType: false,  // tell jQuery not to set contentType
                    success: function (data) {
                        $("body").removeClass("loading");
                        if (data.success) {
                            var avatarUrl = data.data.images[0].image;
                            var thumbnailAvatarUrl = data.data.images[0].thumbnail;
                            $scope.account.thumbnailAvatarUrl = thumbnailAvatarUrl;
                            $scope.account.avatarUrl = avatarUrl;
                            $scope.save($scope.account.avatarUrl);
                        } else {
                            alertSmallBox("upload ảnh không thành công!", error)
                        }
                    },
                    error: function (data) {
                        $("body").removeClass("loading");
                    }
                });
            }
            else {
                var url = "/mgrDoctor/createOrUpdateDoctor"
                $scope.account.isHighlight = $scope.showHomePage ? 1 : 0
                var _account = common.clone($scope.account);
                _account.department = undefined;
                httpRequest.post(url, _account, function (data) {
                    if (data.success) {
                        $scope.loadPage(1);
                        $("#modal-add-user").modal("hide");
                        alertSmallBox(data.data, success);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function () {
                }, true);
            }

        }
    };
    $scope.setHighLight = function (item, highLight) {
        var item2 = common.clone(item);
        item2.user.isHighlight = highLight;
        item2.user.departmentId = item2.department ? item2.department.id : ""
        httpRequest.post("/mgrDoctor/createOrUpdateDoctor",
            item2.user
            , function (data) {
                if (data.success) {
                    item.user.isHighlight = highLight;
                    alertSmallBox(data.data, success);
                } else {
                    alertSmallBox(data.message, error);
                }
            }, function () {
            }, true);
    };
    $.validator.addMethod("fullname_max_length", function (value, element) {
        return value.length <= 50;
    }, "Vui lòng nhập tên dưới 50 ký tự!");
    $.validator.addMethod("isNickName", function (value, element) {
        return value.isNickname();
    }, "Vui lòng nhập không được chứa ký tự đặc biệt!");
    $.validator.addMethod("isValidEmail", function (value, element) {
        return value.isEmail();
    }, "Vui lòng nhập đúng định dạng email!");
    $.validator.addMethod("isdob", function (value, element) {
        if ($scope.account.dob)
            return $scope.account.dob.toDateObject('-').format("yyyyddMM") <= new Date().format("yyyyddMM");
        return true;
    }, "Ngày sinh không lớn hơn ngày hiện tại!");
    $scope.validationAddAccount = {
        rules: {
            gender: {
                required: true,
            },
            deparment: {
                required: true,
            },
            index: {
                required: true,
            },
            dob: {
                isdob: true
            },
            nickname: {
                minlength: 6,
                required: true,
                isNickName: true
            },
            fullname: {
                required: true,
                fullname_max_length: true,
            },

            email: {
                isValidEmail: true
            }
        },
        errorPlacement: function (error, element) {
            error.insertAfter(element.parent());
        },
        messages: {
            gender:
                {
                    required: "Vui lòng chọn giới tính"
                },
            index:
                {
                    required: "Vui lòng chọn chức vụ"
                },
            deparment:
                {
                    required: "Vui lòng chọn chuyên khoa"
                },
            nickname: {
                minlength: "Tên tài khoản tối thiểu 6 ký tự",
                required: "Vui lòng nhập tên tài khoản!",
            },
            fullname: {
                required: "Vui lòng nhập đầy đủ họ tên!",
            },
            dob: {
                required: "Vui lòng nhập ngày sinh",
            },
        }
    };
    $scope.imgAvatar = {
        imageCropWidth: 0,
        imageCropHeight: 0,
        cropPointX: 0,
        cropPointY: 0,
        initCrop: function () {
            $('#img-temp-avatar').Jcrop({
                onChange: $scope.imgAvatar.setCoordsAndImgSize,
                aspectRatio: 1
            }, function () {
                $scope.imgAvatar.inited = true;
                $scope.imgAvatar.jcrop_api = this;
                $scope.imgAvatar.jcrop_api.animateTo([100, 100, 400, 300]);
            });
        },
        setCoordsAndImgSize: function (e) {
            $scope.imgAvatar.imageCropWidth = e.w;
            $scope.imgAvatar.imageCropHeight = e.h;
            $scope.imgAvatar.cropPointX = e.x;
            $scope.imgAvatar.cropPointY = e.y;
        },
        chooseFile: function (id) {
            $("[file-input-id='" + id + "']").trigger("click");
        },
        changeFile: function () {
            var selector = $(event.target);
            var fileName = selector[0].value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
            if (common.endWith(fileName, ".jpg") ||
                common.endWith(fileName, ".png") ||
                common.endWith(fileName, ".gif")) {

                if ($scope.imgAvatar.jcrop_api != undefined) {
                    $scope.imgAvatar.jcrop_api.destroy();
                }
                $(".jcrop-holder").remove();
                $("#img-temp-avatar").remove();

                var filePath = URL.createObjectURL(selector[0].files[0]);
                $scope.account.thumbnailAvatarUrl = filePath;
                $scope.account.avatarUrl = filePath;

                $("#section_select_file")
                    .append($('<img style="max-width: 100%;  margin-top: 10px" id="img-temp-avatar">'));
                $("#form-user #img-temp-avatar").attr("src", filePath);
                $(".jcrop-holder img").attr("src", filePath);
                $scope.imgAvatar.initCrop();

            } else {
                alertSmallBox("Vui lòng chọn hình ảnh có định dạng png, jpg, gif")
            }
        }
    };
});
ngApp.controller('mgrContributeController', function ($scope, $http, httpRequest, fileManager) {
    $scope.contribute = [];
    $scope.dataContribute = {};
    $scope.sttContribute = 1;
    $scope.title = "";
    $scope.content = "";
    $scope.author = "";
    $scope.deleted = 0;
    $scope.size = 10;
    var urlPage = common.getQueryStringHash("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            $scope.page = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.page = urlPage;
        var url = "/mgrContribute/getListContribute?"
            + "title=" + $scope.title
            + "&content=" + $scope.content
            + "&author=" + $scope.author
            + "&deleted=" + $scope.deleted
            + "&page=" + $scope.page
            + "&size=" + $scope.size
        httpRequest.get(url, function (data) {
            if (data.success) {
                $scope.contribute = data.data.data;
                $scope.totalPage = common.getTotalPage($scope.size, data.data.total);
                $scope.sttContribute = 1 + ($scope.page - 1) * $scope.size;
                $scope.listPage = [];
                for (var i = $scope.page - 5; i < $scope.page + 5; i++) {
                    if (i > 0 && i <= $scope.totalPage)
                        $scope.listPage.push(i);
                }
                window.history.replaceState({}, "", "/admin#/quan-ly/danh-sach-goc-tri-an?trang=" + $scope.page);
                setTimeout(function () {
                    $("[rel=tooltip]").tooltip();
                }, 1000);
            }
        }, function (data) {
        }, true);
    };
    $scope.loadPage(urlPage);
    $scope.uploadingImg = true;
    $scope.imgContributeThumbnail = {
        chooseFile: function () {
            $("[file-input-id]").trigger("click");
        },
        selectFile: function () {
            var selector = $(event.target);
            var fileName = selector[0].value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
            if (common.endWith(fileName, ".jpg") ||
                common.endWith(fileName, ".png") ||
                common.endWith(fileName, ".gif")) {
                $scope.dataContribute.authorAvatar = URL.createObjectURL(selector[0].files[0]);
                $scope.uploadingImg = false;
                fileManager.upload(selector[0].files[0], function (data) {
                    if (data.success) {
                        $scope.dataContribute.authorAvatar = data.data.images[0].image;
                        $scope.uploadingImg = true;
                        $scope.$apply();
                    } else {
                        alertSmallBox("Thêm ảnh lỗi");
                    }
                }, function (response) {
                });
            } else {
                $("#select-file-image-cover").val("");
                alertSmallBox("Vui lòng chọn hình ảnh có định dạng png, jpg, gif")
            }
        }
    };
    $.validator.addMethod("input_content", function (value, element) {
        return CKEditorSetup.GetData(element.id).trim() !== "";
    }, "Vui lòng nhập nội dung tri ân");
    $scope.validationContribute = {
        ignore: [],
        rules: {
            authorContribute: {
                required: true,
            },
            titleContribute: {
                required: true,
                maxlength: 1000
            },
            contentContribute: {
                input_content: true
            },
            file1: {
                required: function () {
                    if (!$scope.dataContribute.authorAvatar) {
                        return true;
                    }
                    return false;
                }
            }
        },
        errorPlacement: function (error, element) {
            if (element.attr("id") === "select-file-image-cover") {
                error.insertAfter($("#text-file-image-cover-name").parent());
            } else {
                error.insertAfter(element.parent());
            }
        },
        messages: {
            authorContribute: {
                required: "Vui lòng nhập tên người tạo tri ân!",
            },
            titleContribute: {
                required: "Vui lòng nhập tiêu đề tri ân",
                maxlength: "Vui lòng nhập ít hơn 1000 ký tự"
            },
            file1: {
                required: "Vui lòng chọn ảnh"
            }
        }
    }
    $scope.createContribute = function () {
        if ($("#form-contribute").valid()) {
            httpRequest.post("/mgrContribute/createContribute"
                , {contribute: $scope.dataContribute}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.canceldataContribute();
                        $scope.closedPopupContribute();
                        $scope.loadPage(urlPage);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    }
    $scope.deleteContribute = function (item) {
        confirmDialog("Xác nhận", "Bạn có chắc chắn muốn xóa tri ân này?", "Có", "Không", function () {
            $http({
                method: 'DELETE',
                url: '/mgrContribute/deleteContribute/' + item.id,
            }).then(function successCallback(response) {
                if (response.data.success) {
                    alertSmallBox(response.data.data, success);
                    $scope.loadPage(urlPage);
                }
                else
                    alertSmallBox(response.data.message, error);
            });
        });
    };
    $scope.showdataUpdate = function (item) {
        $scope.showPopupAddNewContribute();
        $scope.dataContribute = JSON.parse(JSON.stringify(item));
        $scope.dataContribute.authorAvatar = item.authorAvatar.absoluteUrl();
        CKEditorSetup.SetData("contentContribute", $scope.dataContribute.content);
        // for (instance in CKEDITOR.instances) {
        //     CKEDITOR.instances[instance].setData(item.content);
        // }
    }
    $scope.resetImgInput = function () {
        $("#select-file-image-cover").val("");
        for (instance in CKEDITOR.instances) {
            CKEDITOR.instances[instance].setData("");
        }
    }
    $scope.canceldataContribute = function () {
        $scope.dataContribute = {};
        $scope.resetImgInput();
    }
    $scope.updateContribute = function (item) {
        if ($("#form-contribute").valid()) {
            httpRequest.post("/mgrContribute/updateContribute/" + item.id,
                {contribute: $scope.dataContribute},
                function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.loadPage(urlPage);
                        $scope.canceldataContribute();
                        $scope.closedPopupContribute();
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    }
    $scope.showPopupAddNewContribute = function () {
        $("#modal-addnew-contribute").show('modal-dialog');
    }
    $scope.closedPopupContribute = function () {
        $("label.error").attr("style", "display:none;");
        $("#modal-addnew-contribute").hide('modal-dialog');
        $scope.canceldataContribute();
    }
});

ngApp.controller('mgrAdvertiseController', function ($scope, $http, httpRequest) {
    $scope.advertise = [];
    $scope.dataAdvertise = {};
    $scope.sttAdvertise = 1;
    $scope.title = "";
    $scope.message = "";
    $scope.type = "";
    $scope.size = 10;
    var urlPage = common.getQueryStringHash("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            $scope.page = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.page = urlPage;
        var url = "/mgrAdvertise/searchAdvertise?"
            + "title=" + $scope.title
            + "&message=" + $scope.message
            + "&type=" + $scope.type
            + "&page=" + $scope.page
            + "&size=" + $scope.size
        httpRequest.get(url
            , function (data) {
                if (data.success) {
                    $scope.advertise = data.data.data;
                    $scope.totalPage = common.getTotalPage($scope.size, data.data.total);
                    $scope.sttAdvertise = 1 + ($scope.page - 1) * $scope.size;
                    $scope.listPage = [];
                    for (var i = $scope.page - 5; i < $scope.page + 5; i++) {
                        if (i > 0 && i <= $scope.totalPage)
                            $scope.listPage.push(i);
                    }
                    window.history.replaceState({}, "", "/admin#/quan-ly/tin-nhan-quang-ba?trang=" + $scope.page);
                }
            }, function (data) {
            }, true);
    };
    $scope.loadPage(urlPage);
    $scope.validationAdvertise = {
        rules: {
            titleAdvertise: {
                required: true,
            },
            messageAdvertise: {
                required: true
            },
            typeAdvertise: {
                required: true
            }
        },
        messages: {
            titleAdvertise: {
                required: "Vui lòng nhập tiêu đề tin nhắn!",
            },
            messageAdvertise: {
                required: "Vui lòng nhập nội dung tin nhắn!",
            },
            typeAdvertise: {
                required: "Vui lòng chọn loại tin nhắn!"
            }
        }
    }
    $scope.canceldataAdvertise = function () {
        $scope.dataAdvertise = {};
    }
    $scope.sendNotification = function () {
        if ($("#form-advertise").valid()) {
            $("body").addClass("loading");
            httpRequest.post("/mgrAdvertise/sendNotification"
                , {advertise: $scope.dataAdvertise}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.canceldataAdvertise();
                        $scope.loadPage(urlPage);
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    }
});
ngApp.controller('mgrWebLinkController', function ($scope, $http, httpRequest, fileManager) {
    $scope.webLink = [];
    $scope.dataWebLink = {};
    $scope.sttWebLink = 1;
    $scope.name = "";
    $scope.size = 10;
    var urlPage = common.getQueryStringHash("trang");
    if (urlPage) {
        if (urlPage % 1 === 0) {
            $scope.page = urlPage;
        } else {
            urlPage = 1;
        }
    } else {
        urlPage = 1;
    }
    $scope.loadPage = function (urlPage) {
        $scope.page = urlPage;
        var url = "/mgrWebLink/getListWebLink?"
            + "&name=" + $scope.name
            + "&page=" + $scope.page
            + "&size=" + $scope.size
        httpRequest.get(url
            , function (data) {
                if (data.success) {
                    $scope.webLink = data.data.data;
                    $scope.totalPage = common.getTotalPage($scope.size, data.data.total);
                    $scope.sttWebLink = 1 + ($scope.page - 1) * $scope.size;
                    $scope.listPage = [];
                    for (var i = $scope.page - 5; i < $scope.page + 5; i++) {
                        if (i > 0 && i <= $scope.totalPage)
                            $scope.listPage.push(i);
                    }
                    window.history.replaceState({}, "", "/admin/web-link?trang=" + $scope.page);
                }
            }, function (data) {
            }, true);
    };
    $scope.loadPage(urlPage);
    $scope.imgWebLink = {
        chooseFile: function () {
            $("[file-input-id]").trigger("click");
        },
        selectFile: function () {
            var selector = $(event.target);
            var fileName = selector[0].value.replace("C:\\fakepath\\", "").toLocaleLowerCase();
            if (common.endWith(fileName, ".jpg") ||
                common.endWith(fileName, ".png") ||
                common.endWith(fileName, ".gif")) {
                var filePath = URL.createObjectURL(selector[0].files[0]);
                $scope.dataWebLink.image = filePath;
            } else {
                alertSmallBox("Vui lòng chọn hình ảnh có định dạng png, jpg, gif")
            }
        }
    };
    $scope.validationWebLink = {
        rules: {
            nameWebLink: {
                required: true,
            },
            linkWeb: {
                required: true,
                url: true
            },
            file1: {
                required: function () {
                    if (!$scope.dataWebLink.image) {
                        return true;
                    }
                    return false;
                }
            }
        },
        errorPlacement: function (error, element) {
            if (element.attr("id") === "select-file-image-cover") {
                error.insertAfter($("#text-file-image-cover-name").parent());
            } else {
                error.insertAfter(element.parent());
            }
        },
        messages: {
            nameWebLink: {
                required: "Vui lòng nhập tên web link!",
            },
            linkWeb: {
                required: "Vui lòng nhập link web",
                url: "Vui lòng nhập đúng định dạng link web!"
            },
            file1: {
                required: "Vui lòng chọn ảnh cho web link!"
            }
        }
    }
    $scope.createWebLink = function () {
        if ($("#form-weblink").valid()) {
            httpRequest.post("/mgrWebLink/createWebLink"
                , {webLink: $scope.dataWebLink}
                , function (data) {
                    if (data.success) {
                        alertSmallBox(data.data, success);
                        $scope.loadPage(urlPage);
                        $scope.canceldataWebLink();
                    } else {
                        alertSmallBox(data.message, error);
                    }
                }, function (data) {
                }, true);
        }
    }
    $scope.createWebLinkWithImg = function () {
        var selector = $("[file-input-id]");
        if (selector[0].files.length > 0) {
            $("body").addClass("loading");
            fileManager.upload(selector[0].files[0], function (data) {
                $("body").removeClass("loading");
                if (data.success) {
                    var imageThumbnail = data.data.images[0].image;
                    $scope.dataWebLink.image = imageThumbnail;
                    $scope.createWebLink();
                } else {
                    alertSmallBox("Thêm ảnh lỗi");
                }
            }, function (response) {
                $("body").removeClass("loading");
            });
        } else {
            $scope.createWebLink();
        }
    }
    $scope.resetImgInput = function () {
        $("#select-file-image-cover").val("");
    }
    $scope.canceldataWebLink = function () {
        $scope.dataWebLink = {};
        $scope.resetImgInput();
    }
    $scope.deleteWebLink = function (item) {
        confirmDialog("Xác nhận", "Bạn có chắc chắn muốn xóa web link này?", "Có", "Không", function () {
            $http({
                method: 'DELETE',
                url: '/mgrWebLink/deleteWebLink/' + item.id,
            }).then(function successCallback(response) {
                if (response.data.success) {
                    alertSmallBox(response.data.data, success);
                    $scope.loadPage(urlPage);
                }
                else
                    alertSmallBox(response.data.message, error);
            });
        });
    }
    $scope.showdataUpdate = function (item) {
        $scope.dataWebLink = JSON.parse(JSON.stringify(item));
        $scope.dataWebLink.image = item.image.absoluteUrl();
    }
    $scope.updateWebLinkWithImg = function (dataWebLink) {
        var selector = $("[file-input-id]");
        if (selector[0].files.length > 0) {
            $("body").addClass("loading");
            fileManager.upload(selector[0].files[0], function (data) {
                $("body").removeClass("loading");
                if (data.success) {
                    var imageThumbnail = data.data.images[0].image;
                    $scope.dataWebLink.image = imageThumbnail;
                    if ($("#form-weblink").valid()) {
                        httpRequest.post("/mgrWebLink/updateWebLink/" + dataWebLink.id
                            , {webLink: $scope.dataWebLink}
                            , function (data) {
                                if (data.success) {
                                    $scope.loadPage(urlPage);
                                    alertSmallBox(data.data, success);
                                    $scope.canceldataWebLink();
                                } else {
                                    alertSmallBox(data.message, error);
                                }
                            }, function (data) {
                            }, true);
                    }
                } else {
                    alertSmallBox("Thêm ảnh lỗi");
                }
            }, function (response) {
                $("body").removeClass("loading");
            });
        } else {
            if ($("#form-weblink").valid()) {
                httpRequest.post("/mgrWebLink/updateWebLink/" + dataWebLink.id
                    , {webLink: $scope.dataWebLink}
                    , function (data) {
                        if (data.success) {
                            alertSmallBox(data.data, success);
                            $scope.loadPage(urlPage);
                            $scope.canceldataWebLink();
                        } else {
                            alertSmallBox(data.message, error);
                        }
                    }, function (data) {
                    }, true);
            }
        }
    }
});

ngApp.filter('filterDic', function () {
    return function (items, search) {
        if (!search.searchKey && !search.searchVi && !search.searchEn && !search.searchType)
            return items;
        var result = [];
        angular.forEach(items, function (value, key) {
            var _val = common.clone(value);
            _val.key = _val.key ? _val.key.toLowerCase() : "";
            _val.vi = _val.vi ? _val.vi.toLowerCase() : "";
            _val.en = _val.en ? _val.en.toLowerCase() : "";

            var searchKey = search.searchKey ? search.searchKey.toLowerCase() : "";
            var searchVi = search.searchVi ? search.searchVi.toLowerCase() : "";
            var searchEn = search.searchEn ? search.searchEn.toLowerCase() : "";
            var searchType = search.searchType;

            if ((!searchType || (searchType == 1 && _val.isMenu) || (searchType == 2 && _val.isDoctor) || (searchType == 3 && _val.isPosition) || (searchType == 4 && !_val.isDoctor && !_val.isMenu && !_val.isPosition)) && (!searchKey || _val.key.indexOf(searchKey) != -1) && (!searchVi || _val.vi.indexOf(searchVi) != -1) && (!searchEn || _val.en.indexOf(searchEn) != -1)) {
                result.push(value);
            }
        });
        return result;
    }
});