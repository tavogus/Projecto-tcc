var current_data;

		function sentiment_to_color(sentiment){
			if(sentiment == 'positive') return 'panel-success';
			else if(sentiment == 'negative') return 'panel-danger';
			else return 'panel-primary';
		}

		function load_tweets(querystring){
			$.ajax({
			    url: 'tweets',
			    data: {'query': querystring, 'retweets_only': 'false'},
			    dataType: 'json',
			    type: 'GET',
			    success: function(data) {
			    	buildChart(data);
			    	current_data = data['data'];
			        var tweets = data['data'];
			        var container = $('#tweets');
			        var contents = '';
			        contents+='<div>'
			        
			        for(i = 0; i < tweets.length; i++){
			        	contents+= '<div class="panel '+ sentiment_to_color(tweets[i].sentiment) +'"> <div class="panel-heading"> <h3 class="panel-title">'+ tweets[i].user +'</h3> </div> <div class="panel-body"><blockquote>'+ tweets[i].text + '</blockquote> </div> </div>'
                        
			        }
                    
                    contents+='</div>';
			        container.html(contents);
                    $('#query').val(querystring);
                    
                }
			});
        }
        
        $(document).ready(function(){
			load_tweets('Python');
        });
        
        $('#search').click(function(){
			$('#tweets').html('');
			load_tweets($('#query').val());
        });
        
        function buildChart(data) {
            Highcharts.chart('container', {
                chart: {
                    plotBackgroundColor: null,
                    plotBorderWidth: null,
                    plotShadow: false,
                    type: 'pie'
                },
                title: {
                    text: 'last 100 tweets on '+$('#query').val()
                },
                tooltip: {
                    pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
                },
                plotOptions: {
                    pie: {
                        allowPointSelect: true,
                        cursor: 'pointer',
                        dataLabels: {
                            enabled: true,
                            format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                            style: {
                                color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                            }
                        }
                    }
                },
                series: getPercentage(data)
            });
        }; 
        function getNegativePercentage(data) {
            var current_data = data['data'];
            var counter = 0 ;
            for (var i = current_data.length - 1; i >= 0; i--) {
                if(current_data[i].sentiment == 'negative') 
                    counter ++;
            }
                console.log('negative',counter)
        
            return counter/data.count;
        }
        function getPositivePercentage(data) {
            var current_data = data['data'];
            var counter = 0 ;
            for (var i = current_data.length - 1; i >= 0; i--) {
                if(current_data[i].sentiment == 'positive') 
                    counter ++;
            }
                console.log('positive',counter)
        
            return counter/data.count;
        }
        function getNeutralPercentage(data) {
            var current_data = data['data'];
            var counter = 0 ;
            for (var i = current_data.length - 1; i >= 0; i--) {
                if(current_data[i].sentiment == 'neutral') 
                    counter ++;
            }
            console.log('neutral',counter)
            return counter/data.count;
        }
        function getPercentage(data) {
            var neutral = getNeutralPercentage(data);
            var positive = getPositivePercentage(data);
            var negative = getNegativePercentage(data);
        
            return [{
                    name: 'Tweets',
                    //colorByPoint: true,
                    data: [{
                        name: 'Positive',
                        y: positive
                    }, {
                        name: 'Negative',
                        y: negative,
                        sliced: true,
                        selected: true
                    }, {
                        name: 'Neutral',
                        y: neutral
                    }]
                }]
            // body...
        }