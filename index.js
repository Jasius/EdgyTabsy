'use strict';

const kPermissionObj = {
  permissions: ['topSites']
};

const topSitesDiv = document.getElementById('topSites');

function createTop() {
  chrome.topSites.get(function (topSites) {
    console.table(topSites)
    topSites.forEach(function (site) {
      const siteTab = document.createElement('div'),
        url = document.createElement('a'),
        span = document.createElement('p'),
        hostname = (new URL(site.url)).hostname,
        image = document.createElement('img');
      siteTab.className = 'topSite';
      url.href = site.url;
      span.innerText = site.title;
      image.title = site.title;
      image.src = 'https://logo.clearbit.com/' + hostname;
      // image.src = 'chrome://favicon/https://' + hostname; //"chrome://favicon/"
      url.appendChild(image);
      url.appendChild(span);
      siteTab.appendChild(url);
      topSitesDiv.appendChild(siteTab);
    })
  })
};

chrome.permissions.contains({
  permissions: ['topSites']
}, function (result) {
  if (result) {
    createTop();
  } else {
    const permissionsAccessCTA = document.createElement('button');
    permissionsAccessCTA.innerText = 'Allow Extension to Access Top Sites';
    permissionsAccessCTA.addEventListener('click', function () {
      chrome.permissions.request(kPermissionObj, function (granted) {
        if (granted) {
          console.info('granted');
          topSitesDiv.innerText = '';
          createTop();
        } else {
          console.info('not granted');
        }
      });
    });
    topSitesDiv.appendChild(permissionsAccessCTA);
  }
});