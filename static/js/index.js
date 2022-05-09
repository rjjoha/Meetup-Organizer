$(document).ready(function(){

    let comment_list = [];
    // replacing jquery with $
    $("#add_button").click(function() {
        // Gets the content of the input.
        let new_comment = $("#new_comment").val();
        // Clears the field.
        $("#new_comment").val("");
        // Creates a div for the comment.
        let new_div = $('<div class="block"></div>');
        // Puts the comment in the div.
        new_div.text(new_comment);
        comment_list.push(new_comment);
        // And adds the div as the last child of the comments.
        $("#comments").append(new_div);
    })

});