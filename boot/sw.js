
// Must use module resolution in webpack config and 
// include app.config.js file in root of src folder.
// (ie. resolve: {modules: [path.resolve(__dirname, 'src'), 'node_modules'],})

// This file is imported by boot.js.

import {
	swReadyMessage, 
	swUpdateMessage
} from 'config.js';

// This code works in conjunction with workbox-webpack-plugin GenerateSW class.
// https://developers.google.com/web/tools/workbox/guides/advanced-recipes


// Load and register pre-caching Service Worker.
if ('serviceWorker' in navigator) {

	// Use the window load event to keep the page load performant.
	window.addEventListener('load', async () => {

		const {message, swToast} = await import(/* webpackChunkName: 'utils' */ '@longlost/utils/utils.js');
		const {Workbox} 				 = await import(/* webpackChunkName: 'workbox-window' */ 'workbox-window');

	  const wb = new Workbox('/service-worker.js');
	  
	  // Add an event listener to detect when the registered
	  // service worker has installed but is waiting to activate.
	  wb.addEventListener('waiting', async event => {
	    // `event.wasWaitingBeforeRegister` will be false if this is
	    // the first time the updated service worker is waiting.
	    // When `event.wasWaitingBeforeRegister` is true, a previously
	    // updated same service worker is still waiting.

    	// Show interactive toast from <app-shell>.
	  	const toastEvent = await swToast(swUpdateMessage);

	  	// User clicked 'Refresh' button instead of 'Dismiss'.
	  	if (!toastEvent.detail.canceled) {

	  		// Assuming the user accepted the update, set up a listener
        // that will reload the page as soon as the previously waiting
        // service worker has taken control.
        wb.addEventListener('controlling', () => {
          window.location.reload();
        });

	  		// Send a message telling the service worker to skip waiting.
        // This will trigger the `controlling` event handler above.
        // Listeners found in auto-generated 'service-worker.js',
        // and in 'service-worker-app.js' files.
        wb.messageSW({type: 'SKIP_WAITING'});
		  }
	  });

	  // Show offline notification toast for
	  // fresh installs of app.
	  wb.addEventListener('activated', event => {
	  	
		  // `event.isUpdate` will be true if another version of the service
		  // worker was controlling the page when this version was registered.
		  if (!event.isUpdate) {
		    // This is the first time the app has been loaded
	    	// so inform user of offline capability.
			  message(swReadyMessage);
		  }
		});

	  // If multiple tabs are open and 
	  // new sw takes control of them, they 
	  // will all be asked to reload to avoid 
	  // multiple versions running simultaneously.
	  // From postMessage in service-worker-app.js.
		wb.addEventListener('message', event => {
			if (event.data && event.data.type === 'WAITING_SKIPPED') {
				window.location.reload();
			}
		});

		
    wb.register();

  });
}
