fs = require("fs");
var exec = require('child_process').exec;


function ButtonChooseProject() {    
    var chooser = $("#projectDialog");    
    var prev_file = chooser.val();
	chooser.trigger('click');
    
    chooser.change(function(evt) {
        if (chooser.val() != ""){
            var filename = $(this).val();

            var projectFolder = filename.split('\\');
            projectFolder.pop();
            projectFolder = projectFolder.join('\\');
            
            
            
            
            
            $('#projectFile').html(projectFolder); // this is a DIV
            $('#button_project').hide();
            $('#button_file').fadeIn('slow');
            
            exec("cd /D "+$('#projectFile').html()+" & openfl display flash",
                function(error,stdout,stderr){
                    //console.log(error);
                    //console.log(stdout);
                    //console.log(stderr);

                    //$(document).triggerHandler("openfl_complete", stdout);
                    $('#projectContent').html(stdout);
                    var content_push = [];
                    //console.log(stdout);
                    var content = stdout.split("\n");
                    var i = 0;
                    //console.log(content);
                    for (i = 0 ; i < content.length;i++)
                        {
                        var cur = content[i];
                        if (cur.indexOf('-lib') == 0) // starts with
                            {
                            content_push.push(cur);
                            }
                        else if (cur.indexOf('-cp') == 0) 
                            {
                            content_push.push(cur);
                            }
                        }
                        
                    //console.dir(content_push);
                    content = content_push.join(' ');
                    //console.log(content);
                    $('#projectContent').html(content);                        
                });
    }
    });
}


function ButtonChooseFile() {    
    var id = session['window_active_id'];
    var chooser = $("#fileDialog_"+id);    
    var prev_file = chooser.val();
	chooser.trigger('click');
    
    chooser.change(function(evt) {
        if (chooser.val() != ""){
            var filename = $(this).val();
            $('#filename_'+id).html(filename); // this is a DIV
            fs.readFile(filename,"utf-8",function(err,data){
                if (err) {return console.log(err);} 
                editors[id].setOption("value",data);
            });
        }
    });
}

function ButtonStoreFile(){
    var id = session['window_active_id'];
    var fileName = $("#filename_"+id).html(); // this is a DIV
    var theContent = $("#bufferCode_"+id).val();
    //console.log(fileName);
    //console.log(theContent);
    fs.writeFile(fileName, theContent, function(err) {
        if(err) {
          //console.log("FS : " + err);
        } else {
          console.log("FS : save "+fileName);
        }
    });
}



function createNewTab()
    {
    session['_window_count'] += 1;
    var id = session['_window_count'];
    session['window_active_id'] = id;
    
    
    $('#editor_vars').append('<div>filename<div id="filename_'+id+'"></div><br/>fileDialog:<input id="fileDialog_'+id+'" type="file" /><br/>buffercode<textarea  id="bufferCode_'+id+'"></textarea></div>'); // create fileDialog & bufferCode for the instance
    $('#code_textarea').append('<textarea id="code_textarea_'+id+'" name="code_textarea_'+id+'"></textarea>');  // create textarea for the instance
    
    editors[id] = CodeMirror.fromTextArea(document.getElementById("code_textarea_"+id), {
        lineNumbers: true,
        indentUnit:4,
        smartIndent:true,
        indentWithTabs:true,
        matchBrackets:true,
        viewportMargin: Infinity
        
        });
        
    
        
    editors[id].on("change",function(data){
        $('#bufferCode_'+id).val(data.getValue());
        
        var the_index = editors[id].getDoc().indexFromPos(editors[id].getCursor());
        var the_text = data.getValue()[the_index -1];
        
        var the_data = Array(the_index,the_text);
        //console.log(the_data);
        $(document).triggerHandler("autocomplete", the_data);
        //console.log();
        });	
        
    }

function compileToFlash()
{
exec("cd /D "+$('#projectFile').html()+" & openfl test flash",
    function(error,stdout,stderr){
        var cur_str = '<div class="autocomplete_block">\
            <p>'+error+'</p>\
        </div>';
        cur_str += '<div class="autocomplete_block">\
            <p>'+stdout+'</p>\
        </div>';
        cur_str += '<div class="autocomplete_block">\
            <p>'+stderr+'</p>\
        </div>';     
        $('#code_autocomplete_inner').html(cur_str);        
    });

}


