// src/index.ts
interface DiscardAPIConfig {
  apiKey: string;
  baseURL?: string;
  fullResponse?: boolean;
  timeout?: number;
}

interface APIResponse<T = any> {
  creator?: string;
  result?: T;
  status?: boolean;
  [key: string]: any;
}

class DiscardAPI {
  private apiKey: string;
  private baseURL: string;
  private fullResponse: boolean;
  private timeout: number;

  constructor(config: DiscardAPIConfig) {
    if (!config.apiKey) {
      throw new Error('API key is required');
    }
    
    this.apiKey = config.apiKey;
    this.baseURL = config.baseURL || 'https://discardapi.dpdns.org';
    this.fullResponse = config.fullResponse ?? false;
    this.timeout = config.timeout || 30000;
  }

  private buildURL(endpoint: string, params: Record<string, any>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);
    const allParams = { ...params, apikey: this.apiKey };
    
    Object.entries(allParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
    
    return url.toString();
  }

  private async request<T = any>(
    endpoint: string,
    method: string = 'GET',
    params?: Record<string, any>,
    body?: Record<string, any> | FormData,
    apiKeyLocation: 'query' | 'body' = 'query'
  ): Promise<T | APIResponse<T>> {
    let url: string;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const fetchOptions: RequestInit = {
        method,
        signal: controller.signal,
        headers: {}
      };

      if (method === 'GET') {
        url = this.buildURL(endpoint, params || {});
      } else {
        url = apiKeyLocation === 'query' 
          ? this.buildURL(endpoint, params || {})
          : `${this.baseURL}${endpoint}`;

        if (body) {
          if (body instanceof FormData) {
            if (apiKeyLocation === 'body') {
              body.append('apikey', this.apiKey);
            }
            fetchOptions.body = body;
          } else {
            fetchOptions.headers = { 'Content-Type': 'application/json' };
            const bodyData = apiKeyLocation === 'body' 
              ? { ...body, apikey: this.apiKey }
              : body;
            fetchOptions.body = JSON.stringify(bodyData);
          }
        }
      }

      const response = await fetch(url, fetchOptions);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType?.includes('application/json')) {
        const data: APIResponse<T> = await response.json();
        return this.fullResponse ? data : (data.result ?? data);
      }
      
      return response.text() as any;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      throw error;
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // ==================== ISLAMIC ====================
  quranSurah(params: { surah: string }) {
    return this.request('/api/dl/surah', 'GET', params);
  }

  hadith(params: { book: string; number: string }) {
    return this.request('/api/get/hadith', 'GET', params);
  }

  prayerTiming(params: { city: string }) {
    return this.request('/api/prayer/timing', 'GET', params);
  }

  quran(params: { surah: string; ayat: string }) {
    return this.request('/api/islamic/quran', 'GET', params);
  }

  islamicHadit(params: { book: string; number: string }) {
    return this.request('/api/islamic/hadit', 'GET', params);
  }

  tahlil() {
    return this.request('/api/islamic/tahlil', 'GET');
  }

  wirid() {
    return this.request('/api/islamic/wirid', 'GET');
  }

  dua() {
    return this.request('/api/islamic/dua', 'GET');
  }

  ayatkursi() {
    return this.request('/api/islamic/ayatkursi', 'GET');
  }

  searchBooks() {
    return this.request('/api/get/books', 'GET');
  }

  getBooks(params: { category: string }) {
    return this.request('/api/get/books', 'GET', params);
  }

  // ==================== AI ====================
  geminiPro(params: { text: string }) {
    return this.request('/api/gemini/pro', 'GET', params);
  }

  geminiFlash(params: { text: string }) {
    return this.request('/api/gemini/flash', 'GET', params);
  }

  googleGemma(params: { text: string }) {
    return this.request('/api/gemini/gemma', 'GET', params);
  }

  geminiEmbed(params: { text: string }) {
    return this.request('/api/gemini/embed', 'GET', params);
  }

  llamaAI(params: { text: string }) {
    return this.request('/api/ai/llama', 'GET', params);
  }

  mythomax(params: { text: string }) {
    return this.request('/api/ai/mythomax', 'GET', params);
  }

  mistralAI(params: { text: string }) {
    return this.request('/api/ai/mistral', 'GET', params);
  }

  qwenCoder(params: { text: string }) {
    return this.request('/api/ai/qwen', 'GET', params);
  }

  kimiAI(params: { text: string }) {
    return this.request('/api/ai/kimi', 'GET', params);
  }

  gemmaAI(params: { text: string }) {
    return this.request('/api/ai/gemma', 'GET', params);
  }

  fluxSchnell(params: { text: string }) {
    return this.request('/api/imagen/schnell', 'GET', params);
  }

  fluxDev(params: { text: string }) {
    return this.request('/api/imagen/flux', 'GET', params);
  }

  stableDiffusion(params: { text: string }) {
    return this.request('/api/imagen/diffusion', 'GET', params);
  }

  blackForest(params: { text: string }) {
    return this.request('/api/imagen/sdxlb', 'GET', params);
  }

  dallE(params: { text: string }) {
    return this.request('/api/imagen/dalle', 'GET', params);
  }

  // ==================== ANIME ====================
  animeNom() {
    return this.request('/api/anime/nom', 'GET');
  }

  animePoke() {
    return this.request('/api/anime/poke', 'GET');
  }

  animeCry() {
    return this.request('/api/anime/cry', 'GET');
  }

  animeKiss() {
    return this.request('/api/anime/kiss', 'GET');
  }

  animePat() {
    return this.request('/api/anime/pat', 'GET');
  }

  animeHug() {
    return this.request('/api/anime/hug', 'GET');
  }

  animeWink() {
    return this.request('/api/anime/wink', 'GET');
  }

  animeFace() {
    return this.request('/api/anime/face', 'GET');
  }

  // ==================== APPS ====================
  searchAndroid1(params: { query: string }) {
    return this.request('/api/apk/search/android1', 'GET', params);
  }

  dlAndroid1(params: { url: string }) {
    return this.request('/api/apk/dl/android1', 'GET', params);
  }

