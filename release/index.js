/**
 * 
 */

/* global require */
/* global define */
require([
		"dojo/_base/array",//
		"dojo/_base/lang",//
		"dojo/dom",//
		"dojo/dom-construct",//
		"dojo/ready",//
		"dojo/string",//
		"dojo/topic",//
		"dijit/registry",//
		"app/constants",//
		"app/GameState",//
		"app/Player",//
		"app/Result",//
		"app/IconWidget",//
		"app/ButtonWidget",//
		"app/PlayerWidget",//
		"app/ResultWidget"//
], function(//
array, lang,//
dom, domConstruct,//
ready, string, topic,//
registry,//
constants, GameState, Player, Result,//
IconWidget, ButtonWidget, PlayerWidget, ResultWidget//
){
	var TYPES = constants.TYPES;
	var RULES = constants.RULES;
	var LABELS = constants.LABELS;
	var RESULTS = constants.RESULTS;
	var RESULT_TEMPLATE = constants.RESULT_TEMPLATE;

	var player1 = new Player({
		type : Player.HUMAN
	});
	var player2 = new Player({
		type : Player.COMPUTER
	});

	topic.subscribe("app/player", function(player, action, result){
		player.set("currentAction", action);
		switch(result){
		case RESULTS.DRAW:
			player.addDraw();
			break;
		case RESULTS.LOSS:
			player.addLoss();
			break;
		case RESULTS.WIN:
			player.addWin();
			break;
		}
	});

	topic.subscribe("app/result", function(player1Action, player2Action, verb, result, resultObject){
		var resultWidget = registry.byId("result");
		var resultText = dom.byId("resultText");
		domConstruct.empty(resultText);

		switch(result){
		case RESULTS.DRAW:
			resultText.appendChild(document.createTextNode("Match is a draw"));
			resultWidget.set("actionType", player1Action);
			break;
		case RESULTS.LOSS:
			resultText.appendChild(document.createTextNode(string.substitute(RESULT_TEMPLATE, {
				0 : LABELS[player2Action],
				1 : LABELS[player1Action],
				2 : verb
			})));

			resultText.appendChild(document.createElement("br"));

			resultText.appendChild(document.createTextNode("Computer wins"));

			resultWidget.set("actionType", player2Action);
			break;
		case RESULTS.WIN:
			resultText.appendChild(document.createTextNode(string.substitute(RESULT_TEMPLATE, {
				0 : LABELS[player1Action],
				1 : LABELS[player2Action],
				2 : verb
			})));

			resultText.appendChild(document.createElement("br"));

			resultText.appendChild(document.createTextNode("Human wins"));

			resultWidget.set("actionType", player1Action);
			break;
		default:
			resultText.appendChild(document.createTextNode("Unknown result"));
			resultWidget.set("actionType", TYPES.READY);
		}
	});

	function observeCurrentActionFactory(widgetId){
		return function observeCurrentAction(name, oldValue, value){
			registry.byId(widgetId).set("actionType", value);
		};
	}

	function observeWinFactory(widgetId){
		return function(name, oldValue, value){
			registry.byId(widgetId).set("score", value);
		};
	}

	ready(function(){

		var player1Widget = new PlayerWidget({
			actionType : TYPES.READY,
			playerName : "Human",
			score : 0,
			scoreLabel : "Wins:"
		}, "player1");

		var player2Widget = new PlayerWidget({
			actionType : TYPES.READY,
			playerName : "Computer",
			score : 0,
			scoreLabel : "Wins:"
		}, "player2");

		var resultWidget = new ResultWidget({
			actionType : TYPES.READY
		}, "result");

		player1Widget.startup();
		player2Widget.startup();
		resultWidget.startup();

		player1.watch("currentAction", observeCurrentActionFactory("player1"));
		player1.watch("win", observeWinFactory("player1"));

		player2.watch("currentAction", observeCurrentActionFactory("player2"));
		player2.watch("win", observeWinFactory("player2"));

		function click(evt){
			var result;
			var resultWidget = registry.byId("result");
			var player1Action = this.actionType;

			//generate random number between 0 and 5 (exclusive)
			var player2Action = Math.floor(Math.random() * 5);
			player2Action = (player2Action === 0) ? 1 : 1 << player2Action;

			if(player2Action === player1Action){
				result = RESULTS.DRAW;
			}else{
				var verb;
				if(RULES[player1Action] !== undefined && (verb = RULES[player1Action][player2Action]) !== undefined){
					result = RESULTS.WIN;
				}else if(RULES[player2Action] !== undefined && (verb = RULES[player2Action][player1Action]) !== undefined){
					result = RESULTS.LOSS;
				}else{
					result = -1;
				}
			}

			topic.publish("app/player", player1, player1Action, result);
			topic.publish("app/player", player2, player2Action, (result === RESULTS.WIN) ? RESULTS.LOSS : (result === RESULTS.LOSS) ? RESULTS.WIN : result);

			var res = new Result({
				player1Action : player1Action,
				player2Action : player2Action,
				result : result
			});

			topic.publish("app/result", player1Action, player2Action, verb, result, res);
		}

		array.forEach([
				TYPES.ROCK, TYPES.PAPER, TYPES.SCISSORS, TYPES.LIZARD, TYPES.SPOCK
		], function(item){
			var id = TYPES[item].toLowerCase() + "Button";

			var button = new ButtonWidget({
				actionType : item
			}, id);
			button.on("click", lang.hitch(button, click));
			button.startup();
		});

	});
});
