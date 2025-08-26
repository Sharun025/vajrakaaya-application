<?php
// Simple PHP router for React app
$request_uri = $_SERVER['REQUEST_URI'];
$file_path = __DIR__ . '/build' . $request_uri;

// If the file exists, serve it
if (file_exists($file_path) && is_file($file_path)) {
    $extension = pathinfo($file_path, PATHINFO_EXTENSION);
    
    // Set appropriate content type
    $content_types = [
        'html' => 'text/html',
        'css' => 'text/css',
        'js' => 'application/javascript',
        'json' => 'application/json',
        'png' => 'image/png',
        'jpg' => 'image/jpeg',
        'jpeg' => 'image/jpeg',
        'gif' => 'image/gif',
        'svg' => 'image/svg+xml',
        'ico' => 'image/x-icon',
        'woff' => 'font/woff',
        'woff2' => 'font/woff2',
        'ttf' => 'font/ttf',
        'eot' => 'application/vnd.ms-fontobject'
    ];
    
    if (isset($content_types[$extension])) {
        header('Content-Type: ' . $content_types[$extension]);
    }
    
    readfile($file_path);
    exit;
}

// For all other requests, serve index.html (React Router)
$index_file = __DIR__ . '/build/index.html';
if (file_exists($index_file)) {
    header('Content-Type: text/html');
    readfile($index_file);
} else {
    http_response_code(404);
    echo 'Vajrakaaya Application - Build files not found. Please upload the build folder contents.';
}
?>
