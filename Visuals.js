let dataset, svg
let salarySizeScale, salaryXScale, categoryColorScale
let simulation, nodes
let categoryLegend, salaryLegend

const margin = {top: 50, right: 50, bottom: 50, left: 50}
const width = 450 - margin.left - margin.right
const height = 450 - margin.bottom - margin.top

//Read Data, convert numerical categories into floats
//Create the initial visualisation


d3.csv("https://raw.githubusercontent.com/MarkdeKwaasteniet/test_D3/main/tekst_data_test.csv"
, function(d){
    return {
        Naam: d.Naam,
        Tekst: +d.tekst,
        Emoji: +d.emoji,
        Nacht: +d.nacht
    };
}).then(data => {
    dataset = data
    console.log(dataset)
    createScales()
    setTimeout(drawInitial(), 100)
})

const colors = ['#ffcc00', '#ff6666', '#cc0066', '#66cccc', '#f688bb', '#65587f', '#baf1a1', '#333333', '#75b79e',  '#66cccc', '#9de3d0', '#f1935c', '#0c7b93', '#eab0d9', '#baf1a1', '#9399ff']

//Create all the scales and save to global variables

function createScales(){
    // xScale will help us set the x position of the bars
    yScale = d3.scaleBand()
        .domain(d3.range(dataset.length)) //sets the input domain for the scale
        .rangeRound([0, width]) //enables rounding of the range
        .paddingInner(0.05); //spacing between each bar
    //yScale will help us map data to the height of bars in the barchart
    xScale = d3.scaleLinear()
        .domain([0, d3.max(dataset.map(function(d) {return d.Tekst;}))]) //sets the upper end of the input domain to the largest data value in dataset
        .range([0, height]);
}


// All the initial elements should be create in the drawInitial function
// As they are required, their attributes can be modified
// They can be shown or hidden using their 'opacity' attribute
// Each element should also have an associated class name for easy reference

