import { writeFileSync } from "fs";

for (let i = 0; i < 100; i++) {
   
    writeFileSync(`${i}.txt`, `Lista ${i} - Cálculo ${i} - Exercício [${i}]`);
}