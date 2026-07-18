# Servidor HTTP ligero en PowerShell para TYANGO STAFF v2
# Nativamente compatible con Windows sin Node, Python o PHP.

$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")

Write-Host "Iniciando servidor en http://localhost:$port/"
try {
    $listener.Start()
    Write-Host "Servidor listo. Abre http://localhost:$port en tu navegador."
    Write-Host "Para detener el servidor, presiona Ctrl+C en esta terminal."
    
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response
        
        # Obtener ruta local relativa
        $urlPath = $request.Url.LocalPath
        if ($urlPath -eq "/") {
            $urlPath = "/index.html"
        }
        
        # Eliminar barra inicial para Join-Path
        $relPath = $urlPath.Substring(1)
        # Limpiar barras diagonales para Windows
        $relPath = $relPath -replace "/", "\"
        $filePath = Join-Path $PSScriptRoot $relPath
        
        if (Test-Path $filePath -PathType Leaf) {
            # Determinar tipo de contenido (MIME type)
            $ext = [System.IO.Path]::GetExtension($filePath).ToLower()
            $contentType = "text/plain"
            switch ($ext) {
                ".html" { $contentType = "text/html; charset=utf-8" }
                ".css"  { $contentType = "text/css; charset=utf-8" }
                ".js"   { $contentType = "application/javascript; charset=utf-8" }
                ".svg"  { $contentType = "image/svg+xml" }
                ".png"  { $contentType = "image/png" }
                ".jpg"  { $contentType = "image/jpeg" }
                ".ico"  { $contentType = "image/x-icon" }
                ".json" { $contentType = "application/json; charset=utf-8" }
            }
            
            # Leer bytes del archivo
            $bytes = [System.IO.File]::ReadAllBytes($filePath)
            
            $response.ContentType = $contentType
            $response.ContentLength64 = $bytes.Length
            $response.OutputStream.Write($bytes, 0, $bytes.Length)
        } else {
            # 404 No encontrado
            $response.StatusCode = 404
            $errBytes = [System.Text.Encoding]::UTF8.GetBytes("Archivo no encontrado: $urlPath")
            $response.ContentType = "text/plain; charset=utf-8"
            $response.ContentLength64 = $errBytes.Length
            $response.OutputStream.Write($errBytes, 0, $errBytes.Length)
        }
        $response.OutputStream.Close()
    }
} catch {
    Write-Host "Error en el servidor: $_" -ForegroundColor Red
} finally {
    $listener.Close()
}