  searchAppStore(params: { id: string }) {
    return this.request('/api/apk/search/appstore', 'GET', params);
  }

  searchApkMirror(params: { query: string }) {
    return this.request('/api/apk/search/apkmirror', 'GET', params);
  }

  dlApkMirror(params: { url: string }) {
    return this.request('/api/apk/dl/apkmirror', 'GET', params);
  }

  searchApkPure(params: { query: string }) {
    return this.request('/api/apk/search/apkpure', 'GET', params);
  }

  dlApkPure(params: { url: string }) {
    return this.request('/api/apk/dl/apkpure', 'GET', params);
  }

  searchModCombo(params: { query: string }) {
    return this.request('/api/apk/search/modcombo', 'GET', params);
  }

  searchPlayStore(params: { query: string }) {
    return this.request('/api/apk/search/playstore', 'GET', params);
  }

  dlPlayStore(params: { url: string }) {
    return this.request('/api/apk/dl/playstore', 'GET', params);
  }

  searchRexdl(params: { query: string }) {
    return this.request('/api/apk/search/rexdl', 'GET', params);
  }

  dlRexdl(params: { url: string }) {
    return this.request('/api/apk/dl/rexdl', 'GET', params);
  }

  searchSteam(params: { query: string }) {
    return this.request('/api/apk/search/steam', 'GET', params);
  }

  searchHappyMod(params: { query: string }) {
    return this.request('/api/apk/search/happymod', 'GET', params);
  }

  searchSFile(params: { query: string }) {
    return this.request('/api/apk/search/sfile', 'GET', params);
  }

  // ==================== CHATBOTS ====================
  llamaBot(params: { text: string }) {
    return this.request('/api/bot/llama', 'GET', params);
  }

  qwenBot(params: { text: string }) {
    return this.request('/api/bot/qwen', 'GET', params);
  }

  baiduBot(params: { text: string }) {
    return this.request('/api/bot/baidu', 'GET', params);
  }

  gemmaBot(params: { text: string }) {
    return this.request('/api/bot/gemma', 'GET', params);
  }

  sparkBot(params: { text: string }) {
    return this.request('/api/chat/spark', 'GET', params);
  }

  quarkBot(params: { text: string }) {
    return this.request('/api/chat/quark', 'GET', params);
  }

  glmBot(params: { text: string }) {
    return this.request('/api/chat/glm', 'GET', params);
  }

  // ==================== CANVAS ====================
  canvasCircle(params: { avatar: string }) {
    return this.request('/api/canvas/circle', 'GET', params);
  }

  canvasBisexual(params: { avatar: string }) {
    return this.request('/api/canvas/bisexual', 'GET', params);
  }

  canvasHeart(params: { avatar: string }) {
    return this.request('/api/canvas/heart', 'GET', params);
  }

  canvasHorny(params: { avatar: string }) {
    return this.request('/api/canvas/horny', 'GET', params);
  }

  canvasPansexual(params: { avatar: string }) {
    return this.request('/api/canvas/pansexual', 'GET', params);
  }

  canvasLesbian(params: { avatar: string }) {
    return this.request('/api/canvas/lesbian', 'GET', params);
  }

  canvasLGBT(params: { avatar: string }) {
    return this.request('/api/canvas/lgbtq', 'GET', params);
  }

  canvasNoBinary(params: { avatar: string }) {
    return this.request('/api/canvas/nobin', 'GET', params);
  }

  canvasTransgen(params: { avatar: string }) {
    return this.request('/api/canvas/transgen', 'GET', params);
  }

  canvasTonikawa(params: { avatar: string }) {
    return this.request('/api/canvas/tonikawa', 'GET', params);
  }

  canvasSimpcard(params: { avatar: string }) {
    return this.request('/api/canvas/simpcard', 'GET', params);
  }

  // ==================== CODEC ====================
  base64(params: { mode: 'encode' | 'decode'; data: string }) {
    return this.request('/api/tools/base64', 'GET', params);
  }

  base32(params: { mode: 'encode' | 'decode'; data: string }) {
    return this.request('/api/tools/base32', 'GET', params);
  }

  base16(params: { mode: 'encode' | 'decode'; data: string }) {
    return this.request('/api/tools/base16', 'GET', params);
  }

  base36(params: { mode: 'encode' | 'decode'; data: string }) {
    return this.request('/api/tools/base36', 'GET', params);
  }

  base45(params: { mode: 'encode' | 'decode'; data: string }) {
    return this.request('/api/tools/base45', 'GET', params);
  }

  base58(params: { mode: 'encode' | 'decode'; data: string }) {
    return this.request('/api/tools/base58', 'GET', params);
  }

  base62(params: { mode: 'encode' | 'decode'; data: string }) {
    return this.request('/api/tools/base62', 'GET', params);
  }

  base85(params: { mode: 'encode' | 'decode'; data: string }) {
    return this.request('/api/tools/base85', 'GET', params);
  }

  base91(params: { mode: 'encode' | 'decode'; data: string }) {
    return this.request('/api/tools/base91', 'GET', params);
  }

  binary(params: { mode: 'encode' | 'decode'; data: string }) {
    return this.request('/api/tools/binary', 'GET', params);
  }

  brainfuck(params: { text: string }) {
    return this.request('/api/tools/brainfuck', 'GET', params);
  }

  interpreter(params: { code: string }) {
    return this.request('/api/interpreter', 'GET', params);
  }

  // ==================== URL SHORTENER ====================
  shortenIsgd(params: { url: string }) {
    return this.request('/api/short/isgd', 'GET', params);
  }

  shortenL8nu(params: { url: string }) {
    return this.request('/api/short/l8nu', 'GET', params);
  }

  shortenReurl(params: { url: string }) {
    return this.request('/api/short/reurl', 'GET', params);
  }

  shortenTinycc(params: { url: string }) {
    return this.request('/api/short/tinycc', 'GET', params);
  }

  shortenClck(params: { url: string }) {
    return this.request('/api/short/clck', 'GET', params);
  }

