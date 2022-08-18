// jsonbin
const URL = "https://api.jsonbin.io/v3/b/62fd7077a1610e6386034788?meta=false";
// json-server
// const URL = "http://localhost:3000/";

let allCourses = {};
let loading = true;

fetch(URL)
  .then((res) => res.json())
  .then((courses) => {
    allCourses = courses;
    setTimeout(() => {
      loading = false;
      for (const [key, value] of Object.entries(allCourses)) {
        renderCourses(
          value.map((crs) => crs.id),
          key
        );
      }
    }, 0);
  })
  .catch((err) => {
    console.log(err);
    alert("Error loading courses");
  });

document.querySelector("form").onsubmit = (e) => {
  e.preventDefault();
  if (loading) {
    alert("Courses are not fetched yet");
    return;
  }
  const keyword = e.target.querySelector("input").value;
  searchCourses(keyword);
};

// Throttling
/* ref: stackoverflow-4220126 */

// let typingTimer;
// var doneTypingInterval = 1000;

// document.getElementById("query").onkeyup = (e) => {
//   clearTimeout(typingTimer);
//   const value = e.target.value;
//   typingTimer = setTimeout((_) => {
//     if (loading) return;
//     searchCourses(value);
//   }, doneTypingInterval);
// };

const searchCourses = (keyword) => {
  for (const [key, value] of Object.entries(allCourses)) {
    const ids = value
      .filter((course) =>
        course.title.toLowerCase().includes(keyword.toLowerCase())
      )
      .map((crs) => crs.id);
    renderCourses(ids, key);
  }
};

const renderCourses = (ids, category) => {
  const courses = getListOfCourses(ids, category);
  renderMediaQueries(category, courses);
};

const getListOfCourses = (ids, category) => {
  if (loading) {
    alert("Courses have not been loaded yet");
    return null;
  }

  const coursesDOM = [];
  for (course of allCourses[category]) {
    if (ids.filter((id) => id === course.id).length === 0) continue;
    // image element
    const image = document.createElement("img");
    image.src = course.image;
    image.alt = course.title;

    // title element
    const title = document.createElement("h2");
    title.innerText = course.title;

    // author element
    const author = document.createElement("p");
    author.innerText = course.author;

    // rating score
    const ratingScore = document.createElement("span");
    ratingScore.classList.add("score");
    ratingScore.innerText = course.rating.score;

    // rating stars
    const ratingStars = [];
    let { score } = course.rating;
    while (score >= 1) {
      const fullStar = document.createElement("i");
      fullStar.classList.add("fa-solid", "fa-star");
      ratingStars.push(fullStar);
      score--;
    }
    if (score > 0) {
      const halfStar = document.createElement("i");
      halfStar.classList.add("fa-solid", "fa-star-half-stroke");
      ratingStars.push(halfStar);
    }
    while (ratingStars.length < 5) {
      const emptyStar = document.createElement("i");
      emptyStar.classList.add("fa-regular", "fa-star");
      ratingStars.push(emptyStar);
    }

    // rating reviews
    const ratingReviews = document.createElement("span");
    ratingReviews.classList.add("reviews");
    ratingReviews.innerText = `(${course.rating.reviews.toLocaleString(
      "en-US"
    )})`;

    // rating element
    const rating = document.createElement("span");
    rating.classList.add("rating");
    rating.append(ratingScore, ...ratingStars, ratingReviews);

    // price element
    const price = document.createElement("p");
    price.classList.add("price");
    price.innerText = `E£${course.price.toLocaleString("en-US", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2
    })}`;

    // course card
    const courseCard = document.createElement("a");
    courseCard.href = "#";
    courseCard.classList.add("course-card");
    courseCard.append(image, title, author, rating, price);

    coursesDOM.push(courseCard);
  }
  return coursesDOM;
};

window.matchMedia("(min-width: 1200px)").addListener((e) => {
  renderMediaQueries();
});
window.matchMedia("(min-width: 992px)").addListener((e) => {
  renderMediaQueries();
});
window.matchMedia("(min-width: 768px)").addListener((e) => {
  renderMediaQueries();
});
window.matchMedia("(min-width: 576px)").addListener((e) => {
  renderMediaQueries();
});
window.matchMedia("(max-width: 575.98px)").addListener((e) => {
  renderMediaQueries();
});

const renderMediaQueries = (category, listOfCourses) => {
  const sizeMap = {
    XS: 1,
    SS: 2,
    MD: 3,
    LG: 4,
    XL: 5
  };

  let size = "";

  if (window.matchMedia("(min-width: 1200px)").matches) size = "XL";
  else if (window.matchMedia("(min-width: 992px)").matches) size = "LG";
  else if (window.matchMedia("(min-width: 768px)").matches) size = "MD";
  else if (window.matchMedia("(min-width: 576px)").matches) size = "SS";
  else size = "XS";

  for (const [key, _] of category === undefined
    ? Object.entries(allCourses)
    : [[category, ""]]) {
    const courseList =
      listOfCourses ||
      document.getElementById(key).getElementsByClassName("course-card");
    const carouselItems = [];
    let j = 0;
    for (let i = 0; i < Math.ceil(courseList.length / sizeMap[size]); i++) {
      const carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel-item");
      if (i == 0) carouselItem.classList.add("active");
      carouselItem.innerHTML = '<div class="wrapper"></div>';
      for (let _ = 0; _ < sizeMap[size]; _++) {
        if (j == courseList.length) break;
        carouselItem.getElementsByClassName("wrapper")[0].innerHTML +=
          courseList[j++].outerHTML;
      }
      carouselItems.push(carouselItem);
    }

    const carouselInner = document.createElement("div");
    carouselInner.classList.add("carousel-inner");
    carouselItems.map((item) => carouselInner.append(item));

    if (
      document.getElementById(key).getElementsByClassName("wrapper").length > 0
    )
      document
        .getElementById(key)
        .getElementsByClassName("wrapper")[0]
        .remove();
    if (
      document.getElementById(key).getElementsByClassName("carousel").length > 0
    )
      document
        .getElementById(key)
        .getElementsByClassName("carousel")[0]
        .remove();
    const randomID = "carousel" + parseInt(Math.random() * 10000);
    const carouselHTML =
      carouselInner.outerHTML +
      ` <a
          class="carousel-control-prev"
          href="#${randomID}"
          role="button"
          data-slide="prev"
        >
          <span
            class="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
          <span class="sr-only">Previous</span>
        </a>
        <a
          class="carousel-control-next"
          href="#${randomID}"
          role="button"
          data-slide="next"
        >
          <span
            class="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
          <span class="sr-only">Next</span>
        </a>`;
    const carouselElement = document.createElement("div");
    carouselElement.id = `${randomID}`;
    carouselElement.classList.add("carousel", "slide");
    carouselElement.dataset.ride = "carousel";
    carouselElement.innerHTML = carouselHTML;

    document.getElementById(key).appendChild(carouselElement);
  }
};

$("#myTab a").on("click", function (e) {
  e.preventDefault();
  $(this).tab("show");
  if (!loading)
    for (const [key, value] of Object.entries(allCourses)) {
      renderCourses(
        value.map((crs) => crs.id),
        key
      );
    }
});

$(".carousel").carousel({ interval: false });
