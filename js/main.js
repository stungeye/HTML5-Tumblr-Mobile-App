// Strip HTML elements from a string.
// IMPORTANT: Only be used with trusted HTML. Very easy to abuse with an XSS attack.
// See: http://stackoverflow.com/questions/822452/strip-html-from-text-javascript#comment9107196_822486
function strip(html) {
  var tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent||tmp.innerText;
}

// Hide a DOM element using the CSS class "hidden", unless the class is already present.
function hide(el) {
  if (el.className.indexOf('hidden') == -1) {
    el.className+= ' hidden';
  }
}

// Unhide any DOM element that was previously hidden using the CSS class "hidden".
function show(el) {
  el.className = el.className.replace(/ ?hidden/gi, '');
}


// A callback event for the Android back button. 
function back_event() {
  switch_screen('#home')
}

function switch_screen(id) {
  id = id.substring(1); // Remove the # from the start of the id.
  
  [].forEach.call(document.querySelectorAll("div.screen"), function(el) {
    hide(el);
  });
  
  current_screen = document.getElementById(id);
  show(current_screen);
  
  back_button = document.getElementById('back_button');
  
  if (id != "home") {
    // We are navigating away from home, so show the home button.
    show(back_button);
    // Bind the Android back button to the back_event callback.
    document.addEventListener("backbutton", back_event, true); 
  } else {
    // We are navigating back to the home screen, so hide the home button.
    hide(back_button);
    // Disable our overriding of the Android back button.
    document.removeEventListener("backbutton", back_event, true);
  }
}

// Helper function the simplify setting click events on elements.
function set_click(el, callback_fnc) {
  el.addEventListener('click', function(event) {
    event.preventDefault();
    callback_fnc(el); // Hand off the element in case it's required in our callback.
  }, false);
}

// When the DOM is ready we need to set up our various click events.
document.addEventListener("DOMContentLoaded", function() {
  var main_division   = document.getElementById('main'),
      about_app_link  = document.getElementById('about_app_link'),
      about_meow_link = document.getElementById('about_meow_link');
      
  // Prevent webkit from allowing the user to scroll the page using a move gesture.
  // Added to prevent the user from scrolling past the end of the home page.
  main_division.addEventListener('touchmove', function(event) { event.preventDefault(); }, false );
  
  // Set the switch_screen callback for the toolbar back button.
  back_button = document.getElementById('back_button');
  set_click(back_button, function() { switch_screen('#home'); });
  
  // Bind each of the buttons on the home screen to a switch_screen callback.
  [].forEach.call(document.querySelectorAll("ul.buttons a.switch_screen"), function(el) {
    set_click(el, function(e) { switch_screen(e.getAttribute('href')); });
  });
  
  // Make the home screen buttons and toolbar back buttons snappy using noclickdelay.js
  [].forEach.call(document.querySelectorAll("ul.buttons"), function(el) {
    new NoClickDelay(el);
  });
  new NoClickDelay(back_button);
  
});

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
      posts = json['response']['posts'];

  // Gather all 20 images returned from the Tumblr API call into an array of hashes.
  for (i = 0; i < posts.length; i++) {
    photos         = posts[i]['photos'][0]['alt_sizes'];
    photo_big      = photos[0]['url'];
    caption_text   = strip(posts[i]['caption']);
    
    images.push({ url: photo_big, caption: caption_text })
  }
  
  // Configure Photoswipe to load images from the array of hashes created above.
  options = { enableDrag: false,
              captionAndToolbarAutoHideDelay: 0,
              getImageSource: function(obj){
                return obj.url;
              },
              getImageCaption: function(obj){
                return obj.caption;
              }
            }
            
  instance = Code.PhotoSwipe.attach(images, options);
  
  // Launch the slideshow when the user clicks on the launch link on the home screen.
  launch_link = document.getElementById('launch_link');
  set_click(launch_link, function(event) { instance.show(0); });
}