<?php
header('Content-Type: application/json');

$allowed = ['state', 'madness'];
$key = $_GET['key'] ?? '';

if (!in_array($key, $allowed, true)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid key']);
    exit;
}

$file = __DIR__ . '/data/' . $key . '.json';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (file_exists($file)) {
        readfile($file);
    } else {
        echo 'null';
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = file_get_contents('php://input');
    if (json_decode($body) === null && trim($body) !== 'null') {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid JSON']);
        exit;
    }
    $written = file_put_contents($file, $body, LOCK_EX);
    if ($written === false) {
        http_response_code(500);
        echo json_encode(['error' => 'Write failed']);
        exit;
    }
    echo json_encode(['ok' => true]);
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}
