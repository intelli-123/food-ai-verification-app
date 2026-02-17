# PowerShell script to create food-ai-verification-app structure

$root = "food-ai-verification-app"

# Define directories
$dirs = @(
    "$root\src",
    "$root\src\config",
    "$root\src\models",
    "$root\src\routes",
    "$root\src\controllers",
    "$root\src\services",
    "$root\src\middlewares",
    "$root\src\public",
    "$root\src\public\js",
    "$root\src\public\locales"
)

# Define files
$files = @(
    "$root\docker-compose.yml",
    "$root\Dockerfile",
    "$root\.dockerignore",
    "$root\.env.example",
    "$root\package.json",
    "$root\README.md",
    "$root\src\server.js",
    "$root\src\app.js",
    "$root\src\config\db.js",
    "$root\src\config\llm.js",
    "$root\src\config\policies.js",
    "$root\src\models\Food.js",
    "$root\src\routes\food.routes.js",
    "$root\src\routes\analyze.routes.js",
    "$root\src\controllers\food.controller.js",
    "$root\src\controllers\analyze.controller.js",
    "$root\src\services\langchainAgent.js",
    "$root\src\services\translation.service.js",
    "$root\src\middlewares\upload.middleware.js",
    "$root\src\public\index.html",
    "$root\src\public\js\app.js",
    "$root\src\public\js\i18n.js",
    "$root\src\public\locales\en.json",
    "$root\src\public\locales\hi.json",
    "$root\src\public\locales\de.json",
    "$root\src\public\locales\fr.json",
    "$root\src\public\locales\es.json",
    "$root\src\public\locales\ur.json",
    "$root\src\public\locales\ar.json",
    "$root\src\public\locales\zh.json",
    "$root\src\public\locales\ja.json",
    "$root\src\public\locales\pt.json"
)

# Create directories
foreach ($dir in $dirs) {
    if (-not (Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir | Out-Null
    }
}

# Create files
foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        New-Item -ItemType File -Path $file | Out-Null
    }
}

Write-Host "Project structure for food-ai-verification-app created successfully!"
