var database = firebase.database();

var name1 = "";
var name2 = "";
var win1 = 0;
var win2 = 0;
var lost1 = 0;
var lost2 = 0;
var keys = [];
var filledOne;
var filledTwo;
var name;
var clickedOne = 0;
var clickedTwo = 0;


var usersRef = database.ref().child("players");
var chatMess = database.ref().child("chat");
$("#player1Btn").hide();
$("#player2Btn").hide();

$("#nameSubmit").click(function(){
    name = $("#name").val();

    if(name === ""){
        alert("please enter a name")
    }else{
        if($("#player1").attr("data-fill") === "unfill"){
            usersRef.child("1").set({
                name: name,
                win: win1,
                lost: lost1
            });
            $("#text1").text(name);
            $("#player1Btn").show();
            $("#player1Btn").attr("data-side", "pic");
        }else {
            usersRef.child("2").set({
                name: name,
                win: win1,
                lost: lost1
            });
            $("#text2").text(name);
            $("#player2Btn").show();
            $("#player2Btn").attr("data-side", "pic");
        }
    }
    $(".nameInput").hide();
});

usersRef.on("child_added", function(snap) {
    if($("#player1").attr("data-fill") === "unfill"){
        $("#text1").text(snap.val().name);
        $("#scoreOne").text("wins:" + snap.val().win + " losts:" + snap.val().lost);
        filledOne = 1;
    }else {
        $("#text2").text(snap.val().name);
        $("#scoreTwo").text("wins:" + snap.val().win + " losts:" + snap.val().lost);
        filledTwo = 1;
    }
    $("#player1").attr("data-fill", "fill");
});

usersRef.child("1").on("child_added", function(snap) {
    
    if (snap.key === "pick") {
        $("#playerOnePick").attr("data-pick", "pick");
        $("#player1Btn").hide();
        // $("#select1").text(snap.val());
        // $("#select1").show();
    }

    if($("#playerTwoPick").attr("data-pick") === "pick"){
        database.ref().child("players").once("value", function(data) {
            var pick1 = snap.val();
            var pick2 = data.child("2").val().pick;
            var result = decision(pick1, pick2);
            var wins;
            var losts;
            var wins2;
            var losts2;

            $("#playerTwoPick").text(data.child("2").val().name + ": " + data.child("2").val().pick);
            $("#playerOnePick").text(data.child("1").val().name + ": " + data.child("1").val().pick);

            if(result === 2){
                console.log("here1")
                wins = data.child("2").val().win + 1;
                losts = data.child("1").val().lost + 1;
                wins2 = data.child("2").val().lost;
                losts2 = data.child("1").val().win;
                usersRef.child("2").update({
                    win: wins
                });
                usersRef.child("1").update({
                    lost: losts
                });
                $("#decision").text("WINNER: " + data.child("2").val().name);
            }else if(result === 1){
                console.log("here1")
                losts2 = data.child("1").val().win + 1;
                wins2 = data.child("2").val().lost + 1;
                losts = data.child("1").val().lost;
                wins = data.child("2").val().win;
                usersRef.child("1").update({
                    win: losts2
                });
                usersRef.child("2").update({
                    lost: wins2
                });
                $("#decision").text("WINNER: " + data.child("1").val().name);
            }else{
                console.log("here1")
                $("#decision").text("TIED");
                losts = data.child("1").val().lost;
                wins = data.child("2").val().win;
                wins2 = data.child("2").val().lost;
                losts2 = data.child("1").val().win;
            }

            $("#scoreOne").text("wins:" + losts2 + " losts:" + losts);
            $("#scoreTwo").text("wins:" + wins + " losts:" + wins2);
            callsReplay(losts2, losts, data.child("1").val().name , wins, wins2, data.child("2").val().name);
        });
    }
});

