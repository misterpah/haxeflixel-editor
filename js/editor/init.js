function splash_state_init() // executed in $(document).ready
    {
    session = {};
    session['_window_count'] = 0;
    session['window_active_id'] = 0;
    editors = [];
    session['last_key'] = "";
    localStorage.haxeHint = new Array();
    }


function editor_state_init() // called by buttons
    {
    }