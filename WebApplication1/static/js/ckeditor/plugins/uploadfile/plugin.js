var CKEditorPlugin =
{
    selectFile: function (data) {
        if (data.success) {
            var tmp = data.data[0].ImageUrl;
            ckeditor.insertHtml("<img  src='" + tmp + "' style='max-width: 100%;'/>");
        }
        }
}
CKEDITOR.plugins.add('uploadfile', {
    icons: 'uploadfile',
    init: function (editor) {
        editor.addCommand('insertImage', {
            exec: function (editor) {
                AJAXFunction.CallAjax("Post",
                    "/FileManager",
                    "/ShowModalUploadImage",
                    { action: "CKEditorPlugin.selectFile(data)" },
                    function (data) {
                        if (data.success) {
                            var place = $("#place-modal-uploadfile");
                            if (place.length === 0) {
                                place = $("<div>").attr("id", "place-modal-uploadfile");
                                $("body").append(place);
                            }
                            place.empty().append(data.data);
                            $("#modal-upload-image").modal("show");
                        }
                    });
            }
        });
        editor.ui.addButton('uploadfile', {
            label: 'Upload hình ảnh',
            command: 'insertImage',
            toolbar: 'insert'
        });
    }
});