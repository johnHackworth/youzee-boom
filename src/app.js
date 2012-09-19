var yz = {
  youzeers: {
    type: 'cartodb',
    user_name: 'xabel',
    table_name: 'youzeediaspora',
    active: true,
    visible: true,
    opacity: 0.7,
    query: 'SELECT * FROM {{table_name}}',
    tile_style: "#{{table_name}}{marker-fill:red}",
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
    title: "Youzee Diaspora",
    description: "New jobplaces of the Youzee engineering & design team after the crash of 2012 summer. If someone else already has found a new position and I'm not aware of it, please tell me! :)",
    center: [40.421317, -3.705439],
    zoom: 15,
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
        $peopleContainer.append('<div class="person" data-position="'+companies[i].location+'"><img src="'+companies[i].people[j].image+'"></img><span>@'+companies[i].people[j].name+'</span></div>');
      }
    }

    setTimeout(function() {
      $('#people img').attr('src', 'http://images.wikia.com/phineasandferb/images/7/77/Perry_dancing.gif');
      $('#people span').html('@perry');
    }, 150000*(1+Math.random()))
  },
  bindHover: function() {
    $('#people .person').on('mouseover', function(e) {
      var position = $(e.currentTarget).data('position').split(',');
      yz.vis.map.setCenter(position.reverse());
    })
  }
}

var companies = [
  {location:[-3.692404, 40.428264], company: 'yunait', people: [{name: 'leidan', image: 'https://si0.twimg.com/profile_images/1131270006/Avatar2010_medium_reasonably_small.jpg'}]},
  {location:[-3.591843, 40.492393], company: "atlassian", people:  [{name: 'scinos', image: 'https://si0.twimg.com/profile_images/1543714613/cinos_reasonably_small.png'}]},
  {location:[-3.70714, 40.421268], company: "spartanbits", people:  [{name: 'pumpkin', image: 'https://si0.twimg.com/profile_images/1881877491/avatar_reasonably_small.jpg'}]},
  {location:[-3.699346, 40.422514], company: "vizzuality", people:  [{name: 'johnhackworth', image: 'https://si0.twimg.com/profile_images/2460338539/814qnn0rrw7icdlcfdg7_reasonably_small.gif'}]},
  {location:[-3.568325, 40.495983], company: "fever", people:  [{name: 'sruiz', image: 'https://si0.twimg.com/profile_images/2235866660/SR_twitter.png'}]},
  {location:[-3.692951, 40.409117], company: "fjord", people:  [{name: 'jorgecorrea', image: 'https://si0.twimg.com/profile_images/2255209386/avatar_fjord_reasonably_small.png'}]},
  {location:[-3.696127, 40.415959], company: "tuenti", people:  [{name: 'ieduardogf', image: 'https://si0.twimg.com/profile_images/1614549841/image_reasonably_small.jpg'}]},
  {location:[-3.707607, 40.422269], company: "funddy", people:  [{name: 'amartinj', image: 'https://si0.twimg.com/profile_images/1332873130/alex-snow_twitter_reasonably_small.png'},{name: 'mrrocks', image: 'https://si0.twimg.com/profile_images/2327871935/xzzuabgzz5ivkzxve76l_reasonably_small.png'},{name: 'keyvanakbary', image: 'https://si0.twimg.com/profile_images/2216189429/43d9c6fa-53d2-4332-b533-0946a4bc62a7_reasonably_small.png'}]}
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






