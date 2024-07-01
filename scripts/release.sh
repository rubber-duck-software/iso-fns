yarn tsup src/index.ts --format esm,cjs --dts --outDir ./package
cp ./package.json ./package/package.json
cp ./README.md ./package/README.md
cp ./LICENSE ./package/LICENSE
cp ./CHANGELOG ./package/CHANGELOG
