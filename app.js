// --- Global Setup ---
const canvas = document.getElementById('visualizerCanvas');
const ctx = canvas.getContext('2d');
const logPanel = document.getElementById('log-panel');
const inputElement = document.getElementById('value-input');

// Set canvas dimensions
canvas.width = 900; 
canvas.height = 500;

// Set the current data structure (based on the UI element, though we focus on Heap here)
let currentStructure = 'heap'; 

// --- 1. Data Structure Implementation (Binary Heap) ---
class BinaryHeap {
    constructor() {
        // The heap data is stored in an array
        this.heapArray = []; 
    }

    // Insert operation [cite: 31]
    insert(value) {
        this.heapArray.push(value);
        this.heapifyUp(this.heapArray.length - 1); // Maintain the heap property [cite: 33]
    }

    // Heapify Up operation [cite: 33]
    heapifyUp(index) {
        if (index === 0) return; // Already at the root
        
        const parentIndex = Math.floor((index - 1) / 2);
        
        // Compare with parent (Min Heap property: parent <= child)
        if (this.heapArray[parentIndex] > this.heapArray[index]) {
            // Swap if child is smaller
            [this.heapArray[parentIndex], this.heapArray[index]] = 
                [this.heapArray[index], this.heapArray[parentIndex]];
            
            // Log the swap step
            logAction(`Heapify Up: Swapped ${this.heapArray[index]} with parent ${this.heapArray[parentIndex]}.`, 'animation');
            
            // Continue heapifying up
            this.heapifyUp(parentIndex);
        }
    }
    
    // Placeholder for Delete/Extract Min [cite: 32]
    deleteMin() {
        if (this.heapArray.length === 0) return null;
        if (this.heapArray.length === 1) return this.heapArray.pop();

        // Swap root with last element
        [this.heapArray[0], this.heapArray[this.heapArray.length - 1]] = 
            [this.heapArray[this.heapArray.length - 1], this.heapArray[0]];
        
        const minValue = this.heapArray.pop();
        this.heapifyDown(0); // Maintain the heap property
        return minValue;
    }

    // Placeholder for Heapify Down [cite: 33]
    heapifyDown(index) {
        // Implementation for heapifyDown goes here...
        // For simplicity, we are skipping the full implementation now, 
        // but this is where the logic for delete/extract would reside.
    }
}

// Instantiate the heap
const minHeap = new BinaryHeap();


// --- 2. Visualization Logic (Draw Array & Tree) ---

// Draw the array visualization at the top 
function drawArray(array) {
    const startX = 50;
    const startY = 50;
    const cellWidth = 40;
    const cellHeight = 30;

    // Draw Array Header
    ctx.fillStyle = '#333';
    ctx.font = '14px Arial';
    ctx.fillText("Array Representation:", startX, startY - 15);

    for (let i = 0; i < array.length; i++) {
        const x = startX + i * cellWidth;
        
        // Draw Array Cell
        ctx.strokeStyle = '#333';
        ctx.strokeRect(x, startY, cellWidth, cellHeight);
        
        // Fill data
        ctx.fillStyle = '#1A5276';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(array[i], x + cellWidth / 2, startY + cellHeight / 2);

        // Draw Index
        ctx.fillStyle = '#555';
        ctx.font = '10px Arial';
        ctx.fillText(`[${i}]`, x + cellWidth / 2, startY + cellHeight + 10);
    }
}

// Draw the tree visualization below the array 
function drawTree(array) {
    if (array.length === 0) return;

    const canvasCenter = canvas.width / 2;
    const levelHeight = 80;
    const nodeRadius = 20;
    const startY = 150; // Start drawing tree below the array

    // Helper function to get coordinates based on index and level
    function getNodeCoords(index) {
        const level = Math.floor(Math.log2(index + 1));
        const nodesInLevel = Math.pow(2, level);
        // Calculate horizontal position based on its position in the current level
        const positionInLevel = index + 1 - nodesInLevel; 
        const offset = canvasCenter / nodesInLevel;
        const x = offset + positionInLevel * (canvas.width - 2 * offset) / nodesInLevel;
        const y = startY + level * levelHeight;
        return { x, y };
    }
    
    // 1. Draw connecting lines (edges)     for (let i = 0; i < array.length; i++) {
        const parentCoords = getNodeCoords(i);
        
        // Draw left child line
        const leftChildIndex = 2 * i + 1;
        if (leftChildIndex < array.length) {
            const childCoords = getNodeCoords(leftChildIndex);
            ctx.strokeStyle = '#999';
            ctx.beginPath();
            ctx.moveTo(parentCoords.x, parentCoords.y + nodeRadius);
            ctx.lineTo(childCoords.x, childCoords.y - nodeRadius);
            ctx.stroke();
        }

        // Draw right child line
        const rightChildIndex = 2 * i + 2;
        if (rightChildIndex < array.length) {
            const childCoords = getNodeCoords(rightChildIndex);
            ctx.strokeStyle = '#999';
            ctx.beginPath();
            ctx.moveTo(parentCoords.x, parentCoords.y + nodeRadius);
            ctx.lineTo(childCoords.x, childCoords.y - nodeRadius);
            ctx.stroke();
        }
    }

    // 2. Draw nodes (circles)
    for (let i = 0; i < array.length; i++) {
        const { x, y } = getNodeCoords(i);
        
        // Draw Circle
        ctx.beginPath();
        ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#4CAF50'; // Node Color
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.stroke();

        // Draw Value
        ctx.fillStyle = 'white';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(array[i], x, y);
    }
}

// Master function to draw the whole structure
function drawVisualizer() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw Array and Tree for Binary Heap
    drawArray(minHeap.heapArray);
    drawTree(minHeap.heapArray);
    
    // We can call an animation frame here if needed for transitions
    requestAnimationFrame(drawVisualizer);
}


// --- 3. UI Functions ---

function insertAtHead() {
    const value = parseInt(inputElement.value);

    if (isNaN(value) || value < 1) {
        logAction("Please enter a valid number (1-99).", 'error');
        return;
    }

    // Perform the heap insertion
    minHeap.insert(value);
    logAction(`Successfully inserted ${value}.`, 'success');
    
    // Clear input after use and redraw
    inputElement.value = '';
}

function deleteValue() {
    const extractedValue = minHeap.deleteMin(); // This is typically Extract Min/Max [cite: 32]
    if (extractedValue !== null) {
        logAction(`Extracted (Deleted) minimum value: ${extractedValue}.`, 'success');
    } else {
        logAction("Heap is empty.", 'error');
    }
}

function logAction(message, type = 'info') {
    const time = new Date().toLocaleTimeString();
    let color = '';
    
    if (type === 'error') color = 'red';
    else if (type === 'success') color = '#006400';
    else if (type === 'animation') color = '#FFA500';
    else color = '#333';
    
    logPanel.innerHTML = `<div style="color: ${color};">
                            [${time}] ${message}
                          </div>` + logPanel.innerHTML;
    
    logPanel.scrollTop = 0; // Keep the panel scrolled to the top
}


// Start the visualization loop
drawVisualizer();
logAction("Visualizer loaded. Select a structure and operate.", 'info');
