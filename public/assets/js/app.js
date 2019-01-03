$(document).ready(function () {
    $('#scrape-btn').on("click", function(){
        $.ajax({
            method: "GET",
            url: "/scrape"

        }).then(function(data){
            console.log(data);
        })
    });
});