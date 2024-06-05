// const photoURLs = [
//     'imgs/moab2.jpg',
//     'imgs/antonio1.PNG',
//     'imgs/alaska2.jpg',
//     'imgs/moab1.jpg',
//     'imgs/alaska1.jpg',
//     'imgs/slo1.jpg',
//     'imgs/wyoming.jpg',
//     'imgs/alaska3.jpg',
//     'imgs/alaska5.jpeg',
//     'imgs/alaska4.jpeg'
// ];

const photoURLs = [
    'imgs/moab2.jpg',
    'imgs/alaska2.jpg',
    'imgs/slo1.jpg',
    'imgs/antonio1.PNG',
    'imgs/alaska1.jpg',
    'imgs/alaska5.jpeg',
    'imgs/alaska3.jpg',
    'imgs/wyoming.jpg',
    'imgs/moab1.jpg',
    'imgs/alaska4.jpeg'
];

// ALL: used to toggle visibility of home page/nav bar pages
function showPage(pageId) {
    var sections = document.querySelectorAll('main section');

    sections.forEach(function(section) {
        section.style.display = 'none';
    });

    document.getElementById(pageId).style.display = 'block';
   
    var selectedSection = document.getElementById(pageId);
    selectedSection.style.display = 'block';

    if (pageId === 'Coding') {
        startWebcam();

        document.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowLeft') { // Left arrow
                change_font_size(-2); // Decrease font size
            } else if (event.key === 'ArrowRight') { // Right arrow
                change_font_size(2); // Increase font size
            }
        });
    } 
}

// PHOTOGRAPHY: photo display algo for photography page
function scale_photos(screenWidth, photoURLs) {
    const scaled_photos = [];
    let rowImages;
    let same_height_photos;
    const imagesPerRow = screenWidth < 650 ? 2 : 3;

    for (let i = 0; i < photoURLs.length; i += imagesPerRow) {
        same_height_photos = [];
        rowImages = photoURLs.slice(i, i + imagesPerRow); 
        let totalWidth = 0;

        rowImages.forEach((photoURL, index) => {
            const image = new Image();
            image.src = photoURL;

            let n_height = 100;
            let n_width = image.width * (n_height / image.height);

            totalWidth += n_width;

            same_height_photos.push({
                src: image.src,
                width: n_width,
                height: n_height
            });
        });

        same_height_photos.forEach((photo, index) => {
            const scaled_width = (photo.width / totalWidth) * screenWidth;
            const scaled_height = photo.height * (scaled_width / photo.width);

            if (imagesPerRow == 2) {
                scaled_photos.push({
                    src: photo.src,
                    width: scaled_width * 0.83,
                    height: scaled_height * 0.83
                });
            } else {
                scaled_photos.push({
                    src: photo.src,
                    width: scaled_width * 0.9,
                    height: scaled_height * 0.9
                });
            }
        });

        if (i + imagesPerRow >= photoURLs.length) {
            displayModifiedPhotos(scaled_photos);
        }
    }
}

// PHOTOGRAPHY: goes through resized photos and displays, adds hover zoom effect and listens for image clicks
function displayModifiedPhotos(modifiedPhotos) {
    const photoContainer = document.getElementById('photoContainer');
    photoContainer.innerHTML = '';

    modifiedPhotos.forEach(modifiedPhoto => {
        const imageWrapper = document.createElement('div');
        const image = document.createElement('img');

        imageWrapper.classList.add('image-wrapper');
        imageWrapper.classList.add('hover-zoom');
        imageWrapper.style.width = modifiedPhoto.width + 'px';

        image.src = modifiedPhoto.src;
        image.width = modifiedPhoto.width;
        image.height = modifiedPhoto.height;

        imageWrapper.appendChild(image);
        photoContainer.appendChild(imageWrapper);
    });

    // set up image expander listener
    setupImageExpander();
}

// PHOTOGRAPHY
function handleResize() {
    const screenWidth = window.innerWidth || document.documentElement.clientWidth;
    scale_photos(screenWidth, photoURLs);
}

