import { createFromRoot } from 'codama';
import { AnchorIdl, rootNodeFromAnchor } from '@codama/nodes-from-anchor'; 
import anchorIdl from "../target/idl/crowdsol.json";
import * as fs from "fs";

const codama = createFromRoot(rootNodeFromAnchor(anchorIdl as AnchorIdl));

fs.writeFileSync("./codamaIDL.json", codama.getJson());