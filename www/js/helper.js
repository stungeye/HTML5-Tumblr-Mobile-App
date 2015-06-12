// An on-screen debug console.
// Requires an element with an id of "main".
function debug_log(msg) {
  var main = document.getElementById("main"),
      debug = document.getElementById('glutton_debug');
  if (debug === null && main !== null) {
	debug = document.createElement('div');
	debug.setAttribute('id','glutton_debug');
	main.appendChild(debug);
  }
  if (debug !== null) {
	debug.innerHTML += "<p>" + msg + "</p>";
  }
}

// Strip HTML elements from a string.
// IMPORTANT: Only be used with trusted HTML. Very easy to abuse with an XSS attack.
// See: http://stackoverflow.com/questions/822452/strip-html-from-text-javascript#comment9107196_822486
function strip(html) {
  var tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent||tmp.innerText;
}

// Hide any DOM element using the CSS class "hidden", unless the class is already present.
function hide(el) {
  if (el.className.indexOf('hidden') === -1) {
    el.className+= ' hidden';
  }
}

// Unhide any DOM element that was previously hidden using the CSS class "hidden".
function show(el) {
  el.className = el.className.replace(/ ?hidden/gi, '');
}


// A callback event for the Android back button. 
function back_event() {
  switch_screen('#home');
}

// Hide all div.screen elements and then show the div with
// the requested id.
function switch_screen(id) {
  id = id.substring(1); // Remove the # from the start of the id.
  
  var current_screen = document.getElementById(id),
      back_button = document.getElementById('back_button');
  
  [].forEach.call(document.querySelectorAll("div.screen"), function(el) {
    hide(el);
  });
  
  show(current_screen);
  
  if (id !== "home") {
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
// The callback_fnc provided should be defined with one parameter,
// which will be set to the clicked element when executed.
function set_click(el, callback_fnc) {
  if('ontouchstart' in document.documentElement ) {
    new NoClickDelay(el, callback_fnc);
  } else {
    el.addEventListener('click', function(event) {
      event.preventDefault();
      callback_fnc(el); // Hand off the element in case it's required in our callback.
    }, false);
  }
}