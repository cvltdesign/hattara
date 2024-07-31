var $ = jQuery;

// EMAIL VALIDATOR //

document.addEventListener('DOMContentLoaded', function() {
    // Function to validate a form
    function validateForm(form) {
        var name = form.querySelector('input[name="name"]').value.trim();
        var email = form.querySelector('input[name="email"]').value.trim();
        var quantity = form.querySelector('input[name="quantity"]').value.trim();
        var address = form.querySelector('input[name="address"]').value.trim();
        var city = form.querySelector('input[name="city"]').value.trim();
        var postalcode = form.querySelector('input[name="postalcode"]').value.trim();
        var country = form.querySelector('input[name="country"]').value.trim();

        if (!name || !email || !quantity || !address || !city || !postalcode || !country) {
            alert('Ole hyvä ja täytä kaikki kentät.');
            return false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            alert('Ole hyvä ja anna kelvollinen sähköpostiosoite.');
            return false;
        }
        return true;
    }

    // Attach event listeners to both forms
    var form1 = document.querySelector('form[action="contact.php"][name="form1"]');
    var form2 = document.querySelector('form[action="contact.php"][name="form2"]');

    if (form1) {
        form1.addEventListener('submit', function(event) {
            if (!validateForm(form1)) {
                event.preventDefault();
            }
        });
    }

    if (form2) {
        form2.addEventListener('submit', function(event) {
            if (!validateForm(form2)) {
                event.preventDefault();
            }
        });
    }
});

// RANDOM QUOTES FOR BAND MEMBERS //

// Object to keep track of the last displayed quote for each band member
const lastQuotes = {
    saara: '',
    juhis: '',
    miikka: '',
    mikael: ''
};

function getRandomQuote(quotes, lastQuote) {
    let newQuote;
    do {
        newQuote = quotes[Math.floor(Math.random() * quotes.length)];
    } while (newQuote === lastQuote); // Ensure the new quote is different from the last one
    return newQuote;
}

