/*
Chat Notifications for Gmail tm shows desktop notfiications when receiving a chat message in Gmail.
Copyright (c) 2010-2013, Mark Piro

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

window.onload = function() {
	chrome.extension.sendMessage({action: 'gmtab'});
	
	var summaryObserver = new MutationSummary({
		callback: handleChanges,
		queries: [{ element: ".Hz"}]
	});
}

var focusList = {};
function handleChanges() {
    var ta = $('.Hz').next().find("textarea");
    chrome.extension.sendMessage({action: 'icon'}, function(ic) {
		if (ic) {
            var basenode = $('.Hz').next().find("div[role='chatMessage'][class='km']").last()
            var chat = basenode.text();
            var c = chat.split(':');
            var name = c[0]
            if (basenode.children().length > 1) {
                var msg = basenode.children().last().text();
            } else {
                var msg = c[1];
            }
            if (name && msg) {
                focusList[name] = ta;
                ta.click();
                ta.blur();
                chrome.extension.sendMessage({ action: 'chat', name: name, msg: msg });
            }
        }
	});
}

chrome.extension.onMessage.addListener(
	function(request, sender, sendResponse) {
		if (request.action == 'focus') {
			focusList[request.name].focus();
		}
        if (request.action == 'blur') {
            for (var k in focusList) {
                var obj = focusList[k];
                obj.click();
                obj.blur();
            }
        }
});

