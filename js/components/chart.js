/* ==========================================================================
   SmartQueue - SVG Chart Generator Component (chart.js)
   ========================================================================== */

/**
 * Renders a responsive Line Chart with actual and predicted values using pure SVG
 * @param {string} containerId - Element ID to render chart inside
 * @param {Array} data - Array of { label: string, value: number, predicted: number }
 */
export function renderLineChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // Clear container

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 220;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    // Find min and max
    const values = data.map(d => Math.max(d.value, d.predicted));
    const maxValue = Math.max(...values, 10) * 1.15; // Give 15% head room

    // Create SVG
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('class', 'chart-svg');

    // Add Gradients
    svg.innerHTML = `
        <defs>
            <linearGradient id="chart-glow-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--accent-primary)" stop-opacity="0.25"/>
                <stop offset="100%" stop-color="var(--accent-primary)" stop-opacity="0.0"/>
            </linearGradient>
            <linearGradient id="chart-predict-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="var(--status-info)" stop-opacity="0.15"/>
                <stop offset="100%" stop-color="var(--status-info)" stop-opacity="0.0"/>
            </linearGradient>
        </defs>
    `;

    // Draw Grid Lines (Y axis reference lines)
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
        const yVal = maxValue * (i / gridLines);
        const yCoord = paddingTop + chartHeight - (chartHeight * (i / gridLines));
        
        // Horizontal grid line
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', paddingLeft);
        line.setAttribute('y1', yCoord);
        line.setAttribute('x2', width - paddingRight);
        line.setAttribute('y2', yCoord);
        line.setAttribute('class', 'chart-grid-line');
        svg.appendChild(line);

        // Y label text
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', paddingLeft - 8);
        text.setAttribute('y', yCoord + 4);
        text.setAttribute('class', 'chart-axis-text');
        text.setAttribute('text-anchor', 'end');
        text.textContent = Math.round(yVal);
        svg.appendChild(text);
    }

    // Compute coordinate points
    const points = data.map((d, index) => {
        const x = paddingLeft + (index / (data.length - 1)) * chartWidth;
        const yActual = paddingTop + chartHeight - (d.value / maxValue) * chartHeight;
        const yPredict = paddingTop + chartHeight - (d.predicted / maxValue) * chartHeight;
        return { label: d.label, x, yActual, yPredict, valActual: d.value, valPredict: d.predicted };
    });

    // 1. Draw Shaded Glow Area for Actuals
    let areaPathActual = `M ${points[0].x} ${paddingTop + chartHeight} `;
    points.forEach(p => {
        areaPathActual += `L ${p.x} ${p.yActual} `;
    });
    areaPathActual += `L ${points[points.length - 1].x} ${paddingTop + chartHeight} Z`;

    const areaActual = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    areaActual.setAttribute('d', areaPathActual);
    areaActual.setAttribute('fill', 'url(#chart-glow-gradient)');
    svg.appendChild(areaActual);

    // 2. Draw Shaded Glow Area for Predictions
    let areaPathPredict = `M ${points[0].x} ${paddingTop + chartHeight} `;
    points.forEach(p => {
        areaPathPredict += `L ${p.x} ${p.yPredict} `;
    });
    areaPathPredict += `L ${points[points.length - 1].x} ${paddingTop + chartHeight} Z`;

    const areaPredict = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    areaPredict.setAttribute('d', areaPathPredict);
    areaPredict.setAttribute('fill', 'url(#chart-predict-gradient)');
    svg.appendChild(areaPredict);

    // 3. Draw Actual Line Path
    let linePathActual = '';
    points.forEach((p, index) => {
        linePathActual += `${index === 0 ? 'M' : 'L'} ${p.x} ${p.yActual} `;
    });

    const lineActual = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    lineActual.setAttribute('d', linePathActual);
    lineActual.setAttribute('class', 'chart-line');
    svg.appendChild(lineActual);

    // 4. Draw Prediction Line Path (Dashed)
    let linePathPredict = '';
    points.forEach((p, index) => {
        linePathPredict += `${index === 0 ? 'M' : 'L'} ${p.x} ${p.yPredict} `;
    });

    const linePredict = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    linePredict.setAttribute('d', linePathPredict);
    linePredict.setAttribute('class', 'chart-line');
    linePredict.setAttribute('stroke', 'var(--status-info)');
    linePredict.setAttribute('stroke-dasharray', '5 5');
    svg.appendChild(linePredict);

    // 5. Draw Interactive Nodes and Labels
    points.forEach(p => {
        // X Label
        const xText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        xText.setAttribute('x', p.x);
        xText.setAttribute('y', height - 8);
        xText.setAttribute('class', 'chart-axis-text');
        xText.setAttribute('text-anchor', 'middle');
        xText.textContent = p.label;
        svg.appendChild(xText);

        // Dot for Actual
        const dotActual = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dotActual.setAttribute('cx', p.x);
        dotActual.setAttribute('cy', p.yActual);
        dotActual.setAttribute('r', '4');
        dotActual.setAttribute('class', 'chart-dot');
        
        // Add simple tooltip title
        const titleActual = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titleActual.textContent = `Actual a las ${p.label}: ${p.valActual} personas`;
        dotActual.appendChild(titleActual);
        svg.appendChild(dotActual);

        // Dot for Prediction
        const dotPredict = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dotPredict.setAttribute('cx', p.x);
        dotPredict.setAttribute('cy', p.yPredict);
        dotPredict.setAttribute('r', '4');
        dotPredict.setAttribute('fill', 'var(--status-info)');
        dotPredict.setAttribute('stroke', 'var(--bg-secondary)');
        dotPredict.setAttribute('stroke-width', '2');
        dotPredict.style.cursor = 'pointer';

        const titlePredict = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        titlePredict.textContent = `Predicción IA: ${p.valPredict} personas`;
        dotPredict.appendChild(titlePredict);
        svg.appendChild(dotPredict);
    });

    container.appendChild(svg);
}

