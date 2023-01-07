let dataset
let salarySizeScale, salaryXScale, categoryColorScale
let simulation, nodes
let categoryLegend, salaryLegend
let interval, trans_timeout

const margin = {top: 20, right: 20, bottom: 30, left: 100};
const width = 800 - margin.left - margin.right
const height = 600 - margin.bottom - margin.top

window.onbeforeunload = function () {
    window.scrollTo(0, 0);
  }
//Read Data, convert numerical categories into floats
//Create the initial visualisation

d3.csv("https://raw.githubusercontent.com/MarkdeKwaasteniet/test_D3/main/Thundermuffin_data.csv"
, function(d){
    return {
        Naam: d.Naam,
        Berichten: +d.Berichten,
        Nacht: +d.Nacht,
        Ochtend: +d.Ochtend,
        Vragen: +d.Vragen,
        Sentiment: +d.Sentiment,
        Sentiment_Tot: +d.Sentiment_Tot,
        Woorden: +d.Woorden,
        Woorden_Tot: +d.Woorden_Tot,
        Lachen: +d.Lachen,
        Lachen_Tot: +d.Lachen_Tot,
        Emoji: +d.emoji,
        Emoji_Tot: +d.emoji_Tot,
        Langste_Bericht: +d.Langste_Bericht,
        Langste_Woord: +d.Langste_Woord,
        Gefrustreerd: +d.Gefrustreerd,
        Gefrustreerd_Tot: +d.Gefrustreerd_Tot,
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
    d3.select(this)
                .transition('mouseover').duration(100)
                .attr('opacity', 0.5)
                .attr('stroke-width', 2)
        
    d3.select('#tooltip')
        .style('left', (d3.event.pageX + 10)+ 'px')
        .style('top', (d3.event.pageY - 25) + 'px')
        .style('display', 'inline-block')
        .html(`<strong>Naam:</strong> ${d.Naam[0] + d.Naam.slice(1,).toLowerCase()} 
            <br> <strong>Aantal:</strong> ${d3.format(",.2f")(d.Berichten)}`)
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
    .attr("xlink:href", "logo_tm2023_white.png")
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
    x.domain([0, d3.max(dataset, d => d.Berichten)]);
    y.domain(dataset.map(d => d.Naam)).padding(0.1);

    // Append the bars
    svg.selectAll(".bar")
        .data(dataset)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Berichten))
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
function styleAxisLabels(){
    svg.selectAll(".x.axis")
      .style("font-family", "Spectral")
      .style("font-size", "20px");
  
    svg.selectAll(".y.axis")
      .style("font-family", "Spectral")
      .style("font-size", "20px");
  }

function draw0(){ 
    clear_img(); 
    // Set a timeout to stop the loop after 50 iterations
    clearInterval(interval);
    clearTimeout(trans_timeout);
    clear_img(); 

    dataset.sort((a, b) => a.Berichten - b.Berichten);
    // Scale the range of the data
    x.domain([0, d3.max(dataset, d => d.Berichten)]);
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
      .attr("width", d => x(d.Berichten))
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

    styleAxisLabels();

    function mouseOver(d, i){
            d3.select(this)
                .transition('mouseover').duration(100)
                .attr('opacity', 0.5)
                .attr('stroke-width', 2);
                
            d3.select('#tooltip')
                .style('left', (d3.event.pageX + 10)+ 'px')
                .style('top', (d3.event.pageY - 25) + 'px')
                .style('display', 'inline-block')
                .html(`<strong>Naam:</strong> ${d.Naam[0] + d.Naam.slice(1,).toLowerCase()} 
                    <br> <strong>Aantal:</strong> ${d3.format(".0f")(d.Berichten)}`);
        }
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut);

}

function draw0_trans(){
    clear_img(); 
    function trans_bar_low(){
        dataset.sort((a, b) => b.Berichten - a.Berichten);
        
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Berichten)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);    
        
        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Berichten / 100))
        .attr("opacity", 1)
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
        dataset.sort((a, b) => a.Berichten - b.Berichten);
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Berichten)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);

        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Berichten * 1.5))
        .attr("opacity", 1)
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

