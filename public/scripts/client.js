/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {

  //XSS Attack Prevention
  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const createTweetElement = (tweet) => {
    const timeSince = moment(tweet.created_at).fromNow();
    //using momentJS to calculate the time since
  
    const newElement = `<article>
    <div class = "tweet-header">
      <div>
        <img src = ${tweet.user.avatars}>
        <p>${tweet.user.name}</p>
      </div>
      <p id = 'at'>${tweet.user.handle}</p>
    </div>
    <div class = "tweet">
      <p>${escape(tweet.content.text)}</p>
    </div>
    <div class = "buttons">
      <p>${timeSince}</p>
    <div id = 'icons'>
      <button><img src = "/images/flag.png"></button>
      <button><img src = "/images/retweet.png"></button>
      <button><img src = "/images/heart.png"></button>
      </div>
    </div>
  </article>`;

    return newElement;
  };

  const renderTweets = function(tweets) {
    for (let post of tweets.reverse()) {
      // loops through tweets
      const newElement = createTweetElement(post);
      // calls createTweetElement for each tweet
      // logs first article tweet
      $('.tweet-container').append(newElement);
      // takes return value and appends it to the tweets container
    }
  };


  const $form = $('.newTweet');
  $form.on('submit', function(event) {
    event.preventDefault();
    validateForm($('textarea').val());
  });

  //Add existing tweets to the page
  const loadTweets = (url, method, callback) => {
    $.ajax({
      url: '/tweets',
      method: 'GET',
    })
      .done(data => {
        callback(data);
      })
      .fail(error => {
        console.log('Error:', error);
      })
      .always(() => {
        console.log("New Tweets loaded!");
      });
  };


  const validateForm = (text) => { //validates & submits new tweets
    if (text === '' | null) {
      $(`#errormsg`).slideDown();
      $(`#errormsg`).text("Please enter a Tweet");
      return;
    } else if (text.length > 140) {
      $(`#errormsg`).slideDown();
      $(`#errormsg`).text(`Your tweet is too long: ${text.length} characters`);
      return;
    } else {
      $.ajax({
        url: '/tweets',
        method: 'POST',
        data: {
          text
        }
      })
        .done(() => {
          console.log('Success!');
          loadTweets("/tweets", "GET", (data) =>{
            $('.tweet-container').empty();
            renderTweets(data);
            $('textarea').val(''); //clear textarea;
            $(`#errormsg`).hide(); // hide the error message when a tweet is processed
            $('.counter').text(140); // reset counter
          });
        })
        .fail((err) => {
          console.log("Error:", err);
        })
        .always(() => {
          console.log("Done!");
        });
    }
  };


  $(`#errormsg`).hide();
  loadTweets("/tweets", "GET", renderTweets);
});