function drawInitial(){
    //Create SVG element
    let svg = d3.select("#vis")
                    .append('svg')
                    .attr('width', width + margin.left + margin.right)
                    .attr('height', height + margin.bottom + margin.top)
                    .attr('opacity', 1)

    let xAxis = d3.axisBottom(xScale)
        .ticks(4)
        .tickSize(height + 20)

    let xAxisGroup = svg.append('g')
    .attr('class', 'first-axis')
    .attr('transform', 'translate(0, 0)')
    .call(xAxis)
    .call(g => g.select('.domain')
    .remove())
    .call(g => g.selectAll('.tick line'))
    .attr('stroke-opacity', 0.2)
    .attr('stroke-dasharray', 2.5)
                    

    svg.selectAll("rect")
    .data(dataset)
    .enter()
    .append("rect")
    .attr("y", function(d, i) { // position in y-axis
        return yScale(i); // we will pass the values from the dataset
    })
    .attr("x", function(d) {
        return 0;
    })
    .attr("height", yScale.bandwidth()) //Asks for the bandwith of the scale
    .attr("width", function(d) {
        return xScale(d.Tekst);
    })
    .attr("fill", function(d) {
        return "rgb("+ Math.round(d.Tekst * 8) + ",0," + Math.round(d.Tekst * 10) + ")"; //Change the color of the bar depending on the value
    });
        
    // Add mouseover and mouseout events for all circles
    // Changes opacity and adds border
    svg.selectAll('rect')
        .on('mouseover', mouseOver)
        .on('mouseout', mouseOut)

    function mouseOver(d, i){

        console.log('hi')
        d3.select(this)
            .transition('mouseover').duration(100)
            .attr('opacity', 1)
            .attr('stroke-width', 2)
            .attr('fill', 'green')
            
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
            .attr("fill", function(d) {
                return "rgb("+ Math.round(d.Tekst * 8) + ",0," + Math.round(d.Tekst * 10) + ")"; //Change the color of the bar depending on the value
            });
    }

    //Small text label for first graph
    svg.selectAll('.small-text')
        .data(dataset)
        .enter()
        .append('text')
            .text((d, i) => d.Naam.toLowerCase())
            .attr('class', 'small-text')
            .attr('x', margin.left)
            .attr("y", function(d, i) {
                return yScale(i) + yScale.bandwidth() / 2; // position the text in the middle of the bar
            })
            .attr('font-size', 30)
            .attr('text-anchor', 'end')
    
    // //All the required components for the small multiples charts
    // //Initialises the text and rectangles, and sets opacity to 0 
    // svg.selectAll('.cat-rect')
    //     .data(categories).enter()
    //     .append('rect')
    //         .attr('class', 'cat-rect')
    //         .attr('x', d => categoriesXY[d][0] + 120 + 1000)
    //         .attr('y', d => categoriesXY[d][1] + 30)
    //         .attr('width', 160)
    //         .attr('height', 30)
    //         .attr('opacity', 0)
    //         .attr('fill', 'grey')


    // svg.selectAll('.lab-text')
    //     .data(categories).enter()
    //     .append('text')
    //     .attr('class', 'lab-text')
    //     .attr('opacity', 0)
    //     .raise()

    // svg.selectAll('.lab-text')
    //     .text(d => `Average: $${d3.format(",.2r")(categoriesXY[d][2])}`)
    //     .attr('x', d => categoriesXY[d][0] + 200 + 1000)
    //     .attr('y', d => categoriesXY[d][1] - 500)
    //     .attr('font-family', 'Domine')
    //     .attr('font-size', '12px')
    //     .attr('font-weight', 700)
    //     .attr('fill', 'black')
    //     .attr('text-anchor', 'middle')       

    // svg.selectAll('.lab-text')
    //         .on('mouseover', function(d, i){
    //             d3.select(this)
    //                 .text(d)
    //         })
    //         .on('mouseout', function(d, i){
    //             d3.select(this)
    //                 .text(d => `Average: $${d3.format(",.2r")(categoriesXY[d][2])}`)
    //         })


    // // Best fit line for gender scatter plot

    // const bestFitLine = [{x: 0, y: 56093}, {x: 1, y: 25423}]
    // const lineFunction = d3.line()
    //                         .x(d => shareWomenXScale(d.x))
    //                         .y(d => salaryYScale(d.y))

    // Axes for Scatter Plot
//     svg.append('path')
//         .transition('best-fit-line').duration(430)
//             .attr('class', 'best-fit')
//             .attr('d', lineFunction(bestFitLine))
//             .attr('stroke', 'grey')
//             .attr('stroke-dasharray', 6.2)
//             .attr('opacity', 0)
//             .attr('stroke-width', 3)

//     let scatterxAxis = d3.axisBottom(shareWomenXScale)
//     let scatteryAxis = d3.axisLeft(salaryYScale).tickSize([width])

//     svg.append('g')
//         .call(scatterxAxis)
//         .attr('class', 'scatter-x')
//         .attr('opacity', 0)
//         .attr('transform', `translate(0, ${height + margin.top})`)
//         .call(g => g.select('.domain')
//             .remove())
    
//     svg.append('g')
//         .call(scatteryAxis)
//         .attr('class', 'scatter-y')
//         .attr('opacity', 0)
//         .attr('transform', `translate(${margin.left - 20 + width}, 0)`)
//         .call(g => g.select('.domain')
//             .remove())
//         .call(g => g.selectAll('.tick line'))
//             .attr('stroke-opacity', 0.2)
//             .attr('stroke-dasharray', 2.5)

//     // Axes for Histogram 

//     let histxAxis = d3.axisBottom(enrollmentScale)

//     svg.append('g')
//         .attr('class', 'enrolment-axis')
//         .attr('transform', 'translate(0, 700)')
//         .attr('opacity', 0)
//         .call(histxAxis)
// 
}

//Cleaning Function
//Will hide all the elements which are not necessary for a given chart type 

function clean(chartType){
    let svg = d3.select('#vis').select('svg')
    if (chartType !== "isScatter") {
        svg.select('.scatter-x').transition().attr('opacity', 0)
        svg.select('.scatter-y').transition().attr('opacity', 0)
        svg.select('.best-fit').transition().duration(200).attr('opacity', 0)
    }
    if (chartType !== "isMultiples"){
        svg.selectAll('.lab-text').transition().attr('opacity', 0)
            .attr('x', 1800)
        svg.selectAll('.cat-rect').transition().attr('opacity', 0)
            .attr('x', 1800)
    }
    if (chartType !== "isFirst"){
        svg.select('.first-axis').transition().attr('opacity', 0)
        svg.selectAll('.small-text').transition().attr('opacity', 0)
            .attr('x', -200)
    }
    if (chartType !== "isHist"){
        svg.selectAll('.hist-axis').transition().attr('opacity', 0)
    }
    if (chartType !== "isBubble"){
        svg.select('.enrolment-axis').transition().attr('opacity', 0)
    }
}

