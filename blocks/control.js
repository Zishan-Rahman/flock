import * as Blockly from "blockly";
import { categoryColours } from "../toolbox.js";
import { getHelpUrlFor } from "../blocks.js";
import { translate, getTooltip } from "../main/translation.js";

export function defineControlBlocks() {
	Blockly.Blocks["wait"] = {
		init: function () {
			this.jsonInit({
				type: "wait",
				message0: translate("wait"),
				args0: [
					{
						type: "input_value",
						name: "DURATION",
						check: "Number",
					},
				],
				previousStatement: null,
				nextStatement: null,
				colour: categoryColours["Control"],
				tooltip: getTooltip("wait"),
			});
			this.setHelpUrl(getHelpUrlFor(this.type));
		},
	};

	Blockly.Blocks["wait_seconds"] = {
		init: function () {
			this.jsonInit({
				type: "wait",
				message0: translate("wait_seconds"),
				args0: [
					{
						type: "input_value",
						name: "DURATION",
						check: "Number",
					},
				],
				previousStatement: null,
				nextStatement: null,
				colour: categoryColours["Control"],
				tooltip: getTooltip("wait_seconds"),
			});
			this.setHelpUrl(getHelpUrlFor(this.type));
		},
	};

	Blockly.Blocks["wait_until"] = {
		init: function () {
			this.jsonInit({
				type: "wait_until",
				message0: translate("wait_until"),
				args0: [
					{
						type: "input_value",
						name: "CONDITION",
						check: "Boolean",
					},
				],
				previousStatement: null,
				nextStatement: null,
				colour: categoryColours["Control"],
				tooltip: getTooltip("wait_until"),
			});
			this.setHelpUrl(getHelpUrlFor(this.type));
		},
	};

	Blockly.Blocks["local_variable"] = {
		init: function () {
			this.jsonInit({
				type: "local_variable",
				message0: translate("local_variable"),
				args0: [
					{
						type: "field_variable",
						name: "VAR",
						variable: "item", // default variable name
					},
				],
				previousStatement: null,
				nextStatement: null,
				colour: categoryColours["Control"],
				tooltip: getTooltip("local_variable"),
			});
			this.setHelpUrl(getHelpUrlFor(this.type));
		},
	};

	Blockly.Blocks["for_loop2"] = {
		init: function () {
			this.jsonInit({
				type: "for_loop",
				message0: translate("for_loop2"),
				args0: [
					{
						type: "field_lexical_variable",
						name: "VAR",
						text: "count", // Default variable name is "count"
						options: [["count", "count"]],
					},
					{
						type: "input_value",
						name: "FROM",
						check: "Number",
					},
					{
						type: "input_value",
						name: "TO",
						check: "Number",
					},
					{
						type: "input_value",
						name: "BY",
						check: "Number",
					},
					{
						type: "input_statement",
						name: "DO",
					},
				],
				previousStatement: null,
				nextStatement: null,
				colour: categoryColours["Control"],
				inputsInline: true,
				tooltip: getTooltip("for_loop2"),
			});
			this.setHelpUrl(getHelpUrlFor(this.type));
		},

		// Returns an array of local variable names.
		getLexicalVariables: function () {
			return [this.getFieldValue("VAR")];
		},

		// Update the variable name on this block.
		setLexicalVariable: function (newName) {
			this.setFieldValue(String(newName), "VAR");
		},

		// Save the current variable name in a mutation.
		mutationToDom: function () {
			const container = document.createElement("mutation");
			container.setAttribute("var", this.getFieldValue("VAR"));
			return container;
		},

		// Restore the variable name from a mutation.
		domToMutation: function (xmlElement) {
			const variableName = xmlElement.getAttribute("var");
			this.setFieldValue(variableName, "VAR");
		},
	};

	Blockly.Blocks["for_loop"] = {
		init: function () {
			this.jsonInit({
				type: "for_loop",
				message0: translate("for_loop"),
				args0: [
					{
						type: "field_lexical_variable",
						name: "VAR",
						text: "count", // Default variable name is "count"
						options: [["count", "count"]],
					},
					{
						type: "input_value",
						name: "FROM",
						check: "Number",
					},
					{
						type: "input_value",
						name: "TO",
						check: "Number",
					},
					{
						type: "input_value",
						name: "BY",
						check: "Number",
					},
					{
						type: "input_statement",
						name: "DO",
					},
				],
				previousStatement: null,
				nextStatement: null,
				colour: categoryColours["Control"],
				inputsInline: true,
				tooltip: getTooltip("for_loop"),
			});
			this.setHelpUrl(getHelpUrlFor(this.type));
		},

		// Returns an array of local variable names.
		getLexicalVariables: function () {
			return [this.getFieldValue("VAR")];
		},

		// Update the variable name on this block.
		setLexicalVariable: function (newName) {
			this.setFieldValue(String(newName), "VAR");
		},

		onchange: function (event) {
			if (
				event.type === Blockly.Events.BLOCK_CREATE &&
				event.ids.includes(this.id)
			) {
				const field = this.getField("VAR");
				if (field && field.variableId_) {
					const oldId = field.variableId_;
					const newId = Blockly.utils.idGenerator.genUid();
					field.variableId_ = newId;

					// Recursively update nested getter blocks.
					const updateNestedBlocks = (block) => {
						if (
							block.type === "get_lexical_variable" &&
							block.variableSourceId === oldId
						) {
							block.variableSourceId = newId;
						}
						block.getChildren(false).forEach(updateNestedBlocks);
					};

					// Update getter blocks inside the DO input.
					const doConnection = this.getInput("DO")?.connection;
					if (doConnection && doConnection.targetBlock()) {
						updateNestedBlocks(doConnection.targetBlock());
					}
				}
			}
		},

		// Save the current variable name and its unique id in a mutation.
		mutationToDom: function () {
			const container = document.createElement("mutation");
			const field = this.getField("VAR");

			if (field && field.saveExtraState) {
				const extraState = field.saveExtraState();
				container.setAttribute("var", extraState.value);
				container.setAttribute("variableid", extraState.variableId);
			} else {
				container.setAttribute("var", this.getFieldValue("VAR"));
			}
			return container;
		},

		// Restore the variable name and unique id from the mutation.
		domToMutation: function (xmlElement) {
			const varName = xmlElement.getAttribute("var");
			const variableId = xmlElement.getAttribute("variableid");
			const field = this.getField("VAR");
			if (field && field.loadExtraState) {
				field.loadExtraState({
					value: varName,
					variableId: variableId,
				});
			} else {
				this.setFieldValue(varName, "VAR");
			}
		},
	};

	class FieldLexicalVariable extends Blockly.FieldDropdown {
	  constructor(opt_value, opt_validator) {
		// Force a default value of "count" if none is provided.
		if (opt_value === null || opt_value === undefined || opt_value === "") {
		  opt_value = "count";
		}
		super(opt_value, opt_validator);
		// Always use our custom options generator.
		this.menuGenerator_ = this.generateOptions.bind(this);
		this.variableId_ = Blockly.utils.genUid
		  ? Blockly.utils.genUid()
		  : Math.random().toString(36).substring(2, 15);
		this.cachedOptions_ = null;

		// Ensure that the value is set (if somehow still null).
		if (!this.getValue()) {
		  super.setValue("count");
		}
	  }

	  // Always show the current variable (only one) plus the extra options.
	  computeOptions() {
		// If the field's value is null-ish, force it to "count".
		let current = super.getValue();
		if (current === null || current === undefined || current === "") {
		  current = "count";
		  super.setValue(current);
		} else {
		  current = String(current);
		}
		return [
		  [current, current],
		  ["Rename variable…", "__RENAME__"],
		  ["Get variable", "__GET__"],
		];
	  }

	  // Return our cached options if available.
	  generateOptions() {
		if (this.cachedOptions_) {
		  return this.cachedOptions_;
		}
		this.cachedOptions_ = this.computeOptions();
		return this.cachedOptions_;
	  }

	  // Ensure that any caller asking for options gets our cached copy.
	  getOptions() {
		return this.cachedOptions_ || this.computeOptions();
	  }

	  // Bypass default class validation so our new value is always accepted.
	  doClassValidation_(newValue) {
		return newValue;
	  }

	  setValue(value) {
		if (value === "__RENAME__") {
		  setTimeout(() => {
			const currentName = String(super.getValue());

			const newName = window.prompt("Rename variable", currentName);
			if (newName && newName !== currentName) {
			  if (
				this.sourceBlock_ &&
				typeof this.sourceBlock_.setLexicalVariable === "function"
			  ) {
				this.sourceBlock_.setLexicalVariable(String(newName));
			  }
			  // Recompute and "lock in" our options with the new variable.
			  this.cachedOptions_ = [
				[String(newName), String(newName)],
				["Rename variable…", "__RENAME__"],
				["Get variable", "__GET__"],
			  ];
			  // Force our generator to return the updated options.
			  this.menuGenerator_ = () => this.cachedOptions_;
			  // Update any getter blocks that reference this variable.
			  if (this.sourceBlock_ && this.sourceBlock_.workspace) {
				const workspace = this.sourceBlock_.workspace;
				const allBlocks = workspace.getAllBlocks(false);
				allBlocks.forEach((block) => {
				  if (
					block.type === "get_lexical_variable" &&
					block.variableSourceId === this.variableId_
				  ) {
					if (typeof block.updateVariable === "function") {
					  block.updateVariable(newName);
					} else {
					  block.setFieldValue(String(newName), "VAR");
					}
				  }
				});
			  }
			  // Finally, update the field's value.
			  super.setValue(String(newName));
			  if (this.sourceBlock_) {
				this.sourceBlock_.render();
			  }
			} else {
			}
		  }, 0);
		  return null;
		} else if (value === "__GET__") {
		  setTimeout(() => {
			const variableName = String(super.getValue());
			const workspace = this.sourceBlock_.workspace;
			const newBlock = workspace.newBlock("get_lexical_variable");
			newBlock.initSvg();
			newBlock.render();
			newBlock.setFieldValue(String(variableName), "VAR");
			newBlock.variableSourceId = this.variableId_;

			const xy = this.sourceBlock_.getRelativeToSurfaceXY();
			newBlock.moveBy(xy.x + 20, xy.y + 20);
		  }, 0);
		  return null;
		} else {
		  return super.setValue(String(value));
		}
	  }

	  doValueValidation_(newValue) {
		return newValue;
	  }

	  saveExtraState() {
		return {
		  variableId: this.variableId_,
		  value: this.getValue(),
		};
	  }

	  loadExtraState(state) {
		this.variableId_ = state.variableId;
		super.setValue(state.value);
		this.cachedOptions_ = [
		  [state.value, state.value],
		  ["Rename variable…", "__RENAME__"],
		  ["Get variable", "__GET__"],
		];
		this.menuGenerator_ = () => this.cachedOptions_;
	  }
	}

	Blockly.fieldRegistry.register("field_lexical_variable", FieldLexicalVariable);

	Blockly.Blocks["get_lexical_variable"] = {
	  init: function () {
		this.jsonInit({
		  message0: translate("get_lexical_variable"),
		  args0: [
			{
			  type: "field_label",
			  name: "VAR",
			  text: "count",
			},
		  ],
		  output: null,
		  colour: categoryColours["Variables"],
		  tooltip: getTooltip("get_lexical_variable"),
		});
		this.setHelpUrl(getHelpUrlFor(this.type));

		// Initialize with a null variable source ID.
		this.variableSourceId = null;
	  },
	  updateVariable: function (newName) {
		this.setFieldValue(String(newName), "VAR");
	  },
	  // Save the current variable name and source ID to the XML mutation.
	  mutationToDom: function () {
		const container = document.createElement("mutation");
		container.setAttribute("var", this.getFieldValue("VAR"));
		if (this.variableSourceId) {
		  container.setAttribute("sourceid", this.variableSourceId);
		}
		return container;
	  },
	  // Restore the variable name and source ID from the XML mutation.
	  domToMutation: function (xmlElement) {
		const variableName = xmlElement.getAttribute("var");
		this.setFieldValue(variableName, "VAR");
		const sourceId = xmlElement.getAttribute("sourceid");
		if (sourceId) {
		  this.variableSourceId = sourceId;
		}
	  },
	};

	Blockly.Blocks["get_lexical_variable"].onchange = function (event) {
	  // Only process if this is a move, create, or similar event that might affect scoping
	  if (
		event.type === Blockly.Events.BLOCK_MOVE ||
		event.type === Blockly.Events.BLOCK_CREATE ||
		event.type === Blockly.Events.BLOCK_CHANGE
	  ) {
		if (!this.workspace) return; // Skip if no workspace

		const variableName = this.getFieldValue("VAR");
		let currentBlock = this;
		let found = false;

		// Traverse up the block hierarchy to find the closest for_loop with matching variable
		while ((currentBlock = currentBlock.getParent())) {
		  if (currentBlock.type === "for_loop") {
			const loopVarName = currentBlock.getFieldValue("VAR");
			const field = currentBlock.getField("VAR");

			if (loopVarName === variableName && field) {
			  // Found a matching for_loop parent
			  const variableId = field.variableId_ || "";

			  // Update this getter's source ID
			  this.variableSourceId = variableId;
			  found = true;
			  break;
			}
		  }
		}

		if (!found) {
		  // No matching for_loop found, disconnect if connected to anything
		  const parentConnection = this.outputConnection.targetConnection;
		  if (parentConnection) {
			parentConnection.disconnect();
		  }
		}
	  }
	};
}