  shortenItsl(params: { url: string }) {
    return this.request('/api/short/itsl', 'GET', params);
  }

  shortenCuqin(params: { url: string }) {
    return this.request('/api/short/cuqin', 'GET', params);
  }

  shortenSurl(params: { url: string }) {
    return this.request('/api/short/surl', 'GET', params);
  }

  shortenVurl(params: { url: string }) {
    return this.request('/api/short/vurl', 'GET', params);
  }

  shortenVgd(params: { url: string }) {
    return this.request('/api/short/vgd', 'GET', params);
  }

  shortenClean(params: { url: string }) {
    return this.request('/api/short/clean', 'GET', params);
  }

  shortenBitly(params: { url: string }) {
    return this.request('/api/short/bitly', 'GET', params);
  }

  shortenTiny(params: { url: string }) {
    return this.request('/api/short/tiny', 'GET', params);
  }

  unshort(params: { url: string }) {
    return this.request('/api/short/unshort', 'GET', params);
  }

  // ==================== AUDIODB ====================
  audiodbScanArtist(params: { name: string }) {
    return this.request('/api/audiodb/scan', 'GET', params);
  }

  audiodbSearchTrack(params: { name: string; track: string }) {
    return this.request('/api/audiodb/track', 'GET', params);
  }

  audiodbDiscography(params: { mbid: string }) {
    return this.request('/api/audiodb/discography', 'GET', params);
  }

  audiodbAlbums(params: { name: string }) {
    return this.request('/api/audiodb/albums', 'GET', params);
  }

  audiodbSpecificAlbum(params: { name: string; album: string }) {
    return this.request('/api/audiodb/album', 'GET', params);
  }

  audiodbArtistById(params: { id: string }) {
    return this.request('/api/audiodb/artist', 'GET', params);
  }

  audiodbArtistByMbid(params: { mbid: string }) {
    return this.request('/api/audiodb/artist-mb', 'GET', params);
  }

  audiodbArtistLinks(params: { id: string }) {
    return this.request('/api/audiodb/artist-links', 'GET', params);
  }

  audiodbAlbumById(params: { id: string }) {
    return this.request('/api/audiodb/album-id', 'GET', params);
  }

  audiodbAlbumByMbid(params: { mbid: string }) {
    return this.request('/api/audiodb/album-mb', 'GET', params);
  }

  audiodbTrackByAlbumId(params: { id: string }) {
    return this.request('/api/audiodb/track-album', 'GET', params);
  }

  audiodbTrackById(params: { id: string }) {
    return this.request('/api/audiodb/track-id', 'GET', params);
  }

  audiodbTrackByMbid(params: { mbid: string }) {
    return this.request('/api/audiodb/track-mb', 'GET', params);
  }

  audiodbVideosById(params: { id: string }) {
    return this.request('/api/audiodb/mvid', 'GET', params);
  }

  audiodbVideosByMbid(params: { mbid: string }) {
    return this.request('/api/audiodb/mvid-mb', 'GET', params);
  }

  audiodbTrendingAlbums(params?: { country?: string }) {
    return this.request('/api/audiodb/trending-albums', 'GET', params);
  }

  audiodbTrendingSingles(params?: { country?: string }) {
    return this.request('/api/audiodb/trending-singles', 'GET', params);
  }

  audiodbTopTracks(params: { name: string }) {
    return this.request('/api/audiodb/top-tracks', 'GET', params);
  }

  audiodbTopTracksMb(params: { mbid: string }) {
    return this.request('/api/audiodb/top-tracks-mb', 'GET', params);
  }

  // ==================== QUOTES ====================
  commitMessage() {
    return this.request('/api/commit/message', 'GET');
  }

  strangerQuote() {
    return this.request('/api/quote/stranger', 'GET');
  }

  pickupLine() {
    return this.request('/api/quote/pickup', 'GET');
  }

  whyQuestion() {
    return this.request('/api/quote/why', 'GET');
  }

  randomQuote() {
    return this.request('/api/quotes/random', 'GET');
  }

  techTip() {
    return this.request('/api/quote/techtips', 'GET');
  }

  codingTip() {
    return this.request('/api/quote/coding', 'GET');
  }

  funFact() {
    return this.request('/api/quote/funfacts', 'GET');
  }

  wyrQuote() {
    return this.request('/api/quote/wyr', 'GET');
  }

  motivQuote() {
    return this.request('/api/quote/motiv', 'GET');
  }

  islamicQuote() {
    return this.request('/api/quote/islamic', 'GET');
  }

  lifeHack() {
    return this.request('/api/quote/lifehacks', 'GET');
  }

  breakingBadQuote() {
    return this.request('/api/quote/breakingbad', 'GET');
  }

  buddhaQuote() {
    return this.request('/api/quote/buddha', 'GET');
  }

  stoicQuote() {
    return this.request('/api/quote/stoic', 'GET');
  }

  luciferQuote() {
    return this.request('/api/quote/lucifer', 'GET');
  }

  // ==================== DOWNLOADS ====================
  dlFacebook(params: { url: string }) {
    return this.request('/api/dl/facebook', 'GET', params);
  }

  dlGitClone(params: { url: string }) {
    return this.request('/api/dl/gitclone', 'GET', params);
  }

  dlInstagram(params: { url: string }) {
    return this.request('/api/dl/instagram', 'GET', params);
  }

  dlMediafire(params: { url: string }) {
    return this.request('/api/dl/mediafire', 'GET', params);
  }

  dlPinterest(params: { text: string }) {
    return this.request('/api/dl/pinterest', 'GET', params);
  }

  dlTikTok(params: { url: string }) {
    return this.request('/api/dl/tiktok', 'GET', params);
  }

  dlTwitter(params: { url: string }) {
    return this.request('/api/dl/twitter', 'GET', params);
  }

  dlLikee(params: { url: string }) {
    return this.request('/api/dl/likee', 'GET', params);
  }

  dlThreads(params: { url: string }) {
    return this.request('/api/dl/threads', 'GET', params);
  }

