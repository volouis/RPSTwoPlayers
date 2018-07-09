var database = firebase.database();

var name1 = "";
var name2 = "";
var win1 = 0;
var win2 = 0;
var lost1 = 0;
var lost2 = 0;
var keys = [];
var filled;
var name;

var usersRef = database.ref().child("players");
var chatMess = database.ref().child("chat");
$("#player1Btn").hide();
$("#player2Btn").hide();

$("#nameSubmit").click(function(){
    name = $("#name").val();
    console.log($("#player1").attr("data-fill"));
    console.log($("#name").val());
    $("#name").val("");

    if(name === ""){
        alert("please enter a name")
    }else{
        if($("#player1").attr("data-fill") === "unfill"){
            usersRef.child("1").set({
                name: name,
                win: win1,
                lost: lost1
            });
            console.log(name + "2");
            $("#text1").text(name);
            $("#player1Btn").show();
        }else {
            usersRef.child("2").set({
                name: name,
                win: win1,
                lost: lost1
            });
            $("#text2").text(name);
            $("#player2Btn").show();
        }
    }
    $(".nameInput").hide();
});

database.ref().child("players").on("child_added", function(snap) {

    if($("#player1").attr("data-fill") === "unfill"){
        $("#text1").text(name);
    }else {
        $("#text2").text(name);
    }
    $("#player1").attr("data-fill", "fill");
});

$(document).on("click","button.btn1", function(){
    console.log($(this).val());
})

$(document).on("click","button.btn2", function(){
    console.log("dff");
})

$("#textSubmit").click(function(){

    chatMess.push($("#inputMessage").val());

    $("#inputMessage").val("");

});

database.ref().child("chat").on("child_added", function(snap) {
    var mess = $("<p>");

    mess.text(snap.val());
    mess.addClass("messages");
    
    $("#messages").append(mess);
});

function myFunction1(event) {

    var x = event.key;
    if(x === "Enter"){
        $("#nameSubmit").click();
    }
}

function myFunction(event) {

    var x = event.key;
    if(x === "Enter"){
        $("#textSubmit").click();
    }
}