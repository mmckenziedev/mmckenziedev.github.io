var profile = (function(){

	return {
		basePath : "../",
		releaseDir : "../../release",
		releaseName : "dojo",
		//action : "release",
		action : "clean,release",
		//optimisation options
		layerOptimize : "closure",
		optimize : "closure",
		cssOptimize : "comments",
		mini : true,
		stripConsole : "all",
		selectorEngine : "lite",
		staticHasFeatures : {
			'dom' : 1,
			'dojo-dom-ready-api' : 1,
			'dojo-firebug' : 0,
			'dojo-guarantee-console' : 0,
			'dojo-has-api' : 1,
			'dojo-loader' : 1,
			'dojo-sync-loader' : 1,
			'dojo-sniff' : 1,
			'host-browser' : 1,
			'host-node' : 0,
			'host-rhino' : 0,
			'touch' : 0
		},

		defaultConfig : {
			hasCache : {
				"dojo-built" : 1,
				"dojo-loader" : 1,
				"dom" : 1,
				"host-browser" : 1,
				"config-selectorEngine" : "lite",
				"config-useDeferredInstrumentation" : 0
			},
			async : false,
			isDebug : false,
			parseOnLoad : false,
			debugAtAllCosts : false
		},

		packages : [
				{
					name : "dojo",
					location : "dojo"
				}, {
					name : "dijit",
					location : "dijit"
				},
				//{name : "dojox",location : "dojox"},
				{
					name : "app",
					location : "script"
				}
		],

		layers : {
			"dojo/dojo" : {

			//customBase : false,
			//boot : true
			},
			"app/app" : {
				include : [
						"dojo/_base/array",//
						"dojo/_base/lang",//
						"dojo/dom",//
						"dojo/dom-construct",//
						"dojo/ready",//
						"dojo/string",//
						"dojo/topic",//
						"dijit/_base/manager",//
						"dijit/registry",//
						"app/constants",//
						"app/GameState",//
						"app/Player",//
						"app/Result",//
						"app/IconWidget",//
						"app/ButtonWidget",//
						"app/PlayerWidget",//
						"app/ResultWidget"//
				]
			}
		}
	};
}());