// function draw1(){
//     clear_img(); 
//     // Set a timeout to stop the loop after 50 iterations
//     clearInterval(interval);
//     clearTimeout(trans_timeout);

//     dataset.sort((a, b) => a.Emoji - b.Emoji);
//     // Scale the range of the data
//     x.domain([0, d3.max(dataset, d => d.Emoji)]);
//     y.domain(dataset.map(d => d.Naam)).padding(0.1);

//     // Select the bars and apply a transition effect
//     svg.selectAll(".bar")
//       .data(dataset)
//       .transition()
//       .duration(2000)
//       .ease(d3.easeLinear)
//       .attr("x", 0)
//       .attr("height", y.bandwidth())
//       .attr("y", d => y(d.Naam))
//       .attr("opacity", 1)
//     .attr("width", d => x(d.Emoji))
//     .attr("fill", d => d.Color);

//     // Update the x Axis
//     svg.selectAll(".x.axis")
//         .transition()
//         .duration(1000)
//         .ease(d3.easeLinear)
//         .call(d3.axisBottom(x));

//     // Update the y Axis
//     svg.selectAll(".y.axis")
//         .transition()
//         .duration(1000)
//         .ease(d3.easeLinear)
//         .call(d3.axisLeft(y));

//         function mouseOver(d, i){
//             d3.select(this)
//                 .transition('mouseover').duration(100)
//                 .attr('opacity', 0.5)
//                 .attr('stroke-width', 2)
                
//             d3.select('#tooltip')
//                 .style('left', (d3.event.pageX + 10)+ 'px')
//                 .style('top', (d3.event.pageY - 25) + 'px')
//                 .style('display', 'inline-block')
//                 .html(`<strong>Naam:</strong> ${d.Naam[0] + d.Naam.slice(1,).toLowerCase()} 
//                     <br> <strong>Aantal:</strong> ${d3.format(",.0f")(d.Emoji)}`)
//         }
    
//     // Add mouseover and mouseout events for all circles
//     // Changes opacity and adds border
//     svg.selectAll('rect')
//         .on('mouseover', mouseOver)
//         .on('mouseout', mouseOut)
// }

// function draw1_trans(){
//     clear_img(); 
//     function trans_bar_low(){
//         dataset.sort((a, b) => b.Emoji - a.Emoji);
        
//         // Scale the range of the data
//         x.domain([0, d3.max(dataset, d => d.Emoji)]);
//         y.domain(dataset.map(d => d.Naam)).padding(0.1);    
        
//         svg.selectAll(".bar")
//         .data(dataset)
//         .transition()
//         .duration(2000)
//         .ease(d3.easeLinear)
//         .attr("x", 0)
//         .attr("height", y.bandwidth())
//         .attr("y", d => y(d.Naam))
//         .attr("width", d => x(d.Emoji / 100))
//         .attr("opacity", 1)
//         .attr("fill", d => d.Color);

//         // Update the y Axis
//         svg.selectAll(".y.axis")
//         .attr("opacity", 1)
//         .transition()
//         .duration(1000)
//         .ease(d3.easeLinear)
//         .call(d3.axisLeft(y));
            
//         // Update the x Axis
//         svg.selectAll(".x.axis")
//         .attr("opacity", 1)
//         .transition()
//         .duration(1000)
//         .ease(d3.easeLinear)
//         .call(d3.axisBottom(x));
//     }
//     // Select the bars and apply a transition effect
//     function trans_bar_high(){
//         dataset.sort((a, b) => a.Emoji - b.Emoji);
//         // Scale the range of the data
//         x.domain([0, d3.max(dataset, d => d.Emoji)]);
//         y.domain(dataset.map(d => d.Naam)).padding(0.1);

