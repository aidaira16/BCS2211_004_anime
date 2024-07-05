// Function to handle button click
function buttonClicked() {
    var anime = document.getElementById("anime_input").value;
    fetch(`https://api.jikan.moe/v4/anime?q=${anime}`)
    .then(response => response.json())
    .then(data => {
        console.log(data);

        var imagesHtml = '';
        data.data.forEach(anime => {
            var synopsis = anime.synopsis || 'N/A';
            var title = anime.title || 'N/A';
            var score = anime.score || 'N/A';
            var rank = anime.rank || 'N/A';
            var popularity = anime.popularity || 'N/A';
            var genre = anime.genres[0]?.name || 'N/A';
            var producer = anime.producers[0]?.name || 'N/A';
            var source = anime.source || 'N/A';
            var rating = anime.rating || 'N/A';
            var release = anime.aired?.from || 'N/A';
            var schedule1 = anime.aired?.from || 'N/A';
            var schedule2 = anime.aired?.to || 'N/A';
            var link = anime.url || '#';
            var pic = anime.images?.jpg?.image_url || 'N/A';
            var episode = anime.episodes || 'N/A';
            var id = anime.mal_id || 'N/A';

            imagesHtml += `
                <div class="anime-card">
                    <h3>${title}</h3>
                    <img src="${pic}" alt="${title}">
                    <br><br>
                    <button class="moredetail" onclick="showDetailModal('${title}', \`${synopsis}\`, '${score}', '${rank}', '${popularity}', '${genre}', '${producer}', '${source}', '${rating}', '${release}', '${schedule1}', '${schedule2}', '${link}', '${pic}', '${episode}', '${id}')">More Detail</button>
                    <br><br>
                    <button class="addtowatchlist" onclick="addToWatchlist('${title}', \`${synopsis}\`, '${score}', '${rank}', '${popularity}', '${genre}', '${producer}', '${source}', '${rating}', '${release}', '${schedule1}', '${schedule2}', '${link}', '${pic}', '${episode}', '${id}')">Add to Watchlist</button>
                    <br><br>
                </div>
            `;
        });

        document.getElementById("demo1").innerHTML = imagesHtml;
    });
}

// Toggle visibility of the watchlist
function toggleWatchlist() {
    const watchlist = document.getElementById('watchlist');
    if (watchlist.style.display === 'none' || watchlist.style.display === '') {
        watchlist.style.display = 'block';
    } else {
        watchlist.style.display = 'none';
    }
}

// Show detail modal
function showDetailModal(title, synopsis, score, rank, popularity, genre, producer, source, rating, release, schedule1, schedule2, link, pic, episode, id) {
    const modalHtml = `
        <div class="modal-overlay" onclick="closeDetailModal()"></div>
        <div class="modal-content" onclick="event.stopPropagation()">
            <h3>${title}</h3>
            <p><strong>ID:</strong> ${id}</p>
            <img src="${pic}" alt="${title}" style="width: 200px; height: auto;">
            <p><strong>Synopsis:</strong> ${synopsis}</p>
            <p><strong>Score:</strong> ${score}</p>
            <p><strong>Rank:</strong> ${rank}</p>
            <p><strong>Popularity:</strong> ${popularity}</p>
            <p><strong>Genre:</strong> ${genre}</p>
            <p><strong>Producer:</strong> ${producer}</p>
            <p><strong>Source:</strong> ${source}</p>
            <p><strong>Rating:</strong> ${rating}</p>
            <p><strong>Total Episodes:</strong> ${episode}</p>
            <p><strong>Release:</strong> ${release}</p>
            <p><strong>Schedule:</strong> ${schedule1} - ${schedule2}</p>
            <p><a href="${link}" target="_blank">More Info</a></p>
        </div>
    `;

    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    modalContainer.innerHTML = modalHtml;
    document.body.appendChild(modalContainer);

    // Hide other elements if needed (e.g., search results)
    document.body.style.overflow = 'hidden';
}

// Close detail modal
function closeDetailModal() {
    const modalContainer = document.getElementById('modal-container');
    if (modalContainer) {
        document.body.removeChild(modalContainer);
        // Show search results if needed
        document.body.style.overflow = 'auto';
    }
}

// Add anime details to watchlist
function addToWatchlist(title, synopsis, score, rank, popularity, genre, producer, source, rating, release, schedule1, schedule2, link, pic, episode, id) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    console.log('Current Watchlist:', watchlist);

    if (!watchlist.some(anime => anime.title === title)) {
        watchlist.push({ title, synopsis, score, rank, popularity, genre, producer, source, rating, release, schedule1, schedule2, link, pic, episode, id });
        localStorage.setItem('watchlist', JSON.stringify(watchlist));
        alert(`${title} has been added to your watchlist!`);
        displayWatchlist();
    } else {
        alert(`${title} is already in your watchlist!`);
    }
}

// Display watchlist
function displayWatchlist() {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    console.log('Displaying Watchlist:', watchlist);

    let watchlistHtml = watchlist.map((anime, index) => `
        <div class="watchlist-item">
            <span>${watchlist[index].title}</span><br><br>
            <img src="${watchlist[index].pic}" style="width: 100px; height: auto;"><br>
            <h4>Progress: ${watchlist[index].progress}</h4>
            <button class="thedetail" onclick="showDetailModal('${watchlist[index].title}', \`${watchlist[index].synopsis}\`, '${watchlist[index].score}', '${watchlist[index].rank}', '${watchlist[index].popularity}', '${watchlist[index].genre}', '${watchlist[index].producer}', '${watchlist[index].source}', '${watchlist[index].rating}', '${watchlist[index].release}', '${watchlist[index].schedule1}', '${watchlist[index].schedule2}', '${watchlist[index].link}', '${watchlist[index].pic}', '${watchlist[index].episode}', '${watchlist[index].id}')">The Details</button>
            <button class="update" onclick="editWatchlistItem(${index})">Update</button>
            <button class="delete" onclick="deleteFromWatchlist(${index})">Delete</button>
            <br><br>
            <hr>
            <br>
        </div>
    `).join('');

    document.getElementById('watchlist').innerHTML = watchlistHtml;
}

function editWatchlistItem(index) {
    // Create the edit form HTML
    const editFormHtml = `
        <label for="progress">Choose the progress for this selected anime:</label>
        <select id="progress">
            <option value="Plan to Watch">Plan to Watch</option>
            <option value="Watching">Watching</option>
            <option value="Completed">Completed</option>
        </select>
        <br><br>
        <button onclick="saveProgress(${index})">Save</button>
        <button onclick="cancelEdit()">Cancel</button>
    `;

    // Update the HTML of the container
    document.getElementById('edit-form-container').innerHTML = editFormHtml;
}

function saveProgress(index) {
    // Get the selected progress value
    const progress = document.getElementById('progress').value;

    // Get the current watchlist
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

    // Update the progress for the selected item
    if (watchlist[index]) {
        watchlist[index].progress = progress;
    }

    // Save the updated watchlist back to localStorage
    localStorage.setItem('watchlist', JSON.stringify(watchlist));

    alert("The progress have been saved")
    // Clear the edit form
    document.getElementById('edit-form-container').innerHTML = '';

    // Optionally, you could refresh the watchlist display
    displayWatchlist();
}

function cancelEdit() {
    // Clear the edit form
    document.getElementById('edit-form-container').innerHTML = '';
}

// Delete from watchlist
function deleteFromWatchlist(index) {
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist.splice(index, 1);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    displayWatchlist();
}

// Initialize and display watchlist on page load
document.addEventListener('DOMContentLoaded', () => {
    displayWatchlist();
});
