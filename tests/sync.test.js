import {expect} from "chai";
import {getMeshFromBlock, updateMeshFromBlock, updateOrCreateMeshFromBlock} from "../ui/blockmesh.js"
import {handleBlockCreateEvent} from "../blocks.js"

export function runSynchronisationTests() {
    describe("block synchronisation tests", function () {
		this.timeout(5000);
    });
}