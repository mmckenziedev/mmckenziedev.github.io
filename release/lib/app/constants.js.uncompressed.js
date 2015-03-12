/*
 * Doing some old school C-like things and using numeric constants to represent various states and values in the system.
 */
/* global define */

define("app/constants", [
	"module"
], function(module){
	var READY = 0, ROCK = 1, PAPER = 2, SCISSORS = 4, LIZARD = 8, SPOCK = 16;

	var TYPES = {
		READY : READY,
		ROCK : ROCK,
		PAPER : PAPER,
		SCISSORS : SCISSORS,
		LIZARD : LIZARD,
		SPOCK : SPOCK
	};

	(function(){
		var i;

		for(i in TYPES){
			if(TYPES.hasOwnProperty(i)){
				TYPES[TYPES[i]] = i;
			}
		}
	}())

	var LABELS = {};
	LABELS[READY] = "\xA0";
	LABELS[ROCK] = "Rock";
	LABELS[PAPER] = "Paper";
	LABELS[SCISSORS] = "Scissors";
	LABELS[LIZARD] = "Lizard";
	LABELS[SPOCK] = "Spock";

	/**
	 * Store the rules that describe which action beats another action, and for fun we will store the verb that
	 * describes the interaction between the two actions.
	 */
	var RULES = {
		ROCK : {
			LIZARD : "crushes",
			SCISSORS : "crushes"
		},
		PAPER : {
			ROCK : "covers",
			SPOCK : "disproves"
		},
		SCISSORS : {
			PAPER : "cut",
			LIZARD : "decapitates"
		},
		LIZARD : {
			PAPER : "eats",
			SPOCK : "poisons"
		},
		SPOCK : {
			SCISSORS : "smashes",
			ROCK : "vapourises"
		}
	};

	/*
	 * Take the RULES object and condense down it down to make lookups easier via constants. I could do this manually,
	 * but for now this will suffice .
	 */
	RULES = (function(rules){
		var i, j, out = {};

		var type, rule;

		for(i in rules){
			if(rules.hasOwnProperty(i)){
				out[TYPES[i]] = type = {};
				rule = rules[i];

				for(j in rule){
					if(rule.hasOwnProperty(j)){
						type[TYPES[j]] = rule[j];
					}
				}
			}
		}

		return out;
	}(RULES));

	module.exports = {
		LABELS : LABELS,
		TYPES : TYPES,
		RULES : RULES,
		RESULT_TEMPLATE : "${0} ${2} ${1}",
		RESULTS : {
			DRAW : 0,
			LOSS : 1,
			WIN : 2
		}
	};
});