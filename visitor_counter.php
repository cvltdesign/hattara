<?php
session_start();

$counter_file = 'visitor_count.txt';

// Check if the session is new (indicating a unique visitor)
if (!isset($_SESSION['visited'])) {
    $_SESSION['visited'] = true;

    // Increment the counter
    if (file_exists($counter_file)) {
        $counter = file_get_contents($counter_file);
        $counter = intval($counter) + 1;
    } else {
        $counter = 1;
    }

    // Save the new counter value to the file
    file_put_contents($counter_file, $counter);
} else {
    // Get the current counter value
    $counter = file_get_contents($counter_file);
}

// Return the visitor count as a JSON response
header('Content-Type: application/json');
echo json_encode(['count' => $counter]);
?>