//First draw function

// function draw1(){
//     let svg = d3.select("#vis")
//                     .select('svg')
//                     .attr('width', 1000)
//                     .attr('height', 950)
    
//     clean('isFirst')

//     // d3.select('.categoryLegend').transition().remove()

//     svg.select('.first-axis')
//         .attr('opacity', 1)
    
//     svg.selectAll('rect')
//         .transition().duration(500).delay(100)
//         .attr('fill', 'green')
//         .attr('cx', (d, i) => xScale(d.Tekst)+5)
//         .attr('cy', (d, i) => i * 5.2 + 30)

//     svg.selectAll('.small-text').transition()
//         .attr('opacity', 1)
//         .attr('x', margin.left)
//         .attr('y', (d, i) => i * 5.2 + 30)
// }

// function draw2(){
//     let svg = d3.select("#vis")
//                     .select('svg')
//                     .attr('width', 1000)
//                     .attr('height', 950)
    
//     clean('isFirst')

//     // d3.select('.categoryLegend').transition().remove()

//     svg.select('.first-axis')
//         .attr('opacity', 1)
    
//     svg.selectAll('rect')
//         .transition().duration(500).delay(100)
//         .attr('fill', 'green')
//         .attr('cx', (d, i) => xScale(d.Tekst)+5)
//         .attr('cy', (d, i) => i * 5.2 + 30)

//     svg.selectAll('.small-text').transition()
//         .attr('opacity', 1)
//         .attr('x', margin.left)
//         .attr('y', (d, i) => i * 5.2 + 30)
// }


// function draw2(){
//     let svg = d3.select("#vis").select('svg')
    
//     clean('none')

//     svg.selectAll('circle')
//         .transition().duration(300).delay((d, i) => i * 5)
//         .attr('r', d => salarySizeScale(d.Median) * 1.2)
//         .attr('fill', d => categoryColorScale(d.Category))

//     simulation  
//         .force('charge', d3.forceManyBody().strength([2]))
//         .force('forceX', d3.forceX(d => categoriesXY[d.Category][0] + 200))
//         .force('forceY', d3.forceY(d => categoriesXY[d.Category][1] - 50))
//         .force('collide', d3.forceCollide(d => salarySizeScale(d.Median) + 4))
//         .alphaDecay([0.02])

//     //Reheat simulation and restart
//     simulation.alpha(0.9).restart()
    
//     createLegend(20, 50)
// }

// function draw3(){
//     let svg = d3.select("#vis").select('svg')
//     clean('isMultiples')
    
//     svg.selectAll('circle')
//         .transition().duration(400).delay((d, i) => i * 5)
//         .attr('r', d => salarySizeScale(d.Median) * 1.2)
//         .attr('fill', d => categoryColorScale(d.Category))

//     svg.selectAll('.cat-rect').transition().duration(300).delay((d, i) => i * 30)
//         .attr('opacity', 0.2)
//         .attr('x', d => categoriesXY[d][0] + 120)
        
//     svg.selectAll('.lab-text').transition().duration(300).delay((d, i) => i * 30)
//         .text(d => `Average: $${d3.format(",.2r")(categoriesXY[d][2])}`)
//         .attr('x', d => categoriesXY[d][0] + 200)   
//         .attr('y', d => categoriesXY[d][1] + 50)
//         .attr('opacity', 1)

//     svg.selectAll('.lab-text')
//         .on('mouseover', function(d, i){
//             d3.select(this)
//                 .text(d)
//         })
//         .on('mouseout', function(d, i){
//             d3.select(this)
//                 .text(d => `Average: $${d3.format(",.2r")(categoriesXY[d][2])}`)
//         })

//     simulation  
//         .force('charge', d3.forceManyBody().strength([2]))
//         .force('forceX', d3.forceX(d => categoriesXY[d.Category][0] + 200))
//         .force('forceY', d3.forceY(d => categoriesXY[d.Category][1] - 50))
//         .force('collide', d3.forceCollide(d => salarySizeScale(d.Median) + 4))
//         .alpha(0.7).alphaDecay(0.02).restart()

// }

// function draw5(){
    
//     let svg = d3.select('#vis').select('svg')
//     clean('isMultiples')

//     simulation
//         .force('forceX', d3.forceX(d => categoriesXY[d.Category][0] + 200))
//         .force('forceY', d3.forceY(d => categoriesXY[d.Category][1] - 50))
//         .force('collide', d3.forceCollide(d => salarySizeScale(d.Median) + 4))

