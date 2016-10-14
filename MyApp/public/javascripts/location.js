$(document).ready(function () {

    const formData = {};
    $("#addloc").click(function () {
        var formData = {};
        var aurl = $("#locform").attr("action");
        $("#locform").find("input[name]").each(function (index, node) {
            formData[node.name] = node.value;
        });
        formData["category"] = $("#categ").find(":selected").text();
        const latitude = $("#lat").val();
        const longtude = $("#long").val();

        formData["latitude"] = latitude;
        formData["longitude"] = longtude;
        $.ajax({
            type: 'POST',
            url: aurl,
            data: formData,
            success: function (data) {
                if (data == 'success') {
                    alert("Location successfully added");
                    location.reload();
                }
            }
        });
    });
    $("#btnsearch").click(function () {
        $("#nloc").empty();
        var categ = $("#searchcateg").find(":selected").text();
        var curlong;
        var curlat;
        navigator.geolocation.getCurrentPosition((pos) => {
            curlong = pos.coords.longitude;
            curlat = pos.coords.latitude;
            const categData = { "category": categ, "curLong": curlong, "curLat": curlat };
            $.ajax({
                type: 'POST',
                url: "/location/search",
                data: categData,
                success: function (data) {
                    // if (data == 'success') {
                    data.forEach((el, index, array) => {
                        const n = el.name;
                        $("#nloc").append(`<tr><td>${n}</td></tr>`);
                    });
                    //}
                }
            });
        }, (msg) => {
            console.log(msg.code + msg.message);
        });

    });

});