  dlTwitch(params: { url: string }) {
    return this.request('/api/dl/twitch', 'GET', params);
  }

  dlWallBest(params: { text: string; page?: string }) {
    return this.request('/api/dl/wallbest', 'GET', params);
  }

  dlWallCraft(params: { text: string }) {
    return this.request('/api/dl/wallcraft', 'GET', params);
  }

  dlWallHaven(params?: { q?: string; sorting?: string; page?: string; purity?: string; categories?: string }) {
    return this.request('/api/dl/wallhaven', 'GET', params);
  }

  dlWikimedia(params: { title: string }) {
    return this.request('/api/dl/wikimedia', 'GET', params);
  }

  dlYouTube(params: { url: string; format: string }) {
    return this.request('/api/dl/youtube', 'GET', params);
  }

  dlBilibili(params: { url: string }) {
    return this.request('/api/dl/bilibili', 'GET', params);
  }

  dlLinkedIn(params: { url: string }) {
    return this.request('/api/dl/linkedin', 'GET', params);
  }

  dlSnapChat(params: { url: string }) {
    return this.request('/api/dl/snapchat', 'GET', params);
  }

  dlShareChat(params: { url: string }) {
    return this.request('/api/dl/sharechat', 'GET', params);
  }

  dlSnackVideo(params: { url: string }) {
    return this.request('/api/dl/snack', 'GET', params);
  }

  dlPinterestVideo(params: { url: string }) {
    return this.request('/api/dl/pinterest', 'GET', params);
  }

  dlRedditVideo(params: { url: string }) {
    return this.request('/api/dl/reddit', 'GET', params);
  }

  dlVideezy(params: { url: string }) {
    return this.request('/api/dl/videezy', 'GET', params);
  }

  dlVidsPlay(params: { url: string }) {
    return this.request('/api/dl/vidsplay', 'GET', params);
  }

  dlIMDbVideo(params: { url: string }) {
    return this.request('/api/dl/imdb', 'GET', params);
  }

  dlIFunny(params: { url: string }) {
    return this.request('/api/dl/ifunny', 'GET', params);
  }

  dlGetty(params: { url: string }) {
    return this.request('/api/dl/getty', 'GET', params);
  }

  pexelsVideos(params: { query: string }) {
    return this.request('/api/pexels/videos', 'GET', params);
  }

  pexelsImages(params: { query: string }) {
    return this.request('/api/pexels/images', 'GET', params);
  }

  loremPicsum(params: { id: string; height?: string; width?: string; grayscale?: string; blur?: string }) {
    return this.request('/api/dl/picsum', 'GET', params);
  }

  iconFinder(params: { query: string }) {
    return this.request('/api/icon/finder', 'GET', params);
  }

  pixabayImages(params: { query: string; page?: string }) {
    return this.request('/api/pixabay/images', 'GET', params);
  }

  pixabayVideos(params: { query: string; page?: string; category?: string }) {
    return this.request('/api/pixabay/videos', 'GET', params);
  }

  tenorGifs(params: { query: string }) {
    return this.request('/api/dl/tenor', 'GET', params);
  }

  pasteBin(params: { id: string; dl?: string }) {
    return this.request('/api/dl/pastebin', 'GET', params);
  }

  googleImage(params: { query: string }) {
    return this.request('/api/dl/gimage', 'GET', params);
  }

  baiduImage(params: { query: string; page?: string }) {
    return this.request('/api/img/baidu', 'GET', params);
  }

  dailyBing() {
    return this.request('/api/img/dailybing', 'GET');
  }

  dlIStock(params: { url: string }) {
    return this.request('/api/dl/istock', 'GET', params);
  }

  dlOdysee(params: { url: string }) {
    return this.request('/api/dl/odysee', 'GET', params);
  }

  dlAlamy(params: { url: string }) {
    return this.request('/api/dl/alamy', 'GET', params);
  }

  // ==================== IMAGE MAKERS ====================
  qrCode(params: { text: string }) {
    return this.request('/api/maker/qrcode', 'GET', params);
  }

  qrTag(params: { text: string; size?: string; color?: string; logo?: string }) {
    return this.request('/api/maker/qrtag', 'GET', params);
  }

  textToPic(params: { text: string }) {
    return this.request('/api/maker/ttp', 'GET', params);
  }

  designFont(params: { text: string }) {
    return this.request('/api/design/font', 'GET', params);
  }

  captchaImage() {
    return this.request('/api/maker/captcha', 'GET');
  }

  customQR(params: { text: string; size?: string; color?: string }) {
    return this.request('/api/maker/customqr', 'GET', params);
  }

  textAvatar(params: { text: string; shape?: string }) {
    return this.request('/api/maker/avatar', 'GET', params);
  }

  webLogo(params: { url: string }) {
    return this.request('/api/maker/weblogo', 'GET', params);
  }

  whoWins(params: { url1: string; url2: string }) {
    return this.request('/api/maker/whowin', 'GET', params);
  }

  quoted(params: { text: string; name: string; profile: string; color?: string }) {
    return this.request('/api/maker/quoted', 'GET', params);
  }

  qrPro(params: { text: string; size?: string; color?: string; logo?: string; caption?: string }) {
    return this.request('/api/qr/pro', 'GET', params);
  }

  img2Base64(body: FormData) {
    return this.request('/api/img2base64', 'POST', undefined, body, 'body');
  }

  base64ToImg(params: { data: string }) {
    return this.request('/api/img2base64', 'GET', params);
  }

  barcode128(params: { text: string }) {
    return this.request('/api/barcode/code', 'GET', params);
  }

  barcodeEAN(params: { text: string }) {
    return this.request('/api/barcode/ean', 'GET', params);
  }

  barcodeQR(params: { text: string }) {
    return this.request('/api/barcode/qr', 'GET', params);
  }

  emojiMosaic(body: FormData, params: { width: string; palette: string; format?: string }) {
    return this.request('/api/emoji/mosaic', 'POST', params, body, 'body');
  }

  emojiTranslate(params: { text: string }) {
    return this.request('/api/emoji/translate', 'GET', params);
  }

