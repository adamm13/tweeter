$(document).ready(function() {

  $(".tweet-text").on("input", function() {

  const maxCharacters = 140
  const length = $(this).val().length;

  $(".counter").text(maxCharacters - length);

  if (length > maxCharacters) {
    $(".counter").css("color","#FF0000");

  } else {
    $(".counter").css("color","#000000");
   }
  })
});