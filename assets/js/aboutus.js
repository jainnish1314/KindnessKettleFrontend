function createAboutUsPage() {
   
    const mainContent = document.getElementById('main-content');

 
    mainContent.innerHTML = '';

   
    const containerDiv = document.createElement('div');
    containerDiv.classList.add('responsive-container-block', 'bigContainer');

 
    const aboutUsDescription = `

    <div class="about-section">
    <div class="leftSide">
        <p class="text-blk heading">Meet Our Creative Team</p>
        <p class="text-blk subHeading">
            Meet the creative minds behind Kindness Kettle:
             <ul class="developer-list">
                <li>Krishna Singh - krishna.singh@bbd.co.za</li>
                <li>Ajay Singh - ajay.singh@bbd.co.za</li>
                <li>Nisha Jain - nisha.jain@bbd.co.za</li>
            </ul>
        </p>
    </div>
    <div class="rightSide">
        <p class="text-blk heading">About Kindness Kettle</p>
        <p class="text-blk subHeading">
            In a world that often seems rushed and impersonal, the Kindness Kettle project emerges as a beacon of hope and humanity. 
            At its heart, Kindness Kettle is more than just a platform; it’s a movement dedicated to the profound impact of small acts of kindness. 
            Our mission is simple yet powerful: to make the world a better place by encouraging and facilitating acts of generosity and compassion within our communities and beyond.
        </p>
    </div>
</div>


    `;

    // Set the content of the container to the aboutUsDescription
    containerDiv.innerHTML = aboutUsDescription;

    // Append main container to main content
    mainContent.appendChild(containerDiv);


  
}


