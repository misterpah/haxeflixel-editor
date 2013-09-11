$(document).on("system_parse_project_complete",function(event){
    $('#splash').hide();
    $('#editor').show();
})

function ide_alert(type_error,content)
{
    var type_text = "";
    if (type_error == "error")
    {
        type_error = "danger";
        type_text = "Error";

    }

    if (type_error == "warning")
    {
        type_error = "warning";
        type_text = "Warning";
    }

    skip = false;
    if (content == undefined)
    {
        skip = true;
    }



var retstr = ['<div style="margin:10px;" class="alert alert-'+type_error+' fade in">',
'<a class="close" data-dismiss="alert" href="#" aria-hidden="true">&times;</a>',
'<strong>'+type_text+' :</strong><br/>'+content,
'</div>'].join("\n");

if (skip ==false)
    {
    $('#notify_position').append(retstr);    
    }

}


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
            console.log(filename);
            var projectFolder = filename.split(path.sep);
            projectFolder.pop();
            projectFolder = projectFolder.join(path.sep);                
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
	        "Ctrl-O": ide_choose_file,
            "Ctrl-S": ide_store_file,
            "F5": system_compileToFlash
        },
        /*viewportMargin: Infinity        */
        });
    editors[id].setOption("theme","blackboard");
    
    editors[id].on("change",function(data)
    	{
        var the_index = editors[id].getDoc().indexFromPos(editors[id].getCursor());
        
        if (the_index != session['current_key_pos'])
    	    {
	        console.log("Changed!");
			$('#bufferCode_'+id).val(data.getValue());    
		    session['last_key'] = data.getValue()[the_index -1];
		    session['last_last_key'] = data.getValue()[the_index -2];
			session['current_key_pos'] = the_index;

			var key = session['last_key'];
			var prev_key = session['last_key'];
			
			if (key == ")")
				{
				var curString = "#function_hint_line_"+editors[id].getCursor().line;
				$(curString).remove();				
				}
			
			if ((key == ".") | (key == '('))
				{
				if (isNaN(prev_key))
					{
				    $(document).triggerHandler("autocomplete");
				    }
			    }
			}
		});
		        
    }



function system_compileToFlash(){
	if (session['window_active_id'] != 0)
		{
		ide_store_file();
		}
	
	var os_cmd = "";
	var target = "flash";
	
    if (system_check_os() == 'linux'){
	os_cmd = "cd "+$('#projectFile').html()+" ; openfl test "+target
    }

	if (system_check_os() == 'windows'){
	os_cmd = "cd /D "+$('#projectFile').html()+" & openfl test "+target
	}
    
    console.log(os_cmd);
    exec(os_cmd,
        function(error,stdout,stderr){
            if (error != null)
                {
                ide_alert("error",stderr);
                }
    
            }
        );
        
}
