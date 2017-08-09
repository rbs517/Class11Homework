var app = {
    //Define the url for the wikipedia API call
   //currentWord: "salad",
  musixMatchRest:"&page_size=10&page=1&s_track_rating=desc",
  musixMatchURL: "http://api.musixmatch.com/ws/1.1/track.search?&format=jsonp&f_lyrics_language=en&q_lyrics=",
   //newCurrentWord: "salad",
   //musixMatchRest:"&page_size=10&page=1&s_track_rating=desc",
  musixMatchKey:"&apikey=d919d8d046718bd5469b63e886f873cc",
   
   //A place to set up listeners or kick off an initial function
  initialize: function() {
    $("#title").hide();
    $("#search").click(function() {
      $("#resultsTarget").html("");
        //Use jQuery to get the value of the 'query' input box
      var newCurrentWord = $("#query").val();
      $("#title h1").html($("#title h1").html() + " " + newCurrentWord);
    //console.log(newCurrentWord);
    //Execute the MusixMatch API call function with the currentWord var as the argument
      app.searchMusixMatch(app.newCurrentWord);
    });
  },    
  searchMusixMatch: function(word) {
    console.log("Executing the searchMusixMatch function"); 
    var searchResults1, searchResults2, searchResults3;
    $.ajax({
      url: app.musixMatchURL + word /*+ app.musixMatchRest+ &format=jsonp& */ + app.musixMatchKey, //word is the argument passed into the function
      type: 'GET',
      dataType: 'jsonp',
      error: function(data){
        console.log("We got problems");
        //console.log(data.status);
      },
      success: function(data){
        console.log("WooHoo!");
          //Check the browser console to see the returned data
        //title +=  $('#title').show();
        //title +=  '</div>';

        var findRandomTrackNumber = function() {
          var randomNum = Math.floor(Math.random() * 10);
          console.log(data.message.body.track_list[randomNum]);
          if (!data.message.body.track_list || 
              !data.message.body.track_list[randomNum] || 
              !data.message.body.track_list[randomNum].track || 
              !data.message.body.track_list[randomNum].track.track_name ||
              data.message.body.track_list[randomNum].track.track_name.toLowerCase().indexOf('undefined') !== -1 ||
              data.message.body.track_list[randomNum].track.artist_name.toLowerCase().indexOf('undefined') !== -1) {
            return findRandomTrackNumber();
          } else {
            return randomNum;
          }
          
        };

        var randomTrackNumber = findRandomTrackNumber();
      
        searchResults1 = (data.message.body.track_list[randomTrackNumber].track.track_name);
        searchResults2 = (data.message.body.track_list[randomTrackNumber].track.artist_name);
        searchResults3 = (data.message.body.track_list[randomTrackNumber].track.track_id);

        // var htmlString= '<div class="Results">';
        // htmlString += '<h2>' + searchResults1 + '</h2>';
        // htmlString += '<span>' + searchResults2 + '</span>';
        // htmlString += '</div>';
        // $('#resultsTarget').append(htmlString);
        // $(".go-away").hide();
        
      }
    }).then(function () {
      $.ajax({
        url: "http://api.musixmatch.com/ws/1.1/track.lyrics.get?&format=jsonp&track_id=" + searchResults3 + app.musixMatchKey,
        type:'GET',
        dataType: 'jsonp',
        crossDomain: true,
        success: function(data) {
          console.log("It worked!");
          $('#everythingElse').hide();
          $('#myCanvas').show();
        lyrics= data.message.body.lyrics.lyrics_body; 

        var str = lyrics;
        var words = str.split(" ");
            console.log(words);

        //lyrics.replace(/^[a-zA-Z\ ]/);



        //var pluck = _.pluck(lyrics, '!', '*', '↵', ',', '.', ')', '(');
           //replace(pluck);
        //Add the updates to the page
        // _.each(updates, function(el){
        //  $('#congressData').append("<p>" + el + "</p>");
        // });

  
        //["This", "is", "an", "amazing", "sentence."]
        }
      });     //console.log(lyricsArray); 
        //c = o.gsub(/\W+/, '');
     });  
  }
};
        //var musixMatchURL2 = "https://www.musixmatch.com/lyrics/";
        //var musixMatchWord1= searchResults2 ;
        //var musixMatchWord2= "/" + searchResults1 ;
    
    
        

$(document).ready(function(){
  console.log("LOADED!!!!");
  app.initialize();

});  