//         svg.selectAll(".bar")
//         .data(dataset)
//         .transition()
//         .duration(2000)
//         .ease(d3.easeLinear)
//         .attr("x", 0)
//         .attr("height", y.bandwidth())
//         .attr("y", d => y(d.Naam))
//         .attr("width", d => x(d.Emoji * 1.5))
//         .attr("opacity", 1)
//         .attr("fill", d => d.Color);

//         // Update the y Axis
//         svg.selectAll(".y.axis")
//         .attr("opacity", 1)
//         .transition()
//         .duration(1000)
//         .ease(d3.easeLinear)
//         .call(d3.axisLeft(y));
            
//         // Update the x Axis
//         svg.selectAll(".x.axis")
//         .attr("opacity", 1)
//         .transition()
//         .duration(1000)
//         .ease(d3.easeLinear)
//         .call(d3.axisBottom(x));
//     }

//     // Define a function to be called on each iteration of the loop
//     function loop() {
//     // Call the trans_bar_high() function
//     trans_bar_low();
    
//     // Call the trans_bar_low() function with a delay of 500 milliseconds
//     trans_timeout = setTimeout(trans_bar_high, 2000);
//     }
//     loop();
//     // Use the setInterval() function to call the loop() function at regular intervals
//     interval = setInterval(loop, 4000);

//     // Set a timeout to stop the loop after 50 iterations
//     setTimeout(function() {
//     clearInterval(interval);
//     }, 50000);
// }

function draw2(){
    clear_img(); 
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
        .attr("fill", d => d.Color)
        .attr("opacity", 1);

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
                    <br> <strong>Aantal:</strong> ${d3.format(",.0f")(d.Nacht)}`)
        }
    
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
}

function draw2_trans(){
    clear_img(); 
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

function draw3(){
    clear_img(); 
    clearInterval(interval);
    clearTimeout(trans_timeout);

    dataset.sort((a, b) => a.Ochtend - b.Ochtend);
    // Scale the range of the data
    x.domain([0, d3.max(dataset, d => d.Ochtend)]);
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
        .attr("width", d => x(d.Ochtend))
        .attr("fill", d => d.Color)
        .attr("opacity", 1);

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
                    <br> <strong>Aantal:</strong> ${d3.format(",.0f")(d.Ochtend)}`)
        }
    
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
}

function draw3_trans(){
    clear_img(); 
    function trans_bar_low(){
        dataset.sort((a, b) => b.Ochtend - a.Ochtend);
        
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Ochtend)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);    
        
        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Ochtend / 100))
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
        dataset.sort((a, b) => a.Ochtend - b.Ochtend);
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Ochtend)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);

        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Ochtend * 1.5))
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

function draw4(){
    clear_img(); 
    clearInterval(interval);
    clearTimeout(trans_timeout);

    dataset.sort((a, b) => a.Vragen - b.Vragen);
    // Scale the range of the data
    x.domain([0, d3.max(dataset, d => d.Vragen)]);
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
        .attr("width", d => x(d.Vragen))
        .attr("fill", d => d.Color)
        .attr("opacity", 1);

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
                    <br> <strong>Aantal:</strong> ${d3.format(",.4f")(d.Vragen)}`)
        }
    
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
}

function draw4_trans(){
    clear_img(); 
    function trans_bar_low(){
        dataset.sort((a, b) => b.Vragen - a.Vragen);
        
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Vragen)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);    
        
        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Vragen / 100))
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
        dataset.sort((a, b) => a.Vragen - b.Vragen);
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Vragen)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);

        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Vragen * 1.5))
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

function draw5(){
    clear_img(); 
    clearInterval(interval);
    clearTimeout(trans_timeout);

    dataset.sort((a, b) => a.Sentiment - b.Sentiment);
    // Scale the range of the data
    x.domain([0, d3.max(dataset, d => d.Sentiment)]);
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
        .attr("width", d => x(d.Sentiment))
        .attr("fill", d => d.Color)
        .attr("opacity", 1);

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
                    <br> <strong>Aantal:</strong> ${d3.format(",.4f")(d.Sentiment)}`)
        }
    
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
}

