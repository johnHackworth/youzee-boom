var yz = {
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
    "#{{table_name}}[name='Atlassian (Australia!)'] {marker-fill:#59F}" +
    "#{{table_name}}[name='Fever (Barcelona)'] {marker-fill:#666}" +
    "#{{table_name}}[name='Fjord'] {marker-fill:#FFF}" +
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
    title: "The Youzee Diaspora",
    description: "Youzee engineering & design team's new jobplaces, after the crash of 2012 summer. If someone else already has found a new position and I'm not aware of it, please tell me, you know where to find me!  :)",
    center: [40.421317, -3.705439],
    zoom: 14,
    maxZoom: 20,
    minZoom: 11,
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
  deployPeople: function() {
    var $peopleContainer = $('#people');
    for(var i=0, l=companies.length; i < l; i++) {
      for(var j=0, ll=companies[i].people.length; j < ll; j++) {
        $peopleContainer.append('<div class="person" data-color="'+companies[i].color+'" data-position="'+companies[i].location+'"><img src="'+companies[i].people[j].image+'"></img><span>@'+companies[i].people[j].name+'</span></div>');
      }
    }

    setTimeout(this.perrify.bind(this), 60000*(1+Math.random()))
  },
  perrify: function() {
    var numberOfPeople = $('#people .person').length;
    var becomePerry = (Math.random() > 0.5)
    if(becomePerry) {
      var $oneOfThem = $('#people .person').eq(Math.floor(numberOfPeople*Math.random()));
      $oneOfThem.find('img').attr('src', 'http://images.wikia.com/phineasandferb/images/7/77/Perry_dancing.gif');
      $oneOfThem.find('span').html('@perry');
    }
    setTimeout(this.perrify.bind(this), 60000*(1+Math.random()))
  },
  bindHover: function() {
    $('#people .person').on('mouseover click', function(e) {
      $element = $(e.currentTarget);
      var position = $element.data('position').split(',');
      yz.vis.map.setCenter(position.reverse());
      $element.css('background-color', $element.data('color'));
    }).on('mouseout', function(e) {
      $element = $(e.currentTarget);
      $element.css('background-color', 'transparent');
    })

  }
}

var companies = [
  {color: "yellow", location:[-3.692404, 40.428264], company: 'yunait', people: [{name: 'leidan', image: 'https://si0.twimg.com/profile_images/1131270006/Avatar2010_medium_reasonably_small.jpg'}]},
  {color: "#FFDFDF", location:[-3.707097, 40.420501], company: "spartanbits", people:  [{name: 'pumpkin', image: 'https://si0.twimg.com/profile_images/1881877491/avatar_reasonably_small.jpg'}]},
  {color: "#CF3", location:[-3.699185, 40.422424], company: "vizzuality", people:  [{name: 'johnhackworth', image: 'https://si0.twimg.com/profile_images/2460338539/814qnn0rrw7icdlcfdg7_reasonably_small.gif'}]},
  {color: "#FFF", location:[-3.692951, 40.409117], company: "fjord", people:  [{name: 'jorgecorrea', image: 'https://si0.twimg.com/profile_images/2255209386/avatar_fjord_reasonably_small.png'}]},
  {color: "#00F", location:[-3.696127, 40.415959], company: "tuenti", people:  [{name: 'ieduardogf', image: 'https://si0.twimg.com/profile_images/1614549841/image_reasonably_small.jpg'}]},
  {color: "#77F", location:[-3.707843, 40.423307], company: "funddy", people:  [{name: 'amartinj', image: 'https://si0.twimg.com/profile_images/1332873130/alex-snow_twitter_reasonably_small.png'},{name: 'mrrocks', image: 'https://si0.twimg.com/profile_images/2327871935/xzzuabgzz5ivkzxve76l_reasonably_small.png'},{name: 'keyvanakbary', image: 'https://si0.twimg.com/profile_images/2216189429/43d9c6fa-53d2-4332-b533-0946a4bc62a7_reasonably_small.png'}]},
  {color: "#59F", location:[-3.568497, 40.464189], company: "atlassian", people:  [{name: 'scinos', image: 'https://si0.twimg.com/profile_images/1543714613/cinos_reasonably_small.png'}]},
  {color: "#666", location:[-3.568153, 40.472612], company: "fever", people:  [{name: 'sruiz', image: 'https://si0.twimg.com/profile_images/2235866660/SR_twitter.png'}]}
];


window.onload = function() {
    var vis = new Vis({el: $('#map')});
    yz.mapConfig.layers = [yz.baseLayer, yz.youzeers]
    vis.load(yz.mapConfig);
    vis.map.setCenter(yz.mapConfig.center);
    yz.vis = vis;
    yz.deployPeople();
    yz.bindHover();
}



