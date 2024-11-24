<?php
session_start();

function sanitizeNumber($number) {
    return filter_var($number, FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
}

function calculate($num1, $operator, $num2) {
    $num1 = floatval($num1);
    $num2 = floatval($num2);
    
    switch($operator) {
        case '+':
            return $num1 + $num2;
        case '-':
            return $num1 - $num2;
        case '*':
            return $num1 * $num2;
        case '/':
            if ($num2 == 0) {
                return 'Error';
            }
            return $num1 / $num2;
        default:
            return 'Error';
    }
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $currentNumber = isset($_POST['currentNumber']) ? sanitizeNumber($_POST['currentNumber']) : '0';
    $lastResult = isset($_POST['lastResult']) ? sanitizeNumber($_POST['lastResult']) : '';
    $pendingOperator = isset($_POST['pendingOperator']) ? $_POST['pendingOperator'] : '';
    
    $result = $currentNumber;
    
    if ($lastResult !== '' && $pendingOperator !== '') {
        $result = calculate($lastResult, $pendingOperator, $currentNumber);
    }
    
    // Format result
    if ($result !== 'Error') {
        $result = floatval($result);
        if (strlen($result) > 9) {
            $result = sprintf('%.4e', $result);
        }
    }
    
    // Store in session if needed
    $_SESSION['last_calculation'] = $result;
    
    // Return result
    header('Content-Type: application/json');
    echo json_encode(['result' => $result]);
    exit;
}