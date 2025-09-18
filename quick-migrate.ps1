# Script simple para migrar TouchableOpacity a Pressable
# Ejecutar: .\quick-migrate.ps1

Write-Host "🚀 Migración rápida TouchableOpacity → Pressable" -ForegroundColor Green

# Archivos a migrar (excluyendo node_modules y backups)
$files = Get-ChildItem -Recurse -Include "*.tsx", "*.ts" | Where-Object { 
    $_.FullName -notlike "*node_modules*" -and 
    $_.FullName -notlike "*.backup*" -and
    (Get-Content $_.FullName -Raw) -match "TouchableOpacity" 
}

Write-Host "Archivos encontrados: $($files.Count)"

foreach ($file in $files) {
    Write-Host "Procesando: $($file.Name)" -ForegroundColor Cyan
    
    # Crear backup
    Copy-Item $file.FullName "$($file.FullName).backup" -Force
    
    # Reemplazos
    (Get-Content $file.FullName) | 
        ForEach-Object { $_ -replace "TouchableOpacity", "Pressable" } |
        Set-Content $file.FullName -Encoding UTF8
    
    Write-Host "✅ Completado" -ForegroundColor Green
}

Write-Host ""
Write-Host "🎉 Migración completada! Revisa los cambios antes de continuar." -ForegroundColor Green