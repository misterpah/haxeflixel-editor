// command to create server
// $ haxe -v --wait 6000
// cd /D c:\flixel & openfl display flash -- get project stats
// C:\flixel>haxe -lib openfl -lib flixel -cp C:\flixel\source -main ProjectClass -v --display C:\flixel\source\ProjectClass.hx@30
// C:\Users\Administrator>haxe -lib openfl -lib flixel -cp C:\flixel\source -main ProjectClass --display C:\flixel\source\ProjectClass.hx@385

var sys = require('sys');
var exec = require('child_process').exec;

function putsAutocomplete(error,stdout,stderr){
    $(document).triggerHandler("autocomplete_complete", stderr);
    }

    
function hint_haxe(editor,options){
}    
    

$(document).on("autocomplete",function(event,data,key){
    if ((key == ".") | (key == '(')  |  (key == ')') | (key == ';') )
        {
        session['last_key'] = key;
        ide_store_file();
        
        var id = session['window_active_id'];
        var fileName = $("#filename_"+id).html(); // this is a DIV
        //CodeMirror.showHint(editors[id],CodeMirror.hint.haxe);
        
        filename_split = fileName.split('\\');
        className = filename_split[filename_split.length-1].split('.')[0];
        fileName = fileName.replace(/\\/g,"\\\\");        
        
        execStr = "cd /D "+$('#projectFile').html()+" & haxe "+$('#projectContent').html().split("\n").join(" ") +" -main "+className+" --display "+fileName+"@"+data ;
        exec(execStr,putsAutocomplete);
        }
    
});

$(document).on("autocomplete_complete",function(event,data){

    //var retStr = "";
    
    ///////////////////////
    // seek object in class
    if (session['last_key'] == ".") 
        {
        var json = $.xml2json(data);
        var json_array = "";
        var json_str = "";
        var haxeHint = [];
        
        json_array = json.i;
        for (i = 0;i < json_array.length;i++)
            {
            var cur = json_array[i];
            haxeHint.push(cur.n);
            }
        localStorage.haxeHint = haxeHint;
        var id = session['window_active_id'];
        CodeMirror.showHint(editors[id],CodeMirror.hint.haxe);
        } // END seek object in class
        

        
        
        
    //////////////////////////
    // seek object in function
    if (session['last_key'] == "(") 
        {
        var json = $.xml2json(data);
        var id = session['window_active_id'];
        htmlNode = $("<div id='function_hint_line_"+editors[id].getCursor().line+"' class='functionHint'>"+json+"</div>");        
        editors[id].addWidget({ch:1 , line: editors[id].getCursor().line},htmlNode.get(0), true);        
        } // END seek object in function
    
    
    if ( (session['last_key'] == ")") | (session['last_key'] == ";") )
        {
        var id = session['window_active_id'];
        var curString = "#function_hint_line_"+editors[id].getCursor().line;
        $(curString).remove();
        }    
    
    
    /*
    try{
        var json = $.xml2json(data); 
        
        var json_array = "";
        var json_str = "";
        var haxeHint = [];

        console.log(session['last_key']);
        if (session['last_key'] == "("){
        var id = session['window_active_id'];
        htmlNode = $("<div id='function_hint_line_"+editors[id].getCursor().line+"' class='functionHint'>"+json+"</div>");        
        editors[id].addWidget({ch:1 , line: editors[id].getCursor().line},htmlNode.get(0), true);
        }

        if (session['last_key'] == ")"){
        var curString = "#function_hint_line_"+editors[id].getCursor().line;
        $(curString).remove();
        }

        
        
        if (typeof json == "object")
            {
            json_array = json.i;
            for (i = 0;i < json_array.length;i++)
                {
                var cur = json_array[i];
                haxeHint.push(cur.n);
                }
            localStorage.haxeHint = haxeHint;
            var id = session['window_active_id'];
            CodeMirror.showHint(editors[id],CodeMirror.hint.haxe);
            
            /*
            var htmlNode =document.createElement("p");
            var text =  document.createTextNode("Text or whatever");
            htmlNode.appendChild(text)
            
            
            }    
        }
    catch(err)
        {
        //console.log(err);           
        }
        
        
    
    //$('#code_autocomplete_inner').html(retStr);
    */
});