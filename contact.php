<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Retrieve form inputs
    $name = strip_tags(trim($_POST["name"]));
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $quantity = intval(trim($_POST["quantity"]));
    $address = strip_tags(trim($_POST["address"]));
    $city = strip_tags(trim($_POST["city"]));
    $postalcode = strip_tags(trim($_POST["postalcode"]));
    $country = strip_tags(trim($_POST["country"]));

    // Validate the form inputs
    if (empty($name) || empty($email) || empty($quantity) || empty($address) || empty($city) || empty($postalcode) || empty($country) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        // If any required field is missing, or email is invalid, return an error
        http_response_code(400);
        echo "Ole hyvä ja täytä lomake uudelleen.";
        exit;
    }

    // Set the recipient email address
    $recipient = "paananen.miiro@gmail.com";  // Replace with your email

    // Set the email subject
    $subject = "Uusi tilaus: $name";

    // Build the email content
    $email_content = "Nimi: $name\n";
    $email_content .= "Sähköposti: $email\n";
    $email_content .= "Määrä: $quantity\n\n";
    $email_content .= "Osoitetiedot:\n";
    $email_content .= "Katuosoite: $address\n";
    $email_content .= "Kaupunki: $city\n";
    $email_content .= "Postinumero: $postalcode\n";
    $email_content .= "Maa: $country\n";

    // Build the email headers
    $email_headers = "Lähettäjä: $name <$email>";

    // Send the email
    if (mail($recipient, $subject, $email_content, $email_headers)) {
        // Success message
        http_response_code(200);
        echo "Kiitos! Tilauksesi on vastaanotettu.";
    } else {
        // If mail failed
        http_response_code(500);
        echo "Hups! Jotain meni pieleen, emme voineet lähettää tilaustasi.";
    }

} else {
    // If the form is not submitted via POST, display an error
    http_response_code(403);
    echo "Lomakkeen lähetyksessä tapahtui virhe, yritä uudelleen.";
}
?>