'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.json": "467477158e6c0d8adb1d1f4ff40e0cc6",
"assets/AssetManifest.smcbin": "9f239e93906232a15230c55854f79de6",
"assets/assets/icons/ic_date.svg": "0dbd82f57f447ef48af74261f4ad17d0",
"assets/assets/icons/ic_establishment.svg": "6641b2508eb9cc7af27c45016941de26",
"assets/assets/icons/ic_search.svg": "396d519c18918ed763d741f4ba90243a",
"assets/assets/icons/ic_shopping_bags.svg": "0f2814f7143eec22322612b89da784e2",
"assets/assets/icons/ic_total_client.svg": "d481b65b89e40e7a513c7ae9656d5e7e",
"assets/assets/icons/menu_dashbord.svg": "b2cdf62e9ce9ca35f3fc72f1c1fcc7d4",
"assets/assets/icons/menu_doc.svg": "09673c2879de2db9646345011dbaa7bb",
"assets/assets/icons/menu_notification.svg": "460268d6e4bdeab56538d7020cc4b326",
"assets/assets/icons/menu_profile.svg": "fe56f998a7c1b307809ea3653a1b62f9",
"assets/assets/icons/menu_setting.svg": "d0e24d5d0956729e0e2ab09cb4327e32",
"assets/assets/icons/menu_store.svg": "2fd4ae47fd0fca084e50a600dda008cd",
"assets/assets/icons/menu_task.svg": "1a02d1c14f49a765da34487d23a3093b",
"assets/assets/icons/menu_tran.svg": "6c95fa7ae6679737dc57efd2ccbb0e57",
"assets/assets/images/btn-app-google-play.png": "69970b1220e76c2ee40db1fc04d56d96",
"assets/assets/images/btn-app-store-footer.png": "4042e6eb109f236ae57a375a95a6c535",
"assets/assets/images/ic_avatar.png": "6865e506abdcd407c35dc0fa9e029804",
"assets/assets/images/ic_canceled.png": "e46353bb326c09674abc3e1bd7092483",
"assets/assets/images/ic_confirmed.png": "83121f9b7b4207b56f7458852cff14de",
"assets/assets/images/ic_cupom.png": "555ea9aa3adb4606cc34ad1713190f41",
"assets/assets/images/ic_delivered.png": "c261cc39bad9c49ba1352b814c90f6c2",
"assets/assets/images/ic_dialog_sucess.png": "89b94f8fdeb9425c2b8c479e56ce32df",
"assets/assets/images/ic_divergence.png": "b0d61138747bd687111f187d09dc989b",
"assets/assets/images/ic_empty_debit_card.png": "3f8309a39dec13cbfe74c7f5f24766e0",
"assets/assets/images/ic_entrega_de_pacote.png": "6b14b7e83c407ac3df812e5cb623ef78",
"assets/assets/images/ic_facebook_64.png": "f2a4aa462edaacb1c4a1d7f6d5236cff",
"assets/assets/images/ic_failed_to_deliver.png": "653c822bac843c59a2671ff9c4144655",
"assets/assets/images/ic_instagram_64.png": "b733e8b343bf70b78c9274bb2cddac9c",
"assets/assets/images/ic_list_empty.png": "9082f48214a962ae94f1489dc0b9d72e",
"assets/assets/images/ic_out_for_delivery.png": "9c36a8595b09e61be2f38407cdee97f6",
"assets/assets/images/ic_payment.png": "a1cc55d12df803b2e06913de484fb7a7",
"assets/assets/images/ic_pending.png": "0a2ba7b234fbefb492cb22991b4deab7",
"assets/assets/images/ic_processing.png": "c4a5d92a3421b888138b7c0d35a9175f",
"assets/assets/images/ic_returned.png": "658d5158eb0802f5c8f6a36978b712d4",
"assets/assets/images/ic_site.png": "076e1ee42fe1e79952574f659abdf557",
"assets/assets/images/ic_taxa_entrega.png": "84d312af527a302bb101fc8724b9810a",
"assets/assets/images/ic_whatsapp_64.png": "c7411093c241247d3fc09ca0f7d2923c",
"assets/assets/images/ic_youtube_64.png": "57c89647222aaabdddf97bed4fe4177a",
"assets/assets/images/sem_imagem.png": "9e744549b6aa59968c3e818504b1ceba",
"assets/assets/images/social-face.png": "1ca0a8be83d713585feda6c80ef5c0bb",
"assets/assets/images/social-insta.png": "6497857afc43581727313f8cc2f6a151",
"assets/assets/images/social-linkedin.png": "e7b68f1689537c70a6ab5fe5704997df",
"assets/assets/images/social-youtube.png": "e01cbbda384799b6a0ed0d156392ea79",
"assets/assets/images/store_apple.png": "eead95cb97c074c1e495dc6443876599",
"assets/assets/images/store_play.png": "4d75963cc0937626ce316aef3688308d",
"assets/assets/images/sua_marca.png": "a98249d25bf51d184fbfc5706a281b02",
"assets/assets/logo/ic_launcher.png": "201c04d06ce732901de4717334c26677",
"assets/assets/svg/about.svg": "257f7763607ca50f2f4eeced093a323e",
"assets/assets/svg/ajuda.svg": "56585c36a3c03feea10936fb6fb6a924",
"assets/assets/svg/contatc.svg": "1dd4a8d75ab29da95cfe300d0dc6f5b1",
"assets/assets/svg/delivery-man.svg": "ba6e7eab885ea9274621fc954d469d1b",
"assets/assets/svg/home.svg": "028ec20297111a6df0a6fc94667ca3a8",
"assets/assets/svg/icon-key.svg": "0e2567b3d73aa377d11c739532ebf07a",
"assets/assets/svg/login.svg": "d26913f12cfc6d5008b222d82773981d",
"assets/assets/svg/register.svg": "f4cc12de46b09fa1ef3db289f2e4c95b",
"assets/FontManifest.json": "5a32d4310a6f5d9a6b651e75ba0d7372",
"assets/fonts/MaterialIcons-Regular.otf": "7d167c34c74426e39fdd7c279cfd68d8",
"assets/icons/media.svg": "059dfe46bd2d92e30bf361c2f7055c3b",
"assets/icons/menu_dashbord.svg": "b2cdf62e9ce9ca35f3fc72f1c1fcc7d4",
"assets/icons/menu_doc.svg": "09673c2879de2db9646345011dbaa7bb",
"assets/icons/menu_notification.svg": "460268d6e4bdeab56538d7020cc4b326",
"assets/icons/menu_profile.svg": "fe56f998a7c1b307809ea3653a1b62f9",
"assets/icons/menu_setting.svg": "d0e24d5d0956729e0e2ab09cb4327e32",
"assets/icons/menu_store.svg": "2fd4ae47fd0fca084e50a600dda008cd",
"assets/icons/menu_task.svg": "1a02d1c14f49a765da34487d23a3093b",
"assets/icons/menu_tran.svg": "6c95fa7ae6679737dc57efd2ccbb0e57",
"assets/icons/Search.svg": "396d519c18918ed763d741f4ba90243a",
"assets/images/ic_site.png": "076e1ee42fe1e79952574f659abdf557",
"assets/images/social-face.png": "1ca0a8be83d713585feda6c80ef5c0bb",
"assets/images/social-insta.png": "6497857afc43581727313f8cc2f6a151",
"assets/images/social-linkedin.png": "e7b68f1689537c70a6ab5fe5704997df",
"assets/images/social-youtube.png": "e01cbbda384799b6a0ed0d156392ea79",
"assets/images/store_apple.png": "eead95cb97c074c1e495dc6443876599",
"assets/images/store_play.png": "4d75963cc0937626ce316aef3688308d",
"assets/loading.gif": "97dd708ae3b62c15671a8c715a762482",
"assets/NOTICES": "87a80abbd7fe13067fe969e1c1021868",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "57d849d738900cfd590e9adc7e208250",
"assets/packages/flex_color_picker/assets/opacity.png": "49c4f3bcb1b25364bb4c255edcaaf5b2",
"assets/packages/flutter_signin_button/assets/logos/2.0x/facebook_new.png": "83bf0093719b2db2b16e2839aee1069f",
"assets/packages/flutter_signin_button/assets/logos/2.0x/google_dark.png": "937022ea241c167c8ce463d2ef7ed105",
"assets/packages/flutter_signin_button/assets/logos/2.0x/google_light.png": "8f10eb93525f0c0259c5e97271796b3c",
"assets/packages/flutter_signin_button/assets/logos/3.0x/facebook_new.png": "12531aa3541312b7e5ddd41223fc60cb",
"assets/packages/flutter_signin_button/assets/logos/3.0x/google_dark.png": "ac553491f0002941159b405c2d37e8c6",
"assets/packages/flutter_signin_button/assets/logos/3.0x/google_light.png": "fe46d37e7d6a16ecd15d5908a795b4ee",
"assets/packages/flutter_signin_button/assets/logos/facebook_new.png": "e1dff5c319a9d7898aee817f624336e3",
"assets/packages/flutter_signin_button/assets/logos/google_dark.png": "c32e2778b1d6552b7b4055e49407036f",
"assets/packages/flutter_signin_button/assets/logos/google_light.png": "f71e2d0b0a2bc7d1d8ab757194a02cac",
"assets/packages/font_awesome_flutter/lib/fonts/fa-brands-400.ttf": "b37ae0f14cbc958316fac4635383b6e8",
"assets/packages/font_awesome_flutter/lib/fonts/fa-regular-400.ttf": "5178af1d278432bec8fc830d50996d6f",
"assets/packages/font_awesome_flutter/lib/fonts/fa-solid-900.ttf": "aa1ec80f1b30a51d64c72f669c1326a7",
"assets/shaders/ink_sparkle.frag": "f8b80e740d33eb157090be4e995febdf",
"canvaskit/canvaskit.js": "76f7d822f42397160c5dfc69cbc9b2de",
"canvaskit/canvaskit.wasm": "f48eaf57cada79163ec6dec7929486ea",
"canvaskit/chromium/canvaskit.js": "8c8392ce4a4364cbb240aa09b5652e05",
"canvaskit/chromium/canvaskit.wasm": "fc18c3010856029414b70cae1afc5cd9",
"canvaskit/skwasm.js": "1df4d741f441fa1a4d10530ced463ef8",
"canvaskit/skwasm.wasm": "6711032e17bf49924b2b001cef0d3ea3",
"canvaskit/skwasm.worker.js": "19659053a277272607529ef87acf9d8a",
"favicon.png": "4118e7589a4ee7e490907df698e16d8e",
"flutter.js": "6b515e434cea20006b3ef1726d2c8894",
"icons/Icon-192.png": "e0032f484d2da9e898be7e8a2f446065",
"icons/Icon-512.png": "21615e98184fb4b6a7f1a5ee96bf8b82",
"index.html": "f22a8e016af223e53beec8ad615b86ee",
"/": "f22a8e016af223e53beec8ad615b86ee",
"main.dart.js": "79ae6bdd70e66db06f107e645ff7f9ca",
"manifest.json": "fa1973695df988758be4cfedb2e7dfb3",
"version.json": "e9eb58db72d407be27e9fa052224c304"};
// The application shell files that are downloaded before a service worker can
// start.
const CORE = ["main.dart.js",
"index.html",
"assets/AssetManifest.json",
"assets/FontManifest.json"];

// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});
// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        // Claim client to enable caching on first launch
        self.clients.claim();
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      // Claim client to enable caching on first launch
      self.clients.claim();
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});
// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache only if the resource was successfully fetched.
        return response || fetch(event.request).then((response) => {
          if (response && Boolean(response.ok)) {
            cache.put(event.request, response.clone());
          }
          return response;
        });
      })
    })
  );
});
self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});
// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}
// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
