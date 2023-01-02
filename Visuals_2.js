let dataset
let salarySizeScale, salaryXScale, categoryColorScale
let simulation, nodes
let categoryLegend, salaryLegend
let currentColor
let interval, trans_timeout

const margin = {top: 20, right: 20, bottom: 30, left: 70};
const width = 800 - margin.left - margin.right
const height = 600 - margin.bottom - margin.top

//Read Data, convert numerical categories into floats
//Create the initial visualisation


d3.csv("https://raw.githubusercontent.com/MarkdeKwaasteniet/test_D3/main/tekst_data_test.csv"
, function(d){
    return {
        Naam: d.Naam,
        Tekst: +d.tekst,
        Emoji: +d.emoji,
        Nacht: +d.nacht,
        Color: d.color
    };
}).then(data => {
    dataset = data
    console.log(dataset)
    // createScales()
    setTimeout(draw_img(), 100)
})

// const colors = ['#ffcc00', '#ff6666', '#cc0066', '#66cccc', '#f688bb', '#65587f', '#baf1a1', '#333333', '#75b79e',  '#66cccc', '#9de3d0', '#f1935c', '#0c7b93', '#eab0d9', '#baf1a1', '#9399ff']

async function waitTwoSeconds() {
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

function mouseOver(d, i){
    currentColor = d3.select(this).attr("fill")

    d3.select(this)
                .transition('mouseover').duration(100)
                .attr('opacity', 0.5)
                .attr('stroke-width', 2)
        
    d3.select('#tooltip')
        .style('left', (d3.event.pageX + 10)+ 'px')
        .style('top', (d3.event.pageY - 25) + 'px')
        .style('display', 'inline-block')
        .html(`<strong>Naam:</strong> ${d.Naam[0] + d.Naam.slice(1,).toLowerCase()} 
            <br> <strong>Aantal:</strong> ${d3.format(",.2r")(d.Tekst)}`)
}
function mouseOut(d, i){
    d3.select('#tooltip')
        .style('display', 'none')

    d3.select(this)
        .transition('mouseout').duration(100)
        .attr('opacity', 1)
        .attr('stroke-width', 0)
    }

function clear_img(){
    // Select the image element and remove it from the DOM
  d3.select("image").remove();
}

const x = d3.scaleLinear().range([0, width]);
const y = d3.scaleBand().range([height, 0]);

// Select the svg element and append a 'g' element
const svg = d3.select("#vis").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", `translate(${margin.left},${margin.top})`);

function draw_img(){
    clearInterval(interval);
    draw_init();
    // Select the svg element and append an image element
    const image = svg.append("image")
    .attr("xlink:href", "thundermuffin.jpg")
    .attr("x", 0)
    .attr("y", 0);

        // Set the width and height attributes to specify the size of the image
    image.attr("width", 500)
    .attr("height", 500);

    // Select the image element and append a clipPath element
    const clipPath = d3.select("image")
                        .append("clipPath")
                        .attr("id", "clip-circle");

    // Append a circle element to the clipPath element
    clipPath.append("circle")
    .attr("cx", 250)
    .attr("cy", 250)
    .attr("r", Math.min(250, 250));

    // Set the clip-path attribute of the image element to the ID of the clipPath element
    d3.select("image").attr("clip-path", "url(#clip-circle)");
}

function draw_init(){
    clear_img(); 
    svg.selectAll(".bar").remove();
    svg.select(".y.axis").remove();
    svg.select(".x.axis").remove();
    // Scale the range of the data
    x.domain([0, d3.max(dataset, d => d.Tekst)]);
    y.domain(dataset.map(d => d.Naam)).padding(0.1);

    // Append the bars
    svg.selectAll(".bar")
        .data(dataset)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Tekst))
        .attr("fill", d => d.Color)
        .attr("opacity", 0);

    // Add the x Axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", `translate(0,${height})`)
        .attr("opacity", 0)
        .call(d3.axisBottom(x));

    // Add the y Axis
    svg.append("g")
        .attr("class", "y axis")
        .attr("opacity", 0)
        .call(d3.axisLeft(y));

}

