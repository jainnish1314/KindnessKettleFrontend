
function createMainContent() {

    const mainContent = document.getElementById('main-content');


    mainContent.innerHTML = '';

  
    const contentContainer = document.createElement('div');
    contentContainer.id = 'content-container'; 


    const heading = document.createElement('h1');
    heading.textContent = "At KindnessKettle, we believe in spreading kindness through small acts of generosity.";
    contentContainer.appendChild(heading);

    const heading2 = document.createElement('h2');
    heading2.textContent = "Join us in making the world a better place!";
    contentContainer.appendChild(heading2);

 
    const image = document.createElement('img');
    image.src = "https://unique-kindnesskettle-image.s3.eu-west-1.amazonaws.com/donationImages/letsdonate.jpg"; 
    image.alt = "KindnessKettle Image";
    image.style.maxWidth = "100%";
    image.style.borderRadius = "10px";
    image.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.1)";
    contentContainer.appendChild(image);


    mainContent.appendChild(contentContainer);
}


createMainContent();
