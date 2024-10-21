const getCategories = async () => {
    const { data } = await axios.get(`https://dummyjson.com/products/category-list`);
    return data;
}

const displayCategories = async () => {
    const loader = document.querySelector(".loader-container");
    loader.classList.add("active");
    try {
        const categories = await getCategories();
        const result = categories.map(category => {
            return `
        <div class="category">
         <h2>${category}</h2>
         <a href="categoryDetails.html?category=${category}">Details</a>
        </div>`;
        }).join('');

        document.querySelector(".categories .row").innerHTML = result;

    } catch (error) {
        document.querySelector(".categories .row").innerHTML = `<p>Something went wrong</p>`;

    } finally {
        loader.classList.remove("active");
    }
}

const getProducts = async (page) => {
    const skip = (page - 1) * 30;
    const { data } = await axios.get(`https://dummyjson.com/products?limit=30&skip=${skip}`);
    return data;
}

const displayProducts = async (page = 1) => {
    const loader = document.querySelector(".loader-container");
    loader.classList.add("active");
    try {
        const data = await getProducts(page);
        const numberofPages = Math.ceil(data.total / 30);
        const result = data.products.map((product) => {
            return `
       <div class="product">
        <img src="${product.thumbnail}" alt="${product.description}" class="images"/>
        <h3 class="names">${product.title}</h3>
        <span class="pricses">${product.price}$</span>
       </div>
       `
        }).join('');
        document.querySelector(".products .row").innerHTML = result;
        let paginationLink = ``;
       if (page == 1){
        paginationLink += `<li class="page-item"><button  class="page-link" disabled>&laquo;</button></li>`;
       }else{
        paginationLink += `<li class="page-item"><button onclick=displayProducts(${page-1}) class="page-link" >&laquo;</button></li>`;
       }
        for (let i = 1; i <= numberofPages; i++) {
            paginationLink += `<li class="page-item"><button onclick=displayProducts(${i}) class="page-link ${i == page?'active':''}" >${i}</button></li>`;
        }
        if (page == numberofPages){
            paginationLink += ` <li class="page-item"><button class="page-link" disabled>&raquo;</button></li>`;
        }else{
            paginationLink += ` <li class="page-item"><button onclick=displayProducts(${page+1}) class="page-link" >&raquo;</button></li>`;
        }
        
        document.querySelector(".pagination").innerHTML = paginationLink;

    } catch (error) {
        document.querySelector(".products .row").innerHTML = `<p>Something went wrong</p>`;
    } finally {
        loader.classList.remove("active");
    }

    modal(); 
}


displayCategories();
displayProducts();

window.onscroll = () => {
    const nav = document.querySelector(".header");
    const category = document.querySelector(".categories");
    if (window.scrollY > category.offsetTop) {
        nav.classList.add("scrollNav");
    } else {
        nav.classList.remove("scrollNav");
    }
}

const countdown = () => {
    const date = new Date("2025-03-01T00:00:00").getTime();
    const now = new Date().getTime();
    const distance = date - now;
    const days = Math.floor(distance / (86400000));
    const hours = Math.floor((distance % (86400000)) / (3600000));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);
    document.querySelector("#days").textContent = days;
    document.querySelector("#hours").textContent = hours;
    document.querySelector("#minutes").textContent = minutes;
    document.querySelector("#seconds").textContent = seconds;
}

setInterval(() => {

    countdown();
}, 1000)


function modal() {

    const modal = document.querySelector(".my_modal");
    const closeBtn = document.querySelector(".close-btn");
    const leftBtn = document.querySelector(".left-btn");
    const rightBtn = document.querySelector(".right-btn");
    const images = Array.from(document.querySelectorAll(".images"));
    const productName=Array.from(document.querySelectorAll(".names"));
    const productPrice=Array.from( document.querySelectorAll(".pricses"));
    
    let currentIndex = 0;

    images.forEach((img) => {
        img.addEventListener("click", (e) => {
            modal.classList.remove("d-none");
            modal.querySelector("img").setAttribute("src", e.target.src);
            currentIndex = images.indexOf(e.target);
            modal.querySelector(".info h3").textContent=productName[currentIndex].textContent;
            modal.querySelector(".info span").textContent=productPrice[currentIndex].textContent;
        });
    });



    closeBtn.addEventListener("click", () => {
        modal.classList.add("d-none");
    });

    leftBtn.addEventListener("click", () => {
        currentIndex--;
        if (currentIndex < 0) {
            currentIndex = images.length - 1;
        }
        const src = images[currentIndex].src;
        modal.querySelector("img").setAttribute("src", src);
        modal.querySelector(".info h3").textContent=productName[currentIndex].textContent;
        modal.querySelector(".info span").textContent=productPrice[currentIndex].textContent;
    });

    rightBtn.addEventListener("click", () => {
        currentIndex++;
        if (currentIndex >= images.length) {
            currentIndex = 0;
        }
        const src = images[currentIndex].src;
        modal.querySelector("img").setAttribute("src", src);
        modal.querySelector(".info h3").textContent=productName[currentIndex].textContent;
        modal.querySelector("info span").textContent=productPrice[currentIndex].textContent;
    })

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            modal.classList.add("d-none");
        } else if (e.key === "ArrowLeft") {
            currentIndex--;
            if (currentIndex < 0) {
                currentIndex = images.length - 1;
            }
            const src = images[currentIndex].src;
            modal.querySelector("img").setAttribute("src", src);
            modal.querySelector("info h3").textContent=productName[currentIndex].textContent;
            modal.querySelector("info span").textContent=productPrice[currentIndex].textContent;
        } else if (e.key === "ArrowRight") {
            currentIndex++;
            if (currentIndex >= images.length) {
                currentIndex = 0;
            }
            const src = images[currentIndex].src;
            modal.querySelector("img").setAttribute("src", src);
            modal.querySelector("info h3").textContent=productName[currentIndex].textContent;
            modal.querySelector("info span").textContent=productPrice[currentIndex].textContent;
        }

    });

}