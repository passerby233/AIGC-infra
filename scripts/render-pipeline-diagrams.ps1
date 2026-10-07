# Render the source PDFs using Windows' built-in PDF renderer.
# The generated PNGs are checked in; building the portal does not require Windows.
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$null = [Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime]
$null = [Windows.Data.Pdf.PdfDocument, Windows.Data.Pdf, ContentType = WindowsRuntime]
$null = [Windows.Storage.Streams.InMemoryRandomAccessStream, Windows.Storage.Streams, ContentType = WindowsRuntime]
$awaitResult = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' } | Select-Object -First 1
$awaitAction = [System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and -not $_.IsGenericMethod -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncAction' } | Select-Object -First 1
function Wait-WinRtResult($Operation, $ResultType) {
    $task = $awaitResult.MakeGenericMethod($ResultType).Invoke($null, @($Operation))
    $task.GetAwaiter().GetResult()
}
$assetRoot = Join-Path (Split-Path $PSScriptRoot -Parent) 'img'
foreach ($diagramName in @('singleshot', 'multishot')) {
    $file = Wait-WinRtResult ([Windows.Storage.StorageFile]::GetFileFromPathAsync((Join-Path $assetRoot "$diagramName.pdf"))) ([Windows.Storage.StorageFile])
    $document = Wait-WinRtResult ([Windows.Data.Pdf.PdfDocument]::LoadFromFileAsync($file)) ([Windows.Data.Pdf.PdfDocument])
    if ($document.PageCount -ne 1) { throw "$diagramName.pdf must contain one diagram page." }
    $page = $document.GetPage(0)
    $stream = New-Object Windows.Storage.Streams.InMemoryRandomAccessStream
    $options = New-Object Windows.Data.Pdf.PdfPageRenderOptions
    $options.DestinationWidth = 5400
    try {
        $task = $awaitAction.Invoke($null, @($page.RenderToStreamAsync($stream, $options)))
        $null = $task.GetAwaiter().GetResult()
        $stream.Seek(0)
        $readStream = [System.IO.WindowsRuntimeStreamExtensions]::AsStreamForRead($stream)
        $output = [System.IO.File]::Create((Join-Path $assetRoot "$diagramName.png"))
        try { $readStream.CopyTo($output) } finally { $output.Dispose(); $readStream.Dispose() }
        Write-Output "Rendered $diagramName.png."
    } finally { $stream.Dispose(); $page.Dispose() }
}
