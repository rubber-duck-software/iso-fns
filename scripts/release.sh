pnpm tsdown src/index.ts --format esm,cjs --dts --out-dir ./package
cp ./package.json ./package/package.json
cp ./README.md ./package/README.md
cp ./LICENSE ./package/LICENSE
cp ./CHANGELOG ./package/CHANGELOG
