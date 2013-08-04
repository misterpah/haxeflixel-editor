var os = require('os');

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