usersRef.child("2").on("child_added", function(snap) {
    if (snap.key === "pick") {
        $("#playerTwoPick").attr("data-pick", "pick");
        $("#player2Btn").hide();
    }

    if($("#playerOnePick").attr("data-pick") === "pick"){
        database.ref().child("players").once("value", function(data) {
            var pick1 = snap.val();
            var pick2 = data.child("1").val().pick;
            var result = decision(pick1, pick2);
            var wins;
            var losts;
            var wins2;
            var losts2;

            $("#playerTwoPick").text(data.child("2").val().name + ": " + data.child("2").val().pick);
            $("#playerOnePick").text(data.child("1").val().name + ": " + data.child("1").val().pick);

            if(result === 2){
                console.log("here1")
                wins = data.child("2").val().win + 1;
                losts = data.child("1").val().lost + 1;
                wins2 = data.child("2").val().lost;
                losts2 = data.child("1").val().win;
                usersRef.child("2").update({
                    win: wins
                });
                usersRef.child("1").update({
                    lost: losts
                });
                $("#decision").text("WINNER: " + data.child("2").val().name);
            }else if(result === 1){
                console.log("here1")
                losts2 = data.child("1").val().win + 1;
                wins2 = data.child("2").val().lost + 1;
                losts = data.child("1").val().lost;
                wins = data.child("2").val().win;
                usersRef.child("1").update({
                    win: losts2
                });
                usersRef.child("2").update({
                    lost: wins2
                });
                $("#decision").text("WINNER: " + data.child("1").val().name);
            }else{
                console.log("here1")
                losts = data.child("1").val().lost;
                wins = data.child("2").val().win;
                wins2 = data.child("2").val().lost;
                losts2 = data.child("1").val().win;
                $("#decision").text("TIED");
            }
            $("#scoreOne").text("wins:" + losts2 + " losts:" + losts);
            $("#scoreTwo").text("wins:" + wins + " losts:" + wins2);
            callsReplay(losts2, losts, data.child("1").val().name , wins, wins2, data.child("2").val().name);
        });
    }
});

function callsReplay(pw1, pl1, pn1, pw2, pl2, pn2){
    setTimeout(replay(pw1, pl1, pn1, pw2, pl2, pn2), 2000);
}


$(".btn1").click(function(){
    console.log("here-1")
    usersRef.child("1").update({
        pick: $(this).val()
    });
})

$(".btn2").click(function(){
    console.log("here-1")
    usersRef.child("2").update({
        pick: $(this).val()
    });
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

$(window).on("load", function() {
    // if(filledOne === 1){
    //     usersRef.child("1").remove();

    // }else{
    //     usersRef.child("2").remove();
    // }
    usersRef.child("1").remove();
    usersRef.child("2").remove();
});
// usersRef.child("2").onDisconnect().remove(function(){
//     console.log("ddsccdsd");
// });

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

function decision(pick1, pick2){
    console.log("here0")
    if(pick1 === "rock"){
        if(pick2 === "rock"){
            return 0;
        }else if(pick2 === "paper"){
            return 2;
        }else{
            return 1;
        }
    }else if(pick1 === "paper"){
        if(pick2 === "rock"){
            return 1;
        }else if(pick2 === "paper"){
            return 0;
        }else{
            return 2;
        }
    }else{
        if(pick2 === "rock"){
            return 2;
        }else if(pick2 === "paper"){
            return 1;
        }else{
            return 0;
        }
    }
}

function replay(pw1, pl1, pn1, pw2, pl2, pn2){
    console.log("here2")
    if($("#player2Btn").attr("data-side") === "pic"){

        $("#player2Btn").show();
    }
    if($("#player1Btn").attr("data-side") === "pic"){

        $("#player1Btn").show();
    }

    $("#playerOnePick").attr("data-pick", "unpick");
    $("#playerTwoPick").attr("data-pick", "unpick");

    $("#playerOnePick").hide();
    $("#playerTwoPick").hide();
    $("desicion").hide();
    $("#select2").hide();
    $("#select1").hide();

    usersRef.child("1").set({
        name: pn1,
        win: pw1,
        lost: pl1
    });

    usersRef.child("2").set({
        name: pn2,
        win: pw2,
        lost: pl2
    });
    console.log("here3")
}