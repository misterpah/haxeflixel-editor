/*
codemirror_haxe_hint.js
- modified from javascript autocomplete

developer notes
===============
I (misterpah) never truly understand this thing with the code. 
NEVER change this file unless you REALLY understands it.

*/
(function () {
    /* required scripts for codemirror autocompete */
    ////////////////////////////////
    // CODEMIRROR AUTOCOMPLETE START
    //
    //
    var Pos = CodeMirror.Pos;

    function forEach(arr, f) 
        {
        for (var i = 0, e = arr.length; i < e; ++i) f(arr[i]);
        }

    function arrayContains(arr, item) 
        {
        if (!Array.prototype.indexOf) 
            {
            var i = arr.length;
            while (i--) 
                {
                if (arr[i] === item) 
                    {
                    return true;
                    }
                }
            return false;
            }
        return arr.indexOf(item) != -1;
        }

  function scriptHint(editor, keywords, getToken, options) {
    // Find the token at the cursor
    var cur = editor.getCursor(), token = getToken(editor, cur), tprop = token;
    token.state = CodeMirror.innerMode(editor.getMode(), token.state).state;
    
    
    // If it's not a 'word-style' token, ignore the token.
    if (!/^[\w$_]*$/.test(token.string)) {
      token = tprop = {start: cur.ch, end: cur.ch, string: "", state: token.state,
                       type: token.string == "" ? "property" : null};
    }
    
    
    // If it is a property, find out what it is a property of.
    while (tprop.type == "property") {
      tprop = getToken(editor, Pos(cur.line, tprop.start));
      if (tprop.string != ".") return;
      tprop = getToken(editor, Pos(cur.line, tprop.start));
      if (tprop.string == ')') {
        var level = 1;
        do {
          tprop = getToken(editor, Pos(cur.line, tprop.start));
          switch (tprop.string) {
          case ')': level++; break;
          case '(': level--; break;
          default: break;
          }
        } while (level > 0);
        tprop = getToken(editor, Pos(cur.line, tprop.start));
        if (tprop.type.indexOf("variable") === 0)
          tprop.type = "function";
        else return; // no clue
      }
      if (!context) var context = [];
      context.push(tprop);
    }
    
    
    return {list: getCompletions(token, context, keywords, options),
            from: Pos(cur.line, token.start),
            to: Pos(cur.line, token.end)};
  }    
    
    
  function getCompletions(token, context, keywords, options) {
    var found = [], start = token.string;
    function maybeAdd(str) {
      if (str.indexOf(start) == 0 && !arrayContains(found, str)) found.push(str);
    }
    function gatherCompletions(obj) {
      if (typeof obj == "string") forEach(stringProps, maybeAdd);
      else if (obj instanceof Array) forEach(arrayProps, maybeAdd);
      else if (obj instanceof Function) forEach(funcProps, maybeAdd);
      for (var name in obj) maybeAdd(name);
    }

    
    forEach(keywords, maybeAdd);
    return found;
  }    

  
    //
    //
    // CODEMIRROR AUTOCOMPLETE END 
    //////////////////////////////
    


    
    function haxeHint(cm,options)
        {
        var haxe_completion = localStorage.haxeHint.split(",");

        var id = session['window_active_id'];
        var cur = editors[id].getCursor();
        var curLine = editors[id].getLine(cur.line);
        var start = cur.ch;
        var end = start;
        //return {list:haxe_completion,from:CodeMirror.Pos(cur.line,start),to:CodeMirror.Pos(cur.line,end)};
        return scriptHint(editors[id], haxe_completion, function(e,cur) {return e.getTokenAt(cur);},options);
        }

    CodeMirror.registerHelper("hint","haxe", haxeHint);
})();