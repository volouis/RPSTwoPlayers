var database = firebase.database();

var name1 = "";
var name2 = "";
var win1 = 0;
var win2 = 0;
var lost1 = 0;
var lost2 = 0;
var keys = [];
var filled = 1;
var name;

var usersRef = database.ref().child("players");
var chatMess = database.ref().child("chat");

$("#nameSubmit").click(function(){
    name = $("#name").val();

    if(name === ""){
        alert("please enter a name")
    }else{

        usersRef.once('value', function(snapshot) {
            if (snapshot.hasChild("1")) {
                usersRef.child("2").set({
                    name: name,
                    win: win1,
                    lost: lost1
                });
            }else{
                usersRef.child("1").set({
                    name: name,
                    win: win1,
                    lost: lost1
                });
            }
          }).then(function(){
            gameBtn(name, filled);
        });
    }
    $(".nameInput").hide();
});


database.ref().child("players").on("child_added", function(snap) {
    console.log($("#player1").attr("data-fill"));
    console.log(snap.val())


    if($("#player1").attr("data-fill") === "filled"){
        $("#text2").text(snap.val()[2].name);
    }else{
        $("#text1").text(snap.val()[1].name);
    }
});




$(document).on("click","button.btn1", function(){
    console.log("fff");
})

$(document).on("click","button.btn2", function(){
    console.log("dff");
})

$("#textSubmit").click(function(){

    chatMess.push($("#inputMessage").val());

});

database.ref().child("chat").on("child_added", function(snap) {
    var mess = $("<p>");

    mess.text(snap.val());
    mess.addClass("messages");
    
    $("#messages").append(mess);
});


function gameBtn(name , odd){

    $("#text" + odd).text(name);

    var rock = $("<button>");
    var paper = $("<button>");
    var scissor = $("<button>");

    rock.text("rock");
    paper.text("paper");
    scissor.text("scissor");
    rock.addClass("btn" + odd);
    paper.addClass("btn" + odd);
    scissor.addClass("btn" + odd);
    rock.attr("id", "rock" + odd);
    paper.attr("id", "paper" + odd);
    scissor.attr("id", "scissor" + odd);

    $("#player" + odd).append(rock);
    $("#player" + odd).append(paper);
    $("#player" + odd).append(scissor);

}