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



$(document).on("autocomplete",function(event,data,key){
    if ((key == ".") | (key == '(') )
        {
        // save first before make auto complete
        ButtonStoreFile();
        
        var id = session['window_active_id'];
        var fileName = $("#filename_"+id).html(); // this is a DIV
        
        filename_split = fileName.split('\\');
        className = filename_split[filename_split.length-1].split('.')[0];
        fileName = fileName.replace(/\\/g,"\\\\");        
        
        execStr = "cd /D "+$('#projectFile').html()+" & haxe "+$('#projectContent').html().split("\n").join(" ") +" -main "+className+" --display "+fileName+"@"+data ;
        exec(execStr,putsAutocomplete);
        }
    
});

$(document).on("autocomplete_complete",function(event,data){

    var retStr = "";
    try{
        var json = $.xml2json(data); 
        
        var json_array = "";
        var json_str = "";



        if (typeof json == "object")
            {
            json_array = json.i;
            for (i = 0;i < json_array.length;i++)
                {
                var cur = json_array[i];
                cur_n = cur.n;
                cur_t = cur.t;
                cur_d = cur.d;
                console.log(cur);
                var cur_str = '<div class="autocomplete_block">';
                retStr +='<b>'+cur_n+'</b>';
                retStr +='<p><i>'+cur_t+'</i></p>';
                retStr +='</div>';
                retStr += cur_str;
                }
            }    
        if (typeof json == "string")
            {
            var cur_str = '<div class="autocomplete_block">';
            retStr +='<p><i>'+json+'</i></p>';
            retStr +='</div>';
            retStr += cur_str;    
            }     
        
        
        }
    catch(err)
        {
        var cur_str = '<div class="autocomplete_block">';
        retStr +='<p>'+data+'</p>';
        retStr +='</div>';
        retStr += cur_str;                
        }
        
        
    
    $('#code_autocomplete_inner').html(retStr);
    
});