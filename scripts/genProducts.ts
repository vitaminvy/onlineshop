
import { writeFileSync } from "fs";
import { products } from "../src/data/products.ts";
writeFileSync("public/api/products.json", JSON.stringify(products, null, 2));
console.log(` Generated ${products.length} products -> public/api/products.json`);