  emojiReplace(params: { text: string }) {
    return this.request('/api/emoji/replace', 'GET', params);
  }

  emojiMirror(params: { text: string }) {
    return this.request('/api/emoji/mirror', 'GET', params);
  }

  emojiRainbow(params: { text: string }) {
    return this.request('/api/emoji/rainbow', 'GET', params);
  }

  emojiMix(params: { e1: string; e2: string }) {
    return this.request('/api/emoji/mix', 'GET', params);
  }

  carbonImage(params: { code: string; bg?: string }) {
    return this.request('/api/maker/carbon', 'GET', params);
  }

  welcomeImage(params: { background: string; avatar: string; text1: string; text2: string; text3: string }) {
    return this.request('/api/maker/welcome', 'GET', params);
  }

  // ==================== MUSIC ====================
  searchSpotify(params: { query: string }) {
    return this.request('/api/search/spotify', 'GET', params);
  }

  dlSpotify(params: { url: string }) {
    return this.request('/api/dl/spotify', 'GET', params);
  }

  searchSoundCloud(params: { query: string }) {
    return this.request('/api/search/soundcloud', 'GET', params);
  }

  dlSoundCloud(params: { url: string }) {
    return this.request('/api/dl/soundcloud', 'GET', params);
  }

  lyrics(params: { song: string }) {
    return this.request('/api/music/lyrics', 'GET', params);
  }

  ringtones(params: { title: string }) {
    return this.request('/api/dl/ringtone', 'GET', params);
  }

  searchSound(params: { query: string }) {
    return this.request('/api/search/sound', 'GET', params);
  }

  previewSound(params: { id: string }) {
    return this.request('/api/dl/sound', 'GET', params);
  }

  searchDeezer(params: { track?: string; artist?: string; album?: string }) {
    return this.request('/api/search/deezer', 'GET', params);
  }

  previewDeezer(params: { id: string }) {
    return this.request('/api/search/deezer', 'GET', params);
  }

  searchMusicBrainz(params: { entity: string; query?: string; id?: string }) {
    return this.request('/api/search/musicbrainz', 'GET', params);
  }

  openWhyd(params: { username: string; limit?: string }) {
    return this.request('/api/search/openwhyd', 'GET', params);
  }

  // ==================== JOKES ====================
  dadJoke() {
    return this.request('/api/joke/dad', 'GET');
  }

  generalJoke() {
    return this.request('/api/joke/general', 'GET');
  }

  knockJoke() {
    return this.request('/api/joke/knock', 'GET');
  }

  programmingJoke() {
    return this.request('/api/joke/programming', 'GET');
  }

  miscJoke() {
    return this.request('/api/joke/misc', 'GET');
  }

  codingJoke() {
    return this.request('/api/joke/coding', 'GET');
  }

  spookyJoke() {
    return this.request('/api/joke/spooky', 'GET');
  }

  darkJoke() {
    return this.request('/api/joke/dark', 'GET');
  }

  christmasJoke() {
    return this.request('/api/joke/Christmas', 'GET');
  }

  randomJoke() {
    return this.request('/api/joke/random', 'GET');
  }

  animalJoke() {
    return this.request('/api/joke/animal', 'GET');
  }

  careerJoke() {
    return this.request('/api/joke/career', 'GET');
  }

  celebrityJoke() {
    return this.request('/api/joke/celebrity', 'GET');
  }

  explicitJoke() {
    return this.request('/api/joke/explicit', 'GET');
  }

  fashionJoke() {
    return this.request('/api/joke/fashion', 'GET');
  }

  foodJoke() {
    return this.request('/api/joke/food', 'GET');
  }

  historyJoke() {
    return this.request('/api/joke/history', 'GET');
  }

  moneyJoke() {
    return this.request('/api/joke/money', 'GET');
  }

  movieJoke() {
    return this.request('/api/joke/movie', 'GET');
  }

  musicJoke() {
    return this.request('/api/joke/music', 'GET');
  }

  scienceJoke() {
    return this.request('/api/joke/science', 'GET');
  }

  sportJoke() {
    return this.request('/api/joke/sport', 'GET');
  }

  travelJoke() {
    return this.request('/api/joke/travel', 'GET');
  }

  // ==================== IMAGES ====================
  coupleImage() {
    return this.request('/api/img/couple', 'GET');
  }

  pizzaImage() {
    return this.request('/api/images/pizza', 'GET');
  }

  burgerImage() {
    return this.request('/api/images/burger', 'GET');
  }

  dosaImage() {
    return this.request('/api/images/dosa', 'GET');
  }

  pastaImage() {
    return this.request('/api/images/pasta', 'GET');
  }

  biryaniImage() {
    return this.request('/api/images/biryani', 'GET');
  }

  islamicImage() {
    return this.request('/api/img/islamic', 'GET');
  }

  techImage() {
    return this.request('/api/img/tech', 'GET');
  }

  gameImage() {
    return this.request('/api/img/game', 'GET');
  }

  mountainImage() {
    return this.request('/api/img/mountain', 'GET');
  }

  programmingImage() {
    return this.request('/api/img/programming', 'GET');
  }

  cyberSpaceImage() {
    return this.request('/api/img/cyberspace', 'GET');
  }

  wallPcImage() {
    return this.request('/api/img/wallpc', 'GET');
  }

  messiImage() {
    return this.request('/api/img/messi', 'GET');
  }

  ronaldoImage() {
    return this.request('/api/img/ronaldo', 'GET');
  }

  coffeeImage() {
    return this.request('/api/img/coffee', 'GET');
  }

  catImage() {
    return this.request('/api/img/cat', 'GET');
  }

  dogImage() {
    return this.request('/api/img/dog', 'GET');
  }

  yesNoImage() {
    return this.request('/api/img/yesno', 'GET');
  }

  foxImage() {
    return this.request('/api/img/fox', 'GET');
  }

  notExistImage() {
    return this.request('/api/img/notexist', 'GET');
  }