// PHOTOGRAPHY: defines what happens on image click, adds event listener for window resize
function setupImageExpander() {
    const overlay = document.getElementById('overlay');

    function handleImageClick(event) {
        const clickedImage = event.currentTarget.querySelector('img');
        const expandedImage = document.createElement('img');

        expandedImage.classList.add('expanded-image');
        document.body.appendChild(expandedImage);
        expandedImage.src = clickedImage.src;
        overlay.style.display = 'block';
        expandedImage.classList.add('active');

        function resizeExpandedImage() {
            const width = window.innerWidth;
            const height = window.innerHeight;
            const aspectRatio = expandedImage.width / expandedImage.height;
    
            // adjust expanded image to look nice (PROPER ASPECT RATIO)
            if (width / aspectRatio < height) {
                expandedImage.style.width = width + 'px';
                expandedImage.style.height = 'auto';
            } else {
                expandedImage.style.height = height + 'px';
                expandedImage.style.width = 'auto';
            }
        }
    
        resizeExpandedImage();
    
        window.addEventListener('resize', resizeExpandedImage);
        overlay.addEventListener('click', closeExpandedImage);
    }


    function closeExpandedImage() {
        const expandedImage = document.querySelector('.expanded-image');
        if (expandedImage !== null) {
            expandedImage.classList.remove('active');
            overlay.style.display = 'none';
            document.body.removeChild(expandedImage);
            overlay.removeEventListener('click', closeExpandedImage);
        }
    }

    const imageWrappers = document.querySelectorAll('.image-wrapper');

    // remove old click listener from each image, add new one **IDK WHY THIS WORKS BUT IT DOES**
    imageWrappers.forEach(imageWrapper => {
        imageWrapper.removeEventListener('click', handleImageClick);
        imageWrapper.addEventListener('click', handleImageClick);
    });
}

// PHOTOGRAPHY
document.addEventListener('DOMContentLoaded', function () {
    setupImageExpander();
});

// PHOTOGRAPHY
window.addEventListener('load', function() {
    handleResize();
});

// PHOTOGRAPHY
handleResize();

// PHOTOGRAPHY: listen for window resize to restructure photo arrangement 
window.addEventListener('resize', handleResize);


// CODING: TTimage video stream
let font_size = 12;

function change_font_size(increment) {
    font_size += increment;
    drawFrame();
}



function startWebcam() {
    const videoElement = document.getElementById('webcamVideo');
    const constraints = { video: true };

    navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
            videoElement.srcObject = stream;
            processFrames();
        })
        .catch(error => {
            console.error('Error accessing webcam: ', error);
        });
}


// Function to process video frames and draw ASCII characters
function processFrames() {
    const videoElement = document.getElementById('webcamVideo');
    const canvasElement = document.getElementById('webcamCanvas');
    const context = canvasElement.getContext('2d');

    function resizeCanvas() {
        canvasElement.width = videoElement.videoWidth * 2;
        canvasElement.height = videoElement.videoHeight * 2;
    }

    videoElement.addEventListener('loadedmetadata', resizeCanvas);

    function drawFrame() {
        context.clearRect(0, 0, canvasElement.width, canvasElement.height);

        // Mirror webcam feed
        context.translate(canvasElement.width, 0);
        context.scale(-1, 1);

        context.drawImage(videoElement, 0, 0, canvasElement.width, canvasElement.height);

        context.setTransform(1, 0, 0, 1, 0, 0);

        const frame = context.getImageData(0, 0, canvasElement.width, canvasElement.height);
        const data = frame.data;

        context.clearRect(0, 0, canvasElement.width, canvasElement.height);

        context.fillStyle = 'black';
        // let font_size = 12;
        
        let spacing = font_size - 2;
        context.font = '${font_size}px Helvetica';

        for (let y = 0; y < canvasElement.height; y += spacing) {
            for (let x = 0; x < canvasElement.width; x += spacing) {

                const index = ((y * canvasElement.width) + x) * 4;
                const red = data[index];
                const green = data[index + 1];
                const blue = data[index + 2];
                const brightness = (red + green + blue) / 3;

                const chars = [[0, ' '],
                               [70, ','],
                               [100, '~'],
                               [150, '*'],
                               [190, '?'],
                               [230, '$'],
                               [245, '#'],
                               [255, '@']]

                let char = ' ';

                for (let i = 0; i < 8; i++) {
                    if (chars[i][0] <= brightness  && brightness <= chars[i+1][0]) {
                        char = chars[i][1];
                    }
                }

                if (char == ' ') {
                    char = chars[7][1];
                }

                context.fillText(char, x, y);
            }
        }

        requestAnimationFrame(drawFrame);
    }

    videoElement.addEventListener('play', () => {
        resizeCanvas();
        requestAnimationFrame(drawFrame);
    });

    window.addEventListener('resize', resizeCanvas);
}