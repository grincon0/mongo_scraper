$(document).ready(function () {
    $('#scrape-btn').on("click", function(){
        $.ajax({
            method: "GET",
            url: "/scrape"

        }).then(function(data){
            console.log(data);
            location.reload();
        })
    });

    checkEmpty('#art-box');




});


/* HELPER FUNCTIONS */

const checkEmpty = (classOrId) => {
    if( $(classOrId).is(':empty') ) {
        $(classOrId).text('There are no articles scraped. Try scrapping them.');
    }else{
        return 'div has content';
    }
}