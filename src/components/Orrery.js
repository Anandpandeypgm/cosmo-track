import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const Orrery = () => {
  const mountRef = useRef(null);
  const planets = useRef([]);
  const celestialBodies = useRef([]);
  const neaBodies = useRef([]);
  const necBodies = useRef([]);
  const phaBodies = useRef([]);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // Set background color to black for space
    scene.background = new THREE.Color(0x000000);

    // Create a star field with a better texture
    const createStars = () => {
      const starCount = 10000;
      const starGeometry = new THREE.BufferGeometry();
      const starPositions = new Float32Array(starCount * 3); // 10,000 stars

      for (let i = 0; i < starCount; i++) {
        starPositions[i * 3] = (Math.random() - 0.5) * 400; // x
        starPositions[i * 3 + 1] = (Math.random() - 0.5) * 400; // y
        starPositions[i * 3 + 2] = (Math.random() - 0.5) * 400; // z
      }

      starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

      // Create a PointsMaterial with a soft star color
      const starMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.2, // Adjusted size for better visibility
        sizeAttenuation: true
      });

      const starField = new THREE.Points(starGeometry, starMaterial);
      scene.add(starField);
    };
    createStars();

    // Create planets with respective sizes and colors
    const createPlanet = (size, color, position) => {
      const geometry = new THREE.SphereGeometry(size, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color });
      const planet = new THREE.Mesh(geometry, material);
      planet.position.set(position.x, position.y, position.z);
      scene.add(planet);
      return planet;
    };

    // Create a more realistic orbit with thickness and glow effect
    const createOrbit = (radius) => {
      const orbitGeometry = new THREE.TorusGeometry(radius, 0.05, 16, 100); // Use TorusGeometry for thickness
      const orbitMaterial = new THREE.MeshBasicMaterial({
        color: 0x888888,
        opacity: 0.3,
        transparent: true,
        side: THREE.DoubleSide // Render both sides of the orbit
      });
      const orbitPath = new THREE.Mesh(orbitGeometry, orbitMaterial);
      orbitPath.rotation.x = Math.PI / 2; // Rotate the orbit to lay flat on the XY plane
      scene.add(orbitPath);
    };

    // Define planets with size, color, positions, and orbital speed
    const planetsData = [
      { name: "Mercury", size: 0.4, color: 0xaaaaaa, distance: 8, speed: 0.03, yOffset: 1 },
      { name: "Venus", size: 0.95, color: 0xffcc00, distance: 12, speed: 0.02, yOffset: -1 },
      { name: "Earth", size: 1, color: 0x0000ff, distance: 16, speed: 0.015, yOffset: 2 },
      { name: "Mars", size: 0.6, color: 0xff0000, distance: 20, speed: 0.012, yOffset: -1.5 },
      { name: "Jupiter", size: 2.5, color: 0xffcc99, distance: 25, speed: 0.008, yOffset: 2.5 },
      { name: "Saturn", size: 2.0, color: 0xe6b800, distance: 30, speed: 0.005, yOffset: -2 },
      { name: "Uranus", size: 1.5, color: 0x66ccff, distance: 35, speed: 0.004, yOffset: 1.5 },
      { name: "Neptune", size: 1.5, color: 0x3333cc, distance: 40, speed: 0.003, yOffset: -2.5 },
      { name: "Sun", size: 5, color: 0xffff00, distance: 0, speed: 0, yOffset: 0 }
    ];

    // Create planets and orbits based on defined properties
    planetsData.forEach(data => {
      const planet = createPlanet(data.size, data.color, { x: data.distance, y: data.yOffset, z: 0 });
      planets.current.push({ mesh: planet, distance: data.distance, speed: data.speed, yOffset: data.yOffset });
      createOrbit(data.distance);
    });

    // Function to create celestial bodies like asteroids and comets
    const createCelestialBody = (size, color, distance, speed, offset) => {
      const geometry = new THREE.SphereGeometry(size, 16, 16);
      const material = new THREE.MeshBasicMaterial({ color });
      const body = new THREE.Mesh(geometry, material);
      body.position.set(distance, offset, 0);
      scene.add(body);
      celestialBodies.current.push({ mesh: body, distance, speed, angle: 0 });
      return body;
    };

    // Create celestial bodies (asteroids, comets)
    createCelestialBody(0.2, 0xaaaaaa, 30, 0.02, 0); // Asteroid
    createCelestialBody(0.3, 0xffcc00, 50, 0.01, 0); // Comet

    // Create Near-Earth Asteroids
    const createNEA = (size, color, distance, speed, offset) => {
      const body = createCelestialBody(size, color, distance, speed, offset);
      neaBodies.current.push({ mesh: body, distance, speed });
    };

    // Create some Near-Earth Asteroids
    createNEA(0.15, 0x00ff00, 25, 0.02, 1); // NEA
    createNEA(0.2, 0xff0000, 28, 0.015, -1); // NEA

    // Create Near-Earth Comets
    const createNEC = (size, color, distance, speed, offset) => {
      const body = createCelestialBody(size, color, distance, speed, offset);
      necBodies.current.push({ mesh: body, distance, speed });
    };

    // Create some Near-Earth Comets
    createNEC(0.25, 0xffff00, 22, 0.02, 2); // NEC
    createNEC(0.3, 0x0000ff, 32, 0.01, -2); // NEC

    // Create Potentially Hazardous Asteroids
    const createPHA = (size, color, distance, speed, offset) => {
      const body = createCelestialBody(size, color, distance, speed, offset);
      phaBodies.current.push({ mesh: body, distance, speed });
    };

    // Create some Potentially Hazardous Asteroids
    createPHA(0.3, 0x990000, 35, 0.01, 1); // PHA
    createPHA(0.4, 0x9900ff, 40, 0.008, -1); // PHA

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    // Set initial camera position
    camera.position.z = 50;

    const animate = (time) => {
      requestAnimationFrame(animate);

      // Update planet positions
      planets.current.forEach((planetData) => {
        const { mesh, distance, speed, yOffset } = planetData;
        const angle = speed * time * 0.1; // Adjust speed and time scaling for increased speed
        mesh.position.x = distance * Math.cos(angle);
        mesh.position.z = distance * Math.sin(angle);
        mesh.position.y = yOffset;
      });

      // Update celestial bodies
      celestialBodies.current.forEach((bodyData) => {
        const { mesh, distance, speed } = bodyData;
        bodyData.angle += speed;
        mesh.position.x = distance * Math.cos(bodyData.angle);
        mesh.position.z = distance * Math.sin(bodyData.angle);
      });

      // Update NEAs, NECs, and PHAs
      neaBodies.current.forEach((bodyData) => {
        bodyData.angle += bodyData.speed;
        bodyData.mesh.position.x = bodyData.distance * Math.cos(bodyData.angle);
        bodyData.mesh.position.z = bodyData.distance * Math.sin(bodyData.angle);
      });

      necBodies.current.forEach((bodyData) => {
        bodyData.angle += bodyData.speed;
        bodyData.mesh.position.x = bodyData.distance * Math.cos(bodyData.angle);
        bodyData.mesh.position.z = bodyData.distance * Math.sin(bodyData.angle);
      });

      phaBodies.current.forEach((bodyData) => {
        bodyData.angle += bodyData.speed;
        bodyData.mesh.position.x = bodyData.distance * Math.cos(bodyData.angle);
        bodyData.mesh.position.z = bodyData.distance * Math.sin(bodyData.angle);
      });

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    // Cleanup function to remove the renderer
    return () => {
      mountRef.current.removeChild(renderer.domElement);
      planets.current.forEach((planet) => {
        scene.remove(planet.mesh);
      });
      celestialBodies.current.forEach((body) => {
        scene.remove(body.mesh);
      });
      neaBodies.current.forEach((body) => {
        scene.remove(body.mesh);
      });
      necBodies.current.forEach((body) => {
        scene.remove(body.mesh);
      });
      phaBodies.current.forEach((body) => {
        scene.remove(body.mesh);
      });
    };
  }, []);

  return <div ref={mountRef} />;
};

export default Orrery;
