function getOrCreateUserId() {
    const cookieName = "customer_id=";

    const cookies = document.cookie.split(';');
    const existingCookie = cookies.find(c => c.trim().startsWith(cookieName));
    if (existingCookie) {
        return existingCookie.replace(cookieName, '');
    }
    else {
        const newId = crypto.randomUUID();
        document.cookie = `customer_id=${newId}; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT`;    
        return newId;
    }
}

async function loadSlider(){
    const slides = document.querySelectorAll(".swiper-slide");
    for (const slide of slides) {
            temp = Math.floor(Math.random() * 1000) + 1;
            const response = await fetch("/anime");
            const data =  await response.json();

            slide.querySelector(".anime-img").src = data[temp].large_image;
            slide.querySelector(".anime-title").textContent = data[temp].title;
            slide.querySelector(".anime-title").id = data[temp].mal_id;
            slide.querySelector(".anime-ranking").textContent += data[temp].rank.split('.')[0];
            slide.querySelector(".anime-genre").textContent += data[temp].genres;
            slide.querySelector(".anime-theme").textContent = data[temp].themes;
            slide.querySelector(".anime-synopsis").textContent = data[temp].synopsis;
            slide.querySelector(".anime-link").href = data[temp].url;
        }
}

async function addToWatchlist() {
    const activeSlide = document.querySelector(".swiper-slide-active");
    const anime_id = Number(activeSlide.querySelector(".anime-title").id);
    const customerID = getOrCreateUserId();

    anime = {
        customer_id: customerID,
        mal_id: anime_id,
        date_added : new Date().toISOString()
    }

    const response = await fetch("/add_to_watchlist", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(anime)
    });
    watchlistRefresh();
}  

async function watchlistRefresh() {
    let page = 0;
    const pageSize = 10;

    try {
        const customerId = getOrCreateUserId();
        
        const responseData = await fetch(`/getWatchlist?customer_id=${customerId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(r => r.json());

        const watchlistArray = responseData.data || responseData || [];
        if (!Array.isArray(watchlistArray)) {
            console.error("Watchlist data did not return an array:", responseData);
            return;
        }

        const container = document.querySelector("#WatchList");
        if (!container) return;
        container.innerHTML = "";

        const start = page * pageSize;
        const end = start + pageSize;
        const items = watchlistArray.slice(start, end);
        
        for (const anime of items) {
            if (!anime || !anime.mal_id) continue;

            try {
                const animeDetails = await fetch(`/animeById?mal_id=${anime.mal_id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then(r => r.json());

                if (!animeDetails) continue;
                
                container.innerHTML += `
                <div class="watch-card">
                    <img src="${animeDetails.small_image || ''}">
                    <h3>${animeDetails.title || 'Unknown Title'}</h3>
                </div>`;

            } catch (singleAnimeError) {
                console.error(`Failed to fetch details for anime ID ${anime.mal_id}:`, singleAnimeError);
            }
        }
    } catch (globalNetworkError) {
        console.error("Critical error inside watchlistRefresh:", globalNetworkError);
    }
}

async function findRandomAnime() {
    document.getElementById("warning").textContent = "";
    const data = await fetch("/filteredAnime", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            genres: genreSelect.getValue(),
            themes: themeSelect.getValue(),
            minScore: document.getElementById("min-score").value || 0,
            maxScore: document.getElementById("max-score").value || 10
        })
    }).then(r => r.json());

    if (!data || data.length === 0) {
        document.getElementById("warning").textContent = "That Didn't Work, Try Again!";
        return;
    }

    const temp = Math.floor(Math.random() * data.length);

    document.querySelector(".anime-img").src = data[temp].large_image;
    document.querySelector(".anime-title").textContent = data[temp].title;
    document.querySelector(".anime-title").id = data[temp].mal_id;
    document.querySelector(".anime-ranking").textContent = `Ranked: #${data[temp].rank.split('.')[0]}`;
    document.querySelector(".anime-genre").textContent = `Genres: ${data[temp].genres}`;
    document.querySelector(".anime-theme").textContent = `Themes: ${data[temp].themes}`;
    document.querySelector(".anime-synopsis").textContent = data[temp].synopsis;
    document.querySelector(".anime-link").href = data[temp].url;
}   