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


function putsAutocomplete(error,stdout,stderr){
    $(document).triggerHandler("autocomplete_complete", stderr);
    }

    
function hint_haxe(editor,options){
}    
    

$(document).on("autocomplete",function(event){

		

        ide_store_file();
        
        var id = session['window_active_id'];
        var fileName = $("#filename_"+id).html(); // this is a DIV
	
		filename_split = fileName.split(path.sep);
		className = filename_split[filename_split.length-1].split('.')[0];

		if (system_check_os() == 'linux'){
        execStr = "cd "+$('#projectFile').html()+" ; haxe "+$('#projectContent').html().split("\n").join(" ") +" --display "+fileName+"@"+session['current_key_pos'] ;		

		}
		if (system_check_os() == 'windows'){

        execStr = "cd /D "+$('#projectFile').html()+" & haxe "+$('#projectContent').html().split("\n").join(" ") +" --display "+fileName+"@"+session['current_key_pos'] ;
		}
		
		console.log(execStr);
        
        exec(execStr,putsAutocomplete);
});

$(document).on("autocomplete_complete",function(event,data){

    var skip = false;
    // check if data starts with xml (<)
    //console.log(data);
    var startswith = data.charAt(0);
    console.log(startswith);
    if (startswith != "<")
    {
        skip = true;
    }


    if (skip == true)
   		{
        ide_alert("error",data);
    	}

    //var retStr = "";
    
    ///////////////////////
    // seek object in class
    if (session['last_key'] == "." && skip == false) 
        {
        var json = $.xml2json(data);
        var haxeHint = [];


        
        console.dir(typeof json);
        console.dir(json instanceof Array);
        //
        
        if (json instanceof Object == true)
        {
        json_array = json.i;
        for (i = 0;i < json_array.length;i++)
            {
            var cur = json_array[i];
            haxeHint.push(cur.n);
            }
        }
        else
        {
            //haxeHint.push(json);
        }

        localStorage.haxeHint = haxeHint;
        var id = session['window_active_id'];
        CodeMirror.showHint(editors[id],CodeMirror.hint.haxe);
        
        } // END seek object in class
        

        
        
        
    //////////////////////////
    // seek object in function
    if (session['last_key'] == "(" && skip == false) 
        {
        var json = $.xml2json(data);
        var id = session['window_active_id'];
        htmlNode = $("<div id='function_hint_line_"+editors[id].getCursor().line+"' class='functionHint'>"+json+"</div>");        
        editors[id].addWidget({ch:1 , line: editors[id].getCursor().line},htmlNode.get(0), true);        
        } // END seek object in function
    
    
    if (session['last_key'] == ";")
        {
        var id = session['window_active_id'];
        var curString = "#function_hint_line_"+editors[id].getCursor().line;
        $(curString).remove();
        }    
    
    
});
