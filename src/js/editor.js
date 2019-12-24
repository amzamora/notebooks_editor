class NotebooksEditor {
	constructor (anchor) {
		// Initialize editor
		this.him = document.getElementById(anchor);
		this.him.classList.add('NotebooksEditor');
		this.him.innerHTML = '';
		this.buffer = new Buffer();

		// Attach callbacks to manage input
		this.input = Input(this.him);
		let self = this;
		this.input.addEventListener('keyboard-input', function(e) {
			self._onKeyboardInput(e);
		});
		this.him.addEventListener('click', function(e) {
			self._onClick(e);
		});
	}

	setText(text, cursor = -1) {
		this.buffer.setText(text);
		if (cursor !== - 1) {
			this.cursor = new Cursor(cursor);
		} else {
			this.cursor = new Cursor(text.length);
		}

		this._update(); // This is necessary
		let self = this; // This is also necessary
		setTimeout(function() {
			self._update();
		}, 50);
	}

	setFontSize(new_size) {

	}

	getText() {

	}

	// Private
	// =======

	_update() {
		this.him.innerHTML = this.buffer.getText();
		this.cursor.draw(this.him);
	}

	// Callbacks
	// =========

	_onKeyboardInput(e) {
		switch (e.value) {
			case 'left-key':
				this.cursor.moveLeft(this.buffer);
				break;

			case 'right-key':
				this.cursor.moveRight(this.buffer);
				break;

			case 'up-key':
				break;

			case 'down-key':
				break;

			case 'deletion':
				break;

			default:
				if (e.value.length === 1) {
					this.buffer.insertAt(this.cursor.offset, e.value);
					this.cursor.moveRight(this.buffer);
				}
				break;
		}

		this._update();
	}

	_onClick(e) {
		this.input.focus();
	}
}

// Generates an input box on the editor
function Input(editor) {
	let input = document.createElement('input');
	input.setAttribute('type', 'text');
	input.classList.add('notebooks-editor-input');
	editor.parentElement.appendChild (input);

	// Listen for keypresses
	document.addEventListener('keydown', function(e) {
		if (input === document.activeElement) {
			let aux = new CustomEvent('keyboard-input');

			if (e.keyCode == 37) {
				aux.value = 'left-key';
				input.dispatchEvent(aux);

			} else if (e.keyCode == 39) {
				aux.value = 'right-key';
				input.dispatchEvent(aux);

			} else if (e.keyCode == 38) {
				aux.value = 'up-key';
				input.dispatchEvent(aux);

			} else if (e.keyCode == 40) {
				aux.value = 'down-key';
				input.dispatchEvent(aux);

			} else if (e.keyCode == 8){
				aux.value = 'deletion';
				input.dispatchEvent(aux);

			} else if (e.keyCode == 13) {
				aux.value = '\n';
				input.dispatchEvent(aux);
			}
		}
	});

	// Listen for input
	input.addEventListener('input', function (e) {
			let aux = new CustomEvent('keyboard-input');
			aux.value = input.value;

			// Reset input box
			input.value = '';

			// Check for deleteContentBackward
			if (e.inputType !== 'deleteContentBackward') {
				input.dispatchEvent(aux);
			}
	});

	return input;
}
