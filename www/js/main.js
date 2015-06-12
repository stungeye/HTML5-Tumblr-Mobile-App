// This callback function is called by the JSONP response of the Tumblr API
// request made in the script element below this one.
function load_images(json) {
  document.addEventListener("deviceready", function() {
    var i,
        photos,
        photo_big,
        caption_text,
        options,
        instance,
        images = [],
        posts = json['response']['posts'],
        launch_link = document.getElementById('launch_link'),
        pswpElement = document.querySelectorAll('.pswp')[0],
        androidVersion = parseFloat(device.version);
        
    // Gather all 20 images returned from the Tumblr API call into an array of hashes.
    for (i = 0; i < posts.length; i++) {
      photos         = posts[i]['photos'][0]['alt_sizes'];
      photo          = androidVersion >= 4 ? photos[0] : photos[1]; // Smaller photos for Android OS v3.
      photo_url      = photo['url'];
      photo_width    = photo['width'];
      photo_height   = photo['height']
      caption_text   = strip(posts[i]['caption']);
      
      images.push({ src: photo_url, w: photo_width, h: photo_height, title: caption_text });
    }
    
    photo_swipe_options = {
      index: 0
    };
    
    var instance = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, images, photo_swipe_options);
    instance.init();
    
    show(document.getElementById('about_meow'));
    [].forEach.call(document.querySelectorAll("a.external"), function(el) {
      set_click(el, function() {
        window.open(el.getAttribute('href'), '_blank');
      });
    });

  }, false);
  
}