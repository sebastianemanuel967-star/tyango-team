# ============================================
# serve.ps1 - Servidor HTTP para TYANGO STAFF v2
# ============================================

$port = 8080
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()

Write-Host "🥭 TYANGO STAFF v2 - Servidor iniciado" -ForegroundColor Magenta
Write-Host "📱 Abre: http://localhost:$port" -ForegroundColor Cyan
Write-Host "⏹️  Presiona Ctrl+C para detener" -ForegroundColor Gray
Write-Host ""

$mimeTypes = @{
    ".html" = "text/html"
    ".css"  = "text/css"
    ".js"   = "application/javascript"
    ".json" = "application/json"
    ".png"  = "image/png"
    ".jpg"  = "image/jpeg"
    ".jpeg" = "image/jpeg"
    ".svg"  = "image/svg+xml"
    ".ico"  = "image/x-icon"
    ".woff" = "font/woff"
    ".woff2"= "font/woff2"
    ".ttf"  = "font/ttf"
}

while ($listener.IsListening) {
    try {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $url = $request.Url.LocalPath
        if ($url -eq "/") { $url = "/index.html" }

        $filePath = Join-Path $PSScriptRoot $url
        $ext = [System.IO.Path]::GetExtension($filePath).ToLower()

        if (Test-Path $filePath) {
            $content = [System.IO.File]::ReadAllBytes($filePath)
            $response.ContentType = $mimeTypes[$ext]
            $response.ContentLength64 = $content.Length
            $response.OutputStream.Write($content, 0, $content.Length)
        } else {
            $response.StatusCode = 404
            $notFound = [System.Text.Encoding]::UTF8.GetBytes("404 - Not Found")
            $response.ContentLength64 = $notFound.Length
            $response.OutputStream.Write($notFound, 0, $notFound.Length)
        }

        $response.Close()
    }
    catch {
        Write-Host "Error: $_" -ForegroundColor Red
    }
}

$listener.Stop()
