function createForm() {
    let jwttoken = localStorage.getItem("jwttoken");
    const userDetailsString = localStorage.getItem("userdetails");
    const userDetails = JSON.parse(userDetailsString);
    let userId = userDetails.userId;
  
    function showError(message, type = "fail") {
      const errorCard = document.getElementById("errorCard");
      errorCard.textContent = message || "i am fail";
      errorCard.classList.add("error-card", type);
      errorCard.style.display = "block";
  
      setTimeout(() => {
        errorCard.style.display = "none";
        errorCard.classList.remove("error-card", type);
      }, 5000);
    }
  
    // console.log(userId);
    // console.log(jwttoken);
  
    const loader = document.querySelector('.loader');
    loader.style.display = 'block';
  
    const parentElement = document.querySelector(".main-content");
    parentElement.innerHTML = "";
  
    let feedDiv = document.createElement("div");
    feedDiv.classList.add("feed");
  
    let errorCard = document.createElement("div");
    errorCard.classList.add("error-card");
    errorCard.id = "errorCard";
    feedDiv.appendChild(errorCard);
  
    let headDiv = document.createElement("div");
    headDiv.classList.add("head");
    feedDiv.appendChild(headDiv);
  
    const formContainer = document.createElement("div");
    formContainer.classList.add("postDetailCard");
  
    const formHeader = document.createElement("div");
    formHeader.classList.add("postHeader");
    const formTitle = document.createElement("h2");
    formTitle.textContent = "Donation Post Form";
    formHeader.appendChild(formTitle);
  
    const formBody = document.createElement("div");
    formBody.classList.add("postDetailForm");
  
    const formElements = [
      {
        type: "select",
        id: "foodTypeId",
        name: "foodTypeId",
        labelText: "Food Type:",
        options: ["Vegetarian", "Non-Vegetarian"],
      },
      {
        type: "input",
        inputType: "text",
        id: "addressLine",
        name: "addressLine",
        labelText: "Address Line:",
      },
      {
        type: "input",
        inputType: "text",
        id: "pincode",
        name: "pincode",
        labelText: "Pincode:",
      },
      {
        type: "input",
        inputType: "file",
        id: "foodImageUrl",
        name: "foodImageUrl",
        labelText: "Food Image:",
      },
      {
        type: "input",
        inputType: "datetime-local",
        id: "timeAvailable",
        name: "timeAvailable",
        labelText: "Expire Time:",
      },
    ];
  
    let i = 1;
  
    formElements.forEach((element) => {
      const formGroup = document.createElement("div");
      formGroup.classList.add("form-group");
  
      if (element.type === "select") {
        const selectElement = document.createElement("select");
        selectElement.id = element.id;
        selectElement.name = element.name;
        selectElement.required = true;
  
        element.options.forEach((optionText) => {
          const option = document.createElement("option");
          // option.value = optionText.toLowerCase();
          option.value = i++;
          option.textContent = optionText;
          selectElement.appendChild(option);
        });
  
        const label = document.createElement("label");
        label.id = "label1";
        label.textContent = element.labelText;
  
        formGroup.appendChild(label);
        formGroup.appendChild(selectElement);
      } else if (element.type === "input") {
        const inputElement = document.createElement("input");
        inputElement.type = element.inputType;
        inputElement.id = element.id;
        inputElement.name = element.name;
        inputElement.required = true;
  
        const label = document.createElement("label");
        label.textContent = element.labelText;
  
        formGroup.appendChild(label);
        formGroup.appendChild(inputElement);
  
        if (element.id === "foodImageUrl") {
          const foodImagebtn = document.createElement("button");
          foodImagebtn.textContent = "Upload Image";
          foodImagebtn.id = "foodImageUrl";
          foodImagebtn.addEventListener("click", () => {
            const fileInput = document.getElementById("foodImageUrl");
  
            const file = fileInput.files[0];
  
            if (file) {
              uploadImage(file);
            } else {
           
              showError('No file selected');
            }
          });
  
          formGroup.appendChild(foodImagebtn);
        }
      }
  
      formBody.appendChild(formGroup);
      
    });
  
    const savePostBtn = document.createElement("button");
    savePostBtn.id = "button1";
    savePostBtn.textContent = "Save Post";
    savePostBtn.id = "SavePostbtn";
    savePostBtn.addEventListener("click", () => SavePost(formElements));
  
    formBody.appendChild(savePostBtn);
  
    formContainer.appendChild(formHeader);
    formContainer.appendChild(formBody);
  
  
    feedDiv.appendChild(formContainer);
    parentElement.appendChild(feedDiv);
  
    loader.style.display = 'none';
  
    /////////////pincode validation///////////////////////////////////
    let pinValidate = false;
    async function checkPincode(pincode) {
      console.log("pinecoe" + pincode);
  
      const isValid = await ValidatePincode(pincode);
  
      if (/^\d{6}$/.test(pincode) && isValid) {
        showError(`Valid pincode`, "success");
        pinValidate = true;
        return true;
      } else {
        showError(`Invalid pincode`);
        return false;
      }
    }
  
    async function ValidatePincode(pin_code) {
      try {
        const response = await fetch(
          `https://kindnesskettle.projects.bbdgrad.com/api/checking_pin_code/${pin_code}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${jwttoken}`, 
            },
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        console.log(data);
        if (data.Status === "Success") {
          console.log("Pincode is valid");
          return true;
        } else if (data.Status === "Error") {
          console.error("No records found for the provided pin code");
          return false;
        }
      } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
        return false;
      }
    }
  
    ///////////////////////////////////////////////////////////////////////////
  
    async function SavePost(formElements) {
     
      const formData = {};
      let isValid = true;
  
      formElements.forEach((element) => {
        const inputElement = document.getElementById(element.id);
        const value = inputElement.value.trim();
  
       
        if (!value) {
          showError(`Please fill in the ${element.labelText}`);
          isValid = false;
          return;
        }
  
        if (element.id === 'pincode' && !/^\d+$/.test(value)) {
          showError('Pincode must be numeric');
          isValid = false;
          return;
      }
  
      if (element.id === 'timeAvailable') {
          const selectedDate = new Date(value);
          const currentDate = new Date();
          if (selectedDate <= currentDate) {
              showError('Please select a future date and time');
              isValid = false;
              return;
          }
      }
        
        formData[element.id] = value;
      });
      console.log(formData);
  
      if (!isValid) {
        return;
      }
  
      if (selectedFileName) {
        const Pincode = await checkPincode(formData.pincode);
  
        if (!Pincode) {
          return;
        }
        loader.style.display = 'block'
  
        fetch("https://kindnesskettle.projects.bbdgrad.com/api/donationPosts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwttoken}`,
          },
          body: JSON.stringify({
            userId: userId,
            foodTypeId: formData.foodTypeId,
            addressLine: formData.addressLine,
            pincode: formData.pincode,
            longitude: 45.678,
            latitude: 78.901,
            foodImageUrl: selectedFileName,
            timeAvailable: formData.timeAvailable,
          }),
        })
          .then((response) => {
            if (response.ok) {
              console.log("Post saved successfully:");
              showError("Post saved successfully", "success");
              selectedFileName = "";
              formElements.forEach((element) => {
                document.getElementById(element.id).value = "";
              });
              loader.style.display = 'none'
             }
          })
          .then((data) => {
            console.log("Post saved successfully:");
            showError("Post saved successfully", "success");
          })
          .catch((error) => {
              loader.style.display = 'none'
            console.error("There was a problem saving the post:", error);
            showError("Something went wrong");
           
          });
      } else {
          loader.style.display = 'none'
        showError("Check image is uploaded or not");
        console.log("Image is not uploaded");
        
      }
    }
    ////////////////////////////////////////////////////////////////////////////
  
    /////////////////////////////Success/error card ////////////////////////////////////////
  
    ///////////////////////////////////////////////////////////////////////////////////////////////////
  
    let selectedFileName = "";
    function uploadImage(file) {
      loader.style.display = 'block'
     
      const formData = new FormData();
      formData.append("file", file);
  
      fetch(
        "https://kindnesskettle.projects.bbdgrad.com/api/kindnessKettle/uploadPhotoToProfiles",
        {
          method: "Post",
          headers: {
            Authorization: `Bearer ${jwttoken}`,
          },
  
          body: formData,
        }
      )
        .then((response) => {
          if (response.ok) {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
              return response.json();
            } else {
              return response.text();
            }
          } else {
            throw new Error("Failed to upload image");
          }
        })
        .then((data) => {
          console.log("Image uploaded successfully", data);
          loader.style.display = 'none'
          showError("Image uploaded successfully", "success");
          selectedFileName = data;
  
        })
        .catch((error) => {
          console.error("Error:", error);
         loader.style.display = 'none'
          showError("Failed to upload image");
        });
    }
  }
  