function draw5_trans(){
    clear_img(); 
    function trans_bar_low(){
        dataset.sort((a, b) => b.Sentiment - a.Sentiment);
        
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Sentiment)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);    
        
        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Sentiment / 100))
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
        dataset.sort((a, b) => a.Sentiment - b.Sentiment);
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Sentiment)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);

        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Sentiment * 1.5))
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

function draw6(){
    clear_img(); 
    clearInterval(interval);
    clearTimeout(trans_timeout);

    dataset.sort((a, b) => a.Sentiment_Tot - b.Sentiment_Tot);
    // Scale the range of the data
    x.domain([0, d3.max(dataset, d => d.Sentiment_Tot)]);
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
        .attr("width", d => x(d.Sentiment_Tot))
        .attr("fill", d => d.Color)
        .attr("opacity", 1);

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
                    <br> <strong>Aantal:</strong> ${d3.format(",.0f")(d.Sentiment_Tot)}`)
        }
    
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
}

function draw6_trans(){
    clear_img(); 
    function trans_bar_low(){
        dataset.sort((a, b) => b.Sentiment_Tot - a.Sentiment_Tot);
        
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Sentiment_Tot)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);    
        
        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Sentiment_Tot / 100))
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
        dataset.sort((a, b) => a.Sentiment_Tot - b.Sentiment_Tot);
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Sentiment_Tot)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);

        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Sentiment_Tot * 1.5))
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

function draw7(){
    clear_img(); 
    clearInterval(interval);
    clearTimeout(trans_timeout);

    dataset.sort((a, b) => a.Woorden - b.Woorden);
    // Scale the range of the data
    x.domain([0, d3.max(dataset, d => d.Woorden)]);
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
        .attr("width", d => x(d.Woorden))
        .attr("fill", d => d.Color)
        .attr("opacity", 1);

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
                    <br> <strong>Aantal:</strong> ${d3.format(",.1f")(d.Woorden)}`)
        }
    
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
}

function draw7_trans(){
    clear_img(); 
    function trans_bar_low(){
        dataset.sort((a, b) => b.Woorden - a.Woorden);
        
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Woorden)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);    
        
        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Woorden / 100))
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
        dataset.sort((a, b) => a.Woorden - b.Woorden);
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Woorden)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);

        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Woorden * 1.5))
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

function draw8(){
    clear_img(); 
    clearInterval(interval);
    clearTimeout(trans_timeout);

    dataset.sort((a, b) => b.Woorden_Tot - a.Woorden_Tot);
    // Scale the range of the data
    x.domain([0, d3.max(dataset, d => d.Woorden_Tot)]);
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
        .attr("width", d => x(d.Woorden_Tot))
        .attr("fill", d => d.Color)
        .attr("opacity", 1);

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
                    <br> <strong>Aantal:</strong> ${d3.format(".0f")(d.Woorden_Tot)}`)
        }
    
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
}

function draw8_trans(){
    clear_img(); 
    function trans_bar_low(){
        dataset.sort((a, b) => a.Woorden_Tot - b.Woorden_Tot);
        
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Woorden_Tot)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);    
        
        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Woorden_Tot / 100))
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
        dataset.sort((a, b) => b.Woorden_Tot - a.Woorden_Tot);
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Woorden_Tot)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);

        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Woorden_Tot * 1.5))
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

function draw9(){
    clear_img(); 
    clearInterval(interval);
    clearTimeout(trans_timeout);

    dataset.sort((a, b) => a.Lachen - b.Lachen);
    // Scale the range of the data
    x.domain([0, d3.max(dataset, d => d.Lachen)]);
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
        .attr("width", d => x(d.Lachen))
        .attr("fill", d => d.Color)
        .attr("opacity", 1);

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
                    <br> <strong>Aantal:</strong> ${d3.format(",.2f")(d.Lachen)}`)
        }
    
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
}

