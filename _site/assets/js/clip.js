/*
*	Copy To Clipboard jS by Nathan Long
*	https://codepen.io/nathanlong/pen/ZpAmjv
*/
function copyToClipboardLegacy(text, el) {
	var copyTest = document.queryCommandSupported('copy');
	var elOriginalText = el.getAttribute('data-bs-original-title');
	const tooltip = bootstrap.Tooltip.getInstance(el); // Returns a Bootstrap tooltip instance

	if (copyTest === true) {
		var copyTextArea = document.createElement("textarea");
		copyTextArea.value = text;
		document.body.appendChild(copyTextArea);
		copyTextArea.select();
		try {
			var successful = document.execCommand('copy');
			var msg = successful ? 'Copied!' : 'Whoops, not copied!';
			tooltip.setContent({ '.tooltip-inner': msg });
		} catch (err) {
			console.log(err);
			console.log('Oops, unable to copy');
		}
		document.body.removeChild(copyTextArea);
		tooltip.setContent({ '.tooltip-inner': elOriginalText });
	} else {
		// Fallback if browser doesn't support .execCommand('copy')
		window.prompt("Copy to clipboard: Ctrl+C or Command+C, Enter", text);
	}
}

function copyToClipboard(text, el) {
	if (!navigator.clipboard) {
		console.log("Fell back to legacy clipboard");
		copyToClipboardLegacy(text, el);
	  return false;
	}

	const elOriginalText = el.getAttribute('data-bs-original-title');
	const tooltip = bootstrap.Tooltip.getInstance(el); // Returns a Bootstrap tooltip instance

	navigator.clipboard.writeText(text).then(function() {
		tooltip.setContent({ '.tooltip-inner': 'Copied!' });
	  }, function(err) {
		console.error('Async: Could not copy text: ', err);
		tooltip.setContent({ '.tooltip-inner': 'Whoops, not copied!' });
	});
	tooltip.setContent({ '.tooltip-inner': elOriginalText });
	return true;
}