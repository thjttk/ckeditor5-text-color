import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import buildModelConverter from '@ckeditor/ckeditor5-engine/src/conversion/buildmodelconverter';
import buildViewConverter from '@ckeditor/ckeditor5-engine/src/conversion/buildviewconverter';
import TextColorCommand from './command';
import ContainerElement from '@ckeditor/ckeditor5-engine/src/view/containerelement'

const TEXTCOLOR = 'textColor';

export default class ColorEngine extends Plugin {
	init() {
		const editor = this.editor;
		const data = editor.data;
		const editing = editor.editing;
		// Allow italic attribute on all inline nodes.
		data.model.schema.allow( { name: '$block', attributes: TEXTCOLOR } );
		// Temporary workaround. See https://github.com/ckeditor/ckeditor5/issues/477.
		data.model.schema.allow( { name: '$block', attributes: TEXTCOLOR, inside: '$clipboardHolder' } );

		// Build converter from model to view for data and editing pipelines.
		buildModelConverter().for( data.modelToView, editing.modelToView )
			.fromAttribute( TEXTCOLOR )
			.toAttribute( color => {
				return { key: 'style', value: `color: ${ color }` }
			})

		// Build converter from view to model for data pipeline.
		buildViewConverter().for( data.viewToModel )
			.fromElement( 'p' )
			.consuming( { attribute: [ 'style' ] } )
			.fromElement( 'h1' )
			.consuming( { attribute: [ 'style' ] } )
			.fromElement( 'h2' )
			.consuming( { attribute: [ 'style' ] } )
			.fromElement( 'h3' )
			.consuming( { attribute: [ 'style' ] } )
			.toAttribute( viewElement => {
				const color = viewElement.getStyle( 'color' )
				if (color) {
					return { key: 'textColor', value: viewElement.getStyle( 'color' ) }
				}
			} );

		editor.commands.add( TEXTCOLOR, new TextColorCommand( editor, TEXTCOLOR ) );
	}
}