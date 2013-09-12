var os = require('os');
var fs = require("fs");
var path = require("path");
var exec = require('child_process').exec;


function system_check_os(){
    switch(os.type())
        {
        case "Windows_NT":
            return 'windows'
            break;
        case "Linux":
            return 'linux'
            break;
        }
    }

function capitalize(myString)
	{
	firstChar = myString.substr( 0, 1 ); // == "c"
	firstChar = firstChar.toUpperCase();
	tail = myString.substr( 1 ); // == "heeseburger"
	myString = firstChar + tail; // myString == "Cheeseburger"
	return myString;
	}


function system_openFile(filename)
    {
    return fs.readFileSync(filename,"utf-8");
    }
    
function system_createFile(filename)
	{
	fs.openSync(filename,"wx");
	}

function system_saveFile(filename, content)
    {
    fs.writeFileSync(filename, content);
    console.log("SYSTEM: file saved "+filename);
    }
    
function system_parse_project()
    {
    var exec_str = "";
    if (system_check_os() == 'windows') {exec_str = "cd /D "+$('#projectFile').html()+" & openfl display -hxml flash";}
    if (system_check_os() == 'linux') {exec_str = "cd "+$('#projectFile').html()+" ; openfl display -hxml flash";}
    exec(exec_str,
        function(error,stdout,stderr){
            var the_error = false;
            if (stderr != "") {the_error = true;}
            if (the_error == true){
                ide_alert("error","not a valid HaxeFlixel Project File (XML)");
                }
            if (the_error == false) {
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
                    else if (cur.indexOf('-main') == 0) 
                        {
                        content_push.push(cur);
                        }                        
                    else if (cur.indexOf('-D') == 0) 
                        {
                        content_push.push(cur);
                        }                        
                    }
                content = content_push.join(' ');
                $('#projectContent').html(content);   
                $(document).trigger("system_parse_project_complete");
            } // stdout != ""
        });

    }
