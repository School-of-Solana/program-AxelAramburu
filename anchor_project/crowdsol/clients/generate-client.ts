import { AnchorIdl, rootNodeFromAnchorWithoutDefaultVisitor } from "@codama/nodes-from-anchor";
import { renderJavaScriptUmiVisitor, renderJavaScriptVisitor, renderRustVisitor } from "@codama/renderers";
import { renderVisitor as renderersJs } from '@codama/renderers-js';
import { renderVisitor as renderersJsUmi } from '@codama/renderers-js-umi';
import { visit } from "@codama/visitors-core";
import anchorIdl from "../target/idl/crowdsol.json";
import codamaIDL from "../codamaIDL.json";
import { createFromRoot } from "codama";

// async function generateClients() {
//     const node = rootNodeFromAnchorWithoutDefaultVisitor(anchorIdl as AnchorIdl);

//     const clients = [
//         { type: "JS", dir: "clients/generated/js/src", renderVisitor: renderersJs },
//         // { type: "Umi", dir: "clients/generated/umi/src", renderVisitor: renderersJsUmi },
//         // { type: "Rust", dir: "clients/generated/rust/src", renderVisitor: renderRustVisitor }
//     ];

//     for (const client of clients) {
//         try {
//             const visitor = client.renderVisitor(client.dir);
//             await visit(node, visitor);
//             console.log(`✅ Successfully generated ${client.type} client for directory: ${client.dir}!`);
//         } catch (e) {
//             console.error(`Error in ${client.renderVisitor.name}:`, e);
//             throw e;
//         }
//     }
// }

// generateClients();

const codama = createFromRoot(codamaIDL);
// console. log (codama-getRoot))
codama.accept(renderJavaScriptVisitor('generated/ts', {}));
// codama.accept(renderRustVisitor('clients/rust/src/generated', { ... }));