// This will be the object that will contain the Vue attributes
// and be used to initialize it.
let app = {};
function contents(evt, action) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
    
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace("active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(action).style.display = "block";
    evt.currentTarget.className += " active";
  }

// Given an empty app object, initializes it filling its attributes,
// creates a Vue instance, and then initializes the Vue instance.
let init = (app) => {

    // This is the Vue data.
    app.data = {
        // Complete as you see fit.
        show_accepted: false,
        show_all: false,
        rows: [],
    };

    app.enumerate = (a) => {
        // This adds an _idx field to each element of the array.
        let k = 0;
        a.map((e) => {e._idx = k++;});
        return a;
    };


    app.set_accepted = function (b){
        if (b != 'all') {
        app.vue.show_accepted = (b == 'acc');
        app.vue.show_all = false;
       } else {
        app.vue.show_all = true;
        } 
    };
    
    
    // This contains all the methods.
    app.methods = {
        // Complete as you see fit.
        set_accepted: app.set_accepted,
    };

    // This creates the Vue instance.
    app.vue = new Vue({
        el: "#vue-target",
        data: app.data,
        methods: app.methods,
      
    });

    // And this initializes it.
    app.init = () => {
        // Put here any initialization code.
        // Typically this is a server GET call to load the data.
        // this would be replaced the events invited
        axios.get(load_events_url).then(function (response) {
            app.vue.rows = app.enumerate(response.data.rows);
            
        });
        
    };

    // Call to the initializer.
    app.init();
};

// This takes the (empty) app object, and initializes it,
// putting all the code i
init(app);

