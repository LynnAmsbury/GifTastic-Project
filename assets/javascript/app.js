// Before you can make any part of our site work, you need to create an array of strings,
// each one related to a topic that interests you. Save it to a variable called topics.
var libations = [
    'beer',
    'bourbon',
    'cocktails',
    'coke',
    'gin',
    'liqueur',
    'pepsi',
    'rum',
    'sprite',
    'vodka',
    'whiskey',
    'wine'
  ];
  
  // User input button
  var addCategory = $('#addCategory');
  // Add 10 gifs button
  var addTen = $('#addTen');
  // Track current selected category
  var currentSelection = '';
  // Track offset for subsequent 'add10' clicks
  var offset = 10;
  
  // Take the topics in the libations array and create HTML buttons.
  $(document).ready(function() {
    // Loop that appends a button for each string in the array.
    for (var i = 0; i < libations.length; i++) {
      // Appends a button
      var b = $("<button class='drinkButton'>");
      b.text(libations[i]);
      $('#buttonContainer').append(b);
    }
  
    // When the user clicks on a button, grab 10 static, non-animated gif images from the GIPHY API
    // and place them on the page.
    // This function handles events where a drink button is clicked
    // Uses static container to bind dynamic buttons with 'delegated' event binding
    $('#buttonContainer').on('click', '.drinkButton', function(event) {
      $('#gifContainer').empty();
      event.preventDefault();
      // This line grabs the input from the textbox
      var searchValue = $(this).text();
      // Update current selection and offset 'tracking' variables
      currentSelection = searchValue;
      offset = 10;
  
      // Searches Giphy for gifs of the drink and add to html
      addGiphyResults(searchValue, 'append', '0');
    });
  
    // Click handler to animate/pause images
    $(document).on('click', '.gif', function() {
      var state = $(this).attr('data-state');
      if (state === 'still') {
        $(this).attr('src', $(this).attr('data-animate'));
        $(this).attr('data-state', 'animate');
      } else {
        $(this).attr('src', $(this).attr('data-still'));
        $(this).attr('data-state', 'still');
      }
    });
  
    // Add a form to your page that takes the value from a user input box and adds it into your topics array.
    // Then make a function call that takes each topic in the array remakes the buttons on the page.
    addCategory.click(function() {
      // Value from the input field, store in a variable, and push it onto the libations array
      var userInput = $('#categoryInput').val();
      // Checks if user input is alphanumeric [Aa-Zz 0-9] using regex.test() method
      if (/^\w+$/.test(userInput)) {
        libations.push(userInput);
        // Builds new button with valid user input, adds to html
        var btn = $("<button class='drinkButton'>");
        btn.text(userInput);
        $('#buttonContainer').append(btn);
      }
    });
  
    // Functionality to add 10 additional gifs for a selected category (libation)
    addTen.click(function() {
      // Checks to see if a category is selected
      if (currentSelection) {
        addGiphyResults(currentSelection, 'prepend', offset);
        // Increments offset for subsequent add10 clicks
        offset += 10;
      }
    });
  
    // Functionality to add a user favorite to a 'favorites' section
    $(document).on('click', '.addFavorite', function() {
      // Accesses corresponding image using jquery parent and children methods
      var favoriteImage = $(this)
        .parent()
        .children(':first-child');
      // Appends selected image to html, *** use .clone() to create copy
      $('#favoritesContainer').append(favoriteImage.clone());
    });
  
    // Function to query Giphy API, parse results, and add gif images to html
    function addGiphyResults(searchValue, placement, offset) {
      var queryURL =
        'https://api.giphy.com/v1/gifs/search?q=' +
        searchValue +
        '&limit=10&offset=' +
        offset +
        '&api_key=S8XXevTSnplfXLMtXvsBNEeS51PqRHei';
  
      $.ajax({
        url: queryURL,
        method: 'GET'
      })
        .then(function(response) {
          // Populates the imageDiv with gifs and their ratings
          for (i = 0; i < response.data.length; i++) {
            var stillImage = response.data[i].images.fixed_height_still.url;
            var animatedImage = response.data[i].images.fixed_height.url;
            var rating = response.data[i].rating;
            // Creating a place to store the gif
            var imageDiv = $("<div class='imageDiv'>");
            var image = $(
              '<img src=' +
                stillImage +
                ' data-still=' +
                stillImage +
                ' data-animate=' +
                animatedImage +
                " data-state='still' class='gif'>"
            );
            imageDiv.append(image);
            // Under every gif, display its rating (PG, G, so on).
            imageDiv.append('<p>Rating: ' + rating + '</p>');
            // Appends Download and Favorite buttons under meta data
            imageDiv.append(
              "<a class='button downloadButton' target='_blank' href='" +
                animatedImage +
                "' download>Download</a><button class='button addFavorite'>Add Favorite</button>"
            );
            // Uses [] notation to reference Append or Prepend methods using placement parameter
            $('#gifContainer')[placement](imageDiv);
          }
        })
        .catch(function(error) {
          console.log(error);
        });
    }
  });