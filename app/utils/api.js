const axios = require('axios');

// var id = "";
// var secret = "";
// var params = "?client_id=" + id + "&client_secret=" + sec;

getProfile = (username) => {
	return axios.get(`https://api.github.com/users/${username}`)
		.then(({ data }) => data);
}

getRepos = (username) => axios.get(`https://api.github.com/users/${username}/repos?per_page=100`)

getStarCount = (repos) => repos.data.reduce((count, { stargazers_count }) => count + stargazers_count, 0)

calculateScore = ({ followers }, repos) => (followers * 3) + getStarCount(repos)

handleError = (error) => console.warn(error) || null

getUserData = (player) => {
	return Promise.all([
		getProfile(player),
		getRepos(player)
	]).then(([profile, repos]) => ({
			profile: profile,
			score: calculateScore(profile, repos)
		}))
}

sortPlayers = (players) => players.sort((a,b) => b.score - a.score)

module.exports = {
	battle(players) {
		return Promise.all(players.map(getUserData))
			.then(sortPlayers)
			.catch(handleError)
	},
  fetchPopularRepos(language) {
    const encodedURI = window.encodeURI(`https://api.github.com/search/repositories?q=stars:>1+language:${language}&sort=stars&order=desc&type=Repositories`);
    return axios.get(encodedURI)
      .then(({ data }) => data.items)
  }
}