function draw0(){ 
    // Set a timeout to stop the loop after 50 iterations
    clearInterval(interval);
    clearTimeout(trans_timeout);
    clear_img(); 

    dataset.sort((a, b) => a.Tekst - b.Tekst);
    // Scale the range of the data
    x.domain([0, d3.max(dataset, d => d.Tekst)]);
    y.domain(dataset.map(d => d.Naam)).padding(0.1);

    // Select the bars and apply a transition effect
    svg.selectAll(".bar")
      .data(dataset)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("y", d => y(d.Naam))
      .attr("width", d => x(d.Tekst))
      .attr("fill", d => d.Color)
      .attr("opacity", 1);

    // Update the x Axis
    svg.selectAll(".x.axis")
        .attr("opacity", 1)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisBottom(x));

    // Update the y Axis
    svg.selectAll(".y.axis")
        .attr("opacity", 1)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisLeft(y));

    function mouseOver(d, i){
            d3.select(this)
                .transition('mouseover').duration(100)
                .attr('opacity', 0.5)
                .attr('stroke-width', 2)
                
            d3.select('#tooltip')
                .style('left', (d3.event.pageX + 10)+ 'px')
                .style('top', (d3.event.pageY - 25) + 'px')
                .style('display', 'inline-block')
                .html(`<strong>Naam:</strong> ${d.Naam[0] + d.Naam.slice(1,).toLowerCase()} 
                    <br> <strong>Aantal:</strong> ${d3.format(",.2r")(d.Tekst)}`)
        }
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
}

function draw0_trans(){
    function trans_bar_low(){
        dataset.sort((a, b) => b.Tekst - a.Tekst);
        
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Tekst)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);    
        
        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Tekst / 100))
        .attr("fill", d => d.Color);

        // Update the y Axis
        svg.selectAll(".y.axis")
        .attr("opacity", 1)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisLeft(y));
            
        // Update the x Axis
        svg.selectAll(".x.axis")
        .attr("opacity", 1)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisBottom(x));
    }
    // Select the bars and apply a transition effect
    function trans_bar_high(){
        dataset.sort((a, b) => a.Tekst - b.Tekst);
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Tekst)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);

        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Tekst * 1.5))
        .attr("fill", d => d.Color);

        // Update the y Axis
        svg.selectAll(".y.axis")
        .attr("opacity", 1)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisLeft(y));
            
        // Update the x Axis
        svg.selectAll(".x.axis")
        .attr("opacity", 1)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisBottom(x));
    }

    // Define a function to be called on each iteration of the loop
    function loop() {
    // Call the trans_bar_high() function
    trans_bar_low();
    
    // Call the trans_bar_low() function with a delay of 500 milliseconds
    trans_timeout = setTimeout(trans_bar_high, 2000);
    }
    loop();
    // Use the setInterval() function to call the loop() function at regular intervals
    interval = setInterval(loop, 4000);

    // Set a timeout to stop the loop after 50 iterations
    setTimeout(function() {
    clearInterval(interval);
    }, 50000);
}

function draw1(){
    // Set a timeout to stop the loop after 50 iterations
    clearInterval(interval);
    clearTimeout(trans_timeout);

    dataset.sort((a, b) => a.Emoji - b.Emoji);
    // Scale the range of the data
    x.domain([0, d3.max(dataset, d => d.Emoji)]);
    y.domain(dataset.map(d => d.Naam)).padding(0.1);

    // Select the bars and apply a transition effect
    svg.selectAll(".bar")
      .data(dataset)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("y", d => y(d.Naam))
    .attr("width", d => x(d.Emoji))
    .attr("fill", d => d.Color);

    // Update the x Axis
    svg.selectAll(".x.axis")
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisBottom(x));

    // Update the y Axis
    svg.selectAll(".y.axis")
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisLeft(y));

        function mouseOver(d, i){
            d3.select(this)
                .transition('mouseover').duration(100)
                .attr('opacity', 0.5)
                .attr('stroke-width', 2)
                
            d3.select('#tooltip')
                .style('left', (d3.event.pageX + 10)+ 'px')
                .style('top', (d3.event.pageY - 25) + 'px')
                .style('display', 'inline-block')
                .html(`<strong>Naam:</strong> ${d.Naam[0] + d.Naam.slice(1,).toLowerCase()} 
                    <br> <strong>Aantal:</strong> ${d3.format(",.2r")(d.Emoji)}`)
        }
    
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
}

function draw1_trans(){
    function trans_bar_low(){
        dataset.sort((a, b) => b.Emoji - a.Emoji);
        
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Emoji)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);    
        
        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Emoji / 100))
        .attr("fill", d => d.Color);

        // Update the y Axis
        svg.selectAll(".y.axis")
        .attr("opacity", 1)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisLeft(y));
            
        // Update the x Axis
        svg.selectAll(".x.axis")
        .attr("opacity", 1)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisBottom(x));
    }
    // Select the bars and apply a transition effect
    function trans_bar_high(){
        dataset.sort((a, b) => a.Emoji - b.Emoji);
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Emoji)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);

        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Emoji * 1.5))
        .attr("fill", d => d.Color);

        // Update the y Axis
        svg.selectAll(".y.axis")
        .attr("opacity", 1)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisLeft(y));
            
        // Update the x Axis
        svg.selectAll(".x.axis")
        .attr("opacity", 1)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisBottom(x));
    }

    // Define a function to be called on each iteration of the loop
    function loop() {
    // Call the trans_bar_high() function
    trans_bar_low();
    
    // Call the trans_bar_low() function with a delay of 500 milliseconds
    trans_timeout = setTimeout(trans_bar_high, 2000);
    }
    loop();
    // Use the setInterval() function to call the loop() function at regular intervals
    interval = setInterval(loop, 4000);

    // Set a timeout to stop the loop after 50 iterations
    setTimeout(function() {
    clearInterval(interval);
    }, 50000);
}


