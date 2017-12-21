
import Command from '@ckeditor/ckeditor5-core/src/command';

export default class AttributeCommand extends Command {

	constructor( editor, attributeKey ) {
		super( editor );


		this.attributeKey = attributeKey;
	}

	/**
	 * Updates the command's {@link #value} and {@link #isEnabled} based on the current selection.
	 */
	refresh() {
		const doc = this.editor.document;
		this.value = doc.selection.hasAttribute(this.attributeKey)
		this.isEnabled = true
	}

	execute( options = {} ) {
		const doc = this.editor.document;
		const selection = doc.selection;
		const value = options.color

		doc.enqueueChanges( () => {
			const blocks = selection.getSelectedBlocks()
			const batch = options.batch || doc.batch();
			for ( const block of blocks ) {
				batch.setAttribute( block, this.attributeKey, value );
			}
		} );
	}
}
