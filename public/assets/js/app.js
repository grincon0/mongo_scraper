$(document).ready(function () {
    $('#scrape-btn').on("click", function () {
        $("#art-box").empty();
        $.ajax({
            method: "GET",
            url: "/scrape"

        }).then(function (data) {
        
            location.reload();
        })
    });

    $('.save-btn').on("click", function () {
        let id = $(this).attr('ident');
        let bool = true;
        console.log('atricle is saved')
        $.ajax({
            method: "POST",
            url: `/update/${id}/${bool}`

        }).then(function (data) {
            console.log(data);
            location.reload();
        })
    });

    $('.unsave-btn').on("click", function () {
        let id = $(this).attr('ident');
        let bool = false;
        console.log('atricle is unsaved')
        $.ajax({
            method: "POST",
            url: `/update/${id}/${bool}`

        }).then(function (data) {
            console.log(data);
            location.reload();
        })
    });

    $('.add-note-btn').on("click", function () {
        let id = $(this).attr('ident');
        let note = $(`.${id}`).val();
        console.log(note);

        $.ajax({
            method: "POST",
            url: `/articles/${id}`,
            data: {
                body: note
            }
        }).then(function (data) {
            console.log(data);
            $(`#${id}`).modal('toggle');
            //location.reload();


        }).then(function () {
            $.ajax({
                method: "GET",
                url: `/notes/${id}`
            }).then(function (data) {
               
                let newDiv = $('<div>',{
                    id: `card-${id}`,
                    class: `card-div`
                });

                $(newDiv).append(`<p>${data.note.body}</p>`);
                // A button to submit a new note, with the id of the article saved to it
                $(newDiv).append(`<button art-ref=${id} data-id=${data._id} class=del-note-btn>Delete Note</button>`);
                console.log(newDiv);
                $(`.notes${id}`).append(newDiv);
            });
        });


    });
   
    $('.view-note-btn').on("click", function () {

        let id = $(this).attr('ident');

        $(`#${id}`).modal('toggle');



    });

    $('.close-btn').on("click", function () {
        let id = $(this).attr('ident');
        $(`.${id}`).empty();

    })
    checkEmpty('#art-box');

    //delegating onClick func after dynamic btn creation
    $(document).on('click', ".del-note-btn", function() {
        console.log('fjekjf');
        let id = $(this).attr('data-id');

        $(this).parents(".card-div").remove();
        
        $.ajax({
            method: 'DELETE',
            url: `/notes/${id}`
        }).then(function (data) {
            console.log('delete passed');
      
            /*  $(`#card-${id}`).remove(); 
            $(this).remove(); */
            

        }).then(function () {
            console.log('it worked');
          
        });  
     });
});


/* HELPER FUNCTIONS */

const checkEmpty = (classOrId) => {
    if ($(classOrId).is(':empty')) {
        $(classOrId).text('There are no articles scraped. Try scrapping them.');
    } else {
        return 'div has content';
    }
}