  // ==================== FACTS ====================
  dateFact(params?: { month?: number; day?: number }) {
    return params?.month && params?.day
      ? this.request('/api/fact/date', 'GET', params)
      : this.request('/api/date/fact', 'GET');
  }

  yearFact(params?: { year?: number }) {
    return params?.year
      ? this.request('/api/fact/year', 'GET', params)
      : this.request('/api/year/fact', 'GET');
  }

  mathFact(params?: { number?: number }) {
    return params?.number
      ? this.request('/api/fact/math', 'GET', params)
      : this.request('/api/math/fact', 'GET');
  }

  triviaFact(params?: { number?: number }) {
    return params?.number
      ? this.request('/api/fact/trivia', 'GET', params)
      : this.request('/api/trivia/fact', 'GET');
  }

  uselessFact() {
    return this.request('/api/fact/useless', 'GET');
  }

  todayFact() {
    return this.request('/api/fact/today', 'GET');
  }

  // ==================== FAKER ====================
  fakeUser() {
    return this.request('/api/fake/user', 'GET');
  }

  fakeUsers(params?: { _quantity?: number; _locale?: string; _gender?: string; _seed?: number }) {
    return this.request('/api/fake/users', 'GET', params);
  }

  fakeAddresses(params?: { _quantity?: number; _locale?: string; _country_code?: string; _seed?: number }) {
    return this.request('/api/fake/addresses', 'GET', params);
  }

  fakeTexts(params?: { _quantity?: number; _locale?: string; _characters?: string; _seed?: number }) {
    return this.request('/api/fake/texts', 'GET', params);
  }

  fakePersons(params?: { _quantity?: number; _locale?: string; _gender?: string; _seed?: number; _birthday_start?: string; _birthday_end?: string }) {
    return this.request('/api/fake/persons', 'GET', params);
  }

  fakeBooks(params?: { _quantity?: number; _locale?: string; _seed?: number }) {
    return this.request('/api/fake/books', 'GET', params);
  }

  fakeImages(params?: { _quantity?: number; _locale?: string; type?: string; _seed?: number; width?: string; height?: string }) {
    return this.request('/api/fake/images', 'GET', params);
  }

  fakeCredits(params?: { _quantity?: number; _locale?: string; _seed?: number }) {
    return this.request('/api/fake/credits', 'GET', params);
  }

  fakeCompanies(params?: { _quantity?: number; _locale?: string; _seed?: number }) {
    return this.request('/api/fake/companies', 'GET', params);
  }

  fakePlaces(params?: { _quantity?: number; _locale?: string; _seed?: number }) {
    return this.request('/api/fake/places', 'GET', params);
  }

  fakeProducts(params?: { _quantity?: number; _locale?: string; _taxes?: string; _seed?: number; _price_min?: string; price_max?: string; _categories_type?: string }) {
    return this.request('/api/fake/products', 'GET', params);
  }

  // ==================== FAKE STORE ====================
  storeAddProduct(body: Record<string, any>) {
    return this.request('/api/store/add/products', 'POST', undefined, body, 'body');
  }

  storeDeleteProduct(params: { id: string }) {
    return this.request('/api/store/products', 'DELETE', params, undefined, 'body');
  }

  storeUpdateProduct(params: { id: string }, body: Record<string, any>) {
    return this.request('/api/store/products', 'PUT', params, body, 'body');
  }

  storeAllProducts() {
    return this.request('/api/store/products', 'GET');
  }

  storeGetProduct(params: { id: string }) {
    return this.request('/api/store/product', 'GET', params);
  }

  storeAllCarts() {
    return this.request('/api/store/carts', 'GET');
  }

  storeAddCart(body: Record<string, any>) {
    return this.request('/api/store/carts', 'POST', undefined, body, 'body');
  }

  storeGetCart(params: { id: string }) {
    return this.request('/api/store/cart', 'GET', params);
  }

  storeUpdateCart(params: { id: string }, body: Record<string, any>) {
    return this.request('/api/store/carts', 'PUT', params, body, 'body');
  }

  storeDeleteCart(params: { id: string }) {
    return this.request('/api/store/carts', 'DELETE', params, undefined, 'body');
  }

  storeAllUsers() {
    return this.request('/api/store/users', 'GET');
  }

  storeAddUser(body: Record<string, any>) {
    return this.request('/api/store/users', 'POST', undefined, body, 'body');
  }

  // ==================== NEWS ====================
  AljazeeraEnglish() {
    return this.request('/api/news/aljazeera', 'GET');
  }
  
  AlJazeeraArticle(params: { url: string }) {
    return this.request('/api/aljazeera/article', 'GET', params);
  }
  
  AlJazeeraArabic() {
    return this.request('/api/news/aljazeera/ar', 'GET');
  }
  
  ArabicArticle(params: { url: string }) {
    return this.request('/api/aljazeera/article/ar', 'GET', params);
  }
  
  TRTWorld() {
    return this.request('/api/news/trt', 'GET');
  }
  
  TRTArticle(params: { url: string }) {
    return this.request('/api/trt/article', 'GET', params);
  }
  
  TRTAfrika() {
    return this.request('/api/news/trt/af', 'GET');
  }
  
  AfrikaArticle(params: { url: string }) {
    return this.request('/api/trt/article/af', 'GET', params);
  }
  
  SkyNews() {
    return this.request('/api/news/sky', 'GET');
  }
  
  SkyArticle(params: { url: string }) {
    return this.request('/api/sky/article', 'GET', params);
  }
  
  SkySports() {
    return this.request('/api/news/skysports', 'GET');
  }
  
  SportsArticle(params: { url: string }) {
    return this.request('/api/skysports/article', 'GET', params);
  }
  
  DawnNews() {
    return this.request('/api/news/dawn', 'GET');
  }
  
  DawnArticle(params: { url: string }) {
    return this.request('/api/dawn/article', 'GET', params);
  }
  
  CNNNews() {
    return this.request('/api/news/cnn', 'GET');
  }
  
  CNNArticle(params: { url: string }) {
    return this.request('/api/cnn/article', 'GET', params);
  }
  
