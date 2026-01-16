# Script de Verificación de Setup - TecnoAndamios (Windows)
# Ejecutar en PowerShell

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "🔍 Verificador de Setup - TecnoAndamios" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

$pass = 0
$fail = 0
$warn = 0

function Check-Command {
    param($Name, $Command, $Required = $true)
    
    try {
        $version = Invoke-Expression "$Command 2>&1"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ $Name instalado: $($version -split "`n" | Select-Object -First 1)" -ForegroundColor Green
            $script:pass++
        } else {
            throw
        }
    } catch {
        if ($Required) {
            Write-Host "✗ $Name NO instalado (REQUERIDO)" -ForegroundColor Red
            $script:fail++
        } else {
            Write-Host "⚠ $Name NO instalado (opcional)" -ForegroundColor Yellow
            $script:warn++
        }
    }
}

# Verificar Node.js
Write-Host "Verificando Node.js..." -ForegroundColor Yellow
Check-Command "Node.js" "node --version" $true

# Verificar npm
Write-Host "Verificando npm..." -ForegroundColor Yellow
Check-Command "npm" "npm --version" $true

# Verificar Git
Write-Host "Verificando Git..." -ForegroundColor Yellow
Check-Command "Git" "git --version" $true

# Verificar Docker
Write-Host "Verificando Docker..." -ForegroundColor Yellow
Check-Command "Docker" "docker --version" $false

# Verificar Docker Compose
Write-Host "Verificando Docker Compose..." -ForegroundColor Yellow
try {
    $dockerComposeVersion = docker compose version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Docker Compose instalado: $($dockerComposeVersion -split "`n" | Select-Object -First 1)" -ForegroundColor Green
        $pass++
    } else {
        throw
    }
} catch {
    Write-Host "⚠ Docker Compose NO instalado (opcional)" -ForegroundColor Yellow
    $warn++
}

# Verificar MySQL
Write-Host "Verificando MySQL..." -ForegroundColor Yellow
try {
    $mysqlVersion = mysql --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ MySQL instalado: $($mysqlVersion -split "`n" | Select-Object -First 1)" -ForegroundColor Green
        $pass++
    } else {
        throw
    }
} catch {
    Write-Host "⚠ MySQL NO instalado (opcional si usás Docker)" -ForegroundColor Yellow
    $warn++
}

Write-Host ""
Write-Host "Verificando estructura del proyecto..." -ForegroundColor Yellow

$projectFiles = @(
    @{ Path = "backend"; Type = "Folder" },
    @{ Path = "frontend"; Type = "Folder" },
    @{ Path = "docs"; Type = "Folder" },
    @{ Path = "docker-compose.yml"; Type = "File" },
    @{ Path = "README.md"; Type = "File" }
)

foreach ($item in $projectFiles) {
    if (Test-Path $item.Path) {
        Write-Host "✓ $($item.Type) '$($item.Path)' existe" -ForegroundColor Green
    } else {
        Write-Host "✗ $($item.Type) '$($item.Path)' NO existe" -ForegroundColor Red
        $fail++
    }
}

Write-Host ""
Write-Host "Verificando configuración backend..." -ForegroundColor Yellow

if (Test-Path "backend\.env") {
    Write-Host "✓ backend\.env configurado" -ForegroundColor Green
} else {
    Write-Host "⚠ backend\.env NO existe (copiar de .env.example)" -ForegroundColor Yellow
    $warn++
}

if (Test-Path "backend\package.json") {
    Write-Host "✓ backend\package.json existe" -ForegroundColor Green
} else {
    Write-Host "✗ backend\package.json NO existe" -ForegroundColor Red
    $fail++
}

if (Test-Path "backend\node_modules") {
    Write-Host "✓ Dependencias backend instaladas" -ForegroundColor Green
} else {
    Write-Host "⚠ Dependencias backend NO instaladas (ejecutar: cd backend; npm install)" -ForegroundColor Yellow
    $warn++
}

Write-Host ""
Write-Host "Verificando puertos..." -ForegroundColor Yellow

$ports = @(
    @{ Port = 3000; Name = "Backend" },
    @{ Port = 4200; Name = "Frontend" },
    @{ Port = 3306; Name = "MySQL" }
)

foreach ($portInfo in $ports) {
    $connections = Get-NetTCPConnection -LocalPort $portInfo.Port -ErrorAction SilentlyContinue
    if ($connections) {
        Write-Host "⚠ Puerto $($portInfo.Port) ($($portInfo.Name)) está en uso" -ForegroundColor Yellow
        $warn++
    } else {
        Write-Host "✓ Puerto $($portInfo.Port) ($($portInfo.Name)) disponible" -ForegroundColor Green
    }
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "📊 Resumen" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Verificaciones exitosas: $pass" -ForegroundColor Green
Write-Host "Verificaciones fallidas: $fail" -ForegroundColor Red
Write-Host "Advertencias: $warn" -ForegroundColor Yellow
Write-Host ""

if ($fail -eq 0) {
    Write-Host "✅ ¡Todo listo para empezar a desarrollar!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Próximos pasos:" -ForegroundColor Cyan
    Write-Host "1. cd backend" -ForegroundColor White
    Write-Host "2. npm install" -ForegroundColor White
    Write-Host "3. copy .env.example .env" -ForegroundColor White
    Write-Host "4. Configurar .env con tus credenciales" -ForegroundColor White
    Write-Host "5. npm run migrate" -ForegroundColor White
    Write-Host "6. npm run dev" -ForegroundColor White
} else {
    Write-Host "⚠️ Hay algunos prerequisitos faltantes" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Revisa la documentación en docs\SETUP.md o WINDOWS_SETUP.md" -ForegroundColor White
}

Write-Host ""
Write-Host "======================================" -ForegroundColor Cyan
