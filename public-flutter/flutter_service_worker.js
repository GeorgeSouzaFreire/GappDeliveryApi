'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';

const RESOURCES = {"assets/AssetManifest.json": "9b87d38c3df94a50af1dc1db3725488f",
"assets/AssetManifest.smcbin": "c9ee420a63b68483a88e317084610fcd",
"assets/assets/icons/Documents.svg": "51896b51d35e28711cf4bd218bde185d",
"assets/assets/icons/doc_file.svg": "552a02a5a3dbaee682de14573f0ca9f3",
"assets/assets/icons/drop_box.svg": "482d2bea0c8bff0db481a84132d4ffae",
"assets/assets/icons/excle_file.svg": "dc91b258ecf87f5731fb2ab9ae15a3ec",
"assets/assets/icons/facebook.svg": "c0cd138271276bb33a87c2d174015455",
"assets/assets/icons/Figma_file.svg": "0ae328b79325e7615054aed3147c81f9",
"assets/assets/icons/folder.svg": "40a82e74e930ac73aa6ccb85d8c5a29c",
"assets/assets/icons/google_drive.svg": "9a3005a58d47a11bfeffc11ddd3567c1",
"assets/assets/icons/ic_clientes.svg": "ae4754d919184210a66d34fa783b8868",
"assets/assets/icons/ic_confirmado.svg": "4f7c153648234291ed845d3c7251ea90",
"assets/assets/icons/ic_date.svg": "0dbd82f57f447ef48af74261f4ad17d0",
"assets/assets/icons/ic_em_processamento.svg": "05dc4cbfa6633df63cbeafab29c0822f",
"assets/assets/icons/ic_entregue.svg": "ba6e7eab885ea9274621fc954d469d1b",
"assets/assets/icons/ic_establishment.svg": "6641b2508eb9cc7af27c45016941de26",
"assets/assets/icons/ic_pendente.svg": "3e91302d626011a22d04e214828e6156",
"assets/assets/icons/ic_saiu_para_entrega.svg": "0fd6e55bd979a4daf5cb9ab6033ec802",
"assets/assets/icons/ic_shopping_bags.svg": "0f2814f7143eec22322612b89da784e2",
"assets/assets/icons/ic_total_client.svg": "d481b65b89e40e7a513c7ae9656d5e7e",
"assets/assets/icons/instagram.svg": "82ee87faf54afc9d64a04f6155c7b778",
"assets/assets/icons/logo.svg": "b3af0c077a73709c992d7e075b76ce33",
"assets/assets/icons/media.svg": "059dfe46bd2d92e30bf361c2f7055c3b",
"assets/assets/icons/media_file.svg": "2ac15c968f8a8cea571a0f3e9f238a66",
"assets/assets/icons/menu_dashbord.svg": "b2cdf62e9ce9ca35f3fc72f1c1fcc7d4",
"assets/assets/icons/menu_doc.svg": "09673c2879de2db9646345011dbaa7bb",
"assets/assets/icons/menu_notification.svg": "460268d6e4bdeab56538d7020cc4b326",
"assets/assets/icons/menu_profile.svg": "fe56f998a7c1b307809ea3653a1b62f9",
"assets/assets/icons/menu_setting.svg": "d0e24d5d0956729e0e2ab09cb4327e32",
"assets/assets/icons/menu_store.svg": "2fd4ae47fd0fca084e50a600dda008cd",
"assets/assets/icons/menu_task.svg": "1a02d1c14f49a765da34487d23a3093b",
"assets/assets/icons/menu_tran.svg": "6c95fa7ae6679737dc57efd2ccbb0e57",
"assets/assets/icons/one_drive.svg": "aa908c0a29eb795606799385cdfc8592",
"assets/assets/icons/pdf_file.svg": "ca854643eeee7bedba7a1d550e2ba94f",
"assets/assets/icons/Search.svg": "396d519c18918ed763d741f4ba90243a",
"assets/assets/icons/sound_file.svg": "fe212d5edfddd0786319edf50601ec73",
"assets/assets/icons/unknown.svg": "b2f3cdc507252d75dea079282f14614f",
"assets/assets/icons/whatsapp.svg": "47c77bf133116ff76838809ae5d2c83a",
"assets/assets/icons/xd_file.svg": "38913b108e39bcd55988050d2d80194c",
"assets/assets/icons/youtube.svg": "98886abbd84dd2ce279be8ca80bc7df1",
"assets/assets/images/background.png": "412f2639e9df9ad57546d746f7479814",
"assets/assets/images/facebook.png": "3b149a0e5a55d5a92f114f091364de40",
"assets/assets/images/github.png": "73f6facb5690334ce00e33382c60bda6",
"assets/assets/images/google.png": "66047864288a9df7b69c6bc3c94d16f5",
"assets/assets/images/ic_canceled.png": "e46353bb326c09674abc3e1bd7092483",
"assets/assets/images/ic_confirmed.png": "83121f9b7b4207b56f7458852cff14de",
"assets/assets/images/ic_customer.png": "bd17319cf27ba41a30083c2930465b94",
"assets/assets/images/ic_delivered.png": "454bcf31b05dd947804e2a1a3cffc1dd",
"assets/assets/images/ic_divergence.png": "b0d61138747bd687111f187d09dc989b",
"assets/assets/images/ic_failed_to_deliver.png": "653c822bac843c59a2671ff9c4144655",
"assets/assets/images/ic_list_empty.png": "d71060da5ad1cdd3499681e5d001cbf4",
"assets/assets/images/ic_out_for_delivery.png": "4aac92af237efb5bff6bb6d1c388de2c",
"assets/assets/images/ic_pending.png": "0a2ba7b234fbefb492cb22991b4deab7",
"assets/assets/images/ic_processing.png": "0c4a3ed155581f2e8329a0d3c3f707cf",
"assets/assets/images/ic_returned.png": "658d5158eb0802f5c8f6a36978b712d4",
"assets/assets/images/illustration-1.png": "5ad69c7624875b76c84eebb06806ff46",
"assets/assets/images/illustration-2.png": "9f8a806312ecfe03313dabe5cf70a63f",
"assets/assets/images/logo.png": "5315be9d0a7602fb12a0ad4c2e3006e9",
"assets/assets/images/profile_pic.png": "5f56c3070f1c066ae15ecad12fb44f54",
"assets/assets/svg/about.svg": "257f7763607ca50f2f4eeced093a323e",
"assets/assets/svg/ajuda.svg": "56585c36a3c03feea10936fb6fb6a924",
"assets/assets/svg/contatc.svg": "1dd4a8d75ab29da95cfe300d0dc6f5b1",
"assets/assets/svg/home.svg": "028ec20297111a6df0a6fc94667ca3a8",
"assets/assets/svg/icon-key.svg": "0e2567b3d73aa377d11c739532ebf07a",
"assets/assets/svg/login.svg": "d26913f12cfc6d5008b222d82773981d",
"assets/assets/svg/register.svg": "f4cc12de46b09fa1ef3db289f2e4c95b",
"assets/FontManifest.json": "5a32d4310a6f5d9a6b651e75ba0d7372",
"assets/fonts/MaterialIcons-Regular.otf": "708784b10960343dd445e37c3e77a002",
"assets/icons/Documents.svg": "51896b51d35e28711cf4bd218bde185d",
"assets/icons/doc_file.svg": "552a02a5a3dbaee682de14573f0ca9f3",
"assets/icons/drop_box.svg": "3295157e194179743d6093de9f1ff254",
"assets/icons/excle_file.svg": "dc91b258ecf87f5731fb2ab9ae15a3ec",
"assets/icons/facebook.svg": "c0cd138271276bb33a87c2d174015455",
"assets/icons/Figma_file.svg": "0ae328b79325e7615054aed3147c81f9",
"assets/icons/folder.svg": "40a82e74e930ac73aa6ccb85d8c5a29c",
"assets/icons/google_drive.svg": "9a3005a58d47a11bfeffc11ddd3567c1",
"assets/icons/instagram.svg": "82ee87faf54afc9d64a04f6155c7b778",
"assets/icons/logo.svg": "b3af0c077a73709c992d7e075b76ce33",
"assets/icons/media.svg": "059dfe46bd2d92e30bf361c2f7055c3b",
"assets/icons/media_file.svg": "2ac15c968f8a8cea571a0f3e9f238a66",
"assets/icons/menu_dashbord.svg": "b2cdf62e9ce9ca35f3fc72f1c1fcc7d4",
"assets/icons/menu_doc.svg": "09673c2879de2db9646345011dbaa7bb",
"assets/icons/menu_notification.svg": "460268d6e4bdeab56538d7020cc4b326",
"assets/icons/menu_profile.svg": "fe56f998a7c1b307809ea3653a1b62f9",
"assets/icons/menu_setting.svg": "d0e24d5d0956729e0e2ab09cb4327e32",
"assets/icons/menu_store.svg": "2fd4ae47fd0fca084e50a600dda008cd",
"assets/icons/menu_task.svg": "1a02d1c14f49a765da34487d23a3093b",
"assets/icons/menu_tran.svg": "6c95fa7ae6679737dc57efd2ccbb0e57",
"assets/icons/one_drive.svg": "aa908c0a29eb795606799385cdfc8592",
"assets/icons/pdf_file.svg": "ca854643eeee7bedba7a1d550e2ba94f",
"assets/icons/Search.svg": "396d519c18918ed763d741f4ba90243a",
"assets/icons/sound_file.svg": "fe212d5edfddd0786319edf50601ec73",
"assets/icons/unknown.svg": "b2f3cdc507252d75dea079282f14614f",
"assets/icons/whatsapp.svg": "47c77bf133116ff76838809ae5d2c83a",
"assets/icons/xd_file.svg": "38913b108e39bcd55988050d2d80194c",
"assets/icons/youtube.svg": "98886abbd84dd2ce279be8ca80bc7df1",
"assets/images/facebook.png": "3b149a0e5a55d5a92f114f091364de40",
"assets/images/github.png": "73f6facb5690334ce00e33382c60bda6",
"assets/images/google.png": "66047864288a9df7b69c6bc3c94d16f5",
"assets/images/illustration-1.png": "5ad69c7624875b76c84eebb06806ff46",
"assets/images/illustration-2.png": "9f8a806312ecfe03313dabe5cf70a63f",
"assets/images/logo.png": "5315be9d0a7602fb12a0ad4c2e3006e9",
"assets/images/profile_pic.png": "5f56c3070f1c066ae15ecad12fb44f54",
"assets/loading.gif": "97dd708ae3b62c15671a8c715a762482",
"assets/NOTICES": "76694b24627c4c763907984f14bb9ff8",
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
"index.html": "2da76600bcf8ddda104e6b20209ed150",
"/": "2da76600bcf8ddda104e6b20209ed150",
"main.dart.js": "c08cdc73142bcad350212a8309fb3f19",
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