  CGTNWorld() {
    return this.request('/api/news/cgtn', 'GET');
  }
  
  CGTNArticle(params: { url: string }) {
    return this.request('/api/cgtn/article', 'GET', params);
  }
  
  GeoUrdu() {
    return this.request('/api/news/geo', 'GET');
  }
  
  GeoArticle(params: { url: string }) {
    return this.request('/api/geo/article', 'GET', params);
  }
  
  GeoEnglish() {
    return this.request('/api/news/geo/en', 'GET');
  }
  
  GeoArticleEn(params: { url: string }) {
    return this.request('/api/geo/article/en', 'GET', params);
  }
  
  GeoSuper() {
    return this.request('/api/news/geosuper', 'GET');
  }
  
  SuperArticle(params: { url: string }) {
    return this.request('/api/geosuper/article', 'GET', params);
  }
  
  ExpressTribune() {
    return this.request('/api/news/tribune', 'GET');
  }
  
  TribuneArticle(params: { url: string }) {
    return this.request('/api/tribune/article', 'GET', params);
  }
  
  NeoNews() {
    return this.request('/api/news/neo', 'GET');
  }
  
  NeoArticle(params: { url: string }) {
    return this.request('/api/neo/article', 'GET', params);
  }
  
  ExpressNews() {
    return this.request('/api/news/express', 'GET');
  }
  
  ExpressArticle(params: { url: string }) {
    return this.request('/api/express/article', 'GET', params);
  }
  
  TheGuardian() {
    return this.request('/api/news/guardian', 'GET');
  }
  
  GuardianArticle(params: { url: string }) {
    return this.request('/api/guardian/article', 'GET', params);
  }
  
  AntaraNews() {
    return this.request('/api/news/antara', 'GET');
  }
  
  AntaraArticle(params: { url: string }) {
    return this.request('/api/antara/article', 'GET', params);
  }

  // ==================== STALKER ====================
  stalkPinterest(params: { username: string }) {
    return this.request('/api/stalk/pinterest', 'GET', params);
  }
  
  stalkGithub(params: { username: string }) {
    return this.request('/api/stalk/github', 'GET', params);
  }
  
  stalkInstagram(params: { username: string }) {
    return this.request('/api/stalk/instagram', 'GET', params);
  }
  
  stalkThreads(params: { username: string }) {
    return this.request('/api/stalk/threads', 'GET', params);
  }
  
  stalkTwitter(params: { username: string }) {
    return this.request('/api/stalk/twitter', 'GET', params);
  }
  
  stalkTelegram(params: { username: string }) {
    return this.request('/api/stalk/telegram', 'GET', params);
  }
  
  stalkTikTok(params: { username: string }) {
    return this.request('/api/stalk/tiktok', 'GET', params);
  }

  // ==================== SEARCH ====================
  searchGoogle(params: { query: string }) {
    return this.request('/api/search/google', 'GET', params);
  }

  searchBing(params: { query: string }) {
    return this.request('/api/search/bing', 'GET', params);
  }

  searchBaidu() {
    return this.request('/api/search/baidu', 'GET');
  }

  searchWeibo() {
    return this.request('/api/search/weibo', 'GET');
  }
  
  searchImgur(params: { query: string }) {
    return this.request('/api/search/imgur', 'GET', params);
  }

  searchTime(params: { query: string }) {
    return this.request('/api/search/time', 'GET', params);
  }

  searchFlicker(params: { query: string }) {
    return this.request('/api/search/flicker', 'GET', params);
  }

  searchItunes(params: { query: string }) {
    return this.request('/api/search/itunes', 'GET', params);
  }

  searchWattpad(params: { query: string }) {
    return this.request('/api/search/wattpad', 'GET', params);
  }

  searchStickers(params: { query: string }) {
    return this.request('/api/search/stickers', 'GET', params);
  }

  searchYoutube(params: { query: string }) {
    return this.request('/api/search/youtube2', 'GET', params);
  }

  searchTracks(params: { query: string }) {
    return this.request('/api/search/youtube2', 'GET', params);
  }
  
  searchGifs(params: { query: string }) {
    return this.request('/api/klipy/gif', 'GET', params);
  }

  searchMemes(params: { query: string }) {
    return this.request('/api/klipy/meme', 'GET', params);
  }

  // ==================== TOOLS ====================
  toolsCompress(params: { type: string; text: string }) {
    return this.request('/api/compress', 'GET', params);
  }

  toolsDecompress(params: { type: string; data: string }) {
    return this.request('/api/decompress', 'GET', params);
  }

  toolsBanklogo(params: { domain: string }) {
    return this.request('/api/tools/banklogo', 'GET', params);
  }
  
  toolsDetectLang(params: { text: string }) {
    return this.request('/api/tools/detect', 'GET', params);
  }

  toolsDictionary(params: { word: string }) {
    return this.request('/api/tools/dictionary', 'GET', params);
  }

  toolsDictionary2(params: { word: string }) {
    return this.request('/api/tools/dict', 'GET', params);
  }

  toolsMathematics(params: { expr: string }) {
    return this.request('/api/tools/math', 'GET', params);
  }

  toolsPreview(params: { url: string }) {
    return this.request('/api/tools/preview', 'GET', params);
  }

  toolsScreenshot(params: { url: string }) {
    return this.request('/api/tools/ssweb', 'GET', params);
  }

  toolsStyleText(params: { text: string }) {
    return this.request('/api/tools/styletext', 'GET', params);
  }

  toolsTranslate(params: { text: string; to: string }) {
    return this.request('/api/tools/translate', 'GET', params);
  }

  toolsTranslate2(params: { text: string; lang: string }) {
    return this.request('/api/go/translate', 'GET', params);
  }

  toolsPing(params: { url: string }) {
    return this.request('/api/simple/ping', 'GET', params);
  }

  toolsCounter(params: { count: number }) {
    return this.request('/api/tools/count', 'GET', params);
  }

  toolsHandwriting(params: { text: string }) {
    return this.request('/api/tools/handwrite', 'GET', params);
  }