function draw9_trans(){
    clear_img(); 
    function trans_bar_low(){
        dataset.sort((a, b) => b.Lachen - a.Lachen);
        
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Lachen)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);    
        
        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Lachen / 100))
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
        dataset.sort((a, b) => a.Lachen - b.Lachen);
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Lachen)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);

        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Lachen * 1.5))
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

function draw10(){
    clear_img(); 
    clearInterval(interval);
    clearTimeout(trans_timeout);

    dataset.sort((a, b) => a.Lachen_Tot - b.Lachen_Tot);
    // Scale the range of the data
    x.domain([0, d3.max(dataset, d => d.Lachen_Tot)]);
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
        .attr("width", d => x(d.Lachen_Tot))
        .attr("fill", d => d.Color)
        .attr("opacity", 1);

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
                    <br> <strong>Aantal:</strong> ${d3.format(",.0f")(d.Lachen_Tot)}`)
        }
    
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
}

function draw10_trans(){
    clear_img(); 
    function trans_bar_low(){
        dataset.sort((a, b) => b.Lachen_Tot - a.Lachen_Tot);
        
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Lachen_Tot)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);    
        
        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Lachen_Tot / 100))
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
        dataset.sort((a, b) => a.Lachen_Tot - b.Lachen_Tot);
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Lachen_Tot)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);

        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Lachen_Tot * 1.5))
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

function draw11(){
    clear_img(); 
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
        .attr("fill", d => d.Color)
        .attr("opacity", 1);

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
                    <br> <strong>Aantal:</strong> ${d3.format(",.4f")(d.Emoji)}`)
        }
    
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
}

function draw11_trans(){
    clear_img(); 
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

function draw12(){
    clear_img(); 
    clearInterval(interval);
    clearTimeout(trans_timeout);

    dataset.sort((a, b) => a.Emoji_Tot - b.Emoji_Tot);
    // Scale the range of the data
    x.domain([0, d3.max(dataset, d => d.Emoji_Tot)]);
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
        .attr("width", d => x(d.Emoji_Tot))
        .attr("fill", d => d.Color)
        .attr("opacity", 1);

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
                    <br> <strong>Aantal:</strong> ${d3.format(",.0f")(d.Emoji_Tot)}`)
        }
    
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
}

function draw12_trans(){
    clear_img(); 
    function trans_bar_low(){
        dataset.sort((a, b) => b.Emoji_Tot - a.Emoji_Tot);
        
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Emoji_Tot)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);    
        
        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Emoji_Tot / 100))
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
        dataset.sort((a, b) => a.Emoji_Tot - b.Emoji_Tot);
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Emoji_Tot)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);

        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Emoji_Tot * 1.5))
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

function draw13(){
    clear_img(); 
    clearInterval(interval);
    clearTimeout(trans_timeout);

    dataset.sort((a, b) => a.Langste_Bericht - b.Langste_Bericht);
    // Scale the range of the data
    x.domain([0, d3.max(dataset, d => d.Langste_Bericht)]);
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
        .attr("width", d => x(d.Langste_Bericht))
        .attr("fill", d => d.Color)
        .attr("opacity", 1);

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
                    <br> <strong>Aantal:</strong> ${d3.format(",.0f")(d.Langste_Bericht)}`)
        }
    
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
}

function draw13_trans(){
    clear_img(); 
    function trans_bar_low(){
        dataset.sort((a, b) => b.Langste_Bericht - a.Langste_Bericht);
        
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Langste_Bericht)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);    
        
        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Langste_Bericht / 100))
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
        dataset.sort((a, b) => a.Langste_Bericht - b.Langste_Bericht);
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Langste_Bericht)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);

        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Langste_Bericht * 1.5))
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

