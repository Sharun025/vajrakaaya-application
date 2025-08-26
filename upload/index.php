<?php
// Enhanced PHP router for React app
$request_uri = $_SERVER['REQUEST_URI'];

// Remove query string if present
$request_uri = strtok($request_uri, '?');

// Handle static assets first
if (strpos($request_uri, '/static/') === 0) {
    $file_path = __DIR__ . '/build' . $request_uri;
    
    if (file_exists($file_path) && is_file($file_path)) {
        $extension = pathinfo($file_path, PATHINFO_EXTENSION);
        
        // Set appropriate content type
        $content_types = [
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
        
        // Add cache headers for static assets
        header('Cache-Control: public, max-age=31536000');
        
        readfile($file_path);
        exit;
    }
}

// Handle other static files (favicon, manifest, etc.)
if (in_array($request_uri, ['/favicon.ico', '/manifest.json', '/logo192.png'])) {
    $file_path = __DIR__ . '/build' . $request_uri;
    
    if (file_exists($file_path) && is_file($file_path)) {
        $extension = pathinfo($file_path, PATHINFO_EXTENSION);
        
        if ($extension === 'ico') {
            header('Content-Type: image/x-icon');
        } elseif ($extension === 'json') {
            header('Content-Type: application/json');
        } elseif ($extension === 'png') {
            header('Content-Type: image/png');
        }
        
        readfile($file_path);
        exit;
    }
}

// For all other requests, serve index.html (React Router)
$index_file = __DIR__ . '/build/index.html';
if (file_exists($index_file)) {
    header('Content-Type: text/html; charset=utf-8');
    readfile($index_file);
} else {
    http_response_code(404);
    echo '<!DOCTYPE html><html><head><title>Vajrakaaya Application - Error</title></head><body>';
    echo '<h1>Vajrakaaya Application</h1>';
    echo '<p>Build files not found. Please ensure the build folder is uploaded correctly.</p>';
    echo '<p>Expected file: ' . $index_file . '</p>';
    echo '</body></html>';
}
?>