/**
 * Renders a Bar Chart using pure SVG
 * @param {string} containerId - Element ID to render chart inside
 * @param {Array} data - Array of { label: string, value: number }
 */
export function renderBarChart(containerId, data) {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = ''; // Clear container

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 220;
    const paddingLeft = 40;
    const paddingRight = 20;
    const paddingTop = 20;
    const paddingBottom = 30;

    const chartWidth = width - paddingLeft - paddingRight;
    const chartHeight = height - paddingTop - paddingBottom;

    const maxVal = Math.max(...data.map(d => d.value), 10) * 1.1;

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '100%');
    svg.setAttribute('height', '100%');
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('class', 'chart-svg');

    // Grid lines
    const gridLines = 4;
    for (let i = 0; i <= gridLines; i++) {
        const yVal = maxVal * (i / gridLines);
        const yCoord = paddingTop + chartHeight - (chartHeight * (i / gridLines));
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', paddingLeft);
        line.setAttribute('y1', yCoord);
        line.setAttribute('x2', width - paddingRight);
        line.setAttribute('y2', yCoord);
        line.setAttribute('class', 'chart-grid-line');
        svg.appendChild(line);

        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', paddingLeft - 8);
        text.setAttribute('y', yCoord + 4);
        text.setAttribute('class', 'chart-axis-text');
        text.setAttribute('text-anchor', 'end');
        text.textContent = Math.round(yVal);
        svg.appendChild(text);
    }

    // Draw Bars
    const totalBars = data.length;
    const barSpacing = chartWidth / totalBars;
    const barWidth = barSpacing * 0.6; // 60% width, 40% gap

    data.forEach((d, index) => {
        const xCoord = paddingLeft + (index * barSpacing) + (barSpacing - barWidth) / 2;
        const barHeight = (d.value / maxVal) * chartHeight;
        const yCoord = paddingTop + chartHeight - barHeight;

        // Bar Rect with rounded top corners (custom rendering or standard rx/ry)
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('x', xCoord);
        rect.setAttribute('y', yCoord);
        rect.setAttribute('width', barWidth);
        rect.setAttribute('height', Math.max(barHeight, 2)); // Minimum height of 2px
        rect.setAttribute('rx', '4');
        rect.setAttribute('ry', '4');
        rect.setAttribute('class', 'chart-bar');
        
        const title = document.createElementNS('http://www.w3.org/2000/svg', 'title');
        title.textContent = `${d.label}: ${d.value} turnos`;
        rect.appendChild(title);
        svg.appendChild(rect);

        // X Label
        const xText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        xText.setAttribute('x', xCoord + barWidth / 2);
        xText.setAttribute('y', height - 8);
        xText.setAttribute('class', 'chart-axis-text');
        xText.setAttribute('text-anchor', 'middle');
        xText.textContent = d.label;
        svg.appendChild(xText);
    });

    container.appendChild(svg);
}
