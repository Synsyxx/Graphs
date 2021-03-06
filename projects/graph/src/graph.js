/**
 * 
 * Helper Function
 * Generated HexColorCode
 */
function getRandomColor(hex = '') {
  if (hex.length === 6) return '#' + hex;

  const hexPart = ((Math.random() * 240) | 0).toString(16);
  hex += (hexPart.length === 1) ? '0' + hexPart : hexPart;

  return getRandomColor(hex);
}

/**
 * Edge
 */
export class Edge {
  // !!! IMPLEMENT ME
  constructor(destination, weight = 1) {
    this.destination = destination;
    this.weight = weight;
  }
}

/**
 * Vertex
 */
export class Vertex {
  // !!! IMPLEMENT ME
  constructor() {
    this.edges = [];
    this.fillColor = 'white';
    this.parent = null;
    this.visited = false;
  }
}

/**
 * Graph
 */
export class Graph {
  constructor() {
    this.vertexes = [];
  }

  /**
   * Create a random graph
   */
  randomize(width, height, pxBox, probability=0.6) {
    // Helper function to set up two-way edges
    function connectVerts(v0, v1) {

      v0.edges.push(new Edge(v1, Math.floor(Math.random() * (10 - 1) + 1)));
      v1.edges.push(new Edge(v0,Math.floor(Math.random() * (10 - 1) + 1)));
    }

    let count = 0;

    // Build a grid of verts
    let grid = [];
    for (let y = 0; y < height; y++) {
      let row = [];
      for (let x = 0; x < width; x++) {
        let v = new Vertex();
        //v.value = 'v' + x + ',' + y;
        v.value = 'v' + count++;
        row.push(v);
      }
      grid.push(row);
    }

    // Go through the grid randomly hooking up edges
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        // Connect down
        if (y < height - 1) {
          if (Math.random() < probability) {
            connectVerts(grid[y][x], grid[y+1][x]);
          }
        }

        // Connect right
        if (x < width - 1) {
          if (Math.random() < probability) {
            connectVerts(grid[y][x], grid[y][x+1]);
          }
        }
      }
    }

    // Last pass, set the x and y coordinates for drawing
    const boxBuffer = 0.8;
    const boxInner = pxBox * boxBuffer;
    const boxInnerOffset = (pxBox - boxInner) / 2;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        grid[y][x].pos = {
          'x': (x * pxBox + boxInnerOffset + Math.random() * boxInner) | 0,
          'y': (y * pxBox + boxInnerOffset + Math.random() * boxInner) | 0
        };
      }
    }

    // Finally, add everything in our grid to the vertexes in this Graph
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        this.vertexes.push(grid[y][x]);
      }
    }
  }

  /**
   * Dump graph data to the console
   */
  dump() {
    let s;

    for (let v of this.vertexes) {
      if (v.pos) {
        s = v.value + ' (' + v.pos.x + ',' + v.pos.y + '):';
      } else {
        s = v.value + ':';
      }

      for (let e of v.edges) {
        s += ` ${e.destination.value}`;
      }
      console.log(s);
    }
  }

  /**
   * BFS
   */
  bfs(start) {
    console.log("Called bfs() at vertex ", start);
    const queue = [start];

    let currentGroup = getRandomColor();

    while (queue.length > 0) {

      const currentNode = queue[0];

      if (currentNode.fillColor === 'white')
        currentNode.fillColor = currentGroup;

      currentNode.edges.forEach(edge => {
        const { destination } = edge;

        if (destination.fillColor === 'white') {
          queue.push(destination);
          destination.fillColor = currentGroup;
        }

        destination.parent = currentNode;

      });

      queue.shift();
      
      if (queue.length === 0) {

        for (let e = 0; e < this.vertexes.length; e++) {
          if (this.vertexes[e].fillColor === 'white') {
            currentGroup = getRandomColor();
            queue.push(this.vertexes[e]);
            break;
          }
        }

      }

      // break;
      

    }

  }

  /**
   * Get the connected components
   */
  getConnectedComponents() {
    const connectedComponentsList = [];

    for (let vertex of this.vertexes) {
      if (vertex.color === 'white') {
        const connectedComponent = this.bfs(vertex);
        connectedComponentsList.push(connectedComponent);
      }
    }
    console.log(connectedComponentsList);
    return connectedComponentsList;
  }
}
