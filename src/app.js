var yz = {
  currentZoom: 14,
  youzeers: {
    type: 'cartodb',
    user_name: 'xabel',
    table_name: 'youzeediaspora',
    active: true,
    visible: true,
    opacity: 0.7,
    query: 'SELECT * FROM {{table_name}}',
    tile_style: '@font_reg:"DejaVu Sans Book";' +
    "#{{table_name}} {marker-fill:red; marker-line-color: #666; "+
    "marker-line-width: 2; marker-line-opacity:1; marker-width:16;  marker-allow-overlap: true}" +
    "#{{table_name}}[name='Youzee'] {marker-fill:black; marker-width:3;}" +
    "#{{table_name}}[name='Tuenti'] {marker-fill:#00F}" +
    "#{{table_name}}[name='Vizzuality'] {marker-fill:#CF3}" +
    "#{{table_name}}[name='Yunait'] {marker-fill:yellow}" +
    "#{{table_name}}[name='Funddy'] {marker-fill:#77F}" +
    "#{{table_name}}[name='Spartanbits'] {marker-fill:#FFDFDF}" +
    "#{{table_name}}[name='Atlassian'] {marker-fill:#59F}" +
    "#{{table_name}}[name='Fever'] {marker-fill:#222}" +
    "#{{table_name}}[name='Fjord'] {marker-fill:#FFF}" +
    "#{{table_name}}[name='Luckia'] {marker-fill:red}" +
    "#{{table_name}}[name='Ideup'] {marker-fill:#CCC}" +
    "#{{table_name}}[name='Wopp'] {marker-fill:orange}" +
    "#{{table_name}}::labels[name!='Youzee']  { "+
    "text-name:[name]; "+
    "text-face-name:@font_reg;"+
    "text-allow-overlap:true; " +
    "text-size:14;"+
    "text-opacity:1;"+
    "text-fill:#ff7;"+
    "text-halo-fill:black;"+
    "text-halo-radius:2;"+

    "}" +
    "",
    infowindow: {
      fields: [{ name: 'name', title: true}, {name: 'url_logo', title: true},  { name: 'youzeers', title: true}],
      eventType: 'featureOver',
      template: "<div> "+
        "<% _.each(content.fields, function(f){%>" +
            "<div class=\"<%= f.title %>\">"+
            "<% if(f.title=='url_logo') { %>" +
              "<img src=\"<%= f.value %>\"></img>" +
            "<% } else if(f.title=='youzeers') { %>" +
              "<% var youzeers = JSON.parse(f.value); %>" +
              "<% _.each(youzeers, function(y){%>" +
              " <a href='http://twitter.com/<%= y.name %>'>" +
              " <img class='youzeer' src=\"<%= y.image %>\"></img> "+
              "<span> @<%= y.name %> </span> </a>" +
              " <% }) %>" +
            "<% } else { %>" +
              "<%= f.value %> " +
            "<% }  %>" +
             "</div>" +

        "<% }) %> </div>",
      templateType: 'underscore',

    }
  },
  baseLayer: {
    type: 'tilejson',
    version: '1.0.0',
    tiles: [
      'http://a.tiles.mapbox.com/v3/mapbox.mapbox-streets/{z}/{x}/{y}.png'
    ]
  },
  mapConfig: {
    center: [40.430501, -3.692404],
    zoom: 14,
    maxZoom: 20,
    minZoom: 2,
    height: 400,
    zoomAnimation: true,
    overlays: [{
        type: 'header'
      },
      {
        type: 'zoom',
        template: '<a class="zoom_in">+</a> <a class="zoom_out">-</a>'
      }
    ]
  },
  followText: function(name) {
    var texts = [
      "see "+name+" at twitter",
      "say hello to "+name+" twitter",
      name+" twitter",
      "click to see "+name+" twitter",
      "to the "+name+" twitter, and furthermore!",
      name+ ", I'm your twitter",
      "twit twit twitter!",
      "click me to go to "+name+" twitter",
      "click to twitter!",
      "you're about to go to "+name+" twitter",
      "follow this link to "+name+" twitter"
    ]
    var who = Math.floor(Math.random() * texts.length);
    return texts[who];
  },
  deployPeople: function() {
    var $peopleContainer = $('#people');
    for(var i=0, l=companies.length; i < l; i++) {
      for(var j=0, ll=companies[i].people.length; j < ll; j++) {
        $peopleContainer.append('<a target="_blank" data-company="'+companies[i].company+'" href="http://twitter.com/'+companies[i].people[j].name+'" class="person" data-zoom="'+companies[i].zoom+'" data-color="'+companies[i].color+'" data-position="'+companies[i].location+'"><img src="'+companies[i].people[j].image+'"></img><span>@'+companies[i].people[j].name+'</span></a>');
      }
    }
    $('a').tipsy({
      fade: true,
      gravity: 'w',
      title: function() { return  yz.followText($(this).text())}//this.getAttribute('original-title').toUpperCase(); }
    });
    setTimeout(this.perrify.bind(this), 150000*(1+Math.random()))
  },
  perrify: function() {
    var numberOfPeople = $('#people .person').length;
    var becomePerry = (Math.random() > 0.5)
    if(becomePerry) {
      var $oneOfThem = $('#people .person').eq(Math.floor(numberOfPeople*Math.random()));
      $oneOfThem.find('img').attr('src', 'http://images.wikia.com/phineasandferb/images/7/77/Perry_dancing.gif');
      $oneOfThem.find('span').html('@perry');
    }
    setTimeout(this.perrify.bind(this), 150000*(1+Math.random()))
  },
  bindHover: function() {
    $('#people .person').on('mouseover click', function(e) {
      $element = $(e.currentTarget);
      var position = $element.data('position').split(',');
      var zoomLevel = $element.data('zoom');
      var name = $element.data('company');
      yz.vis.map.setCenter(position.reverse());
      yz.setZoom(yz.currentZoom, zoomLevel);
      var company = yz.getCompany(name);
      if(company.description) {
        $('article.description').fadeIn();
        $('article.description h3').html(name);
        $('article.description span').html(company.description);
      } else {
        $('article.description').fadeOut();
      }

      // yz.bounceZoom(zoomLevel);

      $element.css('background-color', $element.data('color'));
    }).on('mouseout', function(e) {
      $element = $(e.currentTarget);
      $element.css('background-color', 'transparent');
    })

    $('#people').on('mouseout', function(){
        yz.mouseoutDate = new Date();
        setTimeout(function() {
          var currentDate = new Date();
          if(currentDate - yz.mouseoutDate > 4000) {
            $('article.description').fadeOut();
          }
        },5000);
    });

    $('#map').on('mouseout', function() {
      $('.leaflet-tile-pane').click();
    })
  },
  setZoom: function(currentLevel, destLevel) {
    if (currentLevel === destLevel) {
      return true;
    } else {
      yz.currentZoom = currentLevel;
      vis.map.setZoom(currentLevel)
      setTimeout(function() {
        var nextLevel = 0;
        if (currentLevel < destLevel) {
          nextLevel = currentLevel + 1;
        } else {
          nextLevel = currentLevel - 1;
        }
        yz.setZoom(nextLevel, destLevel);
      }, 200);
    }
  },
  bounceZoom: function(destLevel) {
    vis.map.setZoom(17);
    setTimeout(function() {
      yz.setZoom(17, destLevel);
      // vis.map.setZoom(destLevel)
    },2000)
  },
  getCompany: function(name) {
    for(var i = 0, l = companies.length; i < l; i++) {
      if(companies[i].company == name) return companies[i]
    }
  }
}

