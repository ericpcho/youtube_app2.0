'use strict';
const YOUTUBE_SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search';
const api_key = 'AIzaSyC9NYtV2Dup8S78zqCQ3x1dPjazLRcVIAo';
const STORE = [];
let input=[];
let nextPageToken;
let prevPageToken;

function getDataFromApi(searchTerm, callback, token) {
  const findData = {
    pageToken: token,
    part: 'snippet',
    key: api_key,
    q: searchTerm
  }
  $.getJSON(YOUTUBE_SEARCH_URL, findData, callback);
}

function renderResult(item) {
  nextPageToken ? $(".nextpage-button").removeClass("hidden") : $(".nextpage-button").addClass("hidden")
  prevPageToken ? $(".prevpage-button").removeClass("hidden") : $(".prevpage-button").addClass("hidden")

  return `
  <div class= "imgdiv">
      <a data-videoid="${item.id.videoId}" class="playvideo" href="#"><img src=${item.snippet.thumbnails.medium.url}></a>
      <a class="viewchannel" href="https://www.youtube.com/channel/${item.snippet.channelId}">View Channel</a>
      </div>
  `;
}

function displayYoutubeSearchData(data) {
  console.log(data);
  nextPageToken = data.nextPageToken
  prevPageToken = data.prevPageToken
  data.items.map((item, index) => STORE.push(item));
  const results = STORE.splice(0,5).map(item => renderResult(item));
  $('.js-search-results').html(results);
}

function watchSubmit() {
  $('.js-search-form').submit(event => {
    event.preventDefault();
    const queryTarget = $(event.currentTarget).find('.js-query');
    const query = queryTarget.val();
    input = query;
    // clear out the input
    queryTarget.val("");
    getDataFromApi(query, displayYoutubeSearchData);
    $('.js-search-results').removeClass("hidden");
  });
}

function clickThumbnail(){
  $('.js-search-results').on("click", ".playvideo", event => {
    const videoId = $(event.currentTarget).data('videoid')
    $(".js-lightbox-display").html(`<iframe width="560" height="315" src="https://www.youtube.com/embed/${videoId}" frameborder="0" allowfullscreen></iframe>`)
  })
}

function nextPage(){
  $('.main').on("click", ".nextpage-button", event => {
    getDataFromApi(input, displayYoutubeSearchData, nextPageToken);
  })
}

function previousPage(){
  $('.main').on("click", ".prevpage-button", event => {
    getDataFromApi(input, displayYoutubeSearchData, prevPageToken);
  })
}

function handleEvents() {
  watchSubmit();
  clickThumbnail();
  nextPage();
  previousPage();
}

$(handleEvents);