  toolsTextStats(params: { text: string }) {
    return this.request('/api/tools/string', 'GET', params);
  }

  toolsWordCount(params: { text: string }) {
    return this.request('/api/word/count', 'GET', params);
  }

  toolsUnitConvert(params: { from: string; to: string; value: number }) {
    return this.request('/api/convert/unit', 'GET', params);
  }

  // ==================== MEMES ====================
  memesTwoButton(params: { text1: string; text2: string }) {
    return this.request('/api/meme/buttons', 'GET', params);
  }
  
  memesYelling(params: { text1: string; text2: string }) {
    return this.request('/api/meme/yelling', 'GET', params);
  }

  memesSuccess(params: { text1: string; text2: string }) {
    return this.request('/api/meme/success', 'GET', params);
  }

  memesPuppet(params: { text1: string; text2: string }) {
    return this.request('/api/meme/puppet', 'GET', params);
  }

  memesCouple(params: { text1: string; text2: string }) {
    return this.request('/api/meme/couple', 'GET', params);
  }

  memesSquid(params: { text1: string; text2: string }) {
    return this.request('/api/meme/squid', 'GET', params);
  }

  memesMask(params: { text1: string; text2?: string; text3?: string; text4?: string }) {
    return this.request('/api/meme/mask', 'GET', params);
  }

  memesDrowning(params: { text1: string; text2?: string; text3?: string; text4?: string }) {
    return this.request('/api/meme/drowning', 'GET', params);
  }

  memesDistracted(params: { text1: string; text2?: string; text3?: string }) {
    return this.request('/api/meme/boyfriend', 'GET', params);
  }

  memesExit(params: { text1: string; text2?: string; text3?: string }) {
    return this.request('/api/meme/exit', 'GET', params);
  }

  // ==================== PHOTOOXY ====================
  photoPubg(params: { text1: string; text2: string }) {
    return this.request('/api/photo/pubg', 'GET', params);
  }

  photoBattle(params: { text1: string; text2: string }) {
    return this.request('/api/photo/battle4', 'GET', params);
  }

  photoTikTok(params: { text1: string; text2: string }) {
    return this.request('/api/photo/tiktok', 'GET', params);
  }

  photoNeon(params: { text: string }) {
    return this.request('/api/photo/neon', 'GET', params);
  }

  photoWarface(params: { text: string }) {
    return this.request('/api/photo/warface', 'GET', params);
  }

  photoWarface2(params: { text: string }) {
    return this.request('/api/photo/warface2', 'GET', params);
  }

  photoLeague(params: { text: string }) {
    return this.request('/api/photo/league', 'GET', params);
  }

  photoLolCover(params: { text: string }) {
    return this.request('/api/photo/lolcover', 'GET', params);
  }

  photoLolShine(params: { text: string }) {
    return this.request('/api/photo/lolshine', 'GET', params);
  }

  photoMetal(params: { text: string }) {
    return this.request('/api/photo/darkmetal', 'GET', params);
  }

  // ==================== EPHOTO360 ====================
  ephotoDeadpool(params: { text1: string; text2: string }) {
    return this.request('/api/ephoto/deadpool', 'GET', params);
  }

  ephotoWolf(params: { text1: string; text2: string }) {
    return this.request('/api/ephoto/wolf', 'GET', params);
  }

  ephotoShirt(params: { text1: string; text2: string }) {
    return this.request('/api/ephoto/shirt', 'GET', params);
  }

  ephotoPencil(params: { text1: string; text2: string }) {
    return this.request('/api/ephoto/sketch', 'GET', params);
  }

  ephotoThor(params: { text1: string; text2: string }) {
    return this.request('/api/ephoto/thor', 'GET', params);
  }

  ephotoRoyal(params: { text: string }) {
    return this.request('/api/ephoto/royal', 'GET', params);
  }

  ephotoComic(params: { text: string }) {
    return this.request('/api/ephoto/comic', 'GET', params);
  }

  ephotoWings(params: { text: string }) {
    return this.request('/api/ephoto/angel', 'GET', params);
  }

  ephotoFps(params: { text: string }) {
    return this.request('/api/ephoto/game', 'GET', params);
  }

  ephotoMetal(params: { text: string }) {
    return this.request('/api/ephoto/mavatar', 'GET', params);
  }

  // ==================== INFORMATION ====================
  infoGithubUser(params: { username: string }) {
    return this.request('/api/github/user', 'GET', params);
  }

  infoGithubRepo(params: { owner: string; repo: string }) {
    return this.request('/api/github/repo', 'GET', params);
  }

  infoIMDb(params: { query: string }) {
    return this.request('/api/info/imdb', 'GET', params);
  }

  infoTMDb(params: { query: string }) {
    return this.request('/api/info/tmdb', 'GET', params);
  }

  infoUniversity(params: { country: string }) {
    return this.request('/api/info/university', 'GET', params);
  }

  infoIP(params: { ip: string }) {
    return this.request('/api/info/ip', 'GET', params);
  }

  infoTrends(params: { country: string }) {
    return this.request('/api/info/trends', 'GET', params);
  }

  infoWeather(params: { city: string }) {
    return this.request('/api/weather/info', 'GET', params);
  }

  infoCountry(params: { name: string }) {
    return this.request('/api/info/country', 'GET', params);
  }

  infoWikipedia(params: { query: string }) {
    return this.request('/api/info/wiki', 'GET', params);
  }

  // ==================== CRYPTO ====================
 CryptoPrice(params: { id: string }) {
  return this.request('/api/info/crypto', 'GET', params);
 }

 cryptoList() {
  return this.request('/api/crypto/tags', 'GET');
 }

  // ==================== UTILITY METHODS ====================
  setFullResponse(value: boolean): void {
    this.fullResponse = value;
  }

  getFullResponse(): boolean {
    return this.fullResponse;
  }

  setAPIKey(apiKey: string): void {
    this.apiKey = apiKey;
  }

  setTimeout(timeout: number): void {
    this.timeout = timeout;
  }
}

export default DiscardAPI;
export { DiscardAPI, DiscardAPIConfig, APIResponse };
