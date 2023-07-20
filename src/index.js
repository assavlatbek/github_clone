import "./styles.css";
async function searchUsers(query) {
  try {
    const response = await fetch(
      `https://api.github.com/search/users?q=${query}`
    );
    const data = await response.json();
    return data.items;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

// Function to display user profile details
function displayUserProfile(user) {
  // Create a container to display user profile details
  const profileContainer = document.createElement("div");
  profileContainer.classList.add("profile-container");

  // Build the HTML to display user profile details
  const profileHTML = `
      <img src="${user.avatar_url}" alt="${user.login}" class="avatar">
      <h2>${user.login}</h2>
      <p>Followers: ${user.followers}</p>
      <p>Public Repositories: ${user.public_repos}</p>
      <a href="${user.html_url}" target="_blank">View Profile</a>
    `;

  profileContainer.innerHTML = profileHTML;

  // Append the profile container to the main container
  const mainContainer = document.querySelector(".container");
  mainContainer.innerHTML = "";
  mainContainer.appendChild(profileContainer);
}

// Function to handle the search form submission
async function handleSearchFormSubmit(event) {
  event.preventDefault();
  const searchInput = document.querySelector("#search-input");
  const query = searchInput.value.trim();

  if (query !== "") {
    const users = await searchUsers(query);
    displaySearchResults(users);
  }
}

// Function to display search results
function displaySearchResults(users) {
  // Create a container to display search results
  const searchResultsContainer = document.createElement("div");
  searchResultsContainer.classList.add("search-results-container");

  // Build the HTML to display the search results
  const usersHTML = users
    .map(
      (user) => `
          <div class="user-card" data-username="${user.login}">
            <img src="${user.avatar_url}" alt="${user.login}" class="user-avatar">
            <h3>${user.login}</h3>
          </div>
        `
    )
    .join("");

  searchResultsContainer.innerHTML = usersHTML;

  // Clear the main container and append the search results container
  const mainContainer = document.querySelector(".container");
  mainContainer.innerHTML = "";
  mainContainer.appendChild(searchResultsContainer);

  // Add event listeners to the user cards for showing user profiles
  const userCards = document.querySelectorAll(".user-card");
  userCards.forEach((userCard) => {
    userCard.addEventListener("click", handleUserProfileClick);
  });
}

// Function to handle a user profile click
async function handleUserProfileClick(event) {
  const username = event.currentTarget.dataset.username;
  const user = await fetch(`https://api.github.com/users/${username}`).then(
    (res) => res.json()
  );
  displayUserProfile(user);
}

// Add event listener to the search form
const searchForm = document.querySelector("#search-form");
searchForm.addEventListener("submit", handleSearchFormSubmit);

document
  .querySelector(".reload")
  .addEventListener("click", () => location.reload());
