$(document).ready(function () {

    $("#course").change(function () {
        $("#change").text($(this).val())
    })
    
    $(".btnHide").click(function () {
        $("#info").hide("slow")
    })

    $(".btnShow").dblclick(function () {
        $("#info").show(2000)
    })


    $(".hideTable").click(function () {
        $("#table").hide("slow")
    })

    $(".showTable").dblclick(function () {
        $("#table").show(2000)
    })

     $("#btn").mouseenter(function () {
        $("#message").text("Your mouse reached the button!😜")
    })

    $("#btn").mouseleave(function () {
        $("#message").text("Your mouse leaves the button!😭")
    })

    $("#btnChange").click(function () {
        $("#message").text("You clicked the button!🥇")
    })

    $("#btnChange").dblclick(function () {
        $("#message").text("You double clicked the button!🥈")
    })

    $("#btnOdd").click(function () {
        $("tr:odd").css("background", "lightgreen")
    })

    $("#btnEven").click(function () {
        $("tr:even").css("background", "lightblue")
    })

})