function draw2(){
    clearInterval(interval);
    clearTimeout(trans_timeout);

    dataset.sort((a, b) => a.Nacht - b.Nacht);
    // Scale the range of the data
    x.domain([0, d3.max(dataset, d => d.Nacht)]);
    y.domain(dataset.map(d => d.Naam)).padding(0.1);

    // Select the bars and apply a transition effect
    svg.selectAll(".bar")
      .data(dataset)
      .transition()
      .duration(2000)
      .ease(d3.easeLinear)
      .attr("x", 0)
      .attr("height", y.bandwidth())
      .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Nacht))
        .attr("fill", d => d.Color);

    // Update the x Axis
    svg.selectAll(".x.axis")
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisBottom(x));

    // Update the y Axis
    svg.selectAll(".y.axis")
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisLeft(y));

        function mouseOver(d, i){
            d3.select(this)
                .transition('mouseover').duration(100)
                .attr('opacity', 0.5)
                .attr('stroke-width', 2)
                
            d3.select('#tooltip')
                .style('left', (d3.event.pageX + 10)+ 'px')
                .style('top', (d3.event.pageY - 25) + 'px')
                .style('display', 'inline-block')
                .html(`<strong>Naam:</strong> ${d.Naam[0] + d.Naam.slice(1,).toLowerCase()} 
                    <br> <strong>Aantal:</strong> ${d3.format(",.2r")(d.Nacht)}`)
        }
    
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
}

function draw2_trans(){
    function trans_bar_low(){
        dataset.sort((a, b) => b.Nacht - a.Nacht);
        
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Nacht)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);    
        
        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Nacht / 100))
        .attr("fill", d => d.Color);

        // Update the y Axis
        svg.selectAll(".y.axis")
        .attr("opacity", 1)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisLeft(y));
            
        // Update the x Axis
        svg.selectAll(".x.axis")
        .attr("opacity", 1)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisBottom(x));
    }
    // Select the bars and apply a transition effect
    function trans_bar_high(){
        dataset.sort((a, b) => a.Nacht - b.Nacht);
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Nacht)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);

        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Nacht * 1.5))
        .attr("fill", d => d.Color);

        // Update the y Axis
        svg.selectAll(".y.axis")
        .attr("opacity", 1)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisLeft(y));
            
        // Update the x Axis
        svg.selectAll(".x.axis")
        .attr("opacity", 1)
        .transition()
        .duration(1000)
        .ease(d3.easeLinear)
        .call(d3.axisBottom(x));
    }

    // Define a function to be called on each iteration of the loop
    function loop() {
    // Call the trans_bar_high() function
    trans_bar_low();
    
    // Call the trans_bar_low() function with a delay of 500 milliseconds
    trans_timeout = setTimeout(trans_bar_high, 2000);
    }
    loop();
    // Use the setInterval() function to call the loop() function at regular intervals
    interval = setInterval(loop, 4000);

    // Set a timeout to stop the loop after 50 iterations
    setTimeout(function() {
    clearInterval(interval);
    }, 50000);
}

//Array of all the graph functions
//Will be called from the scroller functional
let activationFunctions = [
    draw_img,
    draw_img,
    draw0,
    draw0_trans,
    draw1,
    draw1_trans,
    draw2,
    draw2_trans,
    // draw4,
    // draw5, 
    // draw6, 
    // draw7,
    // draw8
]

//All the scrolling function
//Will draw a new graph based on the index provided by the scroll


let scroll = scroller()
    .container(d3.select('#graphic'))
scroll()

let lastIndex, activeIndex = 0

scroll.on('active', function(index){
    d3.selectAll('.step')
        .transition().duration(500)
        .style('opacity', function (d, i) {return i === index ? 1 : 0.1;});
    
    activeIndex = index
    let sign = (activeIndex - lastIndex) < 0 ? -1 : 1; 
    let scrolledSections = d3.range(lastIndex + sign, activeIndex + sign, sign);
    scrolledSections.forEach(i => {
        activationFunctions[i]();
    })
    lastIndex = activeIndex;

})

scroll.on('progress', function(index, progress){
    if (index == 2 & progress > 0.7){

    }
})