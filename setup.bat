@echo off
echo Setting up Hatid Kita Frontend...
echo.

cd /d "%~dp0"

echo Updating main.js...
(
echo import { createApp } from 'vue'
echo import './style.css'
echo import App from './App.vue'
echo import router from './router'
echo.
echo createApp^(App^).use^(router^).mount^('#app'^)
) > src\main.js

echo.
echo Updating App.vue...
(
echo ^<template^>
echo   ^<router-view /^>
echo ^</template^>
echo.
echo ^<script^>
echo export default {
echo   name: 'App'
echo }
echo ^</script^>
echo.
echo ^<style^>
echo @import url^('https://fonts.googleapis.com/css2?family=Poppins:wght@100..900^&display=swap'^);
echo @import url^('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'^);
echo.
echo * {
echo   margin: 0;
echo   padding: 0;
echo   box-sizing: border-box;
echo   font-family: 'Poppins', sans-serif;
echo }
echo.
echo body {
echo   overflow-x: hidden;
echo }
echo ^</style^>
) > src\App.vue

echo.
echo Updating style.css...
(
echo @tailwind base;
echo @tailwind components;
echo @tailwind utilities;
echo.
echo @import url^('https://fonts.googleapis.com/css2?family=Poppins:wght@100..900^&display=swap'^);
echo @import url^('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css'^);
echo.
echo * {
echo   margin: 0;
echo   padding: 0;
echo   box-sizing: border-box;
echo   font-family: 'Poppins', sans-serif;
echo }
echo.
echo body {
echo   overflow-x: hidden;
echo }
) > src\style.css

echo.
echo Setup complete!
echo.
echo To run the development server:
echo   npm run dev
echo.
echo To build for production:
echo   npm run build
echo.
pause
