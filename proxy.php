<?php
if (!isset($_GET['url'])) {
    http_response_code(400);
    echo "URL não informada.";
    exit;
}

$url = $_GET['url'];

// Puxa o conteúdo com cURL
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$headers = [
    "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept: */*"
];
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$contentType = curl_getinfo($ch, CURLINFO_CONTENT_TYPE);
curl_close($ch);

if ($httpcode != 200 || !$response) {
    http_response_code(502);
    echo "Erro ao buscar a URL.";
    exit;
}

// Se for playlist M3U8, reescreve os links internos
if (strpos($url, ".m3u8") !== false) {
    $base = dirname($url);
    $lines = explode("\n", $response);
    foreach ($lines as &$line) {
        $line = trim($line);
        if ($line && $line[0] != "#" && !preg_match("#^https?://#", $line)) {
            $line = $base . "/" . $line;
        }
        if (preg_match("#^https?://#", $line)) {
            $line = "proxy.php?url=" . urlencode($line);
        }
    }
    $response = implode("\n", $lines);
}

// Cabeçalhos CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: GET, OPTIONS");
header("Content-Type: " . ($contentType ?: "application/vnd.apple.mpegurl"));

echo $response;
