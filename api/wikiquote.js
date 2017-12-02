'use strict';

const mwApi = require('nodemw');
const cheerio = require('cheerio');

var client = new mwApi({
  protocol: 'https',
  server: 'en.wikiquote.org',
  path: '/w',
  debug: true
});

module.exports = {
  get: get
};

function quoteBlockFromIndex(index, pageId) {
  let promise = new Promise((resolve, reject) => {
    let params = {
      action: 'parse',
      format: 'json',
      section: index,
      pageid: pageId};
    client.api.call(params, function(err, data) {
      if(data.text){
        resolve(data.text);
      } else if (err) {
        reject(err);
      } else {
        reject(`No text block in section of index ${index} in page ${key}`);
      }
    });
  });
  return promise;
}

function indexOfQuoteSection(sections) {
  let promise = new Promise((resolve,reject) => {
    var found = false;
    for (var i in sections) {
      if(sections[i].line.includes('Quotes')){
        found = true;
        resolve(sections[i].index);
      }
    }
    if(!found) {
      reject(`No id found for sections ${sections}`);
    }
  });
  return promise;
}

function sectionsOfPage(pagekey) {
  let promise = new Promise((resolve, reject) => {
    let params = {
      action: 'parse',
      format: 'json',
      prop: 'sections',
      pageid: pagekey
    };
    client.api.call(params, function(err, data) {
      if(data.sections){
        resolve(data.sections);
      } else if (err) {
        reject(err);
      } else {
        reject(`No sections found for page id ${pagekey}`);
      }
    });
  });
  return promise;
}

function quotePage() {

  let promise = new Promise((resolve, reject) => {
    var params = {
      action: 'query',
      generator: 'random',
      grnnamespace: '0',
      grnlimit: '1'};

    client.api.call(params, function(err, info, next, data){
      if(err) {
        reject(err);
      }

      var pagesArr = Object.entries(data.query.pages);
      if(pagesArr[0][0]) {
        resolve(pagesArr[0][0]);
      } else {
        reject('No page id found')
      }
    });
  });
  return promise;
}

function getQuotesBlock(callback) {
  var pid;
  quotePage().then(pageId => {
    console.log(`PageID: ${pageId}`);
    pid = pageId;
    return sectionsOfPage(pageId)
  }).then(sections => {
    console.log(`Sections: ${sections}`);
    return indexOfQuoteSection(sections)
  }).then(index => {
    console.log(`Quote section index: ${index}`);
    return quoteBlockFromIndex(index, pid)
  }).then(htmlObj => {
    if(htmlObj) {
      var quotesBlock = htmlObj;
      callback(quotesBlock);
    }

  }).catch((err) => {
    console.log(err);
    getQuotesBlock(callback);
  });
}

function get(callback) {
  getQuotesBlock(block => {
    // Will now have quote data in quotesBlock
    console.log(block);
    var quoteHtml = block['*'];
    htmlToSingleQuote(quoteHtml).then(quote => {
      callback(quote);
    });
  });
}

function htmlToSingleQuote(html) {
  // Quotes are in li elements
  let promise = new Promise((resolve,refuse) => {
    const $ = cheerio.load(html);
    var q = $('ul').children().first().text();
    if(q){
      resolve(q);
    } else {
      reject('no quote');
    }
  });
  return promise;
}
