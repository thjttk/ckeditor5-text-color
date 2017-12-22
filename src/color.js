import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import italicIcon from '@ckeditor/ckeditor5-core/theme/icons/picker.svg'
import Model from '@ckeditor/ckeditor5-ui/src/model';
import createListDropdown from '@ckeditor/ckeditor5-ui/src/dropdown/list/createlistdropdown';
import Collection from '@ckeditor/ckeditor5-utils/src/collection';
import ColorEngine from './colorEngine';

import '../theme/index.scss';

const TEXTCOLOR = 'textColor';

export default class TextColor extends Plugin {

	static get requires() {
		return [ ColorEngine ];
	}


	static get pluginName() {
		return 'Color';
	}

	init() {
		const editor = this.editor;
		const dropdownItems = new Collection();
		const options = editor.config.get( TEXTCOLOR )
		const commands = [];
		const defaultTitle = '选择颜色'

		for ( const option of options ) {
			const command = editor.commands.get( TEXTCOLOR );
			const itemModel = new Model( {
				color: option.value,
				label: option.label,
				class: 'text-color-' + option.label
			} );

			itemModel.bind( 'isActive' ).to( command, 'value' );

			// Add the option to the collection.
			dropdownItems.add( itemModel );

			commands.push( command );
		}

		// Create dropdown model.
		const dropdownModel = new Model( {
			withText: true,
			items: dropdownItems
		} );

		dropdownModel.bind( 'isEnabled' ).to(
			// Bind to #isEnabled of each command...
			...getCommandsBindingTargets( commands, 'isEnabled' ),
			// ...and set it true if any command #isEnabled is true.
			( ...areEnabled ) => areEnabled.some( isEnabled => isEnabled )
		);

		dropdownModel.bind( 'label' ).to(
			// Bind to #value of each command...
			...getCommandsBindingTargets( commands, 'value' ),
			// ...and chose the title of the first one which #value is true.
			( ...areActive ) => {
				const index = areActive.findIndex( value => value );

				// If none of the commands is active, display default title.
				return options[ index ] ? options[ index ] : defaultTitle;
			}
		);

		// Register UI component.
		editor.ui.componentFactory.add( TEXTCOLOR, locale => {
			const dropdown = createListDropdown( dropdownModel, locale );

			dropdown.extendTemplate( {
				attributes: {
					class: [
						'ck-heading-dropdown'
					]
				}
			} );

			// Execute command when an item from the dropdown is selected.
			this.listenTo( dropdown, 'execute', evt => {
				editor.execute( TEXTCOLOR, { color: evt.source.color } );
				editor.editing.view.focus();
			} );

			return dropdown;
		} );
	}

}
function getCommandsBindingTargets( commands, attribute ) {
	return Array.prototype.concat( ...commands.map( c => [ c, attribute ] ) );
}