var companies = [
  {description: "Yunait is a deal aggregator. It's the one stop place that groups the best deals and organizes them, giving the users the power to decide the kind of offers they will see depending on their tastes and interests.",
    zoom: 14, color: "yellow", location:[-3.692404, 40.428264], company: 'yunait', people: [{name: 'leidan', image: 'https://si0.twimg.com/profile_images/1131270006/Avatar2010_medium_reasonably_small.jpg'}]},
  {description: "Spartanbits is more than creating value through apps. It’s about creating an emotional bond with the user; it’s about delivering love to everyone, from our employees to the people that use our apps every day",
    zoom: 17, color: "#FFDFDF", location:[-3.707097, 40.420501], company: "spartanbits", people:  [{name: 'pumpkin', image: 'https://si0.twimg.com/profile_images/1881877491/avatar_reasonably_small.jpg'}]},
  {description:"Trying to make the world better since 2007! Vizzuality take enjoyment in being a small and productive company that delivers great user experiences for stories that matter. In this time they have worked with some of the biggest conservation organizations, NASA, Google, and others! And they have a <a href='http://pics.lockerz.com/s/250525221' target='_blank'>fucking</a> <a href='https://twitter.com/i/#!/demimismo/media/slideshow?url=http%3A%2F%2Finstagr.am%2Fp%2FQVBgCYQbEv%2F' target='_blank'>great</a> <a href='https://twitter.com/JohnHackworth/status/252747260302094336/photo/1' target='_blank'>office</a> :D",
    zoom: 14, color: "#CF3", location:[-3.700429, 40.4346914], company: "vizzuality", people:  [{name: 'johnhackworth', image: 'https://si0.twimg.com/profile_images/2460338539/814qnn0rrw7icdlcfdg7_reasonably_small.gif'}]},
  {description: "Fjord Spain opened in Madrid in late 2009 as a response to strong client demand and today we're already captivating leading brands like Telefonica and BBVA with our elegant, simple designs.",
    zoom: 13, color: "#FFF", location:[-3.692951, 40.409117], company: "fjord", people:  [{name: 'jorgecorrea', image: 'https://si0.twimg.com/profile_images/2255209386/avatar_fjord_reasonably_small.png'}]},
  {description: "Tuenti is a social communication platform for web and mobile, and there’s plenty to be said about our company",
    zoom: 13, color: "#00F", location:[-3.696127, 40.415959], company: "tuenti", people:  [{name: 'ieduardogf', image: 'https://si0.twimg.com/profile_images/1614549841/image_reasonably_small.jpg'}]},
  {description: "Funddy is a service that makes easy to collect money to achieve everything you want",
    zoom: 17, color: "#77F", location:[-3.707843, 40.423307], company: "funddy", people:  [{name: 'amartinj', image: 'https://si0.twimg.com/profile_images/1332873130/alex-snow_twitter_reasonably_small.png'},{name: 'mrrocks', image: 'https://si0.twimg.com/profile_images/2327871935/xzzuabgzz5ivkzxve76l_reasonably_small.png'},{name: 'keyvanakbary', image: 'https://si0.twimg.com/profile_images/2216189429/43d9c6fa-53d2-4332-b533-0946a4bc62a7_reasonably_small.png'}]},
  {description: "Software is everywhere – on our computers, our watches, our refrigerators. And the teams building software together – developers, product managers, doc writers, bug-bashers – are our heroes. Atlassian products help teams of all sizes track and share everything, work smarter, and create better software together.",
    zoom: 11, color: "#59F", location:[151.2071, -33.8671], company: "atlassian", people:  [{name: 'scinos', image: 'https://si0.twimg.com/profile_images/1543714613/cinos_reasonably_small.png'}]},
  {zoom: 12, color: "red", location: [-3.6890140, 40.399752], company: "luckia", people: [{"name": "torgus_2punto0", "image": "https://si0.twimg.com/profile_images/1842033988/422483_10150610296423674_540863673_9097491_251344996_n_reasonably_small.jpg"}]},
  {description:"WOPP is at the same time a means of communication, a social network and a nano-content channel.",
   zoom: 14, color: "orange", location: [-3.695912, 40.427055], company: "wopp", people: [{"name": "delr3ves", "image": "https://si0.twimg.com/profile_images/1179266820/_DSC0167_reasonably_small.jpg"}]},
  {description:"ideup! is a digital services agency with a result-oriented approach and based on constant investigation, without letting aside genuine creativity.",
   zoom: 11, color: "#CCC", location: [-3.893323, 40.539765], company: "ideup", people: [{"name": "LordCrisito", "image": "https://si0.twimg.com/profile_images/1209489204/Crisito2.gif"}]},
  {description: "Fever changes the way people make plans and meet new people you are going to like. Fever helps you to decide where to go at all times in a more personalized way. It is the essential tool for going out and finding",
    zoom: 12, color: "#666", location:[-3.683993, 40.423625], company: "fever", people:  [{name: 'sruiz', image: 'https://si0.twimg.com/profile_images/2235866660/SR_twitter.png'}, {name: 'msurdi', image: 'https://si0.twimg.com/profile_images/2254785484/Homer_Simpson_Sideart_Homebrew_reasonably_small.jpg'}]},

];

window.vis = new Vis({el: $('#map')});
yz.mapConfig.layers = [yz.baseLayer, yz.youzeers]
vis.load(yz.mapConfig);

window.onload = function() {
    vis.map.setCenter(yz.mapConfig.center);
    yz.vis = vis;
    yz.deployPeople();
    yz.bindHover();
    setTimeout(function() {
        $('h1 span').css('color', '#FFF');
        $('h1 span.version').fadeOut(3500);
    },7000)
}



