tsc --project tsconfig.release-cjs.json
tsc --project tsconfig.release-esm.json
cp ./package.json ./package/package.json
cp ./README.md ./package/README.md
cp ./LICENSE ./package/LICENSE
cp ./CHANGELOG ./package/CHANGELOG
