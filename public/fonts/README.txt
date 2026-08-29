FONT SWAP SLOT
The reference site uses licensed faces (a custom display font + others) that
cannot be redistributed. This build ships with Google-font stand-ins
(Anton + Archivo Narrow) loaded via next/font in pages/_app.jsx.

To swap in licensed fonts you own:
1. Drop the .woff2 files in this folder.
2. Replace the next/font/google imports in pages/_app.jsx with
   next/font/local pointing at these files.
