/// <reference path="../../definitions/vsts-task-lib.d.ts" />
"use strict";
const path = require('path');
const tl = require('vsts-task-lib/task');
tl.setResourcePath(path.join(__dirname, 'task.json'));
var gruntFile = 'Gruntfile.js' //tl.getPathInput('gruntFile', true, true);
var grunt = tl.which('grunt', false);
tl.debug('check path : ' + grunt);
if (!tl.exist(grunt)) {
    tl.debug('not found global installed grunt-cli, try to find grunt-cli locally.');
    var gt = tl.createToolRunner(tl.which('node', true));
    var gtcli = tl.getInput('gruntCli', true);
    gtcli = path.resolve(cwd, gtcli);
    tl.debug('check path : ' + gtcli);
    if (!tl.exist(gtcli)) {
        tl.setResult(tl.TaskResult.Failed, tl.loc('GruntCliNotInstalled', gtcli));
    }
    gt.pathArg(gtcli);
}
else {
    var gt = tl.createToolRunner(grunt);
}

// optional - no targets will concat nothing
gt.arg(tl.getDelimitedInput('targets', ' ', false));
gt.arg('--gruntfile');
gt.pathArg(gruntFile);
//tl.getInput('arguments', false)
var gruntargs = '--browser=phantomjs --u=www.uol.com.br,http://www.tjsp.jus.br/Egov/Conciliacao/Default.aspx?f=2,http://www.tjsp.jus.br/EGov/Segmento/Administracao/Default.aspx?f=3 --force' 
gt.argString(gruntargs);
gt.exec().then(function (code) {
            tl.setResult(tl.TaskResult.Succeeded, tl.loc('GruntReturnCode', code));
    }
}).fail(function (err) {
    tl.debug('taskRunner fail');
    tl.setResult(tl.TaskResult.Failed, tl.loc('GruntFailed', err.message));
});
