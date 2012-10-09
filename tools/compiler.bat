@ECHO OFF 
echo  开始压缩 
::E:
::cd E:\www\games\passing\1\private\tools\src
SET PATH_IN = src
cd src
for  %%C in (*.js) do java -jar ../compiler.jar --js %%C  --js_output_file  ../js/%%~nC.js
::for  %%C in (*.css) do java -jar ../compiler.jar --css %%C  --js_output_file  ../../js/%%~nC.css
::for  %%C in (*.js) do java -jar ../yuicompressor-2.4.7.jar --type js %%C  -o  ../../js/%%~nC.js
::for  %%C in (*.css) do java -jar ../yuicompressor-2.4.7.jar --type css %%C  -o  ../../css/%%~nC.css
cd..
echo  压缩完成 
pause