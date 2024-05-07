const photoURLs = [
    'imgs/moab2.jpg',
    'imgs/antonio1.PNG',
    'imgs/alaska2.jpg',
    'imgs/moab1.jpg',
    'imgs/alaska1.jpg',
    'imgs/wyoming.jpg',
    'imgs/alaska3.jpg',
    'imgs/alaska5.jpeg',
    'imgs/alaska4.jpeg'
];

function showPage(pageId) {
    var sections = document.querySelectorAll('main section');
    sections.forEach(function(section) {
        section.style.display = 'none';
    });

    document.getElementById(pageId).style.display = 'block';
   
    var selectedSection = document.getElementById(pageId);
    if (selectedSection) {
        selectedSection.style.display = 'block';
    }
}


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


function handleResize() {
    const screenWidth = window.innerWidth || document.documentElement.clientWidth;
    scale_photos(screenWidth, photoURLs);
}

function displayModifiedPhotos(modifiedPhotos) {
    const photoContainer = document.getElementById('photoContainer');
    // Clear any existing content in the container
    photoContainer.innerHTML = '';

    // Iterate through the modified photos and append them to the container
    modifiedPhotos.forEach(modifiedPhoto => {
        const imageWrapper = document.createElement('div');
        imageWrapper.classList.add('image-wrapper');

        // Add hover effect class
        imageWrapper.classList.add('hover-zoom');

        imageWrapper.style.width = modifiedPhoto.width + 'px';

        const image = document.createElement('img');
        image.src = modifiedPhoto.src;
        image.width = modifiedPhoto.width;
        image.height = modifiedPhoto.height;

        imageWrapper.appendChild(image);
        photoContainer.appendChild(imageWrapper);
    });

    // Setup event listener for image expander after images are appended
    setupImageExpander();
}






// JavaScript to handle click event and expand the image
function setupImageExpander() {
    const overlay = document.getElementById('overlay');

    // Function to handle image click event
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
    
            // Calculate the aspect ratio of the image
            const aspectRatio = expandedImage.width / expandedImage.height;
    
            // Adjust the dimensions while maintaining the aspect ratio
            if (width / aspectRatio < height) {
                expandedImage.style.width = width + 'px';
                expandedImage.style.height = 'auto';
            } else {
                expandedImage.style.height = height + 'px';
                expandedImage.style.width = 'auto';
            }
        }
    
        // Call the resize function initially
        resizeExpandedImage();
    
        // Add event listener for window resize
        window.addEventListener('resize', resizeExpandedImage);

        // Close the expanded image on overlay click
        overlay.addEventListener('click', closeExpandedImage);
    }

    // Function to close the expanded image
    function closeExpandedImage() {
        const expandedImage = document.querySelector('.expanded-image');
        if (expandedImage) {
            expandedImage.classList.remove('active');
            overlay.style.display = 'none';
            document.body.removeChild(expandedImage); // Remove the expanded image from the DOM
            overlay.removeEventListener('click', closeExpandedImage);
        }
    }

    // Add event listener to each image-wrapper
    const imageWrappers = document.querySelectorAll('.image-wrapper');
    imageWrappers.forEach(imageWrapper => {
        imageWrapper.removeEventListener('click', handleImageClick); // Remove existing event listener
        imageWrapper.addEventListener('click', handleImageClick);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    setupImageExpander();
});





window.addEventListener('load', function() {
    handleResize();
});

// Call the function initially
handleResize();

// Add event listener for window resize
window.addEventListener('resize', handleResize);
