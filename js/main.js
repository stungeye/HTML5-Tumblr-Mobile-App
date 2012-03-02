// When the DOM is ready we need to set up our various click events.
document.addEventListener("DOMContentLoaded", function() {
  var main_division   = document.getElementById('main'),
      back_button = document.getElementById('back_button');
      
  // Prevent webkit from allowing the user to scroll the page using a move gesture.
  // Added to prevent the user from scrolling past the end of the home page.
  main_division.addEventListener('touchmove', function(event) { event.preventDefault(); }, false );
  
  // Set the switch_screen callback for the toolbar back button.
  set_click(back_button, function(e) { switch_screen(e.getAttribute('href')); });
  
  // Bind each of the buttons on the home screen to a switch_screen callback.
  [].forEach.call(document.querySelectorAll("ul.buttons a.switch_screen"), function(el) {
    set_click(el, function(e) { switch_screen(e.getAttribute('href')); });
  });
  
});

document.addEventListener("deviceready", phonegap_init, false);

function phonegap_init() {
  [].forEach.call(document.querySelectorAll("a[target=_blank][rel=external]"), function(el) {
    set_click(el, function(e) {
      navigator.app.loadUrl(e.getAttribute('href'));
    });
  });
}

// This callback function is called by the JSONP response of the Tumblr API
// request made in the script element below this one.
function load_images(json) {
  
  var i,
      photos,
      photo_big,
      caption_text,
      options,
      instance,
      images = [],
      posts = json['response']['posts'],
      launch_link = document.getElementById('launch_link');

  // Gather all 20 images returned from the Tumblr API call into an array of hashes.
  for (i = 0; i < posts.length; i++) {
    photos         = posts[i]['photos'][0]['alt_sizes'];
    photo_big      = photos[0]['url'];
    caption_text   = strip(posts[i]['caption']);
    
    images.push({ url: photo_big, caption: caption_text });
  }
  
  // Configure Photoswipe to load images from the array of hashes created above.
  options = {
    enableDrag: false,
    captionAndToolbarAutoHideDelay: 0,
    getImageSource: function(obj){
      return obj.url;
    },
    getImageCaption: function(obj){
      return obj.caption;
    }
  };
  
  instance = Code.PhotoSwipe.attach(images, options);
  
  // Launch the slideshow when the user clicks on the launch link on the home screen.
  set_click(launch_link, function(event) { instance.show(0); });
}