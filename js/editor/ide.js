$(document).on("system_parse_project_complete",function(event){
    $('#splash').hide();
    $('#editor').show();
})


function ide_button(type)
    {
    switch(type)
        {
        case "openProject":
            ide_choose_project();
            break;
        case "openFile":
            ide_choose_file();
            break;
        case "saveFile":
            ide_store_file();
            break;
        case "compileFlash":
            system_compileToFlash()
            break;
        }
    
    }
    



function ide_choose_project(){
    var chooser = $("#projectDialog");
    chooser.trigger('click');
    chooser.change(function(evt)
        {
        if (chooser.val() != "")
            {
            var filename = $(this).val();
            if (system_check_os() == "windows")
                {
                var projectFolder = filename.split(path.sep);
                projectFolder.pop();
                projectFolder = projectFolder.join(path.sep);                
                }
            $('#projectFile').html(projectFolder); // this is a DIV
            system_parse_project();
            }
        });
}

function add_new_tab(tab_name,tab_id){
    tab_name = tab_name.split(path.sep).pop();
    $("#editor_tabs").append("<li id='tab_"+tab_id+"'><a href='#' onClick='show_tab(\""+tab_id+"\")'>"+tab_name+"</a></li>");
    }

function show_tab(id){
    
    for (var i = 0;i< editors.length;i++)
        {
        $("#tab_"+i).removeClass("active");
        $("#code_id_"+i).hide();    
        }
    session['window_active_id'] = id;
    $("#tab_"+id).addClass("active");
    $("#code_id_"+id).show();
    
    $("#button_saveFile").removeClass("icon-disabled");
    
    }
    
    

function ide_choose_file(){

    var chooser = $("#fileDialog");    
	chooser.trigger('click');
    chooser.change(function(evt) 
        {
        console.log(chooser.val());
        if (chooser.val() != ""){
            var filename = $(this).val();
            // check for duplicate
            var fileLoaded = false;
            for (var i = 0; i< editors.length;i++)
                {
                if ( $("#filename_"+i).html() == filename){fileLoaded = true;}
                }

            if (fileLoaded == false){
                system_createNewTab();
                var id = session['window_active_id'];
                $('#filename_'+id).html(filename); // this is a DIV
                $("#editor_help").hide();
                var content = system_openFile(filename);
                
                
                
                
                editors[id].setOption("value",content);
                add_new_tab(filename,id);
                show_tab(id);
                }
            }
        });
    }


/*
function ButtonChooseProject(){
    var chooser = $("#projectDialog");
    var prev_file = chooser.val();
	chooser.trigger('click');
    chooser.change(function(evt) {
        if (chooser.val() != ""){
            var filename = $(this).val();
            
            if (system_check_os() == 'windows'){
                var projectFolder = filename.split('\\');
                projectFolder.pop();
                projectFolder = projectFolder.join('\\');
                }
                
            $('#projectFile').html(projectFolder); // this is a DIV
            $('#button_project').hide();
            $('#button_file').fadeIn('slow');
            
            if (system_check_os() == 'windows'){    
                exec("cd /D "+$('#projectFile').html()+" & openfl display flash",
                    function(error,stdout,stderr){
                        $('#projectContent').html(stdout);
                        var content_push = [];
                        var content = stdout.split("\n");
                        var i = 0;

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
                        content = content_push.join(' ');
                        $('#projectContent').html(content);   
                        $(document).trigger("event_project_is_open");
                    });
                } // END if os windows
        }
    });
}


    
    
    
function ButtonChooseFile(){
    var id = session['window_active_id'];
    var chooser = $("#fileDialog_"+id);    
	chooser.trigger('click');
    
    chooser.change(function(evt) {
    //console.log(chooser.val());
        if (chooser.val() != ""){
            var filename = $(this).val();
            
            
            if (fileLoaded == false){
                $('#filename_'+id).html(filename); // this is a DIV
                fs.readFile(filename,"utf-8",function(err,data){
                    if (err) {return console.log(err);} 
                    //console.log(data)
                    editors[id].setOption("value",data);
                });
            }
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
          //btn-success
          $("#btn_save_file").addClass("btn-success")
          setTimeout(function(){$("#btn_save_file").removeClass("btn-success");},1000)
        }
    });
}

*/

function ide_store_file(){
    var id = session['window_active_id'];
    var filename = $("#filename_"+id).html(); // this is a DIV
    var theContent = $("#bufferCode_"+id).val();
    system_saveFile(filename, theContent);   
}


function system_createNewTab(){
    session['_window_count'] += 1;
    var id = session['_window_count'];
    session['window_active_id'] = id;
    
    $('#editor_vars').append('<div>filename<div id="filename_'+id+'"></div><br/>buffercode<textarea  id="bufferCode_'+id+'"></textarea></div>'); // create  bufferCode for the instance
    $('#code_textarea').append('<div id="code_id_'+id+'"><textarea id="code_textarea_'+id+'" name="code_textarea_'+id+'"></textarea></div>');  // create textarea for the instance
    
    
    editors[id] = CodeMirror.fromTextArea(document.getElementById("code_textarea_"+id), {
        lineNumbers: true,
        lineWrapping:true,
        matchBrackets:true,
        styleActiveLine:true,
        indentUnit:4,
        smartIndent:true,
        indentWithTabs:true,
        extraKeys:{
            "Ctrl-S": ide_store_file,
            "F5": system_compileToFlash
        },
        /*viewportMargin: Infinity        */
        });
    editors[id].setOption("theme","blackboard");
    
    editors[id].on("change",function(data){
        $('#bufferCode_'+id).val(data.getValue());
        var the_index = editors[id].getDoc().indexFromPos(editors[id].getCursor());
        var the_text = data.getValue()[the_index -1];
        var the_data = Array(the_index,the_text);
        $(document).triggerHandler("autocomplete", the_data);
        });
        
    }

function system_compileToFlash(){
    ide_store_file();
    //$("#btn_compile").addClass("btn-warning")
    
    if (system_check_os() == 'windows'){
        exec("cd /D "+$('#projectFile').html()+" & openfl test flash",
            function(error,stdout,stderr){
                console.log(error);
                console.log(stdout);
                console.log(stderr);
                /*
                var cur_str = '<div class="autocomplete_block">';
                cur_str += '<p>'+error+'</p>';
                cur_str += '</div>';
                cur_str += '<div class="autocomplete_block">'
                cur_str += '<p>'+stdout+'</p>'
                cur_str += '</div>';
                cur_str += '<div class="autocomplete_block">';
                cur_str += stderr+'</p>';
                cur_str += '</div>';     
                $('#code_autocomplete_inner').html(cur_str);        
                */
                //setTimeout(function(){$("#btn_compile").removeClass("btn-warning");},500)            
                }
            );
        
    } // END if os windows
}