firebase.auth().onAuthStateChanged((user) => {
    if (user) {
     
        let restaurantname = document.getElementById("restaurantname")
        let email = document.getElementById("email")
        let country = document.getElementById("country")
        let city = document.getElementById("city")
        let defaultDp = document.getElementById("defaultDp")

        var uid = user.uid;
        firebase.database().ref(`restaurant/${uid}`)
        .once('value',(data)=>{
            
            restaurantname.innerHTML =  data.val().Restaurantname
            email.innerHTML = data.val().Email
            country.innerHTML = data.val().Country
            city.innerHTML = data.val().City
            if(data.val().profilepic != null){
                defaultDp.setAttribute("src",`${data.val().profilepic}`)

            }
        })
     // ...
    } else {
        window.location = "restaurantlogin.html"
        // User is signed out
      // ...
    }
  });


  let logout = ()=>{
      firebase.auth().signOut()
      .then((res) =>{
          window.location = "restaurantlogin.html"
      } )
  }
  


  let uploadFiles = (file) => {
            return new Promise((resolve, reject) => {
                let storageRef = firebase.storage().ref(`recipepic/${file.name}`);
                
                // let progress1 = document.getElementById("progress"); // let bar = document.getElementById("bar");  // progress1.style.display = "block"
                let uploading = storageRef.put(file)
                uploading.on('state_changed',
                    (snapshot) => {
                        // var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;         // bar.style.width = Math.round(progress.toFixed()) + "%";           // bar.innerHTML = Math.round(progress.toFixed()) + "%";
                        switch (snapshot.state) {
                            case firebase.storage.TaskState.PAUSED:
                                console.log('Upload is paused');
                                break;
                            case firebase.storage.TaskState.RUNNING:
                                console.log('Upload is running');
                                break;
                        }
                    },
                    (error) => {
                        reject(error)
                    },
                    () => {
                        uploading.snapshot.ref.getDownloadURL().then((downloadURL) => {
                            resolve(downloadURL)
                        });
                    }
                );
            })
        }
    
  
        
  
  let updateProfile = async ()=>{
    let defaultDp = document.getElementById("defaultDp")
    let profilepic = document.getElementById("profilepic")
    let closebtn = document.getElementById("closebtn")
    let profilePicUrl = await uploadFiles1(profilepic.files[0])  
    console.log(profilePicUrl)
    firebase.auth().onAuthStateChanged((user) => {
        firebase.database().ref(`restaurant/${user.uid}`).update({profilepic: profilePicUrl})
        .then(()=>{
            closebtn.click()
            defaultDp.setAttribute("src",`${profilePicUrl}`)
        })
    
    })
        
  } 
   
  
//   firebase.auth().onAuthStateChanged((user) => {
//       firebase.database().ref(`restaurant/${user.uid}/dishes`).push({})
//       .then(()=>{
//           closebtn.click()
//           defaultDp.setAttribute("src",`${profilePicUrl}`)
//       })
  
//   })
      
       
  
  

  let Dish = async ()=>{
    let dishcategory = document.getElementById("dishcategory")
    let dishname = document.getElementById("dishname")
    let dishprice = document.getElementById("dishprice")
    let dishpic = document.getElementById("dishpic")
    let deliverytype = document.getElementById("deliverytype")
    let picUrl = await uploadFiles(dishpic.files[0])  
    let closebtn = document.getElementById("closebtn1")
    
   
    let dishcard = document.getElementById("dishcard")
    
    let card = ` <div class="card" style="width: 18rem;">
                      <img  src="${picUrl}" alt="...">
                      <div class="card-body">
                        <h5   class="card-title">${dishname.value}</h5>
                        <h6  >Rs: ${dishprice.value} </h6>
                        <h6>Delivery: ${deliverytype.value} </h6>
                        <h6>Category: ${dishcategory.value} </h6>
                      </div>
                    </div>`   
                    
                    dishcard.innerHTML += card;
                    firebase.auth().onAuthStateChanged((user) => {
                              firebase.database().ref(`restaurant/${user.uid}/dishes`).push({
                                  Dishname: dishname.value,
                                  Dishprice: dishprice.value,
                                  Picurl: picUrl,
                                  Deliverytype: deliverytype.value,
                                  Category: dishcategory.value
                              })
                              .then(()=>{
                                 
                                  closebtn.click()
                                  
                              })
                          
                          })

  }
    

  firebase.auth().onAuthStateChanged((user) => {
   
                     
    if (user) {
        let dishcard = document.getElementById("dishcard")
        dishcard.innerHTML=""
        var uid = user.uid;
        firebase.database().ref(`restaurant/${user.uid}/dishes`)
        .on("child_added",(data)=>{
    
                let card = ` <div class="card" style="width: 18rem;">
                                  <img  src="${data.val().Picurl}" alt="...">
                                  <div class="card-body">
                                    <h5   class="card-title">${data.val().Dishname}</h5>
                                    <h6  >Rs: ${data.val().Dishprice} </h6>
                                    <h6>Delivery: ${data.val().Deliverytype} </h6>
                                    <h6>Category: ${data.val().Category} </h6>
                                  </div>
                                </div>`   
                                
                                dishcard.innerHTML += card;
           
        })
    }
})