function typeWriterEffect(element, text, speed = 50) {
    element.text('');
    let i = 0;
    function type() {
        if (i < text.length) {
            element.append(text.charAt(i));
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

function loadQuotes(file, elementId, member) {
    $.get(file, function(data) {
        const quotes = data.split('\n').filter(Boolean);
        const newQuote = getRandomQuote(quotes, lastQuotes[member]); // Pass the last displayed quote
        const element = $('#' + elementId);
        typeWriterEffect(element, newQuote);
        lastQuotes[member] = newQuote; // Update the last displayed quote
    });
}

function updateQuotes() {
    loadQuotes('saara-quotes.txt', 'saara-quote', 'saara');
    loadQuotes('juhis-quotes.txt', 'juhis-quote', 'juhis');
    loadQuotes('miikka-quotes.txt', 'miikka-quote', 'miikka');
    loadQuotes('mikael-quotes.txt', 'mikael-quote', 'mikael');
}

$(document).ready(function() {
    updateQuotes(); // Load initial quotes
    setInterval(updateQuotes, 10000); // Update every 10 seconds
});


// LYRICS BAR //


document.addEventListener("DOMContentLoaded", function() {
    fetch('lyrics.txt')
        .then(response => response.text())
        .then(data => {
            const lyricsBar = document.getElementById('lyricsBar');
            const lines = data.split('\n');
            // Include Scandinavian letters in the regular expression
            const nonEmptyLines = lines.filter(line => /[a-zA-ZäöÄÖ]/.test(line));
            
            // Function to shuffle the array
            function shuffle(array) {
                for (let i = array.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [array[i], array[j]] = [array[j], array[i]];
                }
            }

            // Shuffle the non-empty lines
            shuffle(nonEmptyLines);
            
            let currentIndex = 0;
            
            function typewrite(text, callback) {
                let i = 0;
                lyricsBar.textContent = '';
                function type() {
                    if (i < text.length) {
                        lyricsBar.textContent += text.charAt(i);
                        i++;
                        setTimeout(type, 100); // Adjust typing speed here
                    } else if (callback) {
                        setTimeout(callback, 2000); // Delay before showing the next line
                    }
                }
                type();
            }

            function showNextLine() {
                currentIndex = (currentIndex + 1) % nonEmptyLines.length;
                typewrite(nonEmptyLines[currentIndex], showNextLine);
            }

            // Start with the first line
            typewrite(nonEmptyLines[currentIndex], showNextLine);
        })
        .catch(error => console.error('Error fetching lyrics:', error));
});

$(document).ready(function(){

    // VISITOR COUNTER //

    $.getJSON('visitor_counter.php', function(data) {
        $('.website-counter').text(data.count);
    });


    // MENU //

    //toggle menu
    $('.hamburger-container').click(function(){
        $('#menu').slideToggle();
    });

    //to fix issue that toggle adds style(hides) to nav
    $(window).resize(function(){
        if(window.innerWidth > 1024) {
            $('#menu').removeAttr('style');
        }
    });

    //icon animation
    var topBar = $('.hamburger li:nth-child(1)'),
        middleBar = $('.hamburger li:nth-child(2)'),
        bottomBar = $('.hamburger li:nth-child(3)');

    $('.hamburger-container').on('click', function() {
        if (middleBar.hasClass('rot-45deg')) {
            topBar.removeClass('rot45deg');
            middleBar.removeClass('rot-45deg');
            bottomBar.removeClass('hidden');
        } else {
            bottomBar.addClass('hidden');
            topBar.addClass('rot45deg');
            middleBar.addClass('rot-45deg');
        }
    });

    // VISITOR COUNTER //

    const count = document.getElementById('count');

    updateVisitCount();

    function updateVisitCount(){
        fetch('https://api.countapi.xyz/update/popsi/popsi/?amount=1')
            .then(res => res.json())
            .then(res => {
            count.innerHTML = res.value
        });
    }

    // AUDIO PLAY PAUSE //

    function togglePlayPause() {
        var audio = document.getElementById("audio-leiju");
        audio.volume = 0.25;
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    }

    $('#area2').on('click', function(event) {
        event.preventDefault();
        togglePlayPause();
    });

    function togglePlayPause2() {
        var audio2 = document.getElementById("audio-vikabiisi");
        audio2.volume = 0.25;
        if (audio2.paused) {
            audio2.play();
        } else {
            audio2.pause();
        }
    }

    $('#area4').on('click', function(event) {
        event.preventDefault();
        togglePlayPause2();
    });

    function togglePlayPause2() {
        var audio3 = document.getElementById("audio-helle");
        audio3.volume = 0.25;
        if (audio3.paused) {
            audio3.play();
        } else {
            audio3.pause();
        }
    }

    $('#area6').on('click', function(event) {
        event.preventDefault();
        togglePlayPause2();
    });

    // IMAGE MAP //

    $("map").imageMapResize();

        $("area").hover(function() {
            var areaId = $(this).attr('id');
            var shapeId = 'hoverShape' + areaId.replace('area', '');
            var gifOverlayId = 'gifOverlay' + areaId.replace('area', '');
            var hoverTextId = 'hoverText' + areaId.replace('area', '');
            var hoverShape = $('#' + shapeId);
            var gifOverlay = $('#' + gifOverlayId);
            var hoverText = $('#' + hoverTextId);

            if (!hoverShape.length || !gifOverlay.length || !hoverText.length) {
                console.error("Required elements not found.");
                return;
            }

            var coords = $(this).attr('coords').split(',').map(Number);
            var shape = $(this).attr('shape');

            var imgPos = $('#image-map').offset();
            var imgWidth = $('#image-map').width();
            var imgHeight = $('#image-map').height();

            // Ensure SVG container has dimensions
            hoverShape.css({
                left: imgPos.left,
                top: imgPos.top,
                width: imgWidth,
                height: imgHeight,
                display: 'block'
            });

            if (shape === 'poly') {
                var minX = Math.min(...coords.filter((_, i) => i % 2 === 0));
                var minY = Math.min(...coords.filter((_, i) => i % 2 === 1));
                var maxX = Math.max(...coords.filter((_, i) => i % 2 === 0));
                var maxY = Math.max(...coords.filter((_, i) => i % 2 === 1));
                var width = maxX - minX;
                var height = maxY - minY;

                hoverShape.find('polygon').attr('points', coords.join(','));

                hoverShape.css({
                    left: imgPos.left + minX,
                    top: imgPos.top + minY,
                    width: width,
                    height: height
                });

                gifOverlay.css({
                    left: imgPos.left + minX,
                    top: imgPos.top + minY,
                    width: width,
                    height: height,
                    display: 'block'
                });

                hoverText.css({
                    left: imgPos.left + minX,
                    top: imgPos.top + minY + height + 5, // Position text below the area
                    display: 'block'
                });
            } else if (shape === 'circle') {
                var cx = coords[0];
                var cy = coords[1];
                var r = coords[2];
                var diameter = r * 2.15;

                hoverShape.find('circle').attr({ cx, cy, r });

                hoverShape.css({
                    left: imgPos.left + cx - r,
                    top: imgPos.top + cy - r,
                    width: diameter,
                    height: diameter
                });

                gifOverlay.css({
                    left: imgPos.left + cx - r - 8,
                    top: imgPos.top + cy - r,
                    width: diameter,
                    height: diameter,
                    display: 'block'
                });

                hoverText.css({
                    left: imgPos.left + cx - r,
                    top: imgPos.top + cy + r + 5, // Position text below the area
                    display: 'block'
                });
            } else if (shape === 'rect') {
                var x1 = coords[0];
                var y1 = coords[1];
                var x2 = coords[2];
                var y2 = coords[3];
                var width = (x2 - x1) * 1;
                var height = (y2 - y1) * 1;

                hoverShape.find('polygon').attr('points', `${x1},${y1} ${x2},${y1} ${x2},${y2} ${x1},${y2}`);

                hoverShape.css({
                    left: imgPos.left + x1,
                    top: imgPos.top + y1,
                    width: width,
                    height: height
                });

                gifOverlay.css({
                    left: imgPos.left + x1 - 1,
                    top: imgPos.top + y1,
                    width: width,
                    height: height,
                    display: 'block'
                });

                hoverText.css({
                    left: imgPos.left + x1,
                    top: imgPos.top + y1 + height + 5, // Position text below the area
                    display: 'block'
                });
            }

            hoverShape.fadeIn(200);
            gifOverlay.fadeIn(200);
            hoverText.fadeIn(200);
        }, function() {
            var areaId = $(this).attr('id');
            var shapeId = 'hoverShape' + areaId.replace('area', '');
            var gifOverlayId = 'gifOverlay' + areaId.replace('area', '');
            var hoverTextId = 'hoverText' + areaId.replace('area', '');
            $('#' + shapeId).fadeOut(200);
            $('#' + gifOverlayId).fadeOut(200);
            $('#' + hoverTextId).fadeOut(200);
    });

});
    