function draw14(){
    clear_img(); 
    clearInterval(interval);
    clearTimeout(trans_timeout);

    dataset.sort((a, b) => a.Langste_Woord - b.Langste_Woord);
    // Scale the range of the data
    x.domain([0, d3.max(dataset, d => d.Langste_Woord)]);
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
        .attr("width", d => x(d.Langste_Woord))
        .attr("fill", d => d.Color)
        .attr("opacity", 1);

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
                    <br> <strong>Aantal:</strong> ${d3.format(",.0f")(d.Langste_Woord)}`)
        }
    
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
}

function draw14_trans(){
    clear_img(); 
    function trans_bar_low(){
        dataset.sort((a, b) => b.Langste_Woord - a.Langste_Woord);
        
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Langste_Woord)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);    
        
        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Langste_Woord / 100))
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
        dataset.sort((a, b) => a.Langste_Woord - b.Langste_Woord);
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Langste_Woord)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);

        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Langste_Woord * 1.5))
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

function draw15(){
    clear_img(); 
    clearInterval(interval);
    clearTimeout(trans_timeout);

    dataset.sort((a, b) => a.Gefrustreerd - b.Gefrustreerd);
    // Scale the range of the data
    x.domain([0, d3.max(dataset, d => d.Gefrustreerd)]);
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
        .attr("width", d => x(d.Gefrustreerd))
        .attr("fill", d => d.Color)
        .attr("opacity", 1);

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
                    <br> <strong>Aantal:</strong> ${d3.format(",.4f")(d.Gefrustreerd)}`)
        }
    
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
}

function draw15_trans(){
    clear_img(); 
    function trans_bar_low(){
        dataset.sort((a, b) => b.Gefrustreerd - a.Gefrustreerd);
        
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Gefrustreerd)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);    
        
        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Gefrustreerd / 100))
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
        dataset.sort((a, b) => a.Gefrustreerd - b.Gefrustreerd);
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Gefrustreerd)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);

        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Gefrustreerd * 1.5))
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

function draw16(){
    clear_img(); 
    clearInterval(interval);
    clearTimeout(trans_timeout);

    dataset.sort((a, b) => a.Gefrustreerd_Tot - b.Gefrustreerd_Tot);
    // Scale the range of the data
    x.domain([0, d3.max(dataset, d => d.Gefrustreerd_Tot)]);
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
        .attr("width", d => x(d.Gefrustreerd_Tot))
        .attr("fill", d => d.Color)
        .attr("opacity", 1);

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
                    <br> <strong>Aantal:</strong> ${d3.format(",.0f")(d.Gefrustreerd_Tot)}`)
        }
    
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)
}

function draw16_trans(){
    clear_img(); 
    function trans_bar_low(){
        dataset.sort((a, b) => b.Gefrustreerd_Tot - a.Gefrustreerd_Tot);
        
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Gefrustreerd_Tot)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);    
        
        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Gefrustreerd_Tot / 100))
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
        dataset.sort((a, b) => a.Gefrustreerd_Tot - b.Gefrustreerd_Tot);
        // Scale the range of the data
        x.domain([0, d3.max(dataset, d => d.Gefrustreerd_Tot)]);
        y.domain(dataset.map(d => d.Naam)).padding(0.1);

        svg.selectAll(".bar")
        .data(dataset)
        .transition()
        .duration(2000)
        .ease(d3.easeLinear)
        .attr("x", 0)
        .attr("height", y.bandwidth())
        .attr("y", d => y(d.Naam))
        .attr("width", d => x(d.Gefrustreerd_Tot * 1.5))
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
    // draw1,
    // draw1_trans,
    draw2,
    draw2_trans,
    draw3,
    draw3_trans,
    draw4,
    draw4_trans,
    // draw5,
    // draw5_trans,
    draw6,
    draw6_trans,
    draw7,
    draw7_trans,
    draw8,
    draw8_trans,
    // draw9,
    // draw9_trans,
    draw10,
    draw10_trans,
    // draw11,
    // draw11_trans,
    draw12,
    draw12_trans,
    draw13,
    draw13_trans,
    draw14,
    draw14_trans,
    draw15,
    draw15_trans,
    // draw16,
    // draw16_trans,
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
        .style('opacity', function (d, i) {return i === index ? 1 : 0;});
    
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