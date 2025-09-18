# Script para migrar TouchableOpacity a Pressable en React Native
# Ejecutar desde la raíz del proyecto: .\migrate-to-pressable.ps1

Write-Host "🚀 Iniciando migración de TouchableOpacity a Pressable..." -ForegroundColor Green
Write-Host ""

# Función para hacer backup de un archivo
function Backup-File {
    param([string]$filePath)
    $backupPath = $filePath + ".backup"
    if (!(Test-Path $backupPath)) {
        Copy-Item $filePath $backupPath
        Write-Host "✅ Backup creado: $backupPath" -ForegroundColor Yellow
    }
}

# Función para migrar un archivo
function Migrate-File {
    param([string]$filePath)
    
    Write-Host "📝 Procesando: $filePath" -ForegroundColor Cyan
    
    # Crear backup
    Backup-File $filePath
    
    # Leer contenido del archivo
    $content = Get-Content $filePath -Raw
    $originalContent = $content
    
    # 1. Reemplazar importaciones
    $content = $content -replace "TouchableOpacity,", "Pressable,"
    $content = $content -replace ", TouchableOpacity", ", Pressable"
    $content = $content -replace "TouchableOpacity", "Pressable"
    
    # 2. Reemplazar etiquetas de apertura TouchableOpacity
    $content = $content -replace "<TouchableOpacity", "<Pressable"
    
    # 3. Reemplazar etiquetas de cierre
    $content = $content -replace "</TouchableOpacity>", "</Pressable>"
    
    # 4. Reemplazar prop style por style (Pressable usa style en lugar de style)
    # No necesario cambio aquí, ambos usan style
    
    # 5. Verificar si hubo cambios
    if ($content -ne $originalContent) {
        # Escribir contenido modificado
        Set-Content $filePath $content -Encoding UTF8
        Write-Host "✅ Migrado exitosamente!" -ForegroundColor Green
        return $true
    } else {
        Write-Host "ℹ️  Sin cambios necesarios" -ForegroundColor Gray
        return $false
    }
}

# Buscar todos los archivos TypeScript/JavaScript que contienen TouchableOpacity
Write-Host "🔍 Buscando archivos con TouchableOpacity..." -ForegroundColor Blue

$files = Get-ChildItem -Path . -Recurse -Include "*.tsx", "*.ts", "*.jsx", "*.js" | 
         Where-Object { $_.FullName -notlike "*node_modules*" -and $_.FullName -notlike "*.backup*" } |
         Where-Object { (Get-Content $_.FullName -Raw) -match "TouchableOpacity" }

Write-Host "📊 Encontrados $($files.Count) archivos para migrar" -ForegroundColor Yellow
Write-Host ""

$migratedCount = 0

# Migrar cada archivo
foreach ($file in $files) {
    $relativePath = Resolve-Path $file.FullName -Relative
    if (Migrate-File $file.FullName) {
        $migratedCount++
    }
    Write-Host ""
}

Write-Host "🎉 Migración completada!" -ForegroundColor Green
Write-Host "📈 Archivos migrados: $migratedCount de $($files.Count)" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANTE:" -ForegroundColor Red
Write-Host "1. Revisa los cambios antes de commitear" -ForegroundColor White
Write-Host "2. Prueba la aplicación para asegurar que todo funciona" -ForegroundColor White
Write-Host "3. Los archivos .backup contienen la versión original" -ForegroundColor White
Write-Host ""
Write-Host "💡 Notas sobre Pressable vs TouchableOpacity:" -ForegroundColor Blue
Write-Host "- Pressable es más moderno y flexible" -ForegroundColor White
Write-Host "- Mejor soporte para diferentes estados (pressed, disabled, etc.)" -ForegroundColor White
Write-Host "- Mismas props básicas (onPress, disabled, style)" -ForegroundColor White
Write-Host "- Puede requerir ajustes manuales para animaciones específicas" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Si encuentras problemas, puedes restaurar desde los archivos .backup" -ForegroundColor Yellow