import './style.css';
    import * as THREE from 'three';

    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 10;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Function to generate a unique color for each cube
    function getUniqueColor(index: number, total: number) {
      const hue = (index / total) * 360; // Calculate hue based on index
      return new THREE.Color(`hsl(${hue}, 100%, 50%)`); // Convert hue to HSL color
    }

    // Create multiple cubes with unique colors and borders
    const cubes: THREE.Mesh[] = [];
    const edges: THREE.LineSegments[] = [];
    const cubeCount = 100;
    const targetPosition = new THREE.Vector3(0, 0, 0);
    const initialPositions: THREE.Vector3[] = [];

    for (let i = 0; i < cubeCount; i++) {
      const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
      const material = new THREE.MeshLambertMaterial({
        color: getUniqueColor(i, cubeCount), // Unique color
        emissive: 0xFFFFFF, // White
      });
      const cube = new THREE.Mesh(geometry, material);
      const initialPosition = new THREE.Vector3(
        Math.random() * 20 - 10,
        Math.random() * 20 - 10,
        Math.random() * 20 - 10
      );
      cube.position.copy(initialPosition);
      initialPositions.push(initialPosition);
      scene.add(cube);
      cubes.push(cube);

      // Create edges for the cube
      const edgesGeometry = new THREE.EdgesGeometry(geometry);
      const edgesMaterial = new THREE.LineBasicMaterial({ color: 0xADD8E6 }); // Light Blue
      const edge = new THREE.LineSegments(edgesGeometry, edgesMaterial);
      edge.position.copy(initialPosition);
      scene.add(edge);
      edges.push(edge);
    }

    // Add a light source
    const light = new THREE.DirectionalLight(0xffffff, 2);
    light.position.set(1, 1, 1);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    let zoomingIn = true;

    // Animation loop
    function animate() {
      requestAnimationFrame(animate);

      cubes.forEach((cube, index) => {
        if (zoomingIn) {
          cube.position.lerp(targetPosition, 0.01);
          edges[index].position.lerp(targetPosition, 0.01);
        } else {
          cube.position.lerp(initialPositions[index], 0.01);
          edges[index].position.lerp(initialPositions[index], 0.01);
        }
      });

      // Check if all cubes are close to the target position
      if (zoomingIn && cubes.every(cube => cube.position.distanceTo(targetPosition) < 0.1)) {
        zoomingIn = false;
      }

      // Check if all cubes are back to their initial positions
      if (!zoomingIn && cubes.every((cube, index) => cube.position.distanceTo(initialPositions[index]) < 0.1)) {
        zoomingIn = true;
      }

      renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });
