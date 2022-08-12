// jsonbin
const URL = "https://api.jsonbin.io/v3/b/62f5ba62e13e6063dc76baff?meta=false";
// json-server
// const URL = "http://localhost:3000/";

const allCourses = [];
let loading = true;

fetch(URL)
  .then((res) => res.json())
  .then((courses) => {
    // for jsonbin:
    courses = courses.courses;

    allCourses.push(...courses);
    setTimeout(() => {
      loading = false;
      renderCourses(courses.map((crs) => crs.id));
    }, 2000);
  })
  .catch((err) => {
    alert("Error loading courses");
  });

document.querySelector("form").onsubmit = (e) => {
  e.preventDefault();
  if (loading) {
    alert("Courses are not fetched yet");
    return;
  }
  const value = e.target.querySelector("input").value;
  searchCourses(value);
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

const searchCourses = (value) => {
  const ids = allCourses
    .filter((course) =>
      course.title.toLowerCase().includes(value.toLowerCase())
    )
    .map((course) => course.id);
  renderCourses(ids);
};

const renderCourses = (ids) => {
  if (loading) {
    alert("Courses have not been loaded yet");
    return;
  }

  const wrapper = document.querySelector(".wrapper");
  wrapper.innerHTML = "";
  for (course of allCourses) {
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
    courseCard.classList.add("course-card");
    courseCard.append(image, title, author, rating, price);

    wrapper.append(courseCard);
  }
};
