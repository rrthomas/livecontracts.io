var userLang;
var vatCountries = [];
var wavesWallet = null;
var ltoRates = {};
var bonusRate = 0;
var paymentOptions = [
  { value: "creditcard", text: "Credit Card" },
  { value: "ideal", text: "iDeal" }
];

var saleDate;
var today;

var currentCollapsedFaq = '';

$(window).load(function () {
  /* only if you want use mcustom scrollbar */
  $(".sf-step").mCustomScrollbar({
    theme: "dark-3",
    scrollButtons: {
      enable: true
    }
  });
});

function collapseFaq(id) {
  if (currentCollapsedFaq === id) {
    return;
  }

  currentCollapsedFaq = id;

  var collapseBlock = '#' + id + '-section';

  $('.faq-content').removeClass('visible');

  setTimeout(function() {
    $(collapseBlock).addClass('visible');
  }, 500);

  $('.faq-category').removeClass('active');
  $('#' + id).addClass('active');
}

$(document).ready(function () {
  today = new Date();
  var isShowingMore = false;

  redirectUserToLocalSite();
  getSaleDate();

  var files = [
    { url: 'http://www.4-traders.com/BLOCKCHAIN-GROUP-CO-LTD-6165838/news/Blockchain-LegalThings-to-digitise-law-on-Blockchain-25681815/', img: '4-traders.png' },
    { url: 'https://advocatenblad.nl/2017/10/19/legalthings-one-smart-contracts/', img: 'advocatenblad.png' },
    { url: 'https://www.businessinsider.com/legalflings-blockchain-based-app-for-sexual-consent-2018-1?international=true&r=US&IR=T', img: 'business_insider.png' },
    { url: 'https://www.usatoday.com/story/tech/columnist/2018/02/20/sexual-consent-apps-set-rules-intimacy-come-their-own-risks/328635002/', img: 'usa_today.png'},
    { url: 'https://www.blockchainadvisormag.com/2017/12/16/ethereum-competitor-legalthings-to-digitise-law-on-blockchain-for-the-dutch-district-attorneys-office/', img: 'blockchainadvisor.png'},
    { url: 'https://nypost.com/2018/01/11/contracts-for-consensual-one-night-stands-theres-an-app-for-that/', img: 'new_york_post.png'},
    { url: 'https://btcmanager.com/dutch-ministry-justice-commissions-digitizes-law-blockchain/', img: 'btc-manager.png' },
    { url: 'https://fortune.com/2018/01/16/consent-app-me-too/', img: 'fortune.png' },
    { url: 'https://headlines.yahoo.co.jp/hl?a=20180121-00010001-binsider-sci', img: 'yahoo_japan.png'},
    { url: 'https://www.emerce.nl/wire/legalthings-lanceert-succesvolle-token-sale-nederland-nederlandse-ethereumconcurrent-digitaliseert-wet-regelgeving-via-blockchain', img: 'emerce.png'},
    { url: 'https://www.independent.co.uk/life-style/consent-app-sexual-contracts-legalthings-phone-std-free-guarantee-a8154591.html', img: 'independent.png' },
    { url: 'https://g1.globo.com/pop-arte/noticia/depois-de-metoo-aplicativo-permite-dar-consentimento-legal-a-sexo.ghtml', img: 'globo.png'},
    { url: 'http://www.elektroniknet.de/markt-technik/kommunikation/legalthings-digitalisiert-hollaendisches-gesetzgebung-148902.html', img: 'markt-technik.png'},
    { url: 'https://metro.co.uk/2018/01/10/app-creates-legally-binding-contracts-one-night-stands-prove-sex-consensual-7220206/', img: 'metro.png'},
    { url: 'https://www.nrc.nl/nieuws/2018/02/20/seks-eerst-even-je-handtekening-a1592916', img: 'nrc.png'},
    { url: 'https://thenextweb.com/apps/2018/01/11/seeking-consent-before-sex-theres-a-blockchain-based-app-for-that', img: 'the_next_web.png'},
    { url: 'https://www.tahawultech.com/cnme/news/legalthings-digitise-law-blockchain/', img: 'tahawul-tech.png'},
    { url: 'https://nos.nl/op3/artikel/2211488-nos-op-3-tech-podcast-appcontract-voor-je-seks-hebt.html', img: 'nos.png'},
    { url: 'https://www.complex.com/life/2018/01/legalfling-app-consensual-sex', img: 'complex.png'},
    { url: 'https://www.jinse.com/blockchain/116008.html', img: 'jinse.png' },
    { url: 'https://www.vogue.nl/cultuur/nieuws/artikel/voor-seks-eerst-een-contract-tekenen-deze-nederlandse-app-maakt-het-mogelijk', img: 'vogue.png' },
    { url: 'https://www.artificiallawyer.com/2018/01/10/legal-fling-blockchain-contracts-for-legally-binding-consensual-encounters/', img: 'artificial_lawyer.png' },
    { url: 'http://link.law.com/public/11641586', img: 'law.png' }
  ];

  $('#media-logos').append('<div class="media-slider">');

  for (var i = 0; i < files.length; i++) {
    if (i % 5 === 0) {
      $('.media-slider').append('<br/>');
    }

    $('.media-slider').append('<a href="' + files[i].url + '" target="_blank"><img style="margin: 16px;max-width: 150px;filter: grayscale(100%)" src="img/media/' + files[i].img + '"></a>');
  }

  collapseFaq('about-lto');

  $('.faq-category').click(function(e) {
     var id = e.target.id;
    collapseFaq(id);
  });

  if ($(".quote").length > 0) {
    quotesAnimation();
  }

  $('#wallet').on('change', function(newValue) {
    validateWavesAddress(newValue.target.value);
  });

  $("#lto-amount").on("keypress blur",function (event) {
    $(this).val($(this).val().replace(/[^0-9\.]/g,''));
    if ((event.which != 8 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
      event.preventDefault();
    }
  });

  $('#lto-amount').on('input', function (newValue) {
    calculateRate();
  });

  $('#price-currency').on('change', function (newValue) {
    calculateRate();
  });

  $('#toc-agreement').on('click', function(event) {
    if (event.target.checked) {
      $('#pay').removeAttr('disabled');
    } else {
      $('#pay').attr('disabled', 'disabled');
    }
  });

  $('#billing-company').on('change', function(newValue) {
    if (newValue.target.value.length && newValue.target.value.length > 0) {
      changeBillingAddress(true);
    } else {
      changeBillingAddress(false);
    }
  });

  $('#billing-country').on('change', function(newValue) {
    if (newValue.target.value) {
      changeVAT(newValue.target.value, true);
    } else {
      changeVAT(newValue.target.value, false);
    }
  });


  $('#show-more').click(function() {
    if(!isShowingMore) {
      isShowingMore = true;
      $('.show-more').slideDown(500);
      $('#show-more').text('Less team members');
    }
    else {
      isShowingMore = false;
      $('.show-more').slideUp(500);
      $('#show-more').text('More team members');
    }
  });

  eventForMobileTooltip();
  // populateExploreBlock();
  manipulatingHeader();
  loadTokens();
  wizardInit();
  closePopup();
  scrollToBlock();
  bindingWizardsTabs();
  initSubscribeMailChimp();
  timelineInit();
  initWalletChoice();
  createWavesWallet();
  handlePayment();
});

function redirectUserToLocalSite() {
  userLang = navigator.language || navigator.userLanguage;
  var wasRedirected = localStorage.getItem('wasRedirectedToLocale');

  var currentUrl = window.location.pathname.split('/');
  var currentPage = currentUrl[currentUrl.length - 1];

  if (currentPage === '' && userLang.indexOf('pt') > -1 && !wasRedirected) {
    localStorage.setItem("wasRedirectedToLocale", true);
    window.location.href = 'br';
  }
}

function changeBillingAddress(required) {
  if (required) {
    $('#billing-address').attr('required', 'required');
    $('#billing-postcode').attr('required', 'required');
    $('#billing-city').attr('required', 'required');
    $('#billing-country').attr('required', 'required');

    $('.address-required-labels').css('display', 'inline-block');
  } else {
    $('#billing-address').removeAttr('required');
    $('#billing-postcode').removeAttr('required');
    $('#billing-city').removeAttr('required');
    $('#billing-country').removeAttr('required');

    $('.address-required-labels').css('display', 'none');
  }
}

function changeVAT(selectedCountry, required) {
  if (vatCountries.indexOf(selectedCountry) > -1) {
    $('#billing-vat-container').css('display', 'block');
  } else {
    $('#billing-vat-container').css('display', 'none');
  }
}


//init for pie chart

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

// init add open wallet choice
function initWalletChoice() {
  $("#create-wallet").show();
  $("#enter-wallet").hide();
  $('#generated-address').hide();
  $('#generate-address').show();

  if (wavesWallet) {
    $('#generated-address').show();
    $('#generate-address').hide();
  }

  $("#wallet-choice").change(function() {
    var value = $( this ).val();
    if (value === 'yes') {
      showEnterWallet();
    } else {
      showCreateWallet();
    }
  });
}

function showCreateWallet() {

  $("#create-wallet").show();
  $("#enter-wallet").hide();

  if (wavesWallet) {
    $('#generated-address').show();
    $('#generate-address').hide();
  } else {
    $('#generated-address').hide();
    $('#generate-address').show();
  }
}

function showEnterWallet() {
  $("#create-wallet").hide();
  $("#enter-wallet").show();
}

function createWavesWallet() {
  $('#create-waves-wallet').click(function(){
    $.ajax({
      url: waves_server + "/api/wallet",
      success: function (result) {
        wavesWallet = result.address;
        $('#wallet').val(result.address);
        $('#seed').html(result.seed);
        $('#wallet-address').html(result.address);
        $('#download-seed').attr('href','data:application/octet-stream;charset=utf-8;base64,' + result.base64).attr("download", "waves-wallet.txt");;
        showCreateWallet();
      }
    });
  });
}

function getVATCountries() {
  if (vatCountries && vatCountries.length > 0) {
    return;
  }

  $.ajax({
    url: waves_server + "/api/countries",
    success: function (result) {
      vatCountries = result;
    }
  });
}

function getSaleDate() {
  $.ajax({
    url: waves_server + "/api/sale",
    success: function(result) {
      saleDate = {
        startDate: new Date(result['start_date']),
        endDate: new Date(result['end_date'])
      };

      $('.count-down').attr('data-end-date', saleDate.endDate);
      initTimer();

      if (today.getTime() > saleDate.startDate.getTime() &&
          today.getTime() < saleDate.endDate.getTime()) {
        enableBuyButton();
      } else {
        enableSubscribeButton();
      }
    },
    error: function() {
      enableSubscribeButton();
    }
  });
}

function enableSubscribeButton() {
  const btnText = userLang.indexOf('pt') > -1 ? 'Se inscrever' : 'Subscribe now';
  $('.lc-primary-action').text(btnText).addClass('js-open-wishlistPopup');

  $('.js-open-wishlistPopup').on('click', function (e) {
    e.preventDefault();
    $('html').addClass('lock');
    $('.popup.js-wishlist-popup').removeClass('popup-hide');
    $('.popup__close').on('click', function (e) {
      e.preventDefault();
      $('html').removeClass('lock');
      $('.popup.js-wishlist-popup').addClass('popup-hide')
    })
  });
}

function enableBuyButton() {
  const btnText = userLang.indexOf('pt') > -1 ? 'Compre tokens LTO' : 'Buy LTO Tokens';
  $('.lc-primary-action').text(btnText).addClass('js-open-wizard');
  $('.count-down-wrap').removeClass('hidden');

  $(".js-open-wizard").on('click', function (e) {
    e.preventDefault();
    $('html').addClass('lock')
    $('.popup-container').removeClass('popup-hide')
    $('.popup-backdrop').removeClass('popup-hide')
    $('.popup').removeClass('popup-hide')
  });
}

function getRates() {
  $('#rates-message').text('Please wait while we fetch the current rates...');
  $('#rates-message').addClass('visible');

  $.ajax({
    url: waves_server + "/api/rates",
    success: function (result) {
      ltoRates = result;

      $.each(ltoRates, function (i, item) {
        $('#price-currency').append($('<option>', {
          value: item.currency,
          text : item.currency
        }));
      });

      $('#rates-message').removeClass('visible');
      $('#rates-message').css('display', 'none');
      $('#price').val('0');
      calculateRate();
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      $('#rates-message').text('An error has occurred while trying to fetch the current rates. Please try again later.');
    }
  });
}

function calculateRate() {
  if (!ltoRates.length) {
    return;
  }

  var selectedCurrency = $('#price-currency').val();
  var ltoAmount = $('#lto-amount').val();

  if (ltoAmount === '') {
    return;
  }

  var currentCurrency = ltoRates.find(r => r.currency === selectedCurrency);
  var bonusTokens = Math.ceil(parseFloat(ltoAmount * bonusRate));
  var totalLtos = parseInt(ltoAmount) + parseInt(bonusTokens);

  if (currentCurrency) {
    var decimals = currentCurrency.currency === 'USD' || currentCurrency.currency === 'EUR'|| currentCurrency.currency === 'BRL' ? 2 : 6;
    var total = parseFloat(parseInt(ltoAmount) * parseFloat(currentCurrency.rate)).toFixed(decimals);
    $('#price').val(total);
    $('#amount-bonus').html(bonusTokens);
    $('#amount-total').html(totalLtos);
  }

  $('#amount-users').text(Math.floor(ltoAmount / 500));
  $('#amount-contracts').text(Math.floor(ltoAmount / 1000) * 5);
  $('#amount-interactions').text(Math.floor(ltoAmount / 1000) * 250);
  $('#amount-packages').text(Math.min(Math.floor(ltoAmount / 10000), 4));
  $('#amount-nodes').text(ltoAmount > 100000 ? 1 : 0);
}


function handlePayment() {
  $('#pay').click(function() {
    $('#pay').attr('disabled', 'disabled');
    var user = collectUserInfo();
    var organization = convertUserToOrg(user);
    var ref = getParameterByName('ref');
    var amount = $('#lto-amount').val();
    var wallet = $('#wallet').val();
    var currency = $('#price-currency').val();
    var provider = getPaymentProvider($('#payment-choice').val(), currency);
    var price = $('#price').val();

    if (currency == 'BRL') {
      provider = 'creditcard';
    }

		var data = {};
		data.user = user;
		data.organization = organization;
        data.ref = ref;
		data.return_url = 'https://livecontracts.io/thankyou.html';
		data.notify_url = waves_server + '/api/payment/notify';
		data.quantity = parseInt(amount);
		data.wallet = wallet.trim();
		data.currency = currency;
		data.provider = provider;

    var validWallet = checkWalletAddress(wallet, function(err, validWallet) {
      if (!validWallet) {
        $('#error-payment').html('Invalid waves wallet address entered please correct it in previous step');
        $('#error-payment').show();
        return;
      }

  	  $('#error-payment').hide();


  	  if (provider === 'creditcard') {
    		stripeCheckout(data, price);
  	  } else if (provider == 'ideal') {
        if (data.currency == "USD" || data.currency == "BRL") {
          data.currency = "EUR";
        }
        startPayment(data);
      } else {
  		  startPayment(data);
  	  }
		});
	})
}

function startPayment(data) {
  $('#progress-bar').addClass('visible');

	$.ajax({
    url: waves_server + "/api/payment/start",
    type: "POST",
    data: JSON.stringify(data),
    contentType: "application/json",
    dataType: "json",
    success: function (result) {
      $('#pay').removeAttr('disabled');
      $('#progress-bar').removeClass('visible');

  		if (!result.transaction.id) {
  			$('#error-payment').html('Failed to complete transaction, please contact us on one of our social channels.');
  			$('#error-payment').show();
  		}

  	  if (result.transaction.external_payment_url) {
  		  window.location.href = result.transaction.external_payment_url;
  	  } else {
  		  window.location.href = data.return_url;
  	  }
    },
    error: function(XMLHttpRequest, textStatus, errorThrown) {
      $('#progress-bar').removeClass('visible');
      $('#error-payment').html('Failed to complete transaction, please contact us on one of our social channels.');
      $('#error-payment').show();
    }
  });
}

  function getPaymentProvider(provider, currency) {
    const prov = provider.toLowerCase().trim();
    const cur = currency.toLowerCase().trim();

    if (['usd', 'eur'].indexOf(cur) === -1) {
      return 'crypto';
	}

	return prov;
  }

function collectUserInfo() {
  var user = {};
  user.first_name = $('#billing-firstname').val();
  user.last_name = $('#billing-lastname').val();
  user.email = $('#billing-email').val();
  user.company = $('#billing-company').val();
  user.address = $('#billing-address').val();
  user.postcode = $('#billing-postcode').val();
  user.city = $('#billing-city').val();
  user.country = $('#billing-country').val();
  user.vat_number = $('#billing-vat').val();

  return user;
}

function convertUserToOrg(user) {

  var address = {};
  address.street = user.address;
  address.postcode = user.postcode;
  address.city = user.city;
  address.country = user.country;

  var organization = {};
  organization.id = user.email;
  organization.name = user.company == "" ? user.first_name + " " + user.last_name : user.company;
  organization.email = user.email;
  organization.address = address;
  organization.vat_number = user.vat_number;

  return organization;
}

function loadCheckoutInformation() {
  var user = collectUserInfo();

  if (user.company == "") {
    $('#checkout-company').hide();
  } else {
    $('#checkout-company').show();
    $('#checkout-company').html(user.company);
  }

  $('#checkout-name').html(user.first_name + " " + user.last_name);
  $('#checkout-email').html(user.email);
  $('#checkout-address').html(user.address);
  $('#checkout-city').html(user.postcode + ", " + user.city);
  $('#checkout-country').html(user.country);
  $('#checkout-wallet').html($('#wallet').val());

  var tokens = $('#lto-amount').val();
  var bonusTokens = $('#amount-bonus').text();
  var totalTokens = $('#amount-total').text();
  var price = $('#price').val();
  var currency = $('#price-currency').val();

  $('#checkout-tokens').html("<strong>" + tokens + "</strong>");
  $('#checkout-bonus').html("<strong>" + bonusTokens + "</strong>");
  $('#checkout-total-tokens').html("<strong>" + totalTokens + "</strong>");
  $('#checkout-total-price').html("<strong>" + price + " " + currency + "</strong>");

  if (currency === "EUR" || currency === "USD") {
    $('#payment-choice').show();
  } else {
    $('#payment-choice').hide();
  }
}

//function for animating quotes on scroll
//function for animating quotes on scroll
function quotesAnimation() {

  var quote = document.getElementsByClassName('quote');
  quote[0].classList.add('quoteActive');

  for (let i = 0; i < quote.length; i++) {
    window.addEventListener('scroll', function () {
      var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      var parent = $('.top-quotes-block');
      var main = parent.offset().top - (parent.height());

      if (scrollTop <= main) {
        quote[i].classList.remove('quoteActive');
        quote[0].classList.add('quoteActive');
      } else if (scrollTop <= (main + 200)) {
        quote[i].classList.remove('quoteActive');
        quote[1].classList.add('quoteActive');
      } else if (scrollTop <= (main + 400)) {
        quote[i].classList.remove('quoteActive');
        quote[2].classList.add('quoteActive');
      }
    })
  }

}


// animation for quotes

$.fn.extend({
  animateCss: function (animationName, callback) {
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    this.addClass('animated ' + animationName).one(animationEnd, function () {
      $(this).removeClass('animated ' + animationName);
      if (callback) {
        callback();
      }
    });
    return this;
  }
});

//function for timeline init and animation

function timelineInit() {
  (function ($) {
    $.fn.timeline = function () {
      var selectors = {
        id: $(this),
        item: $(this).find(".timeline-item"),
        activeClass: "timeline-item--active",
        img: ".timeline__img"
      };
      selectors.item.eq(0).addClass(selectors.activeClass);
      $("#timeline-background").css(
        "background-image",
        "url(" +
        selectors.item
        .first()
        .find(selectors.img)
        .attr("src") +
        ")"
        );
      var itemLength = selectors.item.length;
      $(window).scroll(function () {
        var max, min;
        var pos = $(this).scrollTop() + 150;
        selectors.item.each(function (i) {
          min = $(this).offset().top;
          max = $(this).height() + $(this).offset().top;
          var that = $(this);
          if (i == itemLength - 2 && pos > min + $(this).height() / 6) {
            selectors.item.removeClass(selectors.activeClass);
            $("#timeline-background").css(
              "background-image",
              "url(" +
              selectors.item
              .last()
              .find(selectors.img)
              .attr("src") +
              ")"
              );
            selectors.item.last().addClass(selectors.activeClass);
          } else if (pos <= max && pos >= min) {
            $("#timeline-background").css(
              "background-image",
              "url(" +
              $(this)
              .find(selectors.img)
              .attr("src") +
              ")"
              );
            selectors.item.removeClass(selectors.activeClass);
            $(this).addClass(selectors.activeClass);
          }
        });
      });
    };
  })(jQuery);

  $("#timeline-1").timeline();

}


//function for showing tooltips on timeline on mobile

function eventForMobileTooltip() {
  if (window.innerHeight > window.innerWidth) {
    $('.timeline .event').on('click', function () {
      $(this).find('.hover-block').toggleClass('open')
    })
  }
}

//function for same tabs in Wizard on 4 and 5 steps

function bindingWizardsTabs() {

  var bitcoinTab = $('.bitcoin-tab')
  var bitcoinContent = $('.bitcoin-content')

  var ethererumTab = $('.ethererum-tab')
  var ethererumContent = $('.ethererum-content')

  $('.tab-nav li').on('click', function () {
    if ($(this).hasClass('bitcoin-tab')) {
      bitcoinTab.addClass('active')
      bitcoinContent.addClass('active')

      ethererumTab.removeClass('active')
      ethererumContent.removeClass('active')
    }
    if ($(this).hasClass('ethererum-tab')) {
      bitcoinTab.removeClass('active')
      bitcoinContent.removeClass('active')

      ethererumTab.addClass('active')
      ethererumContent.addClass('active')
    }
  })

}

// Global variables leave here, pls

var sfw;
var next_loading = false;
var waves_server = 'https://waves.legalthings.io';

//function for smooth scroll to block

function scrollToBlock() {
  $('.js-scrollToBlock').on('click', function (e) {
    e.preventDefault();
    // console.log($(this).attr('href'))
    var blockOffset = $($(this).attr('href')).offset().top;

    $('html, body').animate({
      scrollTop: blockOffset - 96
    }, 2000);
  })

}

//Function that populate blocks in "Explore".

function populateExploreBlock() {
  var explore = [
  {
    "link": "documents/contract-as-automaton.pdf",
    "img": "img/explore/contract-as-automaton.png",
    "title": "Live Contracts — What’s all the fuss about?",
    "intro": "We show that the fundamental legal structure of a well-written financial contract follows a " +
    "statetransition logic that can be formalized mathematically as a finite-state machine (also known as a " +
    "finitestate automaton)."
  },
  {
    "link": "https://medium.com/@rick_42072/live-contracts-whats-all-the-fuss-about-62b167d9a4d4",
    "img": "img/three_common.jpg",
    "title": "Live Contracts — What’s all the fuss about?",
    "intro": "Picture this. A contract or law visualized in such a way that it is understandable for humans and " +
    "computers. Not only the rules that you are agreeing upon in the contract, but also the consequences behind " +
    "those rules. With our solution Live Contracts, we enable equality of rights for all parties involved."
  },
  {
    "link": "documents/livecontracts-at-codex.pdf",
    "img": "img/explore/livecontracts-at-codex.png",
    "title": "Introducing Live Contracts @ Stanford CodeX",
    "intro": "A Live Contract is an agreement that is formalized as a Finite State Machine. LegalThings One runs" +
    " Live Contracts and stores information in a provable, immutable way on a public decentralized storage."
  }
  ];

  $('.populate-block .loading .fa').addClass('spinning')
  var block = $('#blog-grid');
  var count = explore.length;


  $.each(explore, function (key, value) {
    block.append([
      '<div class="isotope-item blog-item" style="position: absolute; left: 0px; top: 0px;">',
      '<div class="blog-media">',
      '<a href="' + value.link + '" target="_blank" class="text-light blog-image">',
      '<img src=' + value.img + ' alt="SEO IMG NAME">' + '<div class="overlay-caption hidden-on-start">',
      '<h6 class="caption-sub portfolio-category subtitle-2"></h6>',
      '<h4 class="caption-name portfolio-name uppercase"></h4>',
      '</a>',
      '</div>',
      '<div class="blog-desc align-center">',
      '<div class="blog-headline">',
      '<h5 class="post-name"><a href="' + value.link + '" target="_blank"><strong>' + value.title + '</strong></a></h5>',
      '</div>',
      '<p>' + value.intro + '</p>',
      '</div>',
      '</div>'
      ].join(''));
    if (key + 1 === count) {
      setTimeout(function () {
        $('.populate-block .loading').addClass('close');
        block.css('opacity', "1");
      }, 3000)
    }
  })
}

//Show/hide header
function manipulatingHeader() {
  var header = $('#header');
  var topBlockHeight = $('#hero').height();
  var new_offset = 100;

  $(window).resize(function () {
    topBlockHeight = $('#hero').height();
  });
  $(window).scroll(function () {
    var scrollFromTop = $(document).scrollTop();

    if (scrollFromTop > new_offset) {
      header.addClass('custom-visible')
    } else {
      header.removeClass('custom-visible')
    }
  })

}

//loading data about tokens status
// function loadTokens() {
// 	var currentTokens = $('#current-tokens-sold');
// 	var allTokens = $('#all-tokens');
// 	$.ajax({
// 		url: waves_server + "/api/balance",
// 		success: function (result) {
// 			var totalTokens = 100000000;
// 			var presaleLimit = 10000000;
// 			var tokensLeft = result.balance / 100000000;

// 			// var total =
// 			var sold = total - (result.balance / 100000000);
// 			var cap = 10000000;

// 			$('.progress-active').attr('data-perc', (sold / cap) * 100);

// 			currentTokens.html(sold.formatMoney(0, '.', ','));
// 			allTokens.html(cap.formatMoney(0, '.', ','));
// 		}
// 	})
// }


//loading data about tokens status
function loadTokens() {
	var currentTokens = $('.current-tokens-sold');
	var allTokens = $('.progress-end');

  $.ajax({
		url: waves_server + "/api/balance",
		success: function (result) {
      // fetch bonus from backend
      // if (result.phases && result.phases.bonus) {
      //   bonusRate = result.phases.bonus;
      // } else {
      //   $('.bonus-tokens-msg').css('display', 'none');
      // }

			var cap = 10000000;
			var presaleLimit = parseFloat(result.phases.presale.limit / 1000000000, 10);
			var presaleAvailable = parseFloat(result.balance / 100000000, 10);
			var sold = presaleLimit - presaleAvailable;

			$('.progress-active').attr('data-perc', (sold / presaleLimit) * 100);

      currentTokens.html(sold.formatMoney(0, '.', ','));
      allTokens.html(cap.formatMoney(0, '.', ','));
    }
  })
}


//loading data about tokens status
function validateWavesAddress(address) {
  $('#wallet').parsley().removeError('required');

  if (!address || !address.length) {
    return;
  }

  checkWalletAddress((address), function(err, valid){
    if (!valid) {
      $('#wallet').parsley().addError('required', { message: 'Invalid Waves wallet address', updateClass: true });
    } else {
      $('#wallet').parsley().removeError('required');
    }
  });
}

function checkWalletAddress(address, callback) {
  $.ajax({
    url: waves_server + `/api/wallet/${address}/validate`,
    success: function (result) {
      callback(null, result.valid)
    },
    error: function (req, status, err) {
      callback(err);
    }
  })
}

function disableNextToDownloadSeed() {
  if (!$('.next-btn').hasClass('disabled')) $('.next-btn').addClass('disabled');

  if (!$('.sf-controls span').length) {
    $('.sf-controls').append('<span class="parsley-required span-seed-msg">Please download your seed to continue</span>');
  }

  $('#download-seed').click(function() {
    $('.next-btn').removeClass('disabled');
    $('.sf-controls').find('span').remove();
  });
}


//init of wizard steps
function wizardInit() {
  sfw = $("#wizard").stepFormWizard({
    markPrevSteps: true,
    onPrev: function() {
      if ($("#pay").hasClass('visible')) {
        $("#pay").removeClass('visible');
      }
    },
    onNext: function(i) {
      loadCheckoutInformation();
      return $("#wizard").parsley().validate('block' + i);
    },
    onFinish: function() {
      return $("#wizard").parsley().validate();
    },
    onSlideChanged: function(to, data) {
        $('.next-btn').removeClass('disabled');

        if ($('.sf-controls').find('span').length) $('.sf-controls').find('span').remove();

      // if we transition to token selection step, fetch the rates and start calculation
      if (to === 1) {
        var myOpts = document.getElementById('price-currency').options;

        if (!myOpts.length) {
          getRates();
        }
      }

      if (to === 2) {
        if ($('#wallet-choice').val() !== 'yes') disableNextToDownloadSeed();

        $('#wallet-choice').on('change', function(event) {
          if (event.target.value !== 'yes') {
            disableNextToDownloadSeed();
          } else {
            $('.next-btn').removeClass('disabled');
            $('.sf-controls').find('span').remove();
          }
        });
      }

      if (to === 3) {
        var currency = $('#price-currency').val();
        $('#payment-choice').empty();

        $.each(paymentOptions, function (i, item) {
          $('#payment-choice').append($('<option>', {
            value: item.value,
            text : item.text
          }));
        });

        $("#pay").appendTo(".sf-controls").addClass('visible');

        // if (currency === "USD") $("#payment-unavailable").css('display', 'block');
        // else $("#payment-unavailable").css('display', 'none');
      }
    }
  });

  getVATCountries();

  $('#error-payment').hide();

  $("#faucet-retrieve-btn").on('click', function (e) {
    e.preventDefault();
    var $recipient = $('#faucet-recipient');
    var address = $recipient.val();

    if (!address) {
      return;
    }

    $.ajax({
      type: "POST",
      url: waves_server + "/api/faucet",
      data: JSON.stringify({recipient: address}),
      contentType: "application/json; charset=utf-8",
      dataType: "json",
      success: function (result) {
        if (!result || !result.id) {
          // something went wrong
          $('#faucet-failed').show();
          $('#faucet-success').hide();
          return;
        }

        $('#faucet-failed').hide();
        $('#faucet-success').show();
        $('#faucet-success-link').attr('href', 'https://wavesexplorer.com/tx/' + result.id);
        $('#faucet-container').hide();
      },
      error: function () {
        $('#faucet-failed').show();
        $('#faucet-success').hide();
      }
    })
  })
}


//function for close popup
function closePopup() {
  $('.popup__close, .sf-btn-finish').on('click', function (e) {
    e.preventDefault();
    $('html').removeClass('lock');
    $('.popup-container').addClass('popup-hide')
    $('.popup-backdrop').addClass('popup-hide')
    $('.popup').addClass('popup-hide')
  })
}

Number.prototype.formatMoney = function(c, d, t) {
  var n = this,
    c = isNaN(c = Math.abs(c))
      ? 2
      : c,
    d = d == undefined
      ? "."
      : d,
    t = t == undefined
      ? ","
      : t,
    s = n < 0
      ? "-"
      : "",
    i = String(parseInt(n = Math.abs(Number(n) || 0).toFixed(c))),
    j = (j = i.length) > 3
      ? j % 3
      : 0;
  return s + (
    j
      ? i.substr(0, j) + t
      : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (
    c
      ? d + Math.abs(n - i).toFixed(c).slice(2)
      : "");
};

function initSubscribeMailChimp() {
  var $form = null;

  $('.newsletter-form').submit(function(e) {
    e.preventDefault();
    $form = $(this);
  });

  $('.newsletter-form').ajaxChimp({
    callback: function(resp) {
      var $error = $form.find('.newsletter-error');
      var $success = $form.find('.newsletter-success');

      $error.hide();
      $success.hide();

      if (resp.result === 'error') {
        $error.show().html(resp.msg);
        $success.hide();
      } else {
        $error.hide();
        $success.show();
      }
    },
    url: 'https://legalthings.us17.list-manage.com/subscribe/post?u=1508bdb96b4379a9aeb07c6e8&amp;id=6d17a10ae2'
  });
}

function stripeCheckout(data, price) {
  if (!price || price <= 0 || isNaN(price)) {
    return;
  }

  var handler = StripeCheckout.configure({
    name: 'LTO Pre-sale',
    key: 'pk_live_8R8FrtJRBHzJ6Fqet7pK4Fa1',
    image: 'https://s3-eu-west-1.amazonaws.com/livecontracts/img/logo/icon-purple.png',
    description: 'Purchase LTO tokens',
    zipCode: false,
    bitcoin: false,
    allowRememberMe: false,
    amount: price * 100, // in cents
    email: data.user.email,
    currency: data.currency || 'USD'
  });

  handler.open({
    token: function(token) {
      data.user.creditcard = {token: token.id};
      startPayment(data);
    }
  });
}

function initTimer() {
  var time = $('.count-down');

  if (!time || !time.length) {
    return;
  }

  var endDate = new Date(time.data("end-date"));
  time.countdown({
    date: endDate,
    render: function(data) {
      $(this.el).html('<div class="cd-row"><div><h1>' + data.days
        + '</h1><p>days</p></div><div><h1>'
        + this.leadingZeros(data.hours, 2)
        + '</h1><p>hrs</p></div></div><div class="cd-row"><div><h1>'
        + this.leadingZeros(data.min, 2)
        + '</h1><p>min</p></div><div><h1>'
        + this.leadingZeros(data.sec, 2)
        + '</h1><p>sec</p></div></div>');
    }
  });
}

if ($('#checkout-presale').length) {
  document.getElementById('checkout-presale').addEventListener('click', function(e) {
    // Open Checkout with further options:
    handler.open({
      name: 'LTO Pre-sale',
      description: 'Purchase LTO tokens',
      zipCode: false,
      currency: 'usd',

      // this needs to be set dynamically: https://stripe.com/docs/recipes/variable-amount-checkout
      // based on <num_tokens> * $0.25
      amount: 2000,
      bitcoin: false,
      allowRememberMe: false
    });
    e.preventDefault();
  });
}


// Close Checkout on page navigation:
window.addEventListener('popstate', function() {
  handler.close();
});
