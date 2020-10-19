/**
 * @license Copyright (c) 2003-2020, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

/**
 * @module html-embed/htmlembedui
 */

import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import ButtonView from '@ckeditor/ckeditor5-ui/src/button/buttonview';
import htmlEmbedIcon from '../theme/icons/htmlembed.svg';
import { isWidget } from '@ckeditor/ckeditor5-widget/src/utils';

/**
 * The HTML embed UI plugin.
 *
 * @extends module:core/plugin~Plugin
 */
export default class HTMLEmbedUI extends Plugin {
	init() {
		const editor = this.editor;
		const t = editor.t;

		// Add the `htmlEmbed` button to feature components.
		editor.ui.componentFactory.add( 'htmlEmbed', locale => {
			const command = editor.commands.get( 'htmlEmbedInsert' );
			const view = new ButtonView( locale );

			view.set( {
				label: t( 'Insert HTML' ),
				icon: htmlEmbedIcon,
				tooltip: true
			} );

			view.bind( 'isEnabled' ).to( command, 'isEnabled' );

			// Execute the command.
			this.listenTo( view, 'execute', () => {
				editor.execute( 'htmlEmbedInsert' );
				editor.editing.view.focus();

				const widgetWrapper = getSelectedRawHtmlViewWidget( editor.editing.view.document.selection );
				const rawHtmlContainer = widgetWrapper.getChild( 0 );

				// After inserting a new element, switch to "Edit source" mode.
				rawHtmlContainer.getChild( 0 ).getCustomProperty( 'domElement' ).click();

				// And focus the edit source element (`textarea`).
				rawHtmlContainer.getChild( 1 ).getCustomProperty( 'domElement' ).focus();
			} );

			return view;
		} );
	}
}

// Returns a raw html widget editing view element if one is selected.
//
// @param {module:engine/view/selection~Selection|module:engine/view/documentselection~DocumentSelection} selection
// @returns {module:engine/view/element~Element|null}
function getSelectedRawHtmlViewWidget( selection ) {
	const viewElement = selection.getSelectedElement();

	if ( viewElement && isRawHtmlWidget( viewElement ) ) {
		return viewElement;
	}

	return null;
}

// Checks if a given view element is a raw html widget.
//
// @param {module:engine/view/element~Element} viewElement
// @returns {Boolean}
function isRawHtmlWidget( viewElement ) {
	return !!viewElement.getCustomProperty( 'rawHtml' ) && isWidget( viewElement );
}