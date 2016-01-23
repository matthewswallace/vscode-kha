var path = require('path');
var vscode = require('vscode');

function activate(context) {
	var disposable = vscode.commands.registerCommand('extension.init', function () {
		require(path.join(vscode.extensions.getExtension('ktx.kha').extensionPath, 'Kha', 'Tools', 'khamake', 'init.js')).run('Project', vscode.workspace.rootPath, 'khafile.js');
		vscode.window.showInformationMessage('Kha project created.');
	});
	
	context.subscriptions.push(disposable);
}
exports.activate = activate;

function deactivate() {
}

exports.deactivate = deactivate;
