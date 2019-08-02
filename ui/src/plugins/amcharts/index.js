const pluginAPI = window.getPluginAPI();

//pluginAPI.page.appendScript('https://www.amcharts.com/lib/4/core.js');
//pluginAPI.page.appendScript('https://www.amcharts.com/lib/4/charts.js');
//pluginAPI.page.appendScript('https://www.amcharts.com/lib/4/themes/animated.js');

function groupBy(xs, prop) {
    var grouped = {};
    for (var i=0; i<xs.length; i++) {
        var p = xs[i][prop];
        if (!grouped[p]) { grouped[p] = []; }
        grouped[p].push(xs[i]);
    }
    return grouped;
}

var series_length = 0;

pluginAPI.page.onLoad(() => {
    if (document.getElementsByClassName('chart').length) {
        setTimeout(() => {

        
        am4core.ready(function() {
            var chart = am4core.create("chart", am4charts.XYChart);
            chart.dataSource.url = "/log.csv";
            chart.dataSource.parser = new am4core.CSVParser();
            chart.dataSource.parser.options.numberFields = ['value']
            // chart.dataSource.parser.options.dateFields = ['timestamp']
            // chart.dataSource.parser.options.dateFormat = 'x';
            chart.dataSource.parser.options.useColumnNames = true;
            chart.dataSource.reloadFrequency = 5000;

            chart.dataSource.events.on("parseended", function(ev) {
                // parsed data is assigned to data source's `data` property
                var data = ev.target.data;
                var grouped = groupBy(data, 'id');

                if (Object.keys(grouped).length !== series_length) {
                    series_length = Object.keys(grouped).length;
                    chart.series.length = 0;

                    for (let key in grouped) {
                        var series1 = chart.series.push(new am4charts.LineSeries());
                        series1.dataFields.valueY = "value";
                        series1.dataFields.categoryX = "timestamp";
                        series1.data = grouped[key];
                        series1.name = "Value";
                        series1.strokeWidth = 3;
                        series1.tensionX = 0.7;
                        series1.bullets.push(new am4charts.CircleBullet());
                    }
                } else {
                    let i = 0;
                    for (let key in grouped) {
                        var series1 = chart.series.values[i++];
                        series1.data = grouped[key];
                    }
                }

            });

            // Create axes
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "timestamp";

            // Create value axis
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        });

        }, 3000);
    }
});