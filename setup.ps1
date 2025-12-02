Write-Host "Setting up Hatid Kita Frontend..." -ForegroundColor Green
Write-Host ""

# Navigate to script directory
Set-Location $PSScriptRoot

# Update main.js
Write-Host "Updating main.js..." -ForegroundColor Yellow
@"
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'

createApp(App).use(router).mount('#app')
"@ | Out-File -FilePath "src\main.js" -Encoding UTF8

# Update App.vue
Write-Host "Updating App.vue..." -ForegroundColor Yellow
@"
<template>
  <router-view />
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100..900&display=swap');
@import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

body {
  overflow-x: hidden;
}
</style>
"@ | Out-File -FilePath "src\App.vue" -Encoding UTF8

# Update style.css
Write-Host "Updating style.css..." -ForegroundColor Yellow
@"
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100..900&display=swap');
@import url('https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}

body {
  overflow-x: hidden;
}
"@ | Out-File -FilePath "src\style.css" -Encoding UTF8

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "To run the development server:" -ForegroundColor Cyan
Write-Host "  npm run dev"
Write-Host ""
Write-Host "To build for production:" -ForegroundColor Cyan
Write-Host "  npm run build"
Write-Host ""
Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
