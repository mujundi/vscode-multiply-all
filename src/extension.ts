// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { mainModule } from 'process';
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "multiply-all" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('multiply-all.multiply', async () => {

		const editor = vscode.window.activeTextEditor;
		if (!editor) {
			vscode.window.showInformationMessage("Editor does not exist.");
			return;
		}

		let options: vscode.InputBoxOptions = {
			prompt: "Enter a number to multiply by. ",
			validateInput: (value) => {
				if (isNaN(Number(value)) || value.length > 12) {
					return "Input must be a valid number.";
				}
				return "";
			},
		};

		let areSelectionsValid: boolean = true;
		const selections = editor.selections;
		let numbers: number[] = [];
		selections.forEach(selection => {
			const text = editor.document.getText(selection);
			if (!text) {
				areSelectionsValid = false;
				vscode.window.showInformationMessage("Selection(s) must contain numbers. Nothing has been selected.");
				return;
			} else if (isNaN(Number(text))) {
				areSelectionsValid = false;
				vscode.window.showInformationMessage("Selection(s) must contain only numbers.");
				return;
			}
			numbers.push(Number(text));
		});

		const getUserInput = async () => {
			const scaleFactor = await vscode.window.showInputBox(options);
			return Number(scaleFactor);
		};
		
		if (areSelectionsValid) {
			getUserInput().then(scaleFactor => {
				editor.edit(editBuilder => {
					numbers.forEach((number, index) => {
						let product = number * Number(scaleFactor);
						let currentSelection = selections[index];
						editBuilder.replace(currentSelection, product.toString());
					});
				});
			});
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