//     simulation.alpha(1).restart()
   
//     svg.selectAll('.lab-text').transition().duration(300).delay((d, i) => i * 30)
//         .text(d => `% Female: ${(categoriesXY[d][3])}%`)
//         .attr('x', d => categoriesXY[d][0] + 200)   
//         .attr('y', d => categoriesXY[d][1] + 50)
//         .attr('opacity', 1)
    
//     svg.selectAll('.lab-text')
//         .on('mouseover', function(d, i){
//             d3.select(this)
//                 .text(d)
//         })
//         .on('mouseout', function(d, i){
//             d3.select(this)
//                 .text(d => `% Female: ${(categoriesXY[d][3])}%`)
//         })
   
//     svg.selectAll('.cat-rect').transition().duration(300).delay((d, i) => i * 30)
//         .attr('opacity', 0.2)
//         .attr('x', d => categoriesXY[d][0] + 120)

//     svg.selectAll('circle')
//         .transition().duration(400).delay((d, i) => i * 4)
//             .attr('fill', colorByGender)
//             .attr('r', d => salarySizeScale(d.Median))

// }

// function colorByGender(d, i){
//     if (d.ShareWomen < 0.4){
//         return 'blue'
//     } else if (d.ShareWomen > 0.6) {
//         return 'red'
//     } else {
//         return 'grey'
//     }
// }

// function draw6(){
//     simulation.stop()
    
//     let svg = d3.select("#vis").select("svg")
//     clean('isScatter')

//     svg.selectAll('.scatter-x').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)
//     svg.selectAll('.scatter-y').transition().attr('opacity', 0.7).selectAll('.domain').attr('opacity', 1)

//     svg.selectAll('circle')
//         .transition().duration(800).ease(d3.easeBack)
//         .attr('cx', d => shareWomenXScale(d.ShareWomen))
//         .attr('cy', d => salaryYScale(d.Median))
    
//     svg.selectAll('circle').transition(1600)
//         .attr('fill', colorByGender)
//         .attr('r', 10)

//     svg.select('.best-fit').transition().duration(300)
//         .attr('opacity', 0.5)
   
// }

// function draw7(){
//     let svg = d3.select('#vis').select('svg')

//     clean('isBubble')

//     simulation
//         .force('forceX', d3.forceX(d => enrollmentScale(d.Total)))
//         .force('forceY', d3.forceY(500))
//         .force('collide', d3.forceCollide(d => enrollmentSizeScale(d.Total) + 2))
//         .alpha(0.8).alphaDecay(0.05).restart()

//     svg.selectAll('circle')
//         .transition().duration(300).delay((d, i) => i * 4)
//         .attr('r', d => enrollmentSizeScale(d.Total))
//         .attr('fill', d => categoryColorScale(d.Category))

//     //Show enrolment axis (remember to include domain)
//     svg.select('.enrolment-axis').attr('opacity', 0.5).selectAll('.domain').attr('opacity', 1)

// }

// function draw4(){
//     let svg = d3.select('#vis').select('svg')

//     clean('isHist')

//     simulation.stop()

//     svg.selectAll('circle')
//         .transition().duration(600).delay((d, i) => i * 2).ease(d3.easeBack)
//             .attr('r', 10)
//             .attr('cx', d => histXScale(d.Midpoint))
//             .attr('cy', d => histYScale(d.HistCol))
//             .attr('fill', d => categoryColorScale(d.Category))

//     let xAxis = d3.axisBottom(histXScale)
//     svg.append('g')
//         .attr('class', 'hist-axis')
//         .attr('transform', `translate(0, ${height + margin.top + 10})`)
//         .call(xAxis)

//     svg.selectAll('.lab-text')
//         .on('mouseout', )
// }

// function draw8(){
//     clean('none')

//     let svg = d3.select('#vis').select('svg')
//     svg.selectAll('circle')
//         .transition()
//         .attr('r', d => salarySizeScale(d.Median) * 1.6)
//         .attr('fill', d => categoryColorScale(d.Category))

//     simulation 
//         .force('forceX', d3.forceX(500))
//         .force('forceY', d3.forceY(500))
//         .force('collide', d3.forceCollide(d => salarySizeScale(d.Median) * 1.6 + 4))
//         .alpha(0.6).alphaDecay(0.05).restart()
        
// }

//Array of all the graph functions
//Will be called from the scroller functionality

let activationFunctions = [
    // draw1,
    // draw2,
    // draw3,
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