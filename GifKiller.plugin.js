/**
 * @name GifKiller
 * @author Calculator
 * @authorId 270992239184838657
 * @version 1.0.1
 * @description Replace useless gifs
 * @source https://github.com/Midnighter32/GifKiller/
 * @updateUrl https://github.com/Midnighter32/GifKiller/blob/main/GifKiller.plugin.js
 */

 module.exports = (_ => {
	const changeLog = {
		
	};

	return !window.BDFDB_Global || (!window.BDFDB_Global.loaded && !window.BDFDB_Global.started) ? class {
		constructor (meta) {for (let key in meta) this[key] = meta[key];}
		getName () {return this.name;}
		getAuthor () {return this.author;}
		getVersion () {return this.version;}
		getDescription () {return `The Library Plugin needed for ${this.name} is missing. Open the Plugin Settings to download it. \n\n${this.description}`;}
		
		downloadLibrary () {
			require("request").get("https://mwittrien.github.io/BetterDiscordAddons/Library/0BDFDB.plugin.js", (e, r, b) => {
				if (!e && b && r.statusCode == 200) require("fs").writeFile(require("path").join(BdApi.Plugins.folder, "0BDFDB.plugin.js"), b, _ => BdApi.showToast("Finished downloading BDFDB Library", {type: "success"}));
				else BdApi.alert("Error", "Could not download BDFDB Library Plugin. Try again later or download it manually from GitHub: https://mwittrien.github.io/downloader/?library");
			});
		}
		
		load () {
			if (!window.BDFDB_Global || !Array.isArray(window.BDFDB_Global.pluginQueue)) window.BDFDB_Global = Object.assign({}, window.BDFDB_Global, {pluginQueue: []});
			if (!window.BDFDB_Global.downloadModal) {
				window.BDFDB_Global.downloadModal = true;
				BdApi.showConfirmationModal("Library Missing", `The Library Plugin needed for ${this.name} is missing. Please click "Download Now" to install it.`, {
					confirmText: "Download Now",
					cancelText: "Cancel",
					onCancel: _ => {delete window.BDFDB_Global.downloadModal;},
					onConfirm: _ => {
						delete window.BDFDB_Global.downloadModal;
						this.downloadLibrary();
					}
				});
			}
			if (!window.BDFDB_Global.pluginQueue.includes(this.name)) window.BDFDB_Global.pluginQueue.push(this.name);
		}
		start () {this.load();}
		stop () {}
		getSettingsPanel () {
			let template = document.createElement("template");
			template.innerHTML = `<div style="color: var(--header-primary); font-size: 16px; font-weight: 300; white-space: pre; line-height: 22px;">The Library Plugin needed for ${this.name} is missing.\nPlease click <a style="font-weight: 500;">Download Now</a> to install it.</div>`;
			template.content.firstElementChild.querySelector("a").addEventListener("click", this.downloadLibrary);
			return template.content.firstElementChild;
		}
	} : (([Plugin, BDFDB]) => {
		var blacklist = [ "270992239184838657", "800306256392093706", "260167377772216322", "735607772024143975" ];

		return class GifKiller extends Plugin {
			onLoad () {
				this.modulePatches = {
					before: [
						"Messages",
					]
				};
			}
			
			onStart () {
			}
			
			onStop () {
			}
		
			forceUpdateAll () {
				BDFDB.PatchUtils.forceAllUpdates(this);
				BDFDB.MessageUtils.rerenderAll();
			}

			processMessages (e) {
				e.instance.props.channelStream = [].concat(e.instance.props.channelStream);
				for (let i in e.instance.props.channelStream) {
					let message = e.instance.props.channelStream[i].content;
					if (message && message.author && blacklist.includes(message.author.id)) {
                        if (BDFDB.ArrayUtils.is(message.attachments)) this.checkMessage(e.instance.props.channelStream[i], message);
                        else if (BDFDB.ArrayUtils.is(message)) for (let j in message) {
							let childMessage = message[j].content;
							if (childMessage && BDFDB.ArrayUtils.is(childMessage.attachments)) this.checkMessage(message[j], childMessage);
						}
                    }
				}
			}

            checkMessage (stream, message) {
                if (this.parseMessage(message)) {
					stream.content.embeds = [];
					stream.content.attachments[stream.content.attachments.length] = {
						content_type: "image/png",
						filename: "Untitled.png",
						height: 128,
						id: "1039507758371852318",
						proxy_url: "https://media.discordapp.net/attachments/450790512094478342/1039507758371852318/Untitled.png",
						size: 1760,
						spoiler: false,
						url: "https://cdn.discordapp.com/attachments/450790512094478342/1039507758371852318/Untitled.png",
						width: 369,
					}
				}
            }

            parseMessage (message) {
                let censored = false;
				let embeds = [].concat(message.embeds);

                for (let i in embeds)
                {
                    if (embeds[i].type == "gifv" || (embeds[i].type == "image" && embeds[i].image.url.indexOf('.gif') != -1))
                        censored = true;
                }
				
                return censored;
            }
		};
	})(window.BDFDB_Global.PluginUtils.buildPlugin(changeLog));
})();
