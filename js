let postsData = "";
let currentFilters = {
  language: [],
  genre: [],
  media_type: []
};


const postsContainer = document.querySelector("#posts-container");
const languageContainer = document.querySelector("#post-language");
const genreContainer = document.querySelector("#post-genre");
const media_typeContainer = document.querySelector("#post-media_type");
const postCount = document.querySelector("#post-count");
const noResults = document.querySelector("#no-results");

fetch(
  "/cardcatalogue.json"
).then(async (response) => {
  postsData = await response.json();
  postsData.map((post) => createPost(post));
  postCount.innerText = postsData.length;


  languageData = [
    ...new Set(
      postsData
        .map((post) => post.language)
        .reduce((acc, curVal) => acc.concat(curVal), [])
    )
  ];
  languageData.map((language) =>
    createFilter("language", language, languageContainer)
  );
  

  genreData = [
    ...new Set(
      postsData
        .map((post) => post.genre)
        .reduce((acc, curVal) => acc.concat(curVal), [])
    )
  ];
  genreData.map((genre) =>
    createFilter("genre", genre, genreContainer)
  );

  media_typeData = [
    ...new Set(
        postsData
        .map((post) => post.media_type)
        .reduce((acc, curVal) => acc.concat(curVal), [])
    )
  ];
  media_typeData.map((media_type) => 
    createFilter("media_type", media_type, media_typeContainer)
  );
});



const createPost = (postData) => {
  const { title, link, image, genre, language, media_type } = postData;
  const post = document.createElement("div");
  post.className = "post";
  post.innerHTML = `
      <a class="post-preview" href="${link}" target="_blank">
        <img class="post-image" width="300" src="${image}">
      </a>
      <div class="post-content">
        <p class="post-title">${title}</p>
        <div class="post-tags">
          ${genre
            .map((genre) => {
              return '<span class="post-tag">' + genre + "</span>";
            })
            .join("")}
        </div>
        <div class="post-footer">
          <span class="post-tags">${language}</span>
          <span class="post-media_type">${media_type}</span>
        </div>
      </div>
  `;

  postsContainer.append(post);
};

const createFilter = (key, param, container) => {
  const filterButton = document.createElement("button");
  filterButton.className = "filter-button";
  filterButton.innerText = param;
  filterButton.setAttribute("data-state", "inactive");
  filterButton.addEventListener("click", (e) =>
    handleButtonClick(e, key, param, container)
  );

  container.append(filterButton);
};

const handleButtonClick = (e, key, param, container) => {
  const button = e.target;
  const buttonState = button.getAttribute("data-state");
  if (buttonState == "inactive") {
    button.classList.add("is-active");
    button.setAttribute("data-state", "active");
    currentFilters[key].push(param);
    handleFilterPosts(currentFilters);
  } else {
    button.classList.remove("is-active");
    button.setAttribute("data-state", "inactive");
    currentFilters[key] = currentFilters[key].filter((item) => item !== param);
    handleFilterPosts(currentFilters);
  }
};

const handleFilterPosts = (filters) => {
  let filteredPosts = [...postsData];
  let filterKeys = Object.keys(filters);

  filterKeys.forEach((key) => {
    let currentKey = filters[key]
    if (currentKey.length <= 0) {
      return;
    }

    filteredPosts = filteredPosts.filter((post) => {
      let currentValue = post[key]
      return Array.isArray(currentValue)
        ? currentValue.some((val) => currentKey.includes(val))
        : currentKey.includes(currentValue);
    });
  });

  //   if (filters.genre.length > 0) {
  //     filteredPosts = filteredPosts.filter((post) =>
  //       post.genre.some((genre) => {
  //         return filters.genre.includes(genre);
  //       })
  //     );
  
  //     // filteredPosts = filteredPosts.filter((post) =>
  //     //   filters.genre.every((filter) => {
  //     //     return post.genre.includes(filter);
  //     //   })
  //     // );
  //   }

  //   if (filters.media_type.length > 0) {
  //     filteredPosts = filteredPosts.filter((post) =>
  //       filters.media_type.includes(post.media_type)
  //     );
  //   }

  postCount.innerText = filteredPosts.length;

  if (filteredPosts.length == 0) {
    noResults.innerText = "Sorry, we couldn't find any results.";
  } else {
    noResults.innerText = "";
  }

  postsContainer.innerHTML = "";
  filteredPosts.map((post) => createPost(post));
};
